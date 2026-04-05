import { apiUrl, parseApiResponse } from './api';

const BASE = apiUrl('/organizations');

function authHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
}

// Transform backend response from snake_case to camelCase
function transformOrganization(data: any): Organization {
  return {
    id: data.id,
    name: data.name,
    founder_name: data.founder_name,
    logo: data.logo,
    contactInfo: data.contact_info,
    taxInfo: data.tax_info
  };
}

// Organization interface
export type Organization = {
  id: string;
  name: string;
  founder_name?: string;
  logo?: string;
  contactInfo?: Record<string, any>;
  taxInfo?: Record<string, any>;
};

// Organization update payload type
export type OrganizationUpdatePayload = {
  name?: string;
  founder_name?: string;
  logo?: string;
  contactInfo?: Record<string, any>;
  taxInfo?: Record<string, any>;
};

/**
 * Get organization details by ID
 */
export async function getOrganization(organizationId: string): Promise<Organization> {
  const response = await fetch(`${BASE}/${organizationId}`, {
    method: 'GET',
    headers: authHeaders()
  });

  const data = await parseApiResponse<any>(response, 'Failed to fetch organization');
  return transformOrganization(data);
}

/**
 * Update organization details
 */
export async function updateOrganization(
  organizationId: string,
  payload: OrganizationUpdatePayload
): Promise<{ message: string; organization: Organization }> {
  const response = await fetch(`${BASE}/${organizationId}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });

  const data = await parseApiResponse<any>(response, 'Failed to update organization');
  return {
    message: data.message,
    organization: transformOrganization(data.organization)
  };
}
