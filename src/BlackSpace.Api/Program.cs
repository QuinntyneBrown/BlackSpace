using BlackSpace.Domain.DTOs;
using BlackSpace.Domain.Entities;
using BlackSpace.Domain.Interfaces;
using BlackSpace.Infrastructure.Data;
using BlackSpace.Infrastructure.Repositories;
using BlackSpace.Infrastructure.Services;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
builder.Host.UseSerilog((context, configuration) =>
    configuration.ReadFrom.Configuration(context.Configuration));

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repositories
builder.Services.AddScoped<IMemberRepository, MemberRepository>();

// Email Service
var useDevelopmentMode = builder.Configuration.GetValue<bool>("Email:UseDevelopmentMode");
if (useDevelopmentMode)
{
    builder.Services.AddScoped<IEmailService, ConsoleEmailService>();
}
else
{
    builder.Services.AddScoped<IEmailService, SmtpEmailService>();
}

// FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// CORS
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? ["http://localhost:4200"];

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Health Checks
builder.Services.AddHealthChecks()
    .AddDbContextCheck<AppDbContext>();

// Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure middleware pipeline
app.UseSerilogRequestLogging();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors();

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.EnsureCreatedAsync();
}

// Health check endpoint
app.MapHealthChecks("/api/health");

// Minimal API endpoints
var api = app.MapGroup("/api");

api.MapPost("/members", async (
    CreateMemberRequest request,
    IValidator<CreateMemberRequest> validator,
    IMemberRepository repository,
    IEmailService emailService,
    ILogger<Program> logger,
    HttpContext httpContext,
    CancellationToken cancellationToken) =>
{
    // Validate with FluentValidation
    var validationResult = await validator.ValidateAsync(request, cancellationToken);
    if (!validationResult.IsValid)
    {
        var errors = validationResult.Errors
            .GroupBy(e => char.ToLowerInvariant(e.PropertyName[0]) + e.PropertyName[1..])
            .ToDictionary(
                g => g.Key,
                g => g.Select(e => e.ErrorMessage).ToArray());

        return Results.Json(new
        {
            error = "validation_failed",
            message = "Please fix the errors below.",
            errors
        }, statusCode: 422);
    }

    // Check duplicate email (case-insensitive)
    if (await repository.ExistsAsync(request.Email.Trim(), cancellationToken))
    {
        return Results.Json(new
        {
            error = "already_registered",
            message = "This email is already part of the community."
        }, statusCode: 409);
    }

    var member = new Member
    {
        Id = Guid.NewGuid(),
        FullName = request.FullName.Trim(),
        Email = request.Email.Trim().ToLowerInvariant(),
        RoleTitle = request.RoleTitle?.Trim(),
        Organization = request.Organization?.Trim(),
        ReferralSource = request.ReferralSource?.Trim(),
        CreatedAtUtc = DateTime.UtcNow,
        IpAddress = httpContext.Connection.RemoteIpAddress?.ToString()
    };

    await repository.AddAsync(member, cancellationToken);

    // Fire-and-forget email - member creation succeeds even if email fails
    var memberEmail = member.Email;
    var memberName = member.FullName;
    _ = Task.Run(async () =>
    {
        try
        {
            await emailService.SendWelcomeEmailAsync(memberEmail, memberName);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to send welcome email to {Email}", memberEmail);
        }
    });

    var response = new MemberResponse(
        member.Id,
        member.FullName,
        member.Email,
        member.RoleTitle,
        member.Organization,
        member.CreatedAtUtc);

    return Results.Created($"/api/members/{member.Id}", response);
})
.WithName("CreateMember")
.WithOpenApi()
.Produces<MemberResponse>(StatusCodes.Status201Created)
.Produces(StatusCodes.Status422UnprocessableEntity)
.Produces(StatusCodes.Status409Conflict);

api.MapGet("/members/{id:guid}", async (Guid id, IMemberRepository repository, CancellationToken cancellationToken) =>
{
    var member = await repository.GetByIdAsync(id, cancellationToken);
    if (member is null)
    {
        return Results.NotFound();
    }

    var response = new MemberResponse(
        member.Id,
        member.FullName,
        member.Email,
        member.RoleTitle,
        member.Organization,
        member.CreatedAtUtc);

    return Results.Ok(response);
})
.WithName("GetMember")
.WithOpenApi()
.Produces<MemberResponse>()
.ProducesProblem(StatusCodes.Status404NotFound);

api.MapGet("/content/stats", async (IMemberRepository repository, IConfiguration configuration, CancellationToken cancellationToken) =>
{
    var memberCount = await repository.GetCountAsync(cancellationToken);
    var nextMeetupDateStr = configuration["Community:NextMeetupDate"];

    return Results.Ok(new
    {
        memberCount,
        nextMeetupDate = nextMeetupDateStr
    });
})
.WithName("GetContentStats")
.WithOpenApi();

api.MapGet("/content/referral-sources", () =>
{
    return Results.Ok(new[]
    {
        "LinkedIn",
        "Twitter/X",
        "A friend or colleague",
        "CSA/DND event",
        "Google search",
        "Other"
    });
})
.WithName("GetReferralSources")
.WithOpenApi();

await app.RunAsync();

// Make Program class accessible for integration tests
public partial class Program { }
