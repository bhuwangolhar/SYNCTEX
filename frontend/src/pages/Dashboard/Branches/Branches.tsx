import { useState, useEffect } from 'react';
import {
  listBranches,
  createBranch,
  updateBranch,
  deleteBranch
} from '../../../services/branch.service';
import type { Branch, BranchPayload } from '../../../services/branch.service';
import { listUsers } from '../../../services/user.service';
import type { OrgUser } from '../../../services/user.service';

const EMPTY_BRANCH: BranchPayload = {
  branchCode: '',
  name: '',
  branchType: 'BRANCH_OFFICE',
  branchStatus: 'ACTIVE',
  addressLine1: '',
  area: '',
  city: '',
  state: '',
  country: 'India',
  pincode: '',
  phone: '',
  email: '',
  gstRegistered: false
};

export default function Branches() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [users, setUsers] = useState<OrgUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [form, setForm] = useState<BranchPayload>(EMPTY_BRANCH);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    fetchBranches();
    fetchUsers();
  }, []);

  async function fetchBranches() {
    try {
      setLoading(true);
      const data = await listBranches();
      setBranches(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load branches');
    } finally {
      setLoading(false);
    }
  }

  async function fetchUsers() {
    try {
      const data = await listUsers();
      setUsers(data);
    } catch (err: unknown) {
      // Silent fail for users
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleGeolocate = async () => {
    setLocationError('');
    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 12000 });
        });
        setForm({
          ...form,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      } catch (err: unknown) {
        setLocationError('Geolocation unavailable or denied.');
      }
    } else {
      setLocationError('Geolocation not supported.');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await createBranch(form);
      setSuccess('Branch created successfully.');
      setForm(EMPTY_BRANCH);
      setShowModal(false);
      fetchBranches();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create branch');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setForm({
      branchCode: branch.branchCode,
      name: branch.name,
      branchType: branch.branchType as any,
      branchStatus: branch.branchStatus as any,
      openingDate: branch.openingDate || '',
      operationalSince: branch.operationalSince || '',
      addressLine1: branch.addressLine1,
      addressLine2: branch.addressLine2 || '',
      area: branch.area,
      city: branch.city,
      state: branch.state,
      country: branch.country,
      pincode: branch.pincode,
      googleMapsLink: branch.googleMapsLink || '',
      latitude: branch.latitude,
      longitude: branch.longitude,
      phone: branch.phone,
      email: branch.email,
      branchOwnerId: branch.branchOwnerId,
      gstRegistered: branch.gstRegistered,
      gstinNumber: branch.gstinNumber || '',
      placeOfSupply: branch.placeOfSupply || '',
      stateCode: branch.stateCode || ''
    });
    setShowModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBranch) return;
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await updateBranch(editingBranch.id, form);
      setSuccess('Branch updated successfully.');
      setForm(EMPTY_BRANCH);
      setShowModal(false);
      setEditingBranch(null);
      fetchBranches();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update branch');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this branch?')) return;
    try {
      await deleteBranch(id);
      setSuccess('Branch deleted successfully.');
      fetchBranches();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete branch');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBranch(null);
    setForm(EMPTY_BRANCH);
    setError('');
    setSuccess('');
  };

  return (
    <div style={s.root}>
      <style>{`
        .branch-row:hover { background: rgba(0,0,0,0.02) !important; }
        .branch-overlay { position:fixed;inset:0;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:200; }
        .branch-modal { background:#fff;border-radius:16px;padding:32px;width:600px;max-width:95vw;max-height:90vh;overflow-y:auto; }
      `}</style>

      <div style={s.header}>
        <div>
          <h2 style={s.title}>Branches</h2>
          <p style={s.sub}>Manage your organization's branches and locations</p>
        </div>
        <button style={s.addBtn} onClick={() => { setShowModal(true); setError(''); setSuccess(''); }}>
          + Add Branch
        </button>
      </div>

      {success && <div style={s.successBanner}>{success}</div>}
      {error && !showModal && <div style={s.errorBanner}>{error}</div>}

      {loading ? (
        <p style={s.loading}>Loading branches…</p>
      ) : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr style={s.thead}>
                <th style={s.th}>Code</th>
                <th style={s.th}>Name</th>
                <th style={s.th}>Type</th>
                <th style={s.th}>Status</th>
                <th style={s.th}>Owner</th>
                <th style={s.th}>Address</th>
                <th style={s.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((b) => (
                <tr key={b.id} className="branch-row" style={s.tr}>
                  <td style={s.td}>{b.branchCode || '—'}</td>
                  <td style={s.td}>{b.name || 'Unnamed Branch'}</td>
                  <td style={s.td}>{((b.branchType || '') ? (b.branchType || '').replace('_', ' ') : '—')}</td>
                  <td style={s.td}>
                    <span style={{
                      ...s.statusBadge,
                      background: b.branchStatus === 'ACTIVE' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                      color: b.branchStatus === 'ACTIVE' ? '#059669' : '#dc2626'
                    }}>
                      {((b.branchStatus || '') ? (b.branchStatus || '').replace('_', ' ') : '—')}
                    </span>
                  </td>
                  <td style={s.td}>{b.owner?.name || '—'}</td>
                  <td style={s.td}>{`${b.area || 'N/A'}, ${b.city || 'N/A'}`}</td>
                  <td style={s.td}>
                    <button onClick={() => handleEdit(b)} style={s.editBtn}>Edit</button>
                    <button onClick={() => handleDelete(b.id)} style={s.deleteBtn}>Delete</button>
                  </td>
                </tr>
              ))}
              {branches.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ ...s.td, textAlign: 'center', color: '#94a3b8' }}>
                    No branches found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="branch-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="branch-modal">
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 6 }}>
              {editingBranch ? 'Edit Branch' : 'Add Branch'}
            </h3>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>
              Fill in the branch details below.
            </p>

            {error && <div style={{ ...s.errorBanner, marginBottom: 16 }}>{error}</div>}
            {locationError && <div style={{ ...s.errorBanner, marginBottom: 16 }}>{locationError}</div>}

            <form onSubmit={editingBranch ? handleUpdate : handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={s.section}>
                <h4 style={s.sectionTitle}>Identity</h4>
                <div style={s.grid}>
                  <div style={s.formGroup}>
                    <label style={s.label}>Branch Code *</label>
                    <input style={s.input} name="branchCode" value={form.branchCode} onChange={handleChange} required />
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.label}>Name *</label>
                    <input style={s.input} name="name" value={form.name} onChange={handleChange} required />
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.label}>Type *</label>
                    <select name="branchType" value={form.branchType} onChange={handleChange} style={s.input} required>
                      <option value="HEAD_OFFICE">Head Office</option>
                      <option value="BRANCH_OFFICE">Branch Office</option>
                      <option value="WAREHOUSE">Warehouse</option>
                      <option value="RETAIL_OUTLET">Retail Outlet</option>
                    </select>
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.label}>Status *</label>
                    <select name="branchStatus" value={form.branchStatus} onChange={handleChange} style={s.input} required>
                      <option value="ACTIVE">Active</option>
                      <option value="TEMPORARILY_CLOSED">Temporarily Closed</option>
                      <option value="PERMANENTLY_CLOSED">Permanently Closed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={s.section}>
                <h4 style={s.sectionTitle}>Address & Location</h4>
                <div style={s.grid}>
                  <div style={s.formGroup}>
                    <label style={s.label}>Address Line 1 *</label>
                    <input style={s.input} name="addressLine1" value={form.addressLine1} onChange={handleChange} required />
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.label}>Address Line 2</label>
                    <input style={s.input} name="addressLine2" value={form.addressLine2} onChange={handleChange} />
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.label}>Area *</label>
                    <input style={s.input} name="area" value={form.area} onChange={handleChange} required />
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.label}>City *</label>
                    <input style={s.input} name="city" value={form.city} onChange={handleChange} required />
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.label}>State *</label>
                    <input style={s.input} name="state" value={form.state} onChange={handleChange} required />
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.label}>Country *</label>
                    <input style={s.input} name="country" value={form.country} onChange={handleChange} required />
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.label}>Pincode *</label>
                    <input style={s.input} name="pincode" value={form.pincode} onChange={handleChange} required />
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.label}>Google Maps Link</label>
                    <input style={s.input} name="googleMapsLink" value={form.googleMapsLink} onChange={handleChange} />
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.label}>Latitude</label>
                    <input style={s.input} name="latitude" type="number" step="0.0000001" value={form.latitude || ''} onChange={(e) => setForm({ ...form, latitude: e.target.value ? parseFloat(e.target.value) : null })} />
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.label}>Longitude</label>
                    <input style={s.input} name="longitude" type="number" step="0.0000001" value={form.longitude || ''} onChange={(e) => setForm({ ...form, longitude: e.target.value ? parseFloat(e.target.value) : null })} />
                  </div>
                  <div style={s.formGroup}>
                    <button type="button" onClick={handleGeolocate} style={s.geoBtn}>Get Current Location</button>
                  </div>
                </div>
              </div>

              <div style={s.section}>
                <h4 style={s.sectionTitle}>Contact & Ownership</h4>
                <div style={s.grid}>
                  <div style={s.formGroup}>
                    <label style={s.label}>Phone *</label>
                    <input style={s.input} name="phone" value={form.phone} onChange={handleChange} required />
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.label}>Email *</label>
                    <input style={s.input} name="email" type="email" value={form.email} onChange={handleChange} required />
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.label}>Branch Owner</label>
                    <select name="branchOwnerId" value={form.branchOwnerId || ''} onChange={handleChange} style={s.input}>
                      <option value="">Select Owner</option>
                      {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div style={s.section}>
                <h4 style={s.sectionTitle}>Compliance</h4>
                <div style={s.grid}>
                  <div style={s.formGroup}>
                    <label style={s.checkboxLabel}>
                      <input type="checkbox" name="gstRegistered" checked={form.gstRegistered} onChange={handleChange} />
                      GST Registered
                    </label>
                  </div>
                  {form.gstRegistered && (
                    <>
                      <div style={s.formGroup}>
                        <label style={s.label}>GSTIN Number *</label>
                        <input style={s.input} name="gstinNumber" value={form.gstinNumber} onChange={handleChange} required />
                      </div>
                      <div style={s.formGroup}>
                        <label style={s.label}>Place of Supply *</label>
                        <input style={s.input} name="placeOfSupply" value={form.placeOfSupply} onChange={handleChange} required />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="submit" disabled={submitting} style={s.submitBtn}>
                  {submitting ? 'Saving…' : editingBranch ? 'Update Branch' : 'Create Branch'}
                </button>
                <button type="button" onClick={closeModal} style={s.cancelBtn}>
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
  statusBadge: { fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99 },
  editBtn: { background: '#e2e8f0', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, cursor: 'pointer', marginRight: 8 },
  deleteBtn: { background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, cursor: 'pointer' },
  section: { border: '1px solid #e2e8f0', borderRadius: 8, padding: 16 },
  sectionTitle: { fontSize: 14, fontWeight: 600, color: '#1e293b', marginBottom: 12 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 },
  formGroup: { display: 'flex', flexDirection: 'column', gap: 4 },
  label: { fontSize: 12, fontWeight: 600, color: '#475569' },
  checkboxLabel: { fontSize: 13, color: '#475569', display: 'flex', alignItems: 'center', gap: 8 },
  input: { border: '1px solid #e2e8f0', borderRadius: 8, padding: '9px 12px', fontSize: 13, outline: 'none', fontFamily: "'DM Sans',sans-serif", color: '#1e293b' },
  geoBtn: { background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 12px', fontSize: 13, cursor: 'pointer', marginTop: 24 },
  submitBtn: { flex: 1, background: 'linear-gradient(90deg,#3b82f6,#7c3aed)', color: '#fff', border: 'none', borderRadius: 9, padding: '11px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" },
  cancelBtn: { padding: '11px 20px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 9, fontSize: 14, cursor: 'pointer', color: '#475569', fontFamily: "'DM Sans',sans-serif" }
};
