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
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")!;
var dbProvider = builder.Configuration.GetValue<string>("Database:Provider") ?? "Sqlite";

builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (dbProvider.Equals("PostgreSQL", StringComparison.OrdinalIgnoreCase))
        options.UseNpgsql(connectionString);
    else
        options.UseSqlite(connectionString);
});

// Repositories
builder.Services.AddScoped<IMemberRepository, MemberRepository>();
builder.Services.AddScoped<IContentRepository, ContentRepository>();

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
    ?? ["http://localhost:4200", "http://localhost:4201"];

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

// Controllers & Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure middleware pipeline
app.UseSerilogRequestLogging();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors();

// Ensure database is created and seed default content
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    // Create missing tables for PostgreSQL (EnsureCreated won't add tables to existing DB)
    if (dbProvider.Equals("PostgreSQL", StringComparison.OrdinalIgnoreCase))
    {
        await db.Database.ExecuteSqlRawAsync("""
            CREATE TABLE IF NOT EXISTS "SiteContents" (
                "Id" uuid NOT NULL PRIMARY KEY,
                "Key" character varying(100) NOT NULL,
                "Value" character varying(4000) NOT NULL
            );
            CREATE UNIQUE INDEX IF NOT EXISTS "IX_SiteContents_Key" ON "SiteContents" ("Key");
        """);
    }
    else
    {
        await db.Database.EnsureCreatedAsync();
    }

    var contentRepo = scope.ServiceProvider.GetRequiredService<IContentRepository>();

    // Seed default referral sources if not already present
    var existingSources = await contentRepo.GetReferralSourcesAsync();
    if (existingSources.Length == 0)
    {
        await contentRepo.SetReferralSourcesAsync([
            "LinkedIn",
            "Twitter/X",
            "A friend or colleague",
            "CSA/DND event",
            "Google search",
            "Other"
        ]);
    }

    // Seed default meetup date if not already present
    var existingMeetup = await contentRepo.GetNextMeetupDateAsync();
    if (existingMeetup is null)
    {
        var defaultMeetup = app.Configuration["Community:NextMeetupDate"] ?? "2026-04-15T18:00:00Z";
        await contentRepo.SetNextMeetupDateAsync(defaultMeetup);
    }
}

// Health check endpoint
app.MapHealthChecks("/api/health");

// Map controllers
app.MapControllers();

await app.RunAsync();

// Make Program class accessible for integration tests
public partial class Program { }
