const BASE = "http://localhost:5000/api/enquiries";

const parseResponse = async (res: Response) => {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "Enquiry request failed");
  }

  return data;
};

export const getEnquiries = async (orgId: string) => {
  if (!orgId) {
    return [];
  }

  const res = await fetch(`${BASE}?organization_id=${orgId}`);
  const data = await parseResponse(res);

  return Array.isArray(data) ? data : [];
};

export const createEnquiry = async (data: any) => {
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

export const updateEnquiry = async (id: string, data: any) => {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  return parseResponse(res);
};

export const deleteEnquiry = async (id: string) => {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  return parseResponse(res);
};
