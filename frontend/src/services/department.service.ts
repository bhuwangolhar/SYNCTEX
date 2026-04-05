import { apiUrl, parseApiResponse } from './api';

const BASE = apiUrl('/departments');

function authHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
}

export interface Department {
  id: string;
  organization_id: string;
  name: string;
  code?: string;
  description?: string;
}

export interface DepartmentPayload {
  name: string;
  code?: string;
  description?: string;
}

export async function listDepartments(): Promise<Department[]> {
  const res = await fetch(BASE, { headers: authHeaders() });
  return parseApiResponse<Department[]>(res, 'Failed to fetch departments');
}

export async function createDepartment(payload: DepartmentPayload): Promise<Department> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });
  return parseApiResponse<Department>(res, 'Failed to create department');
}

export async function updateDepartment(id: string, payload: DepartmentPayload): Promise<Department> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });
  return parseApiResponse<Department>(res, 'Failed to update department');
}

export async function deleteDepartment(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE', headers: authHeaders() });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to delete department');
  }
}
