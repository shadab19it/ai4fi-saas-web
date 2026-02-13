/** Shared role badge color classes (bg, text, border) */
export const ROLE_COLORS: Record<string, string> = {
  owner: 'bg-amber-50 text-amber-700 border-amber-200',
  admin: 'bg-violet-50 text-violet-600 border-violet-200',
  member: 'bg-blue-50 text-blue-600 border-blue-200',
};

/** Utility to get role badge classes with fallback */
export const getRoleBadgeClasses = (role: string): string =>
  ROLE_COLORS[role] || ROLE_COLORS.member;
