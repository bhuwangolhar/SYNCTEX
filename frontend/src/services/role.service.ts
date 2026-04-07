import { apiUrl, parseApiResponse } from './api';

const BASE = apiUrl('/roles');

function authHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
}

export interface Role {
  id: string;
  organizationId: string;
  name: string;
  code?: string;
  description?: string;
}

export interface RolePayload {
  name: string;
  code?: string;
  description?: string;
}

export async function listRoles(): Promise<Role[]> {
  const res = await fetch(BASE, { headers: authHeaders() });
  return parseApiResponse<Role[]>(res, 'Failed to fetch roles');
}

export async function createRole(payload: RolePayload): Promise<Role> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });
  return parseApiResponse<Role>(res, 'Failed to create role');
}

export async function updateRole(id: string, payload: RolePayload): Promise<Role> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });
  return parseApiResponse<Role>(res, 'Failed to update role');
}

export async function deleteRole(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE', headers: authHeaders() });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to delete role');
  }
}
