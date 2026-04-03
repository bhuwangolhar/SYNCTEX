import { apiUrl, parseApiResponse } from "./api";

const BASE = apiUrl("/tasks");

type TaskPayload = {
  title: string;
  description?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  status?: "TODO" | "IN_PROGRESS" | "DONE";
  organization_id: string;
};

const authHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
};

export const getTasks = async (orgId: string) => {
  if (!orgId) {
    return [];
  }

  const res = await fetch(`${BASE}?organization_id=${orgId}`, {
    headers: authHeaders()
  });
  const data = await parseApiResponse<unknown>(res, "Task request failed");

  return Array.isArray(data) ? data : [];
};

export const createTask = async (data: TaskPayload) => {
  if (!data.organization_id) {
    throw new Error("Organization not found. Please log in again.");
  }

  const res = await fetch(BASE, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data)
  });

  return parseApiResponse(res, "Task request failed");
};

export const updateTask = async (id: string, data: Partial<TaskPayload>) => {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data)
  });

  return parseApiResponse(res, "Task request failed");
};

export const deleteTask = async (id: string) => {
  const res = await fetch(`${BASE}/${id}`, {
    method: "DELETE",
    headers: authHeaders()
  });
  return parseApiResponse(res, "Task request failed");
};
