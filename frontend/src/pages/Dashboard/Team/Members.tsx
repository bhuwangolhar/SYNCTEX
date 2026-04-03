// frontend/src/pages/Dashboard/TeamMembers/TeamMembers.tsx
// Admin-only panel: list org users and create new ones.

import { useState, useEffect } from 'react';
import {
  listUsers,
  createUser
} from '../../../services/user.service';
import type { OrgUser, UserPayload } from '../../../services/user.service';
import { getStoredUserRole } from '../../../services/session.service';

const EMPTY_FORM: UserPayload = {
  name: '',
  email: '',
  mobile: '',
  password: '',
  role: 'EMPLOYEE'
};

export default function TeamMembers() {
  const [users, setUsers] = useState<OrgUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<UserPayload>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const role = getStoredUserRole();
  const isAdmin = role === 'ADMIN';

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const data = await listUsers();
      setUsers(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load users';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await createUser(form);
      setSuccess(`Employee "${form.name}" was added. Share the email and password securely so they can log in.`);
      setForm(EMPTY_FORM);
      setShowModal(false);
      fetchUsers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create user';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={s.root}>
      <style>{`
        .tm-row:hover { background: rgba(0,0,0,0.02) !important; }
        .tm-overlay { position:fixed;inset:0;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:200; }
        .tm-modal { background:#fff;border-radius:16px;padding:32px;width:460px;max-width:95vw; }
      `}</style>

      {/* Header */}
      <div style={s.header}>
        <div>
          <h2 style={s.title}>Team Members</h2>
          <p style={s.sub}>Invite employees manually with email and a password you choose</p>
        </div>
        {isAdmin && (
          <button style={s.addBtn} onClick={() => { setShowModal(true); setError(''); setSuccess(''); }}>
            + Invite Member
          </button>
        )}
      </div>

      {/* Success / Error banners */}
      {success && <div style={s.successBanner}>{success}</div>}
      {error && !showModal && <div style={s.errorBanner}>{error}</div>}

      {/* Users Table */}
      {loading ? (
        <p style={s.loading}>Loading…</p>
      ) : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr style={s.thead}>
                <th style={s.th}>Name</th>
                <th style={s.th}>Email</th>
                <th style={s.th}>Mobile</th>
                <th style={s.th}>Role</th>
                <th style={s.th}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="tm-row" style={s.tr}>
                  <td style={s.td}>
                    <div style={s.nameCell}>
                      <div style={{ ...s.avatar, background: u.role === 'ADMIN' ? '#3b82f6' : '#8b5cf6' }}>
                        {u.name[0].toUpperCase()}
                      </div>
                      <span style={s.nameText}>{u.name}</span>
                    </div>
                  </td>
                  <td style={s.td}>{u.email}</td>
                  <td style={s.td}>{u.mobile || '—'}</td>
                  <td style={s.td}>
                    <span style={{
                      ...s.roleBadge,
                      background: u.role === 'ADMIN' ? 'rgba(59,130,246,0.1)' : 'rgba(139,92,246,0.1)',
                      color: u.role === 'ADMIN' ? '#3b82f6' : '#8b5cf6'
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={s.td}>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ ...s.td, textAlign: 'center', color: '#94a3b8' }}>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create User Modal */}
      {showModal && (
        <div className="tm-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="tm-modal">
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 6 }}>
              Invite Employee
            </h3>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>
              Create the employee login details here. They will use this email and password to sign in.
            </p>

            {error && <div style={{ ...s.errorBanner, marginBottom: 16 }}>{error}</div>}

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {(['name', 'email', 'mobile', 'password'] as const).map((field) => (
                <div key={field} style={s.formGroup}>
                  <label style={s.label}>
                    {field === 'mobile'
                      ? 'Mobile (Optional)'
                      : field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    style={s.input}
                    name={field}
                    type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                    placeholder={field === 'password'
                      ? 'Create a temporary password'
                      : field === 'mobile'
                        ? 'Enter mobile number'
                        : `Enter ${field}`}
                    value={form[field]}
                    onChange={handleChange}
                    required={field !== 'mobile'}
                  />
                </div>
              ))}

              <div style={s.formGroup}>
                <label style={s.label}>Role</label>
                <select name="role" value={form.role} onChange={handleChange} style={s.input} required>
                  <option value="EMPLOYEE">Employee</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <p style={s.helperText}>
                The new member will use this email and password to sign in to your organization.
              </p>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="submit" disabled={submitting} style={s.submitBtn}>
                  {submitting ? 'Creating…' : 'Create Login'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={s.cancelBtn}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  root: { display: 'flex', flexDirection: 'column', gap: 20 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, color: '#1e293b' },
  sub: { fontSize: 13, color: '#64748b', marginTop: 3 },
  addBtn: { background: 'linear-gradient(90deg,#3b82f6,#7c3aed)', color: '#fff', border: 'none', borderRadius: 9, padding: '10px 22px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" },
  successBanner: { background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#059669', borderRadius: 8, padding: '10px 16px', fontSize: 13 },
  errorBanner: { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#dc2626', borderRadius: 8, padding: '10px 16px', fontSize: 13 },
  loading: { color: '#64748b', fontSize: 14 },
  tableWrap: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { borderBottom: '1px solid #e2e8f0' },
  th: { textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8 },
  tr: { borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' },
  td: { padding: '14px 16px', fontSize: 13, color: '#334155' },
  nameCell: { display: 'flex', alignItems: 'center', gap: 10 },
  avatar: { width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12, flexShrink: 0 },
  nameText: { fontWeight: 500, color: '#1e293b' },
  roleBadge: { fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99 },
  formGroup: { display: 'flex', flexDirection: 'column', gap: 4 },
  label: { fontSize: 12, fontWeight: 600, color: '#475569' },
  input: { border: '1px solid #e2e8f0', borderRadius: 8, padding: '9px 12px', fontSize: 13, outline: 'none', fontFamily: "'DM Sans',sans-serif", color: '#1e293b' },
  helperText: { fontSize: 12, color: '#64748b', lineHeight: 1.5 },
  submitBtn: { flex: 1, background: 'linear-gradient(90deg,#3b82f6,#7c3aed)', color: '#fff', border: 'none', borderRadius: 9, padding: '11px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" },
  cancelBtn: { padding: '11px 20px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 9, fontSize: 14, cursor: 'pointer', color: '#475569', fontFamily: "'DM Sans',sans-serif" }
};
