import { Page } from '@playwright/test';

const MOCK_MEMBERS = [
  {
    id: '1',
    fullName: 'Alice Johnson',
    email: 'alice@example.com',
    roleTitle: 'Software Engineer',
    organization: 'Tech Corp',
    referralSource: 'LinkedIn',
    createdAtUtc: new Date().toISOString(),
  },
  {
    id: '2',
    fullName: 'Bob Smith',
    email: 'bob@example.com',
    roleTitle: 'Designer',
    organization: 'Design Co',
    referralSource: 'Twitter',
    createdAtUtc: new Date().toISOString(),
  },
  {
    id: '3',
    fullName: 'Carol Williams',
    email: 'carol@example.com',
    roleTitle: 'Product Manager',
    organization: 'Startup Inc',
    referralSource: 'Friend',
    createdAtUtc: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    fullName: 'David Brown',
    email: 'david@example.com',
    roleTitle: 'Data Scientist',
    organization: 'Analytics Ltd',
    referralSource: 'Conference',
    createdAtUtc: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    fullName: 'Eva Chen',
    email: 'eva@example.com',
    roleTitle: 'CEO',
    organization: 'Eva Enterprises',
    referralSource: 'Other',
    createdAtUtc: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const MOCK_REFERRAL_SOURCES = ['LinkedIn', 'Twitter', 'Friend', 'Conference', 'Other'];

const MOCK_MEETUP_DATE = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

export async function setupAdminApiMocks(page: Page) {
  // Use a single route handler to avoid LIFO ordering issues with Playwright routes.
  await page.route('http://localhost:5000/api/**', (route) => {
    const url = route.request().url();
    const method = route.request().method();

    // --- /api/admin/members ---
    if (url.includes('/api/admin/members')) {
      if (method === 'DELETE') {
        return route.fulfill({ status: 204 });
      }

      if (method === 'PUT') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(MOCK_MEMBERS[0]),
        });
      }

      // GET: list members with optional search/pagination
      const urlObj = new URL(url);
      const pageNum = parseInt(urlObj.searchParams.get('page') ?? '1', 10);
      const pageSize = parseInt(urlObj.searchParams.get('pageSize') ?? '10', 10);
      const search = urlObj.searchParams.get('search') ?? '';

      let filteredMembers = [...MOCK_MEMBERS];

      if (search) {
        const lowerSearch = search.toLowerCase();
        filteredMembers = filteredMembers.filter(
          (m) =>
            m.fullName.toLowerCase().includes(lowerSearch) ||
            m.email.toLowerCase().includes(lowerSearch),
        );
      }

      const totalCount = filteredMembers.length;
      const start = (pageNum - 1) * pageSize;
      const items = filteredMembers.slice(start, start + pageSize);

      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items, totalCount, page: pageNum, pageSize }),
      });
    }

    // --- /api/members (POST create) ---
    if (url.includes('/api/members')) {
      if (method === 'POST') {
        return route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '99',
            fullName: 'New Member',
            email: 'new@example.com',
            createdAtUtc: new Date().toISOString(),
          }),
        });
      }
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    }

    // --- /api/admin/content/next-meetup ---
    if (url.includes('/api/admin/content/next-meetup')) {
      if (method === 'PUT') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ nextMeetupDate: MOCK_MEETUP_DATE }),
        });
      }
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ nextMeetupDate: MOCK_MEETUP_DATE }),
      });
    }

    // --- /api/admin/content/referral-sources ---
    if (url.includes('/api/admin/content/referral-sources')) {
      if (method === 'PUT') {
        const body = route.request().postDataJSON();
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ sources: body.sources }),
        });
      }
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ sources: MOCK_REFERRAL_SOURCES }),
      });
    }

    // --- Catch-all ---
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
}
