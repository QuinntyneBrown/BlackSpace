using BlackSpace.Domain.Entities;

namespace BlackSpace.Domain.Interfaces;

public interface IMemberRepository
{
    Task<Member?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Member?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Member>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Member> AddAsync(Member member, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(string email, CancellationToken cancellationToken = default);
}
