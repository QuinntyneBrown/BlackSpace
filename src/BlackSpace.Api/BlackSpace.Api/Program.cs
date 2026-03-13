using BlackSpace.Domain.DTOs;
using BlackSpace.Domain.Entities;
using BlackSpace.Domain.Interfaces;
using BlackSpace.Infrastructure.Data;
using BlackSpace.Infrastructure.Repositories;
using BlackSpace.Infrastructure.Services;
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

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.EnsureCreatedAsync();
}

// Health check endpoint
app.MapHealthChecks("/health");

// Minimal API endpoints
var api = app.MapGroup("/api");

api.MapPost("/members", async (CreateMemberRequest request, IMemberRepository repository, IEmailService emailService, HttpContext httpContext, CancellationToken cancellationToken) =>
{
    if (string.IsNullOrWhiteSpace(request.FullName) || string.IsNullOrWhiteSpace(request.Email))
    {
        return Results.BadRequest(new { error = "FullName and Email are required." });
    }

    if (await repository.ExistsAsync(request.Email, cancellationToken))
    {
        return Results.Conflict(new { error = "A member with this email already exists." });
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
    await emailService.SendWelcomeEmailAsync(member.Email, member.FullName, cancellationToken);

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
.ProducesProblem(StatusCodes.Status400BadRequest)
.ProducesProblem(StatusCodes.Status409Conflict);

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

api.MapGet("/community", (IConfiguration configuration) =>
{
    return Results.Ok(new
    {
        LinkedInGroupUrl = configuration["Community:LinkedInGroupUrl"],
        NextMeetupDate = configuration["Community:NextMeetupDate"]
    });
})
.WithName("GetCommunityInfo")
.WithOpenApi();

await app.RunAsync();

// Make Program class accessible for integration tests
public partial class Program { }
