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

    public async Task<Member> UpdateAsync(Member member, CancellationToken cancellationToken = default)
    {
        _context.Members.Update(member);
        await _context.SaveChangesAsync(cancellationToken);
        return member;
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var member = await _context.Members.FindAsync([id], cancellationToken);
        if (member is not null)
        {
            _context.Members.Remove(member);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }

    public async Task<(IReadOnlyList<Member> Items, int TotalCount)> GetPagedAsync(
        int page,
        int pageSize,
        string? search,
        string sortBy,
        string sortDirection,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Members.AsQueryable();

        // Apply search filter
        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.ToLower();
            query = query.Where(m =>
                m.FullName.ToLower().Contains(searchLower) ||
                m.Email.ToLower().Contains(searchLower));
        }

        var totalCount = await query.CountAsync(cancellationToken);

        // Apply sorting
        query = sortBy.ToLowerInvariant() switch
        {
            "fullname" => sortDirection.ToLowerInvariant() == "asc"
                ? query.OrderBy(m => m.FullName)
                : query.OrderByDescending(m => m.FullName),
            "email" => sortDirection.ToLowerInvariant() == "asc"
                ? query.OrderBy(m => m.Email)
                : query.OrderByDescending(m => m.Email),
            _ => sortDirection.ToLowerInvariant() == "asc"
                ? query.OrderBy(m => m.CreatedAtUtc)
                : query.OrderByDescending(m => m.CreatedAtUtc),
        };

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }
}
