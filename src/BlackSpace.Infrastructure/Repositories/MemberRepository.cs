using BlackSpace.Domain.Entities;
using BlackSpace.Domain.Interfaces;
using BlackSpace.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BlackSpace.Infrastructure.Repositories;

public class MemberRepository : IMemberRepository
{
    private readonly AppDbContext _context;

    public MemberRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Member?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Members.FindAsync([id], cancellationToken);
    }

    public async Task<Member?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _context.Members
            .FirstOrDefaultAsync(m => m.Email == email, cancellationToken);
    }

    public async Task<IReadOnlyList<Member>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Members
            .OrderByDescending(m => m.CreatedAtUtc)
            .ToListAsync(cancellationToken);
    }

    public async Task<Member> AddAsync(Member member, CancellationToken cancellationToken = default)
    {
        _context.Members.Add(member);
        await _context.SaveChangesAsync(cancellationToken);
        return member;
    }

    public async Task<bool> ExistsAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _context.Members
            .AnyAsync(m => m.Email.ToLower() == email.ToLower(), cancellationToken);
    }

    public async Task<int> GetCountAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Members.CountAsync(cancellationToken);
    }
}
