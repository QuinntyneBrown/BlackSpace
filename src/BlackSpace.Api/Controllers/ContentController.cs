using BlackSpace.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BlackSpace.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContentController(
    IMemberRepository repository,
    IConfiguration configuration) : ControllerBase
{
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats(CancellationToken cancellationToken)
    {
        var memberCount = await repository.GetCountAsync(cancellationToken);
        var nextMeetupDate = configuration["Community:NextMeetupDate"];

        return Ok(new
        {
            memberCount,
            nextMeetupDate
        });
    }

    [HttpGet("referral-sources")]
    public IActionResult GetReferralSources()
    {
        return Ok(new[]
        {
            "LinkedIn",
            "Twitter/X",
            "A friend or colleague",
            "CSA/DND event",
            "Google search",
            "Other"
        });
    }
}
