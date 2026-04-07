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
    founder_name: data.founder_name || data.founderName, // Handle both formats
    logo: data.logo,
    contactInfo: data.contact_info || data.contactInfo || {}, // Ensure object exists
    taxInfo: data.tax_info || data.taxInfo || {} // Ensure object exists
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
  // Transform camelCase keys to snake_case for backend compatibility
  const transformedPayload = {
    name: payload.name,
    founder_name: payload.founder_name,
    contact_info: payload.contactInfo,
    logo: payload.logo,
    tax_info: payload.taxInfo
  };

  const response = await fetch(`${BASE}/${organizationId}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(transformedPayload)
  });

  const data = await parseApiResponse<any>(response, 'Failed to update organization');
  
  // Handle response - could be { message, organization } or just organization
  const org = data.organization || data;
  
  return {
    message: data.message || 'Organization updated successfully',
    organization: transformOrganization(org)
  };
}
