export function normalizeRole(role) {
  if (role === 'waiter') return 'waiter';
  if (role === 'manager' || role === 'admin') return 'manager';
  return null;
}

export function routeForRole(role) {
  return normalizeRole(role) === 'waiter' ? '/waiter' : '/manager';
}
