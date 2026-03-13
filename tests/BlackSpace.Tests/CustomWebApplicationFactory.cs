using BlackSpace.Domain.Interfaces;
using BlackSpace.Infrastructure.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace BlackSpace.Tests;

public class FakeEmailService : IEmailService
{
    public List<(string Email, string Name)> WelcomeEmailsSent { get; } = [];
    public List<(string Subject, string Body)> NotificationEmailsSent { get; } = [];
    public bool ShouldThrow { get; set; }

    public Task SendWelcomeEmailAsync(string toEmail, string toName, CancellationToken cancellationToken = default)
    {
        if (ShouldThrow)
            throw new InvalidOperationException("Simulated email failure");

        WelcomeEmailsSent.Add((toEmail, toName));
        return Task.CompletedTask;
    }

    public Task SendNotificationEmailAsync(string subject, string body, CancellationToken cancellationToken = default)
    {
        if (ShouldThrow)
            throw new InvalidOperationException("Simulated email failure");

        NotificationEmailsSent.Add((subject, body));
        return Task.CompletedTask;
    }
}

public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    private SqliteConnection? _connection;

    public FakeEmailService FakeEmailService { get; } = new();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Remove existing DbContext registration
            var dbContextDescriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
            if (dbContextDescriptor != null)
                services.Remove(dbContextDescriptor);

            // Remove any existing IEmailService registrations
            var emailDescriptors = services.Where(
                d => d.ServiceType == typeof(IEmailService)).ToList();
            foreach (var descriptor in emailDescriptors)
                services.Remove(descriptor);

            // Create and open a persistent in-memory SQLite connection
            _connection = new SqliteConnection("DataSource=:memory:");
            _connection.Open();

            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseSqlite(_connection);
            });

            // Register the FakeEmailService as singleton so it's the same instance
            services.AddSingleton<IEmailService>(FakeEmailService);

            // Ensure database is created
            var sp = services.BuildServiceProvider();
            using var scope = sp.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            db.Database.EnsureCreated();
        });
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
        if (disposing)
        {
            _connection?.Dispose();
        }
    }
}
