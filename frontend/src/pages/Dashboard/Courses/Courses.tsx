import { useState, useEffect } from 'react';
import {
  listCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  archiveCourse,
  getCourseStats
} from '../../../services/course.service';
import type { Course, CoursePayload, CourseStats } from '../../../services/course.service';

const EMPTY_COURSE: CoursePayload = {
  courseCode: '',
  courseName: '',
  courseSlug: '',
  description: '',
  deliveryMode: 'online',
  courseType: '',
  courseStatus: 'draft',
  sellingPrice: null,
  discountedPrice: null,
  gstPercentage: 18,
  feePlan: '',
  language: 'English',
  showOnHomepage: false
};

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<CourseStats>({ total: 0, active: 0, draft: 0, archived: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [form, setForm] = useState<CoursePayload>(EMPTY_COURSE);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Load courses and stats on mount
  useEffect(() => {
    fetchCourses();
    fetchStats();
  }, [search, statusFilter]);

  // Fetch courses with current filters
  async function fetchCourses() {
    try {
      setLoading(true);
      const data = await listCourses(search, statusFilter === 'all' ? undefined : statusFilter);
      setCourses(data.courses);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }

  // Fetch stats for dashboard cards
  async function fetchStats() {
    try {
      const data = await getCourseStats();
      setStats(data);
    } catch (err: unknown) {
      console.error('Failed to load stats:', err);
    }
  }

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
    } else if (type === 'number') {
      setForm({ ...form, [name]: value ? parseFloat(value) : null });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Generate URL slug from course code
  const handleCodeChange = (code: string) => {
    const slug = code.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    setForm({ ...form, courseCode: code, courseSlug: slug });
  };

  // Create new course
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await createCourse(form);
      setSuccess('Course created successfully.');
      setForm(EMPTY_COURSE);
      setShowModal(false);
      fetchCourses();
      fetchStats();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create course');
    } finally {
      setSubmitting(false);
    }
  };

  // Open edit modal with course data
  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setForm({
      courseCode: course.courseCode,
      courseName: course.courseName,
      courseSlug: course.courseSlug,
      description: course.description || '',
      deliveryMode: (course.deliveryMode as any) || 'online',
      courseType: course.courseType || '',
      courseStatus: (course.courseStatus as any) || 'draft',
      sellingPrice: course.sellingPrice,
      discountedPrice: course.discountedPrice,
      gstPercentage: course.gstPercentage,
      feePlan: course.feePlan || '',
      language: course.language,
      showOnHomepage: course.showOnHomepage
    });
    setShowModal(true);
  };

  // Update existing course
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await updateCourse(editingCourse.id, form);
      setSuccess('Course updated successfully.');
      setForm(EMPTY_COURSE);
      setShowModal(false);
      setEditingCourse(null);
      fetchCourses();
      fetchStats();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update course');
    } finally {
      setSubmitting(false);
    }
  };

  // Archive course
  const handleArchive = async (id: string) => {
    if (!confirm('Archive this course? It will move to Archived status.')) return;
    try {
      await archiveCourse(id);
      setSuccess('Course archived successfully.');
      fetchCourses();
      fetchStats();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to archive course');
    }
  };

  // Delete course permanently
  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this course? This cannot be undone.')) return;
    try {
      await deleteCourse(id);
      setSuccess('Course deleted successfully.');
      fetchCourses();
      fetchStats();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete course');
    }
  };

  // Close modal and reset form
  const closeModal = () => {
    setShowModal(false);
    setEditingCourse(null);
    setForm(EMPTY_COURSE);
    setError('');
    setSuccess('');
  };

  // Format price with decimals
  const formatPrice = (price: number | null) => {
    if (!price) return '—';
    return `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div style={s.root}>
      <style>{`
        .course-row:hover { background: rgba(0,0,0,0.02) !important; }
        .course-modal-overlay { position:fixed;inset:0;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:200; }
        .course-modal { background:#fff;border-radius:16px;padding:32px;width:700px;max-width:95vw;max-height:90vh;overflow-y:auto; }
      `}</style>

      {/* Header with title and action */}
      <div style={s.header}>
        <div>
          <h2 style={s.title}>Courses</h2>
          <p style={s.sub}>Manage your organization's courses and training programs</p>
        </div>
        <button style={s.addBtn} onClick={() => { setShowModal(true); setError(''); setSuccess(''); }}>
          + New Course
        </button>
      </div>

      {/* Success and error messages */}
      {success && <div style={s.successBanner}>{success}</div>}
      {error && !showModal && <div style={s.errorBanner}>{error}</div>}

      {/* Stats cards showing course counts by status */}
      <div style={s.statsGrid}>
        <div style={s.statCard}>
          <div style={s.statNumber}>{stats.total}</div>
          <div style={s.statLabel}>Total</div>
        </div>
        <div style={s.statCard}>
          <div style={{ ...s.statNumber, color: '#10b981' }}>{stats.active}</div>
          <div style={s.statLabel}>Active</div>
        </div>
        <div style={s.statCard}>
          <div style={{ ...s.statNumber, color: '#f59e0b' }}>{stats.draft}</div>
          <div style={s.statLabel}>Draft</div>
        </div>
        <div style={s.statCard}>
          <div style={{ ...s.statNumber, color: '#ef4444' }}>{stats.archived}</div>
          <div style={s.statLabel}>Archived</div>
        </div>
      </div>

      {/* Search and filter controls */}
      <div style={s.controlsBar}>
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={s.searchInput}
        />
        <div style={s.filterBtns}>
          {['all', 'active', 'draft', 'archived'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{
                ...s.filterBtn,
                background: statusFilter === status ? '#3b82f6' : '#f1f5f9',
                color: statusFilter === status ? '#fff' : '#475569'
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Course list table */}
      {loading ? (
        <p style={s.loading}>Loading courses…</p>
      ) : courses.length === 0 ? (
        <div style={s.emptyStateContainer}>
          <div style={s.emptyStateCard}>
            <div style={s.emptyStateIcon}>📚</div>
            <h3 style={s.emptyStateTitle}>Create Your First Course</h3>
            <p style={s.emptyStateText}>
              Build and manage training courses for your organization. Start by creating your first course.
            </p>
            <button 
              onClick={() => { setShowModal(true); setError(''); setSuccess(''); }}
              style={s.emptyStateBtn}
            >
              + New Course
            </button>
          </div>
        </div>
      ) : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr style={s.thead}>
                <th style={s.th}>Course</th>
                <th style={s.th}>Code</th>
                <th style={s.th}>Mode</th>
                <th style={s.th}>Price</th>
                <th style={s.th}>Status</th>
                <th style={{ ...s.th, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="course-row" style={s.tr}>
                  <td style={s.td}>
                    <div style={s.courseName}>{course.courseName || 'Unnamed Course'}</div>
                  </td>
                  <td style={s.td}>
                    <div style={s.courseCode}>{course.courseCode || '—'}</div>
                  </td>
                  <td style={s.td}>{course.deliveryMode ? (course.deliveryMode.charAt(0).toUpperCase() + course.deliveryMode.slice(1)) : '—'}</td>
                  <td style={s.td}>
                    <div style={s.priceCol}>
                      <div style={s.sellingPrice}>{formatPrice(course.sellingPrice)}</div>
                      {course.discountedPrice && (
                        <div style={s.discountedPrice}>{formatPrice(course.discountedPrice)}</div>
                      )}
                    </div>
                  </td>
                  <td style={s.td}>
                    <span style={{
                      ...s.statusBadge,
                      background: course.courseStatus === 'active' 
                        ? 'rgba(16,185,129,0.1)' 
                        : course.courseStatus === 'draft' 
                        ? 'rgba(245,158,11,0.1)' 
                        : 'rgba(239,68,68,0.1)',
                      color: course.courseStatus === 'active' 
                        ? '#059669' 
                        : course.courseStatus === 'draft' 
                        ? '#d97706' 
                        : '#dc2626'
                    }}>
                      {course.courseStatus ? (course.courseStatus.charAt(0).toUpperCase() + course.courseStatus.slice(1)) : '—'}
                    </span>
                  </td>
                  <td style={{ ...s.td, ...s.actionsTd }}>
                    <button onClick={() => handleEdit(course)} style={s.editBtn}>Edit</button>
                    {course.course_status !== 'archived' && (
                      <button onClick={() => handleArchive(course.id)} style={s.archiveBtn}>Archive</button>
                    )}
                    <button onClick={() => handleDelete(course.id)} style={s.deleteBtn}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit course modal */}
      {showModal && (
        <div className="course-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="course-modal">
            <h3 style={s.modalTitle}>
              {editingCourse ? 'Edit Course' : 'Create New Course'}
            </h3>
            <p style={s.modalSub}>Fill in the course details below.</p>

            {error && <div style={{ ...s.errorBanner, marginBottom: 16 }}>{error}</div>}

            <form onSubmit={editingCourse ? handleUpdate : handleCreate} style={s.form}>
              {/* General information section */}
              <div style={s.section}>
                <h4 style={s.sectionTitle}>General Information</h4>
                <div style={s.grid}>
                  <div style={s.formGroup}>
                    <label style={s.label}>Course Name *</label>
                    <input style={s.input} name="courseName" value={form.courseName} onChange={handleChange} required placeholder="e.g., Advanced React Development" />
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.label}>Course Code *</label>
                    <input style={s.input} name="courseCode" value={form.courseCode} onChange={(e) => handleCodeChange(e.target.value)} required placeholder="e.g., REACT-101" />
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.label}>URL Slug *</label>
                    <input style={s.input} name="courseSlug" value={form.courseSlug} onChange={handleChange} required placeholder="e.g., advanced-react" />
                  </div>
                </div>

                <div style={s.formGroup}>
                  <label style={s.label}>Description</label>
                  <textarea style={{ ...s.input, minHeight: '100px' }} name="description" value={form.description} onChange={handleChange} placeholder="Brief course overview..." />
                </div>

                <div style={s.formGroup}>
                  <label style={s.checkboxLabel}>
                    <input type="checkbox" name="showOnHomepage" checked={form.showOnHomepage} onChange={handleChange} />
                    Show on Homepage
                  </label>
                </div>
              </div>

              {/* Pricing section */}
              <div style={s.section}>
                <h4 style={s.sectionTitle}>Pricing</h4>
                <div style={s.grid}>
                  <div style={s.formGroup}>
                    <label style={s.label}>Selling Price (₹)</label>
                    <input style={s.input} name="sellingPrice" type="number" step="0.01" value={form.sellingPrice || ''} onChange={handleChange} placeholder="0.00" />
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.label}>Discounted Price (₹)</label>
                    <input style={s.input} name="discountedPrice" type="number" step="0.01" value={form.discountedPrice || ''} onChange={handleChange} placeholder="0.00" />
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.label}>GST (%)</label>
                    <input style={s.input} name="gstPercentage" type="number" step="0.01" value={form.gstPercentage} onChange={handleChange} placeholder="18" />
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.label}>Fee Plan</label>
                    <select name="feePlan" value={form.feePlan} onChange={handleChange} style={s.input}>
                      <option value="">Select Fee Plan</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                      <option value="one-time">One Time</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Delivery & Type section */}
              <div style={s.section}>
                <h4 style={s.sectionTitle}>Delivery & Type</h4>
                <div style={s.grid}>
                  <div style={s.formGroup}>
                    <label style={s.label}>Delivery Mode</label>
                    <select name="deliveryMode" value={form.deliveryMode} onChange={handleChange} style={s.input}>
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.label}>Course Type</label>
                    <select name="courseType" value={form.courseType} onChange={handleChange} style={s.input}>
                      <option value="">Select type</option>
                      <option value="self-paced">Self Paced</option>
                      <option value="instructor-led">Instructor Led</option>
                      <option value="blended">Blended</option>
                    </select>
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.label}>Language</label>
                    <select name="language" value={form.language} onChange={handleChange} style={s.input}>
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Marathi">Marathi</option>
                    </select>
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.label}>Status</label>
                    <select name="courseStatus" value={form.courseStatus} onChange={handleChange} style={s.input}>
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit buttons */}
              <div style={s.formActions}>
                <button type="submit" disabled={submitting} style={s.submitBtn}>
                  {submitting ? 'Saving…' : editingCourse ? 'Update Course' : 'Create Course'}
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

// Styling object for cleaner JSX
const s: Record<string, React.CSSProperties> = {
  root: { display: 'flex', flexDirection: 'column', gap: 24 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 },
  title: { fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 24, color: '#1e293b', margin: 0 },
  sub: { fontSize: 14, color: '#64748b', marginTop: 4 },
  addBtn: { background: 'linear-gradient(90deg,#3b82f6,#7c3aed)', color: '#fff', border: 'none', borderRadius: 9, padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" },
  successBanner: { background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#059669', borderRadius: 8, padding: '12px 16px', fontSize: 13 },
  errorBanner: { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#dc2626', borderRadius: 8, padding: '12px 16px', fontSize: 13 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 },
  statCard: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, textAlign: 'center' },
  statNumber: { fontSize: 28, fontWeight: 700, color: '#1e293b' },
  statLabel: { fontSize: 12, color: '#64748b', marginTop: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  controlsBar: { display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' },
  searchInput: { flex: 1, minWidth: '200px', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', fontSize: 13, outline: 'none', fontFamily: "'DM Sans',sans-serif" },
  filterBtns: { display: 'flex', gap: 8 },
  filterBtn: { border: '1px solid #e2e8f0', borderRadius: 6, padding: '8px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans',sans-serif" },
  loading: { color: '#64748b', fontSize: 14, padding: '32px', textAlign: 'center' },
  tableWrap: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { borderBottom: '1px solid #e2e8f0', background: '#f8fafc' },
  th: { textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8 },
  tr: { borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' },
  td: { padding: '14px 16px', fontSize: 13, color: '#334155' },
  courseNameCol: { display: 'flex', flexDirection: 'column', gap: 2 },
  courseName: { fontWeight: 600, color: '#1e293b' },
  courseCode: { fontSize: 11, color: '#94a3b8' },
  courseDesc: { fontSize: 12, color: '#64748b', marginTop: 2 },
  priceCol: { display: 'flex', flexDirection: 'column', gap: 2 },
  sellingPrice: { fontWeight: 600, color: '#059669' },
  discountedPrice: { fontSize: 12, color: '#94a3b8', textDecoration: 'line-through' },
  statusBadge: { fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 99, display: 'inline-block' },
  editBtn: { background: '#e2e8f0', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, cursor: 'pointer', marginRight: 10 },
  archiveBtn: { background: '#fef08a', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, cursor: 'pointer', marginRight: 10, color: '#854d0e' },
  deleteBtn: { background: '#fee2e2', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, cursor: 'pointer', color: '#dc2626' },
  actionsTd: { textAlign: 'right' as const },
  modalTitle: { fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, color: '#1e293b', margin: '0 0 6px' },
  modalSub: { fontSize: 13, color: '#64748b', marginBottom: 24 },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  section: { border: '1px solid #e2e8f0', borderRadius: 8, padding: 16 },
  sectionTitle: { fontSize: 14, fontWeight: 600, color: '#1e293b', marginBottom: 12, margin: '0 0 12px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 },
  formGroup: { display: 'flex', flexDirection: 'column', gap: 4 },
  label: { fontSize: 12, fontWeight: 600, color: '#475569' },
  checkboxLabel: { fontSize: 13, color: '#475569', display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 },
  input: { border: '1px solid #e2e8f0', borderRadius: 8, padding: '9px 12px', fontSize: 13, outline: 'none', fontFamily: "'DM Sans',sans-serif", color: '#1e293b' },
  formActions: { display: 'flex', gap: 10, marginTop: 8 },
  submitBtn: { flex: 1, background: 'linear-gradient(90deg,#3b82f6,#7c3aed)', color: '#fff', border: 'none', borderRadius: 9, padding: '11px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" },
  cancelBtn: { padding: '11px 20px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 9, fontSize: 14, cursor: 'pointer', color: '#475569', fontFamily: "'DM Sans',sans-serif" },
  emptyStateContainer: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', padding: '40px 20px' },
  emptyStateCard: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '48px 32px', textAlign: 'center', maxWidth: '420px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 },
  emptyStateIcon: { fontSize: 56, marginBottom: 8 },
  emptyStateTitle: { fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 20, color: '#1e293b', margin: 0 },
  emptyStateText: { fontSize: 14, color: '#64748b', lineHeight: 1.5, margin: 0 },
  emptyStateBtn: { background: 'linear-gradient(90deg,#3b82f6,#7c3aed)', color: '#fff', border: 'none', borderRadius: 8, padding: '11px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", marginTop: 8 }
};
