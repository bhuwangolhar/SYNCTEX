import { apiUrl, parseApiResponse } from './api';

const BASE = apiUrl('/courses');

function authHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
}

// Define TypeScript interfaces for course data
export interface CoursePayload {
  courseCode: string;
  courseName: string;
  courseSlug: string;
  description?: string;
  deliveryMode?: 'online' | 'offline' | 'hybrid';
  courseType?: string;
  courseStatus?: 'draft' | 'active' | 'archived';
  sellingPrice?: number | null;
  discountedPrice?: number | null;
  gstPercentage?: number;
  feePlan?: string;
  language?: string;
  showOnHomepage?: boolean;
}

export interface Course {
  id: string;
  organizationId: string;
  courseCode: string;
  courseName: string;
  courseSlug: string;
  description: string | null;
  deliveryMode: string;
  courseType: string | null;
  courseStatus: string;
  sellingPrice: number | null;
  discountedPrice: number | null;
  gstPercentage: number;
  feePlan: string | null;
  language: string;
  showOnHomepage: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  creator?: { id: string; name: string };
}

export interface CourseStats {
  total: number;
  active: number;
  draft: number;
  archived: number;
}

// Fetch all courses with optional filters and search
export async function listCourses(search?: string, status?: string, limit = 50, offset = 0): Promise<{ courses: Course[]; total: number }> {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (status) params.append('status', status);
  params.append('limit', limit.toString());
  params.append('offset', offset.toString());

  const res = await fetch(`${BASE}?${params}`, { headers: authHeaders() });
  return parseApiResponse<{ courses: Course[]; total: number }>(res, 'Failed to fetch courses');
}

// Get course statistics (counts by status)
export async function getCourseStats(): Promise<CourseStats> {
  const res = await fetch(`${BASE}/stats`, { headers: authHeaders() });
  return parseApiResponse<CourseStats>(res, 'Failed to fetch course stats');
}

// Get single course by ID
export async function getCourse(id: string): Promise<Course> {
  const res = await fetch(`${BASE}/${id}`, { headers: authHeaders() });
  return parseApiResponse<Course>(res, 'Failed to fetch course');
}

// Create new course
export async function createCourse(payload: CoursePayload): Promise<Course> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });
  return parseApiResponse<Course>(res, 'Failed to create course');
}

// Update course by ID
export async function updateCourse(id: string, payload: Partial<CoursePayload>): Promise<Course> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });
  return parseApiResponse<Course>(res, 'Failed to update course');
}

// Delete course by ID
export async function deleteCourse(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to delete course');
  }
}

// Archive course (soft delete via status change)
export async function archiveCourse(id: string): Promise<Course> {
  const res = await fetch(`${BASE}/${id}/archive`, {
    method: 'PATCH',
    headers: authHeaders()
  });
  return parseApiResponse<Course>(res, 'Failed to archive course');
}
