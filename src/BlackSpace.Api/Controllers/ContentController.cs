using BlackSpace.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BlackSpace.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContentController(
    IMemberRepository repository,
    IContentRepository contentRepository,
    IConfiguration configuration) : ControllerBase
{
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats(CancellationToken cancellationToken)
    {
        var memberCount = await repository.GetCountAsync(cancellationToken);
        var nextMeetupDate = await contentRepository.GetNextMeetupDateAsync(cancellationToken)
            ?? configuration["Community:NextMeetupDate"];

        return Ok(new
        {
            memberCount,
            nextMeetupDate
        });
    }

    [HttpGet("referral-sources")]
    public async Task<IActionResult> GetReferralSources(CancellationToken cancellationToken)
    {
        var sources = await contentRepository.GetReferralSourcesAsync(cancellationToken);

        return Ok(sources);
    }
}
