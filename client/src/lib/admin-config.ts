/** Signal Atlas security note: the private route reduces accidental discovery; Firebase Authentication and Firestore Rules provide the real access control. */
const requestedAdminPath = import.meta.env.VITE_ADMIN_PATH?.trim();

export const adminPath = requestedAdminPath && /^\/[A-Za-z0-9-]{8,80}$/.test(requestedAdminPath)
  ? requestedAdminPath
  : "/owner-portal-7m4q9x";

export const ownerEmail = (import.meta.env.VITE_ADMIN_EMAIL || "").trim().toLowerCase();
export const hasConfiguredOwner = Boolean(ownerEmail);

export function isConfiguredOwner(email?: string | null) {
  return Boolean(ownerEmail && email && email.trim().toLowerCase() === ownerEmail);
}

