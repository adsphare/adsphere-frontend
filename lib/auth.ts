export type User = {
  id: string;
  name: string;
  email: string;
};

const AUTH_KEY = "adsphere_user";

// Get user
export function getUser(): User | null {
  if (typeof window === "undefined") return null;

  const data = localStorage.getItem(AUTH_KEY);
  return data ? JSON.parse(data) : null;
}

// Login / Register (fake auth)
export function login(name: string, email: string) {
  const user: User = {
    id: Date.now().toString(),
    name,
    email,
  };

  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return user;
}

// Logout
export function logout() {
  localStorage.removeItem(AUTH_KEY);
}