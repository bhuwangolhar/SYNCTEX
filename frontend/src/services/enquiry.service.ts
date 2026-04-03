import { apiUrl, parseApiResponse } from "./api";

const BASE = apiUrl("/enquiries");

const authHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
};

export const getEnquiries = async (orgId: string) => {
  if (!orgId) {
    return [];
  }

  const res = await fetch(`${BASE}?organization_id=${orgId}`, {
    headers: authHeaders()
  });
  const data = await parseApiResponse<unknown>(res, "Enquiry request failed");

  return Array.isArray(data) ? data : [];
};

export const createEnquiry = async (data: any) => {
  if (!data.organization_id) {
    throw new Error("Organization not found. Please log in again.");
  }

  const res = await fetch(BASE, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data)
  });

  return parseApiResponse(res, "Enquiry request failed");
};

export const updateEnquiry = async (id: string, data: any) => {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data)
  });

  return parseApiResponse(res, "Enquiry request failed");
};

export const deleteEnquiry = async (id: string) => {
  const res = await fetch(`${BASE}/${id}`, {
    method: "DELETE",
    headers: authHeaders()
  });
  return parseApiResponse(res, "Enquiry request failed");
};
