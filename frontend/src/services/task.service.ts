const BASE = "http://localhost:5000/api/tasks";

type TaskPayload = {
  title: string;
  description?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  status?: "TODO" | "IN_PROGRESS" | "DONE";
  organization_id: string;
};

const parseResponse = async (res: Response) => {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "Task request failed");
  }

  return data;
};

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

export const getTasks = async (orgId: string) => {
  if (!orgId) {
    return [];
  }

  const res = await fetch(`${BASE}?organization_id=${orgId}`);
  const data = await parseResponse(res);

  return Array.isArray(data) ? data : [];
};

export const createTask = async (data: TaskPayload) => {
  if (!data.organization_id) {
    throw new Error("Organization not found. Please log in again.");
  }

  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  return parseResponse(res);
};

export const updateTask = async (id: string, data: Partial<TaskPayload>) => {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  return parseResponse(res);
};

export const deleteTask = async (id: string) => {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  return parseResponse(res);
};
