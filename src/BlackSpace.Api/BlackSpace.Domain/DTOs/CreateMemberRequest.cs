namespace BlackSpace.Domain.DTOs;

public record CreateMemberRequest(
    string FullName,
    string Email,
    string? RoleTitle,
    string? Organization,
    string? ReferralSource);
