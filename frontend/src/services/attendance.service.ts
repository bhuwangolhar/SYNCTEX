import { apiUrl, parseApiResponse } from './api';

const BASE = apiUrl('/attendance');

function authHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
}

export interface AttendanceDay {
  id: string;
  organization_id: string;
  user_id: string;
  date: string;
  total_worked_seconds: number;
  status: 'OPEN' | 'CLOSED' | 'AUTO_CLOSED';
  auto_closed_at: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceSession {
  id: string;
  attendance_day_id: string;
  punch_in_at: string;
  punch_out_at: string | null;
  duration_seconds: number | null;
  break_started_at: string | null;
  total_break_seconds: number;
  latitude: number | null;
  longitude: number | null;
  location_name: string;
  summary_text: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TodayAttendanceResponse {
  attendanceDay: AttendanceDay | null;
  sessions: AttendanceSession[];
  activeSession: AttendanceSession | null;
  totalWorkedSeconds: number;
}

export async function getTodayAttendance(): Promise<TodayAttendanceResponse> {
  const res = await fetch(`${BASE}/today`, { headers: authHeaders() });
  return parseApiResponse<TodayAttendanceResponse>(res, 'Failed to fetch today attendance');
}

export async function getAttendanceByDate(date: string): Promise<TodayAttendanceResponse> {
  const res = await fetch(`${BASE}/by-date?date=${encodeURIComponent(date)}`, { headers: authHeaders() });
  return parseApiResponse<TodayAttendanceResponse>(res, 'Failed to fetch attendance by date');
}

export async function punchIn(payload: {
  latitude?: number | null;
  longitude?: number | null;
  locationName?: string;
  summaryText?: string;
}): Promise<any> {
  const res = await fetch(`${BASE}/punch-in`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });
  return parseApiResponse<any>(res, 'Failed to punch in');
}

export async function punchOut(): Promise<any> {
  const res = await fetch(`${BASE}/punch-out`, { method: 'POST', headers: authHeaders() });
  return parseApiResponse<any>(res, 'Failed to punch out');
}

export async function startBreak(): Promise<any> {
  const res = await fetch(`${BASE}/break/start`, { method: 'POST', headers: authHeaders() });
  return parseApiResponse<any>(res, 'Failed to start break');
}

export async function endBreak(): Promise<any> {
  const res = await fetch(`${BASE}/break/end`, { method: 'POST', headers: authHeaders() });
  return parseApiResponse<any>(res, 'Failed to end break');
}

export async function updateSessionSummary(id: string, summaryText: string): Promise<any> {
  const res = await fetch(`${BASE}/session/${id}/summary`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ summaryText })
  });
  return parseApiResponse<any>(res, 'Failed to update session summary');
}
