const decodeTokenPayload = (token: string) => {
  try {
    const [, payload] = token.split(".");

    if (!payload) {
      return null;
    }

    const padding = "=".repeat((4 - (payload.length % 4)) % 4);
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/") + padding;

    return JSON.parse(atob(normalized));
  } catch {
    return null;
  }
};

export const getStoredOrganizationId = () => {
  const savedOrgId = localStorage.getItem("organization_id");

  if (savedOrgId) {
    return savedOrgId;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    return "";
  }

  const payload = decodeTokenPayload(token);
  const orgId = payload?.organizationId || "";

  if (orgId) {
    localStorage.setItem("organization_id", orgId);
  }

  return orgId;
};

export const getStoredUserRole = () => {
  const savedRole = localStorage.getItem("userRole");

  if (savedRole) {
    return savedRole;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    return "";
  }

  const payload = decodeTokenPayload(token);
  const role = payload?.role || "";

  if (role) {
    localStorage.setItem("userRole", role);
  }

  return role;
};
