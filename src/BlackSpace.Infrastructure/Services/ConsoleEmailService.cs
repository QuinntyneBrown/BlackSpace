using BlackSpace.Domain.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace BlackSpace.Infrastructure.Services;

public class ConsoleEmailService : IEmailService
{
    private readonly ILogger<ConsoleEmailService> _logger;
    private readonly IConfiguration _configuration;

    public ConsoleEmailService(ILogger<ConsoleEmailService> logger, IConfiguration configuration)
    {
        _logger = logger;
        _configuration = configuration;
    }

    public Task SendWelcomeEmailAsync(string toEmail, string toName, CancellationToken cancellationToken = default)
    {
        var linkedInGroupUrl = _configuration["Community:LinkedInGroupUrl"] ?? "(not configured)";
        var subject = "Welcome to Black Canadians in Space & Defence!";

        _logger.LogInformation(
            "[DEV EMAIL] Welcome email to {Name} <{Email}> | Subject: {Subject} | LinkedIn: {LinkedInUrl}",
            toName, toEmail, subject, linkedInGroupUrl);
        return Task.CompletedTask;
    }

    public Task SendNotificationEmailAsync(string subject, string body, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation(
            "[DEV EMAIL] Notification - Subject: {Subject}, Body: {Body}",
            subject, body);
        return Task.CompletedTask;
    }
}
