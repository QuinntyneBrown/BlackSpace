namespace BlackSpace.Domain.DTOs;

public record MemberResponse(
    Guid Id,
    string FullName,
    string Email,
    string? RoleTitle,
    string? Organization,
    DateTime CreatedAtUtc);
