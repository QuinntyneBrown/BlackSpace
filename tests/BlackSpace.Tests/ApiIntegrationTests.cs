using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;

namespace BlackSpace.Tests;

public class ApiIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    public ApiIntegrationTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    private HttpClient CreateClient() => _factory.CreateClient();

    private static object CreateValidMemberRequest(string? email = null, string? name = null) => new
    {
        fullName = name ?? $"Test User {Guid.NewGuid():N}",
        email = email ?? $"test-{Guid.NewGuid():N}@example.com",
        roleTitle = "Engineer",
        organization = "TestCorp",
        referralSource = "LinkedIn"
    };

    [Fact]
    public async Task CreateMember_WithValidData_Returns201Created()
    {
        var client = CreateClient();
        var request = CreateValidMemberRequest();

        var response = await client.PostAsJsonAsync("/api/members", request);

        response.StatusCode.Should().Be(HttpStatusCode.Created);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        json.GetProperty("id").GetString().Should().NotBeNullOrEmpty();
        json.GetProperty("fullName").GetString().Should().NotBeNullOrEmpty();
        json.GetProperty("email").GetString().Should().NotBeNullOrEmpty();
        json.TryGetProperty("createdAtUtc", out _).Should().BeTrue();
    }

    [Fact]
    public async Task CreateMember_DuplicateEmail_Returns409Conflict()
    {
        var client = CreateClient();
        var email = $"dup-{Guid.NewGuid():N}@example.com";
        var request1 = CreateValidMemberRequest(email: email);
        var request2 = CreateValidMemberRequest(email: email, name: "Another User");

        var first = await client.PostAsJsonAsync("/api/members", request1);
        first.StatusCode.Should().Be(HttpStatusCode.Created);

        var second = await client.PostAsJsonAsync("/api/members", request2);
        second.StatusCode.Should().Be(HttpStatusCode.Conflict);

        var json = await second.Content.ReadFromJsonAsync<JsonElement>();
        json.GetProperty("error").GetString().Should().Be("already_registered");
    }

    [Fact]
    public async Task CreateMember_EmptyName_Returns422ValidationError()
    {
        var client = CreateClient();
        var request = new
        {
            fullName = "",
            email = $"test-{Guid.NewGuid():N}@example.com",
            roleTitle = (string?)null,
            organization = (string?)null,
            referralSource = (string?)null
        };

        var response = await client.PostAsJsonAsync("/api/members", request);

        response.StatusCode.Should().Be(HttpStatusCode.UnprocessableEntity);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        json.GetProperty("error").GetString().Should().Be("validation_failed");
        json.GetProperty("errors").TryGetProperty("fullName", out _).Should().BeTrue();
    }

    [Fact]
    public async Task CreateMember_InvalidEmail_Returns422ValidationError()
    {
        var client = CreateClient();
        var request = new
        {
            fullName = "Valid Name",
            email = "not-an-email",
            roleTitle = (string?)null,
            organization = (string?)null,
            referralSource = (string?)null
        };

        var response = await client.PostAsJsonAsync("/api/members", request);

        response.StatusCode.Should().Be(HttpStatusCode.UnprocessableEntity);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        json.GetProperty("errors").TryGetProperty("email", out _).Should().BeTrue();
    }

    [Fact]
    public async Task CreateMember_NameTooLong_Returns422ValidationError()
    {
        var client = CreateClient();
        var request = new
        {
            fullName = new string('A', 201),
            email = $"test-{Guid.NewGuid():N}@example.com",
            roleTitle = (string?)null,
            organization = (string?)null,
            referralSource = (string?)null
        };

        var response = await client.PostAsJsonAsync("/api/members", request);

        response.StatusCode.Should().Be(HttpStatusCode.UnprocessableEntity);
    }

    [Fact]
    public async Task CreateMember_EmailCaseInsensitiveDuplicate_Returns409()
    {
        var client = CreateClient();
        var uniquePart = Guid.NewGuid().ToString("N");
        var email1 = $"Test-{uniquePart}@Example.com";
        var email2 = $"test-{uniquePart}@example.com";

        var first = await client.PostAsJsonAsync("/api/members", CreateValidMemberRequest(email: email1));
        first.StatusCode.Should().Be(HttpStatusCode.Created);

        var second = await client.PostAsJsonAsync("/api/members", CreateValidMemberRequest(email: email2));
        second.StatusCode.Should().Be(HttpStatusCode.Conflict);
    }

    [Fact]
    public async Task GetMember_ExistingId_Returns200()
    {
        var client = CreateClient();
        var request = CreateValidMemberRequest();

        var createResponse = await client.PostAsJsonAsync("/api/members", request);
        createResponse.StatusCode.Should().Be(HttpStatusCode.Created);

        var created = await createResponse.Content.ReadFromJsonAsync<JsonElement>();
        var id = created.GetProperty("id").GetString();

        var getResponse = await client.GetAsync($"/api/members/{id}");

        getResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var member = await getResponse.Content.ReadFromJsonAsync<JsonElement>();
        member.GetProperty("id").GetString().Should().Be(id);
        member.GetProperty("fullName").GetString().Should().NotBeNullOrEmpty();
        member.GetProperty("email").GetString().Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task GetMember_NonExistentId_Returns404()
    {
        var client = CreateClient();
        var fakeId = Guid.NewGuid();

        var response = await client.GetAsync($"/api/members/{fakeId}");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetStats_ReturnsCorrectMemberCount()
    {
        // Use a separate factory to get a clean database for count verification
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        // Create 3 members
        for (int i = 0; i < 3; i++)
        {
            var response = await client.PostAsJsonAsync("/api/members", CreateValidMemberRequest());
            response.StatusCode.Should().Be(HttpStatusCode.Created);
        }

        var statsResponse = await client.GetAsync("/api/content/stats");
        statsResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await statsResponse.Content.ReadFromJsonAsync<JsonElement>();
        json.GetProperty("memberCount").GetInt32().Should().Be(3);
    }

    [Fact]
    public async Task GetReferralSources_ReturnsExpectedList()
    {
        var client = CreateClient();

        var response = await client.GetAsync("/api/content/referral-sources");

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var sources = await response.Content.ReadFromJsonAsync<string[]>();
        sources.Should().NotBeNull();
        sources.Should().Contain("LinkedIn");
        sources.Should().Contain("Other");
        sources.Should().Contain("Google search");
        sources.Should().HaveCount(6);
    }

    [Fact]
    public async Task HealthCheck_Returns200Healthy()
    {
        var client = CreateClient();

        var response = await client.GetAsync("/api/health");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Swagger_ReturnsOpenApiDocument()
    {
        var client = CreateClient();

        var response = await client.GetAsync("/swagger/v1/swagger.json");

        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var content = await response.Content.ReadAsStringAsync();
        content.Should().Contain("paths");
    }

    [Fact]
    public async Task CreateMember_EmailFailure_StillReturns201()
    {
        // Use a separate factory so we can configure the FakeEmailService to throw
        using var factory = new CustomWebApplicationFactory();
        factory.FakeEmailService.ShouldThrow = true;
        var client = factory.CreateClient();

        var request = CreateValidMemberRequest();

        var response = await client.PostAsJsonAsync("/api/members", request);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }
}
