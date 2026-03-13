using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;

namespace BlackSpace.Tests;

public class AdminApiIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    public AdminApiIntegrationTests(CustomWebApplicationFactory factory)
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

    private async Task<Guid> CreateMemberAndGetId(HttpClient client, string? email = null, string? name = null)
    {
        var request = CreateValidMemberRequest(email: email, name: name);
        var response = await client.PostAsJsonAsync("/api/members", request);
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        return Guid.Parse(json.GetProperty("id").GetString()!);
    }

    // ===== L2-21.1: List Members with Pagination, Search, and Sort =====

    [Fact]
    public async Task ListMembers_Pagination_ReturnsCorrectPage()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        // Create 25 members
        for (int i = 0; i < 25; i++)
        {
            await CreateMemberAndGetId(client, name: $"PagUser {i:D2}");
        }

        // Request page 2 with pageSize 10
        var response = await client.GetAsync("/api/admin/members?page=2&pageSize=10");
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        json.GetProperty("totalCount").GetInt32().Should().Be(25);
        json.GetProperty("page").GetInt32().Should().Be(2);
        json.GetProperty("pageSize").GetInt32().Should().Be(10);
        json.GetProperty("items").GetArrayLength().Should().Be(10);
    }

    [Fact]
    public async Task ListMembers_LastPage_ReturnsRemainingItems()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        // Create 25 members
        for (int i = 0; i < 25; i++)
        {
            await CreateMemberAndGetId(client, name: $"LastPageUser {i:D2}");
        }

        // Request page 3 with pageSize 10 — should get 5 items
        var response = await client.GetAsync("/api/admin/members?page=3&pageSize=10");
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        json.GetProperty("totalCount").GetInt32().Should().Be(25);
        json.GetProperty("items").GetArrayLength().Should().Be(5);
    }

    [Fact]
    public async Task ListMembers_SearchByName_FiltersCorrectly()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        await CreateMemberAndGetId(client, name: "Alice Wonderland");
        await CreateMemberAndGetId(client, name: "Bob Builder");
        await CreateMemberAndGetId(client, name: "Alice Springs");

        var response = await client.GetAsync("/api/admin/members?search=Alice");
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        json.GetProperty("totalCount").GetInt32().Should().Be(2);
    }

    [Fact]
    public async Task ListMembers_SearchByEmail_FiltersCorrectly()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        var uniquePart = Guid.NewGuid().ToString("N")[..8];
        await CreateMemberAndGetId(client, email: $"searchable-{uniquePart}@example.com");
        await CreateMemberAndGetId(client, name: "Other Person");

        var response = await client.GetAsync($"/api/admin/members?search=searchable-{uniquePart}");
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        json.GetProperty("totalCount").GetInt32().Should().Be(1);
    }

    [Fact]
    public async Task ListMembers_SortByCreatedAtDesc_DefaultSort()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        await CreateMemberAndGetId(client, name: "First Created");
        await Task.Delay(50); // Ensure different timestamps
        await CreateMemberAndGetId(client, name: "Second Created");

        var response = await client.GetAsync("/api/admin/members?sortBy=createdAtUtc&sortDirection=desc");
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        var items = json.GetProperty("items");
        items.GetArrayLength().Should().BeGreaterThanOrEqualTo(2);
        // The most recently created should be first
        items[0].GetProperty("fullName").GetString().Should().Be("Second Created");
    }

    [Fact]
    public async Task ListMembers_SortByFullNameAsc()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        await CreateMemberAndGetId(client, name: "Zara Zebra");
        await CreateMemberAndGetId(client, name: "Aaron Aardvark");

        var response = await client.GetAsync("/api/admin/members?sortBy=fullName&sortDirection=asc");
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        var items = json.GetProperty("items");
        items.GetArrayLength().Should().BeGreaterThanOrEqualTo(2);
        items[0].GetProperty("fullName").GetString().Should().Be("Aaron Aardvark");
    }

    // ===== L2-21.2: Update Member =====

    [Fact]
    public async Task UpdateMember_ValidData_Returns200()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        var id = await CreateMemberAndGetId(client, name: "Original Name");

        var updateRequest = new
        {
            fullName = "Updated Name",
            email = $"updated-{Guid.NewGuid():N}@example.com",
            roleTitle = "Manager",
            organization = "NewCorp",
            referralSource = "Twitter/X"
        };

        var response = await client.PutAsJsonAsync($"/api/admin/members/{id}", updateRequest);
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        json.GetProperty("fullName").GetString().Should().Be("Updated Name");
        json.GetProperty("roleTitle").GetString().Should().Be("Manager");
        json.GetProperty("organization").GetString().Should().Be("NewCorp");
    }

    [Fact]
    public async Task UpdateMember_NonExistentId_Returns404()
    {
        var client = CreateClient();
        var fakeId = Guid.NewGuid();

        var updateRequest = new
        {
            fullName = "Updated Name",
            email = $"updated-{Guid.NewGuid():N}@example.com",
            roleTitle = (string?)null,
            organization = (string?)null,
            referralSource = (string?)null
        };

        var response = await client.PutAsJsonAsync($"/api/admin/members/{fakeId}", updateRequest);
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task UpdateMember_DuplicateEmail_Returns409()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        var email1 = $"user1-{Guid.NewGuid():N}@example.com";
        var email2 = $"user2-{Guid.NewGuid():N}@example.com";

        await CreateMemberAndGetId(client, email: email1);
        var id2 = await CreateMemberAndGetId(client, email: email2);

        var updateRequest = new
        {
            fullName = "Updated Name",
            email = email1, // Try to use existing email
            roleTitle = (string?)null,
            organization = (string?)null,
            referralSource = (string?)null
        };

        var response = await client.PutAsJsonAsync($"/api/admin/members/{id2}", updateRequest);
        response.StatusCode.Should().Be(HttpStatusCode.Conflict);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        json.GetProperty("error").GetString().Should().Be("already_registered");
    }

    [Fact]
    public async Task UpdateMember_InvalidData_Returns422()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        var id = await CreateMemberAndGetId(client);

        var updateRequest = new
        {
            fullName = "", // Invalid — empty name
            email = "not-an-email", // Invalid email
            roleTitle = (string?)null,
            organization = (string?)null,
            referralSource = (string?)null
        };

        var response = await client.PutAsJsonAsync($"/api/admin/members/{id}", updateRequest);
        response.StatusCode.Should().Be(HttpStatusCode.UnprocessableEntity);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        json.GetProperty("error").GetString().Should().Be("validation_failed");
        json.GetProperty("errors").TryGetProperty("fullName", out _).Should().BeTrue();
        json.GetProperty("errors").TryGetProperty("email", out _).Should().BeTrue();
    }

    [Fact]
    public async Task UpdateMember_SameEmail_Returns200()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        var email = $"same-{Guid.NewGuid():N}@example.com";
        var id = await CreateMemberAndGetId(client, email: email, name: "Original");

        var updateRequest = new
        {
            fullName = "Updated Name",
            email = email, // Same email — should not conflict
            roleTitle = "Manager",
            organization = (string?)null,
            referralSource = (string?)null
        };

        var response = await client.PutAsJsonAsync($"/api/admin/members/{id}", updateRequest);
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        json.GetProperty("fullName").GetString().Should().Be("Updated Name");
    }

    // ===== L2-21.3: Delete Member =====

    [Fact]
    public async Task DeleteMember_ExistingId_Returns204()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        var id = await CreateMemberAndGetId(client);

        var response = await client.DeleteAsync($"/api/admin/members/{id}");
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // Verify the member is gone
        var getResponse = await client.GetAsync($"/api/members/{id}");
        getResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DeleteMember_NonExistentId_Returns404()
    {
        var client = CreateClient();
        var fakeId = Guid.NewGuid();

        var response = await client.DeleteAsync($"/api/admin/members/{fakeId}");
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    // ===== L2-21.4: Get and Update NextMeetupDate =====

    [Fact]
    public async Task GetNextMeetup_ReturnsCurrentDate()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        var response = await client.GetAsync("/api/admin/content/next-meetup");
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        json.GetProperty("nextMeetupDate").GetString().Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task PutNextMeetup_ValidDate_UpdatesAndPersists()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        var newDate = "2026-06-15T19:00:00Z";

        var putResponse = await client.PutAsJsonAsync("/api/admin/content/next-meetup", new { nextMeetupDate = newDate });
        putResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var putJson = await putResponse.Content.ReadFromJsonAsync<JsonElement>();
        putJson.GetProperty("nextMeetupDate").GetString().Should().Be(newDate);

        // Verify persistence
        var getResponse = await client.GetAsync("/api/admin/content/next-meetup");
        getResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var getJson = await getResponse.Content.ReadFromJsonAsync<JsonElement>();
        getJson.GetProperty("nextMeetupDate").GetString().Should().Be(newDate);
    }

    [Fact]
    public async Task PutNextMeetup_InvalidDateFormat_Returns422()
    {
        var client = CreateClient();

        var putResponse = await client.PutAsJsonAsync("/api/admin/content/next-meetup", new { nextMeetupDate = "not-a-date" });
        putResponse.StatusCode.Should().Be(HttpStatusCode.UnprocessableEntity);

        var json = await putResponse.Content.ReadFromJsonAsync<JsonElement>();
        json.GetProperty("error").GetString().Should().Be("validation_failed");
    }

    [Fact]
    public async Task PutNextMeetup_EmptyDate_Returns422()
    {
        var client = CreateClient();

        var putResponse = await client.PutAsJsonAsync("/api/admin/content/next-meetup", new { nextMeetupDate = "" });
        putResponse.StatusCode.Should().Be(HttpStatusCode.UnprocessableEntity);
    }

    // ===== L2-21.5: Get and Update Referral Sources =====

    [Fact]
    public async Task GetAdminReferralSources_ReturnsCurrentSources()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        var response = await client.GetAsync("/api/admin/content/referral-sources");
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        json.GetProperty("sources").GetArrayLength().Should().BeGreaterThan(0);
    }

    [Fact]
    public async Task PutAdminReferralSources_ValidData_UpdatesAndPersists()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        var newSources = new[] { "Website", "Conference", "Social Media" };

        var putResponse = await client.PutAsJsonAsync("/api/admin/content/referral-sources", new { sources = newSources });
        putResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var putJson = await putResponse.Content.ReadFromJsonAsync<JsonElement>();
        putJson.GetProperty("sources").GetArrayLength().Should().Be(3);

        // Verify persistence
        var getResponse = await client.GetAsync("/api/admin/content/referral-sources");
        getResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var getJson = await getResponse.Content.ReadFromJsonAsync<JsonElement>();
        getJson.GetProperty("sources").GetArrayLength().Should().Be(3);
    }

    [Fact]
    public async Task PutAdminReferralSources_EmptyArray_Returns422()
    {
        var client = CreateClient();

        var putResponse = await client.PutAsJsonAsync("/api/admin/content/referral-sources", new { sources = Array.Empty<string>() });
        putResponse.StatusCode.Should().Be(HttpStatusCode.UnprocessableEntity);

        var json = await putResponse.Content.ReadFromJsonAsync<JsonElement>();
        json.GetProperty("error").GetString().Should().Be("validation_failed");
    }

    // ===== L2-21.5: Verify public referral-sources endpoint reads from DB =====

    [Fact]
    public async Task PublicReferralSources_ReflectsAdminUpdates()
    {
        using var factory = new CustomWebApplicationFactory();
        var client = factory.CreateClient();

        // Update via admin
        var newSources = new[] { "Custom Source 1", "Custom Source 2" };
        var putResponse = await client.PutAsJsonAsync("/api/admin/content/referral-sources", new { sources = newSources });
        putResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        // Verify public endpoint reflects the update
        var publicResponse = await client.GetAsync("/api/content/referral-sources");
        publicResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var sources = await publicResponse.Content.ReadFromJsonAsync<string[]>();
        sources.Should().NotBeNull();
        sources.Should().HaveCount(2);
        sources.Should().Contain("Custom Source 1");
        sources.Should().Contain("Custom Source 2");
    }
}
