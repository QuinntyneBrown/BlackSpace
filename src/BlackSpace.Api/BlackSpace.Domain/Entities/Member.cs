namespace BlackSpace.Domain.Entities;

public class Member
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? RoleTitle { get; set; }
    public string? Organization { get; set; }
    public string? ReferralSource { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public string? IpAddress { get; set; }
}
