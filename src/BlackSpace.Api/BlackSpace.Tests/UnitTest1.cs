using BlackSpace.Domain.DTOs;
using BlackSpace.Domain.Entities;

namespace BlackSpace.Tests;

public class MemberEntityTests
{
    [Fact]
    public void Member_ShouldHaveExpectedProperties()
    {
        var member = new Member
        {
            Id = Guid.NewGuid(),
            FullName = "Test User",
            Email = "test@example.com",
            RoleTitle = "Engineer",
            Organization = "CSA",
            ReferralSource = "LinkedIn",
            CreatedAtUtc = DateTime.UtcNow,
            IpAddress = "127.0.0.1"
        };

        Assert.Equal("Test User", member.FullName);
        Assert.Equal("test@example.com", member.Email);
        Assert.Equal("Engineer", member.RoleTitle);
        Assert.Equal("CSA", member.Organization);
    }

    [Fact]
    public void CreateMemberRequest_ShouldBeRecord()
    {
        var request = new CreateMemberRequest("Jane Doe", "jane@example.com", "Pilot", "RCAF", "Website");

        Assert.Equal("Jane Doe", request.FullName);
        Assert.Equal("jane@example.com", request.Email);
    }

    [Fact]
    public void MemberResponse_ShouldBeRecord()
    {
        var id = Guid.NewGuid();
        var now = DateTime.UtcNow;
        var response = new MemberResponse(id, "John Doe", "john@example.com", "Analyst", "DND", now);

        Assert.Equal(id, response.Id);
        Assert.Equal("John Doe", response.FullName);
        Assert.Equal(now, response.CreatedAtUtc);
    }
}
