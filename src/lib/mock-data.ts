export interface JiraTicket {
  id: string;
  title: string;
  status: "To Do" | "In Progress" | "Done";
  priority: "High" | "Medium" | "Low";
  assignee: string;
  description: string;
}

export interface GithubRepo {
  name: string;
  openPrs: number;
  url: string;
}

export interface ConfluencePage {
  id: string;
  title: string;
  content: string;
}

export const mockJiraTickets: JiraTicket[] = [
  {
    id: "ENG-101",
    title: "Implement SSO Authentication",
    status: "In Progress",
    priority: "High",
    assignee: "Alice Smith",
    description: "Integrate Okta SSO for the internal dashboard as per the new security guidelines.",
  },
  {
    id: "ENG-102",
    title: "Fix API Rate Limiting Bug",
    status: "To Do",
    priority: "High",
    assignee: "Bob Jones",
    description: "Users are getting 429 Too Many Requests errors even when below the quota. Investigate and fix the Redis counter.",
  },
  {
    id: "ENG-103",
    title: "Update React to 18",
    status: "Done",
    priority: "Medium",
    assignee: "Charlie Brown",
    description: "Upgrade the main web app to React 18 and fix any breaking changes.",
  },
  {
    id: "ENG-104",
    title: "Create User Onboarding Flow",
    status: "To Do",
    priority: "Medium",
    assignee: "Diana Prince",
    description: "Design and implement a guided tour for new users upon first login.",
  },
  {
    id: "ENG-105",
    title: "Optimize Database Queries",
    status: "In Progress",
    priority: "Medium",
    assignee: "Eve Davis",
    description: "Review and optimize slow queries in the analytics dashboard module.",
  },
];

export const mockGithubRepos: GithubRepo[] = [
  { name: "core-api-service", openPrs: 4, url: "https://github.com/enterprise/core-api-service" },
  { name: "frontend-dashboard", openPrs: 2, url: "https://github.com/enterprise/frontend-dashboard" },
  { name: "auth-gateway", openPrs: 1, url: "https://github.com/enterprise/auth-gateway" },
];

export const mockConfluencePages: ConfluencePage[] = [
  {
    id: "CONF-1",
    title: "Authentication Architecture",
    content: "Our system uses OAuth 2.0 with JWT tokens. The `auth-gateway` service handles token issuance and validation. All internal microservices must validate the JWT signature using the shared public key retrieved from the `/certs` endpoint on the `auth-gateway`. For SSO integration, we currently use Okta as the primary Identity Provider (IdP).",
  },
  {
    id: "CONF-2",
    title: "API Rate Limiting Guidelines",
    content: "To protect our infrastructure, all public API endpoints are rate-limited. The default limit is 100 requests per minute per IP address, tracked using a sliding window algorithm in Redis. The `core-api-service` implements this via a middleware. When limits are exceeded, a 429 status code MUST be returned along with a `Retry-After` header indicating the seconds until the limit resets.",
  },
];
