using BlackSpace.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace BlackSpace.Infrastructure.Services;

public class ConsoleEmailService : IEmailService
{
    private readonly ILogger<ConsoleEmailService> _logger;

    public ConsoleEmailService(ILogger<ConsoleEmailService> logger)
    {
        _logger = logger;
    }

    public Task SendWelcomeEmailAsync(string toEmail, string toName, CancellationToken cancellationToken = default)
    {
        _logger.LogInformation(
            "[DEV EMAIL] Welcome email to {Name} <{Email}>: Welcome to Black Canadians in Space & Defence!",
            toName, toEmail);
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
