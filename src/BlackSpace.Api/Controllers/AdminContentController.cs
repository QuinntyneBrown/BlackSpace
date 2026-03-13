using BlackSpace.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BlackSpace.Api.Controllers;

[ApiController]
[Route("api/admin/content")]
public class AdminContentController(
    IContentRepository contentRepository) : ControllerBase
{
    [HttpGet("next-meetup")]
    public async Task<IActionResult> GetNextMeetup(CancellationToken cancellationToken)
    {
        var nextMeetupDate = await contentRepository.GetNextMeetupDateAsync(cancellationToken);

        return Ok(new { nextMeetupDate });
    }

    [HttpPut("next-meetup")]
    public async Task<IActionResult> UpdateNextMeetup(
        [FromBody] UpdateNextMeetupRequest request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.NextMeetupDate))
        {
            return StatusCode(422, new
            {
                error = "validation_failed",
                message = "Please fix the errors below.",
                errors = new { nextMeetupDate = new[] { "Next meetup date is required." } }
            });
        }

        if (!DateTimeOffset.TryParse(request.NextMeetupDate, out _))
        {
            return StatusCode(422, new
            {
                error = "validation_failed",
                message = "Please fix the errors below.",
                errors = new { nextMeetupDate = new[] { "Invalid date format." } }
            });
        }

        await contentRepository.SetNextMeetupDateAsync(request.NextMeetupDate, cancellationToken);

        return Ok(new { nextMeetupDate = request.NextMeetupDate });
    }

    [HttpGet("referral-sources")]
    public async Task<IActionResult> GetReferralSources(CancellationToken cancellationToken)
    {
        var sources = await contentRepository.GetReferralSourcesAsync(cancellationToken);

        return Ok(new { sources });
    }

    [HttpPut("referral-sources")]
    public async Task<IActionResult> UpdateReferralSources(
        [FromBody] UpdateReferralSourcesRequest request,
        CancellationToken cancellationToken)
    {
        if (request.Sources is null || request.Sources.Length == 0)
        {
            return StatusCode(422, new
            {
                error = "validation_failed",
                message = "Please fix the errors below.",
                errors = new { sources = new[] { "At least one referral source is required." } }
            });
        }

        await contentRepository.SetReferralSourcesAsync(request.Sources, cancellationToken);

        return Ok(new { sources = request.Sources });
    }
}

public record UpdateNextMeetupRequest(string NextMeetupDate);
public record UpdateReferralSourcesRequest(string[] Sources);
