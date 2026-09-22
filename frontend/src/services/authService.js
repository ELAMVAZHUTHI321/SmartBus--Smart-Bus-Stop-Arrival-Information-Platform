import { USE_MOCK, httpRequest, delay } from "./api.js";
import { getAll, insert, getById } from "./store.js";
import { uid } from "../utils/format.js";

function encodeToken(user) {
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
  return `mock.${btoa(unescape(encodeURIComponent(JSON.stringify(payload))))}.sig`;
}

export function toSafeUser(user) {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
}

export const authService = {
  async login(email, password) {
    if (USE_MOCK) {
      await delay(400);
      const user = getAll("users").find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
      );
      if (!user) throw new Error("Invalid email or password.");
      if (user.active === false) throw new Error("This account has been deactivated.");
      return { token: encodeToken(user), user: toSafeUser(user) };
    }
    return httpRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async register({ name, email, password, role, phone, organizationName, contactNumber }) {
    if (USE_MOCK) {
      await delay(500);
      if (getAll("users").some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("An account with this email already exists.");
      }
      const createdAt = new Date().toISOString();
      const user = insert("users", {
        id: uid("u"),
        name,
        email,
        password,
        role,
        active: true,
        phone,
        createdAt,
      });
      if (role === "PASSENGER") {
        insert("passengers", { id: uid("p"), userId: user.id, phone: phone || null, createdAt });
      } else if (role === "OPERATOR") {
        insert("operators", {
          id: uid("op"),
          userId: user.id,
          organizationName: organizationName || name,
          contactNumber: contactNumber || phone || null,
          createdAt,
        });
      }
      insert("auditLogs", {
        id: uid("al"),
        userId: user.id,
        action: "REGISTER",
        entityType: "USER",
        entityId: user.id,
        createdAt,
      });
      return { token: encodeToken(user), user: toSafeUser(user) };
    }
    return httpRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role, phone, organizationName, contactNumber }),
    });
  },

  async updateProfile(userId, patch) {
    if (USE_MOCK) {
      await delay();
      const updated = { ...getById("users", userId), ...patch, id: userId };
      return updated;
    }
    return httpRequest(`/users/${userId}`, { method: "PUT", body: JSON.stringify(patch) });
  },
};