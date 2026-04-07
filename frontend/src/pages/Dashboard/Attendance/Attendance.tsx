import { useState, useEffect } from 'react';
import {
  getTodayAttendance,
  punchIn,
  punchOut,
  startBreak,
  endBreak,
  updateSessionSummary
} from '../../../services/attendance.service';
import type { TodayAttendanceResponse } from '../../../services/attendance.service';

function secondsToHuman(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function Attendance() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [locationError, setLocationError] = useState('');
  const [attendance, setAttendance] = useState<TodayAttendanceResponse>({
    attendanceDay: null,
    sessions: [],
    activeSession: null,
    totalWorkedSeconds: 0
  });
  const [now, setNow] = useState(new Date());
  const [summaryDraft, setSummaryDraft] = useState('');

  useEffect(() => {
    fetchAttendance();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getTodayAttendance();
      setAttendance(data);
      setSummaryDraft(data.activeSession?.summaryText || '');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const getActiveElapsedSeconds = () => {
    if (!attendance.activeSession) return 0;
    const inMs = new Date(attendance.activeSession.punchInAt).getTime();
    const running = Math.max(0, Math.floor((now.getTime() - inMs) / 1000));

    const paused = attendance.activeSession.totalBreakSeconds || 0;
    const activeBreak = attendance.activeSession.breakStartedAt
      ? Math.max(0, Math.floor((now.getTime() - new Date(attendance.activeSession.breakStartedAt).getTime()) / 1000))
      : 0;

    return Math.max(0, running - paused - activeBreak);
  };

  const getBreakElapsedSeconds = () => {
    if (!attendance.activeSession || !attendance.activeSession.breakStartedAt) return 0;
    const breakStartedMs = new Date(attendance.activeSession.breakStartedAt).getTime();
    return Math.max(0, Math.floor((now.getTime() - breakStartedMs) / 1000));
  };

  const handlePunchInOut = async () => {
    if (attendance.activeSession) {
      await handlePunchOut();
    } else {
      await handlePunchIn();
    }
  };

  const handleBreakToggle = async () => {
    if (attendance.activeSession?.breakStartedAt) {
      await handleEndBreak();
    } else {
      await handleStartBreak();
    }
  };

  const handlePunchIn = async () => {
    setError('');
    setSuccess('');
    setLocationError('');
    // Always use 'Remote' as location - no geolocation fetching
    const locationName = 'Remote';

    try {
      await punchIn({ latitude: null, longitude: null, locationName, summaryText: summaryDraft });
      setSuccess('Punched in successfully.');
      await fetchAttendance();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to punch in');
    }
  };

  const handlePunchOut = async () => {
    setError('');
    setSuccess('');
    try {
      await punchOut();
      setSuccess('Punched out successfully.');
      await fetchAttendance();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to punch out');
    }
  };

  const handleStartBreak = async () => {
    setError('');
    setSuccess('');
    try {
      await startBreak();
      setSuccess('Break started.');
      await fetchAttendance();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to start break');
    }
  };

  const handleEndBreak = async () => {
    setError('');
    setSuccess('');
    try {
      await endBreak();
      setSuccess('Break ended.');
      await fetchAttendance();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to end break');
    }
  };

  const handleSaveSummary = async () => {
    if (!attendance.activeSession) {
      setError('No active session to update summary');
      return;
    }
    setError('');
    setSuccess('');
    try {
      await updateSessionSummary(attendance.activeSession.id, summaryDraft);
      setSuccess('Session summary saved.');
      await fetchAttendance();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save summary');
    }
  };

  const activeSeconds = getActiveElapsedSeconds();
  const breakSeconds = getBreakElapsedSeconds();

  return (
    <div style={s.root}>
      <style>{tableStyles}</style>
      <h2 style={s.title}>Attendance</h2>
      <p style={s.sub}>Track punch in/out, breaks and today's work sessions.</p>

      {loading && <p>Loading attendance...</p>}
      {error && <div style={s.errorBanner}>{error}</div>}
      {locationError && <div style={s.errorBanner}>{locationError}</div>}
      {success && <div style={s.successBanner}>{success}</div>}

      <div style={s.card}>
        <div style={s.statsRow}>
          <div style={s.statItem}>
            <div style={s.statLabel}>Total Worked</div>
            <div style={s.statValue}>{secondsToHuman(attendance.totalWorkedSeconds)}</div>
          </div>
          <div style={s.statItem}>
            <div style={s.statLabel}>Day Status</div>
            <div style={s.statValue}>{attendance.attendanceDay?.status || 'N/A'}</div>
          </div>
          <div style={s.statItem}>
            <div style={s.statLabel}>Location</div>
            <div style={s.statValue}>
              {attendance.activeSession
                ? getDistanceLabel(attendance.activeSession.latitude, attendance.activeSession.longitude)
                : 'Not punched in'}
            </div>
          </div>
        </div>

        <div style={s.buttonRow}>
          <button 
            onClick={handlePunchInOut} 
            disabled={false}
            style={attendance.activeSession ? s.warningBtn : s.primaryBtn}
          >
            {attendance.activeSession ? 'Punch Out' : 'Punch In'}
          </button>
          <button
            onClick={handleBreakToggle}
            disabled={!attendance.activeSession}
            style={s.secondaryBtn}
          >
            {attendance.activeSession?.breakStartedAt ? 'End Break' : 'Start Break'}
          </button>
        </div>

        {attendance.activeSession && (
          <div style={s.liveRow}>
            <div>Current session time: <b>{secondsToHuman(activeSeconds)}</b></div>
            {attendance.activeSession.breakStartedAt && (
              <div>Current break: <b>{secondsToHuman(breakSeconds)}</b></div>
            )}
          </div>
        )}

        <div style={s.summaryRow}>
          <textarea
            value={summaryDraft}
            onChange={(e) => setSummaryDraft(e.target.value)}
            placeholder="Session summary (editable while active)"
            style={s.textarea}
            rows={3}
            disabled={!attendance.activeSession}
          />
          <button
            onClick={handleSaveSummary}
            disabled={!attendance.activeSession}
            style={s.saveBtn}
          >
            Save Summary
          </button>
        </div>
      </div>

      <div style={s.tableWrap}>
        <h3 style={s.tableWrapTitle}>Today's sessions</h3>
        {attendance.sessions.length === 0 ? (
          <p>No sessions started yet today.</p>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                <th>Session</th>
                <th>Punch In</th>
                <th>Punch Out</th>
                <th>Duration</th>
                <th>Breaks</th>
                <th>Location</th>
                <th>Summary</th>
              </tr>
            </thead>
            <tbody>
              {attendance.sessions.map((sess) => (
                <tr key={sess.id} style={{ background: sess.id === attendance.activeSession?.id ? '#f8fbff' : 'transparent' }}>
                  <td>{sess.id.slice(0, 8)}</td>
                  <td>{sess.punchInAt ? new Date(sess.punchInAt).toLocaleTimeString() : '—'}</td>
                  <td>{sess.punchOutAt ? new Date(sess.punchOutAt).toLocaleTimeString() : 'Active'}</td>
                  <td>{sess.durationSeconds !== null && sess.durationSeconds !== undefined ? secondsToHuman(sess.durationSeconds) : '—'}</td>
                  <td>{secondsToHuman(sess.totalBreakSeconds || 0)}{sess.breakStartedAt ? ' (ongoing)' : ''}</td>
                  <td>{sess.locationName || 'Remote'}</td>
                  <td>{sess.summaryText || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSPropertieInAt).toLocaleTimeString()}</td>
                  <td>{sess.punchOutAt ? new Date(sess.punchOutAt).toLocaleTimeString() : 'Active'}</td>
                  <td>{sess.durationSeconds !== null && sess.durationSeconds !== undefined ? secondsToHuman(sess.durationSeconds) : '--'}</td>
                  <td>{secondsToHuman(sess.totalBreakSeconds || 0)}{sess.breakStartedAt ? ' (ongoing)' : ''}</td>
                  <td>{sess.locationName || 'Remote'}</td>
                  <td>{sess.summaryTmplateColumns: 'repeat(3, 1fr)', gap: 12 },
  statItem: { background: '#f8fafc', borderRadius: 9, padding: 10 },
  statLabel: { color: '#64748b', fontSize: 12, marginBottom: 4 },
  statValue: { fontWeight: 700, fontSize: 16 },
  buttonRow: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  primaryBtn: { background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 12px', cursor: 'pointer' },
  warningBtn: { background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 12px', cursor: 'pointer' },
  secondaryBtn: { background: '#e2e8f0', color: '#1e293b', border: 'none', borderRadius: 8, padding: '9px 12px', cursor: 'pointer' },
  liveRow: { marginTop: 8, display: 'flex', gap: 18, color: '#0f766e' },
  summaryRow: { display: 'flex', flexDirection: 'column', gap: 6 },
  textarea: { width: '100%', borderRadius: 8, border: '1px solid #e2e8f0', padding: 8, fontSize: 13, resize: 'vertical' },
  saveBtn: { alignSelf: 'flex-end', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer' },
  tableWrap: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 },
  tableWrapTitle: { fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, color: '#1e293b', margin: '0 0 12px 0' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  errorBanner: { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#dc2626', borderRadius: 8, padding: '8px 12px' },
  successBanner: { background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#059669', borderRadius: 8, padding: '8px 12px' }
};

// Add table cell styles to global styles
const tableStyles = `
  table thead tr {
    background: #f8fafc;
    border-bottom: 2px solid #e2e8f0;
  }
  table thead th {
    padding: 12px;
    text-align: left;
    font-weight: 600;
    color: #1e293b;
    font-size: 12px;
    border: none;
  }
  table tbody tr {
    border-bottom: 1px solid #f1f5f9;
    transition: background 0.15s;
  }
  table tbody tr:hover {
    background: #f8fafc;
  }
  table tbody td {
    padding: 12px;
    color: #475569;
    border: none;
  }
  table tbody tr:last-child {
    border-bottom: none;
  }
`;
