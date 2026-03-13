namespace BlackSpace.Domain.DTOs;

public record UpdateMemberRequest(
    string FullName,
    string Email,
    string? RoleTitle,
    string? Organization,
    string? ReferralSource);
