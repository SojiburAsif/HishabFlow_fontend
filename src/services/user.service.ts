export type CurrentUser = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  avatarUrl?: string;
  image?: string;
  fullName?: string;
};

export const getCurrentUser = async (): Promise<CurrentUser | null> => {
  try {
    const response = await fetch('/api/me', {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
    });

    if (!response.ok) return null;

    const payload = await response.json();
    return payload?.data ?? null;
  } catch {
    return null;
  }
};
