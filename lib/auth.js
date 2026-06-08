export function normalizeRole(role) {
  if (role === 'waiter') return 'waiter';
  if (role === 'manager' || role === 'admin') return 'manager';
  return null;
}

export function routeForRole(role) {
  return normalizeRole(role) === 'waiter' ? '/waiter' : '/manager';
}

const ROLE_COOKIE = 'orderix_role';

export function setRoleCookie(role) {
  if (typeof document === 'undefined') return;
  const normalized = normalizeRole(role);
  if (!normalized) return;
  document.cookie = `${ROLE_COOKIE}=${normalized}; path=/; max-age=2592000; samesite=lax`;
}

export function clearRoleCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = `${ROLE_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

export function getRoleCookie() {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${ROLE_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}
