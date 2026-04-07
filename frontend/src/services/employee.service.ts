import { apiUrl, parseApiResponse } from './api';

const BASE = apiUrl('/employees');

export interface EmployeePayload {
  employeeId: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  department?: string;
  role?: string;
  status?: 'active' | 'inactive' | 'on_leave';
  dateOfJoining?: string;
  userId?: string;
}

export interface Employee {
  id: string;
  organizationId: string;
  employeeId: string;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string | null;
  department: string | null;
  role: string | null;
  status: string;
  dateOfJoining: string | null;
  userId: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

function authHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
}

export async function listEmployees(search?: string, status?: string): Promise<Employee[]> {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (status) params.append('status', status);
  const res = await fetch(`${BASE}?${params.toString()}`, { headers: authHeaders() });
  return parseApiResponse<Employee[]>(res, 'Failed to fetch employees');
}

export async function getEmployee(id: string): Promise<Employee> {
  const res = await fetch(`${BASE}/${id}`, { headers: authHeaders() });
  return parseApiResponse<Employee>(res, 'Failed to fetch employee');
}

export async function createEmployee(payload: EmployeePayload): Promise<Employee> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });
  return parseApiResponse<Employee>(res, 'Failed to create employee');
}

export async function updateEmployee(id: string, payload: Partial<EmployeePayload>): Promise<Employee> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });
  return parseApiResponse<Employee>(res, 'Failed to update employee');
}

export async function deleteEmployee(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to delete employee');
  }
}
