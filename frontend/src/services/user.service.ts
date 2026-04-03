// frontend/src/services/user.service.ts

import { apiUrl, parseApiResponse } from './api';

const BASE = apiUrl('/users');

function authHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
}

export interface UserPayload {
  name: string;
  email: string;
  mobile: string;
  password: string;
  role: 'ADMIN' | 'EMPLOYEE';
}

export interface OrgUser {
  id: string;
  name: string;
  email: string;
  mobile: string | null;
  role: 'ADMIN' | 'EMPLOYEE';
  organization_id: string;
  createdAt: string;
}

export async function listUsers(): Promise<OrgUser[]> {
  const res = await fetch(BASE, { headers: authHeaders() });
  return parseApiResponse<OrgUser[]>(res, 'Failed to fetch users');
}

export async function createUser(payload: UserPayload): Promise<OrgUser> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });
  return parseApiResponse<OrgUser>(res, 'Failed to create user');
}

export async function updateUser(
  id: string,
  payload: Partial<UserPayload>
): Promise<OrgUser> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });
  return parseApiResponse<OrgUser>(res, 'Failed to update user');
}
