using BlackSpace.Domain.DTOs;
using FluentValidation;

namespace BlackSpace.Api.Validators;

public class UpdateMemberRequestValidator : AbstractValidator<UpdateMemberRequest>
{
    public UpdateMemberRequestValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Please enter your name")
            .MaximumLength(200).WithMessage("Name must be 200 characters or fewer");
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Please enter your email")
            .EmailAddress().WithMessage("Please enter a valid email address")
            .MaximumLength(254).WithMessage("Email must be 254 characters or fewer");
        RuleFor(x => x.RoleTitle)
            .MaximumLength(200).WithMessage("Role/title must be 200 characters or fewer");
        RuleFor(x => x.Organization)
            .MaximumLength(200).WithMessage("Organization must be 200 characters or fewer");
        RuleFor(x => x.ReferralSource)
            .MaximumLength(200).WithMessage("Referral source must be 200 characters or fewer");
    }
}
