using BlackSpace.Domain.Interfaces;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;

namespace BlackSpace.Infrastructure.Services;

public class SmtpEmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<SmtpEmailService> _logger;

    public SmtpEmailService(IConfiguration configuration, ILogger<SmtpEmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendWelcomeEmailAsync(string toEmail, string toName, CancellationToken cancellationToken = default)
    {
        var subject = "Welcome to Black Canadians in Space & Defence!";
        var body = $"""
            <h1>Welcome, {toName}!</h1>
            <p>Thank you for joining the Black Canadians in Space & Defence community.</p>
            <p>We're excited to have you on board.</p>
            """;

        await SendEmailAsync(toEmail, toName, subject, body, cancellationToken);
    }

    public async Task SendNotificationEmailAsync(string subject, string body, CancellationToken cancellationToken = default)
    {
        var fromAddress = _configuration["Email:FromAddress"] ?? "noreply@blackspace.ca";
        var fromName = _configuration["Email:FromName"] ?? "BlackSpace";

        await SendEmailAsync(fromAddress, fromName, subject, body, cancellationToken);
    }

    private async Task SendEmailAsync(string toEmail, string toName, string subject, string htmlBody, CancellationToken cancellationToken)
    {
        var fromAddress = _configuration["Email:FromAddress"] ?? "noreply@blackspace.ca";
        var fromName = _configuration["Email:FromName"] ?? "BlackSpace";
        var smtpHost = _configuration["Email:SmtpHost"] ?? "localhost";
        var smtpPort = int.Parse(_configuration["Email:SmtpPort"] ?? "587");

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(fromName, fromAddress));
        message.To.Add(new MailboxAddress(toName, toEmail));
        message.Subject = subject;

        message.Body = new TextPart("html")
        {
            Text = htmlBody
        };

        using var client = new SmtpClient();
        try
        {
            await client.ConnectAsync(smtpHost, smtpPort, false, cancellationToken);
            await client.SendAsync(message, cancellationToken);
            _logger.LogInformation("Email sent to {Email}: {Subject}", toEmail, subject);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {Email}: {Subject}", toEmail, subject);
            throw;
        }
        finally
        {
            await client.DisconnectAsync(true, cancellationToken);
        }
    }
}
