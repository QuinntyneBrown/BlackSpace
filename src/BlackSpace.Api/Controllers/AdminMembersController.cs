using BlackSpace.Domain.DTOs;
using BlackSpace.Domain.Interfaces;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace BlackSpace.Api.Controllers;

[ApiController]
[Route("api/admin/members")]
public class AdminMembersController(
    IMemberRepository repository,
    IValidator<UpdateMemberRequest> validator) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(PagedResponse<MemberResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> List(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] string sortBy = "createdAtUtc",
        [FromQuery] string sortDirection = "desc",
        CancellationToken cancellationToken = default)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 1;
        if (pageSize > 100) pageSize = 100;

        var (items, totalCount) = await repository.GetPagedAsync(
            page, pageSize, search, sortBy, sortDirection, cancellationToken);

        var responseItems = items.Select(m => new MemberResponse(
            m.Id,
            m.FullName,
            m.Email,
            m.RoleTitle,
            m.Organization,
            m.CreatedAtUtc)).ToList();

        return Ok(new PagedResponse<MemberResponse>(responseItems, totalCount, page, pageSize));
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(MemberResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdateMemberRequest request,
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

        var member = await repository.GetByIdAsync(id, cancellationToken);
        if (member is null)
        {
            return NotFound(new
            {
                error = "not_found",
                message = "Member not found."
            });
        }

        // Check for duplicate email (only if email changed)
        var newEmail = request.Email.Trim().ToLowerInvariant();
        if (!string.Equals(member.Email, newEmail, StringComparison.OrdinalIgnoreCase))
        {
            if (await repository.ExistsAsync(newEmail, cancellationToken))
            {
                return Conflict(new
                {
                    error = "already_registered",
                    message = "This email is already part of the community."
                });
            }
        }

        member.FullName = request.FullName.Trim();
        member.Email = newEmail;
        member.RoleTitle = request.RoleTitle?.Trim();
        member.Organization = request.Organization?.Trim();
        member.ReferralSource = request.ReferralSource?.Trim();

        await repository.UpdateAsync(member, cancellationToken);

        var response = new MemberResponse(
            member.Id,
            member.FullName,
            member.Email,
            member.RoleTitle,
            member.Organization,
            member.CreatedAtUtc);

        return Ok(response);
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var member = await repository.GetByIdAsync(id, cancellationToken);
        if (member is null)
        {
            return NotFound(new
            {
                error = "not_found",
                message = "Member not found."
            });
        }

        await repository.DeleteAsync(id, cancellationToken);

        return NoContent();
    }
}
