// Auth utility functions
// Reference: Replit Auth blueprint

export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}

export function getLoginUrl(): string {
  return "/api/login";
}

export function getLogoutUrl(): string {
  return "/api/logout";
}
