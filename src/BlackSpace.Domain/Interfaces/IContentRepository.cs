namespace BlackSpace.Domain.Interfaces;

public interface IContentRepository
{
    Task<string?> GetNextMeetupDateAsync(CancellationToken cancellationToken = default);
    Task SetNextMeetupDateAsync(string value, CancellationToken cancellationToken = default);
    Task<string[]> GetReferralSourcesAsync(CancellationToken cancellationToken = default);
    Task SetReferralSourcesAsync(string[] sources, CancellationToken cancellationToken = default);
}
