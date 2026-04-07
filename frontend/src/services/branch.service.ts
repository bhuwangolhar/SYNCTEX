import { apiUrl, parseApiResponse } from './api';

const BASE = apiUrl('/branches');

function authHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
}

export interface BranchPayload {
  branchCode: string;
  name: string;
  branchType: 'HEAD_OFFICE' | 'BRANCH_OFFICE' | 'WAREHOUSE' | 'RETAIL_OUTLET';
  branchStatus: 'ACTIVE' | 'TEMPORARILY_CLOSED' | 'PERMANENTLY_CLOSED';
  openingDate?: string;
  operationalSince?: string;
  addressLine1: string;
  addressLine2?: string;
  area: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  googleMapsLink?: string;
  latitude?: number | null;
  longitude?: number | null;
  phone: string;
  email: string;
  branchOwnerId?: string | null;
  gstRegistered: boolean;
  gstinNumber?: string;
  placeOfSupply?: string;
  stateCode?: string;
}

export interface Branch {
  id: string;
  organizationId: string;
  branchCode: string;
  name: string;
  branchType: string;
  branchStatus: string;
  openingDate: string | null;
  operationalSince: string | null;
  addressLine1: string;
  addressLine2: string | null;
  area: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  googleMapsLink: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string;
  email: string;
  branchOwnerId: string | null;
  gstRegistered: boolean;
  gstinNumber: string | null;
  placeOfSupply: string | null;
  stateCode: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  owner?: { id: string; name: string };
  creator?: { id: string; name: string };
}

export async function listBranches(): Promise<Branch[]> {
  const res = await fetch(BASE, { headers: authHeaders() });
  return parseApiResponse<Branch[]>(res, 'Failed to fetch branches');
}

export async function getBranch(id: string): Promise<Branch> {
  const res = await fetch(`${BASE}/${id}`, { headers: authHeaders() });
  return parseApiResponse<Branch>(res, 'Failed to fetch branch');
}

export async function createBranch(payload: BranchPayload): Promise<Branch> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });
  return parseApiResponse<Branch>(res, 'Failed to create branch');
}

export async function updateBranch(id: string, payload: Partial<BranchPayload>): Promise<Branch> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });
  return parseApiResponse<Branch>(res, 'Failed to update branch');
}

export async function deleteBranch(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE', headers: authHeaders() });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to delete branch');
  }
}
