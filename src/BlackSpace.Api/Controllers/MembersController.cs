using BlackSpace.Domain.DTOs;
using BlackSpace.Domain.Entities;
using BlackSpace.Domain.Interfaces;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace BlackSpace.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MembersController(
    IMemberRepository repository,
    IEmailService emailService,
    IValidator<CreateMemberRequest> validator,
    ILogger<MembersController> logger) : ControllerBase
{
    [HttpPost]
    [ProducesResponseType(typeof(MemberResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Create(
        [FromBody] CreateMemberRequest request,
        CancellationToken cancellationToken)
    {
        var validationResult = await validator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors
                .GroupBy(e => char.ToLowerInvariant(e.PropertyName[0]) + e.PropertyName[1..])
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(e => e.ErrorMessage).ToArray());

            return StatusCode(422, new
            {
                error = "validation_failed",
                message = "Please fix the errors below.",
                errors
            });
        }

        if (await repository.ExistsAsync(request.Email.Trim(), cancellationToken))
        {
            return Conflict(new
            {
                error = "already_registered",
                message = "This email is already part of the community."
            });
        }

        var member = new Member
        {
            Id = Guid.NewGuid(),
            FullName = request.FullName.Trim(),
            Email = request.Email.Trim().ToLowerInvariant(),
            RoleTitle = request.RoleTitle?.Trim(),
            Organization = request.Organization?.Trim(),
            ReferralSource = request.ReferralSource?.Trim(),
            CreatedAtUtc = DateTime.UtcNow,
            IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString()
        };

        await repository.AddAsync(member, cancellationToken);

        // Fire-and-forget email - member creation succeeds even if email fails
        var memberEmail = member.Email;
        var memberName = member.FullName;
        _ = Task.Run(async () =>
        {
            try
            {
                await emailService.SendWelcomeEmailAsync(memberEmail, memberName);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to send welcome email to {Email}", memberEmail);
            }
        });

        var response = new MemberResponse(
            member.Id,
            member.FullName,
            member.Email,
            member.RoleTitle,
            member.Organization,
            member.CreatedAtUtc);

        return CreatedAtAction(nameof(GetById), new { id = member.Id }, response);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(MemberResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var member = await repository.GetByIdAsync(id, cancellationToken);
        if (member is null)
        {
            return NotFound();
        }

        var response = new MemberResponse(
            member.Id,
            member.FullName,
            member.Email,
            member.RoleTitle,
            member.Organization,
            member.CreatedAtUtc);

        return Ok(response);
    }
}
