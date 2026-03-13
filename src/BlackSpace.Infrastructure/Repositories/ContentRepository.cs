using System.Text.Json;
using BlackSpace.Domain.Entities;
using BlackSpace.Domain.Interfaces;
using BlackSpace.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BlackSpace.Infrastructure.Repositories;

public class ContentRepository : IContentRepository
{
    private const string NextMeetupDateKey = "NextMeetupDate";
    private const string ReferralSourcesKey = "ReferralSources";

    private readonly AppDbContext _context;

    public ContentRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<string?> GetNextMeetupDateAsync(CancellationToken cancellationToken = default)
    {
        var entry = await _context.SiteContents
            .FirstOrDefaultAsync(s => s.Key == NextMeetupDateKey, cancellationToken);
        return entry?.Value;
    }

    public async Task SetNextMeetupDateAsync(string value, CancellationToken cancellationToken = default)
    {
        var entry = await _context.SiteContents
            .FirstOrDefaultAsync(s => s.Key == NextMeetupDateKey, cancellationToken);

        if (entry is null)
        {
            entry = new SiteContent
            {
                Id = Guid.NewGuid(),
                Key = NextMeetupDateKey,
                Value = value
            };
            _context.SiteContents.Add(entry);
        }
        else
        {
            entry.Value = value;
        }

        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<string[]> GetReferralSourcesAsync(CancellationToken cancellationToken = default)
    {
        var entry = await _context.SiteContents
            .FirstOrDefaultAsync(s => s.Key == ReferralSourcesKey, cancellationToken);

        if (entry is null)
            return [];

        return JsonSerializer.Deserialize<string[]>(entry.Value) ?? [];
    }

    public async Task SetReferralSourcesAsync(string[] sources, CancellationToken cancellationToken = default)
    {
        var entry = await _context.SiteContents
            .FirstOrDefaultAsync(s => s.Key == ReferralSourcesKey, cancellationToken);

        var json = JsonSerializer.Serialize(sources);

        if (entry is null)
        {
            entry = new SiteContent
            {
                Id = Guid.NewGuid(),
                Key = ReferralSourcesKey,
                Value = json
            };
            _context.SiteContents.Add(entry);
        }
        else
        {
            entry.Value = json;
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
