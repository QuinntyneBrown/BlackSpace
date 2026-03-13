namespace BlackSpace.Domain.Interfaces;

public interface IEmailService
{
    Task SendWelcomeEmailAsync(string toEmail, string toName, CancellationToken cancellationToken = default);
    Task SendNotificationEmailAsync(string subject, string body, CancellationToken cancellationToken = default);
}
