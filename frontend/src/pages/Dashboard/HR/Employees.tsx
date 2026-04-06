import { useEffect, useState } from 'react';
import {
  listEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from '../../../services/employee.service';
import type { Employee, EmployeePayload } from '../../../services/employee.service';
import {
  listDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
} from '../../../services/department.service';
import type { Department, DepartmentPayload } from '../../../services/department.service';
import {
  listRoles,
  createRole,
  updateRole,
  deleteRole
} from '../../../services/role.service';
import type { Role, RolePayload } from '../../../services/role.service';

const INITIAL_EMPLOYEE: EmployeePayload = {
  employeeId: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  department: '',
  role: '',
  status: 'active',
  dateOfJoining: ''
};

type Tab = 'employees' | 'departments' | 'roles';

export default function Employees() {
  const [tab, setTab] = useState<Tab>('employees');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'on_leave'>('all');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [form, setForm] = useState<EmployeePayload>(INITIAL_EMPLOYEE);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modals
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deptForm, setDeptForm] = useState<DepartmentPayload>({ name: '', code: '', description: '' });
  const [roleForm, setRoleForm] = useState<RolePayload>({ name: '', code: '', description: '' });

  useEffect(() => {
    refreshAll();
  }, [search, statusFilter]);

  const refreshAll = async () => {
    setLoading(true);
    try {
      const [employeeData, departmentData, roleData] = await Promise.all([
        listEmployees(search, statusFilter === 'all' ? undefined : statusFilter),
        listDepartments(),
        listRoles()
      ]);
      setEmployees(employeeData);
      setDepartments(departmentData);
      setRoles(roleData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => {
    setForm(INITIAL_EMPLOYEE);
    setIsEditing(false);
    setEditingEmployee(null);
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const openEdit = (emp: Employee) => {
    setForm({
      employeeId: emp.employee_id,
      firstName: emp.first_name,
      lastName: emp.last_name || '',
      email: emp.email,
      phone: emp.phone || '',
      department: emp.department || '',
      role: emp.role || '',
      status: emp.status as 'active' | 'inactive' | 'on_leave',
      dateOfJoining: emp.date_of_joining || ''
    });
    setEditingEmployee(emp);
    setIsEditing(true);
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditingEmployee(null);
    setForm(INITIAL_EMPLOYEE);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove employee?')) return;
    try {
      await deleteEmployee(id);
      refreshAll();
      setSuccess('Employee removed');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Remove failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const payload: EmployeePayload = { ...form };
      if (isEditing && editingEmployee) {
        await updateEmployee(editingEmployee.id, payload);
        setSuccess('Employee updated successfully.');
      } else {
        await createEmployee(payload);
        setSuccess('Employee created successfully.');
      }
      closeModal();
      refreshAll();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed');
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    if (!confirm('Remove department?')) return;
    try {
      await deleteDepartment(id);
      refreshAll();
      setSuccess('Department removed');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Remove failed');
    }
  };

  const handleDeleteRole = async (id: string) => {
    if (!confirm('Remove role?')) return;
    try {
      await deleteRole(id);
      refreshAll();
      setSuccess('Role removed');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Remove failed');
    }
  };

  const handleCreateDepartment = async () => {
    if (!deptForm.name.trim()) return;
    try {
      await createDepartment(deptForm);
      setDeptForm({ name: '', code: '', description: '' });
      setShowDeptModal(false);
      refreshAll();
      setSuccess('Department added');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add department');
    }
  };

  const handleUpdateDepartment = async () => {
    if (!editingDept || !deptForm.name.trim()) return;
    try {
      await updateDepartment(editingDept.id, deptForm);
      setDeptForm({ name: '', code: '', description: '' });
      setEditingDept(null);
      setShowDeptModal(false);
      refreshAll();
      setSuccess('Department updated');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update department');
    }
  };

  const handleEditDepartment = (dept: Department) => {
    setDeptForm({ name: dept.name, code: dept.code || '', description: dept.description || '' });
    setEditingDept(dept);
    setShowDeptModal(true);
  };

  const handleCreateRole = async () => {
    if (!roleForm.name.trim()) return;
    try {
      await createRole(roleForm);
      setRoleForm({ name: '', code: '', description: '' });
      setShowRoleModal(false);
      refreshAll();
      setSuccess('Role added');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add role');
    }
  };

  const handleUpdateRole = async () => {
    if (!editingRole || !roleForm.name.trim()) return;
    try {
      await updateRole(editingRole.id, roleForm);
      setRoleForm({ name: '', code: '', description: '' });
      setEditingRole(null);
      setShowRoleModal(false);
      refreshAll();
      setSuccess('Role updated');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
    }
  };

  const handleEditRole = (role: Role) => {
    setRoleForm({ name: role.name, code: role.code || '', description: role.description || '' });
    setEditingRole(role);
    setShowRoleModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={s.root}>
      <style>{` .hr-row:hover { background: rgba(0,0,0,0.03); } `}</style>

      <div style={s.header}>
        <div>
          <h2 style={s.title}>HR</h2>
          <p style={s.subtitle}>Manage employee records, departments and roles</p>
        </div>
      </div>

      <div style={s.tabBar}>
        {(['employees', 'departments', 'roles'] as Tab[]).map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            style={{ ...s.tabButton, ...(tab === item ? s.tabButtonActive : {}) }}
          >
            {item === 'employees' ? 'Employees' : item === 'departments' ? 'Departments' : 'Roles'}
          </button>
        ))}
      </div>

      {success && <div style={s.success}>{success}</div>}
      {error && <div style={s.error}>{error}</div>}

      {tab === 'employees' && (
        <>
          <div style={s.filters}>
            <input style={s.searchInput} placeholder="Search employee..." value={search} onChange={e => setSearch(e.target.value)} />
            <select style={s.statusSelect} value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on_leave">On Leave</option>
            </select>
            <button style={s.addBtn} onClick={openNew}>+ Add Employee</button>
          </div>

          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr style={s.thRow}>
                  <th style={s.th}>ID</th>
                  <th style={s.th}>Name</th>
                  <th style={s.th}>Email</th>
                  <th style={s.th}>Department</th>
                  <th style={s.th}>Role</th>
                  <th style={s.th}>Status</th>
                  <th style={s.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} style={s.loading}>Loading…</td></tr>
                ) : employees.length === 0 ? (
                  <tr><td colSpan={7} style={s.loading}>No employees found</td></tr>
                ) : (
                  employees.map(e => (
                    <tr key={e.id} className="hr-row" style={s.tr}>
                      <td style={s.td}>{e.employee_id}</td>
                      <td style={s.td}>{e.first_name} {e.last_name || ''}</td>
                      <td style={s.td}>{e.email}</td>
                      <td style={s.td}>{e.department || '—'}</td>
                      <td style={s.td}>{e.role || '—'}</td>
                      <td style={s.td}>{e.status}</td>
                      <td style={s.td}>
                        <button style={s.smallBtn} onClick={() => openEdit(e)}>Edit</button>
                        <button style={{ ...s.smallBtn, ...s.deleteBtn }} onClick={() => handleDelete(e.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'departments' && (
        <>
          <div style={s.filters}>
            <div style={{ flex: 1 }}></div>
            <button style={s.addBtn} onClick={() => { setDeptForm({ name: '', code: '', description: '' }); setEditingDept(null); setShowDeptModal(true); }}>+ Add Department</button>
          </div>
          <div style={s.listPanel}>
            <ul style={s.simpleList}>
              {departments.map((d) => (
                <li key={d.id} style={s.listItem}>
                  <div>
                    <strong>{d.name}</strong> {d.code && `(${d.code})`}
                    {d.description && <div style={{ fontSize: 12, color: '#64748b' }}>{d.description}</div>}
                  </div>
                  <div>
                    <button style={s.editBtn} onClick={() => handleEditDepartment(d)}>Edit</button>
                    <button style={s.deleteIcon} onClick={() => handleDeleteDepartment(d.id)}>Delete</button>
                  </div>
                </li>
              ))}
              {departments.length === 0 && <li style={s.empty}>No departments yet</li>}
            </ul>
          </div>
        </>
      )}

      {tab === 'roles' && (
        <>
          <div style={s.filters}>
            <div style={{ flex: 1 }}></div>
            <button style={s.addBtn} onClick={() => { setRoleForm({ name: '', code: '', description: '' }); setEditingRole(null); setShowRoleModal(true); }}>+ Add Role</button>
          </div>
          <div style={s.listPanel}>
            <ul style={s.simpleList}>
              {roles.map((r) => (
                <li key={r.id} style={s.listItem}>
                  <div>
                    <strong>{r.name}</strong> {r.code && `(${r.code})`}
                    {r.description && <div style={{ fontSize: 12, color: '#64748b' }}>{r.description}</div>}
                  </div>
                  <div>
                    <button style={s.editBtn} onClick={() => handleEditRole(r)}>Edit</button>
                    <button style={s.deleteIcon} onClick={() => handleDeleteRole(r.id)}>Delete</button>
                  </div>
                </li>
              ))}
              {roles.length === 0 && <li style={s.empty}>No roles yet</li>}
            </ul>
          </div>
        </>
      )}

      {showModal && (
        <div style={s.modalBackdrop} onClick={closeModal}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h3 style={s.modalTitle}>{isEditing ? 'Edit Employee' : 'New Employee'}</h3>
            <form onSubmit={handleSubmit} style={s.form}>
              <div style={s.row}>
                <label style={s.label}>First Name *</label>
                <input style={s.input} name="firstName" value={form.firstName} onChange={handleChange} required />
              </div>
              <div style={s.row}>
                <label style={s.label}>Last Name</label>
                <input style={s.input} name="lastName" value={form.lastName} onChange={handleChange} />
              </div>
              <div style={s.row}>
                <label style={s.label}>Email *</label>
                <input style={s.input} type="email" name="email" value={form.email} onChange={handleChange} required />
              </div>
              <div style={s.row}>
                <label style={s.label}>Phone</label>
                <input style={s.input} name="phone" value={form.phone} onChange={handleChange} />
              </div>
              <div style={s.row}>
                <label style={s.label}>Department</label>
                <select style={s.input} name="department" value={form.department || ''} onChange={handleChange}>
                  <option value="">Select department</option>
                  {departments.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </div>
              <div style={s.row}>
                <label style={s.label}>Role</label>
                <select style={s.input} name="role" value={form.role || ''} onChange={handleChange}>
                  <option value="">Select role</option>
                  {roles.map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}
                </select>
              </div>
              <div style={s.row}>
                <label style={s.label}>Status</label>
                <select style={s.input} name="status" value={form.status} onChange={handleChange}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on_leave">On Leave</option>
                </select>
              </div>
              <div style={s.row}>
                <label style={s.label}>Date of Joining</label>
                <input style={s.input} type="date" name="dateOfJoining" value={form.dateOfJoining || ''} onChange={handleChange} />
              </div>
              <div style={s.modalActions}>
                <button type="submit" style={s.saveBtn}>{isEditing ? 'Update' : 'Create'}</button>
                <button type="button" onClick={closeModal} style={s.cancelBtn}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeptModal && (
        <div style={s.modalBackdrop} onClick={() => setShowDeptModal(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h3 style={s.modalTitle}>{editingDept ? 'Edit Department' : 'New Department'}</h3>
            <div style={s.form}>
              <div style={s.row}>
                <label style={s.label}>Name *</label>
                <input style={s.input} value={deptForm.name} onChange={e => setDeptForm(prev => ({ ...prev, name: e.target.value }))} required />
              </div>
              <div style={s.row}>
                <label style={s.label}>Code</label>
                <input style={s.input} value={deptForm.code} onChange={e => setDeptForm(prev => ({ ...prev, code: e.target.value }))} />
              </div>
              <div style={s.row}>
                <label style={s.label}>Description</label>
                <textarea style={{ ...s.input, height: 80 }} value={deptForm.description} onChange={e => setDeptForm(prev => ({ ...prev, description: e.target.value }))} />
              </div>
              <div style={s.modalActions}>
                <button onClick={editingDept ? handleUpdateDepartment : handleCreateDepartment} style={s.saveBtn}>{editingDept ? 'Update' : 'Create'}</button>
                <button onClick={() => setShowDeptModal(false)} style={s.cancelBtn}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRoleModal && (
        <div style={s.modalBackdrop} onClick={() => setShowRoleModal(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h3 style={s.modalTitle}>{editingRole ? 'Edit Role' : 'New Role'}</h3>
            <div style={s.form}>
              <div style={s.row}>
                <label style={s.label}>Name *</label>
                <input style={s.input} value={roleForm.name} onChange={e => setRoleForm(prev => ({ ...prev, name: e.target.value }))} required />
              </div>
              <div style={s.row}>
                <label style={s.label}>Code</label>
                <input style={s.input} value={roleForm.code} onChange={e => setRoleForm(prev => ({ ...prev, code: e.target.value }))} />
              </div>
              <div style={s.row}>
                <label style={s.label}>Description</label>
                <textarea style={{ ...s.input, height: 80 }} value={roleForm.description} onChange={e => setRoleForm(prev => ({ ...prev, description: e.target.value }))} />
              </div>
              <div style={s.modalActions}>
                <button onClick={editingRole ? handleUpdateRole : handleCreateRole} style={s.saveBtn}>{editingRole ? 'Update' : 'Create'}</button>
                <button onClick={() => setShowRoleModal(false)} style={s.cancelBtn}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  root: { display: 'flex', flexDirection: 'column', gap: 20 },
  header: { marginBottom: 10 },
  title: { fontSize: 22, fontWeight: 700, margin: 0 },
  subtitle: { color: '#64748b' },
  tabBar: { display: 'flex', gap: 10, marginBottom: 14 },
  tabButton: { border: '1px solid #e2e8f0', borderRadius: 8, background: '#f8fafc', padding: '8px 12px', cursor: 'pointer' },
  tabButtonActive: { background: '#3b82f6', color: '#fff', borderColor: '#3b82f6' },
  filters: { display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' },
  searchInput: { border: '1px solid #cbd5e1', borderRadius: 8, padding: '8px 12px', flex: 1, minWidth: 220 },
  statusSelect: { border: '1px solid #cbd5e1', borderRadius: 8, padding: '8px 12px' },
  addBtn: { background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 14px', cursor: 'pointer' },
  success: { background: '#ecfdf5', border: '1px solid #d1fae5', color: '#059669', borderRadius: 8, padding: '10px' },
  error: { background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: 8, padding: '10px' },
  tableWrap: { border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thRow: { background: '#f8fafc' },
  th: { textAlign: 'left', padding: 10, fontSize: 12, color: '#64748b', borderBottom: '1px solid #e2e8f0' },
  tr: { borderBottom: '1px solid #edf2f7' },
  td: { padding: 10, fontSize: 14, color: '#334155' },
  loading: { padding: 16, color: '#64748b', textAlign: 'center' },
  editBtn: { border: '1px solid #e2e8f0', background: '#f8fafc', color: '#1e293b', padding: '5px 10px', borderRadius: 6, marginRight: 6, cursor: 'pointer' },
  deleteBtn: { background: '#fee2e2', borderColor: '#fecaca', color: '#b91c1c' },
  smallBtn: { border: '1px solid #e2e8f0', background: '#f8fafc', color: '#1e293b', padding: '5px 10px', borderRadius: 6, cursor: 'pointer', marginRight: 8 },
  listPanel: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16 },
  rowInline: { display: 'flex', gap: 10, marginBottom: 12 },
  simpleList: { listStyle: 'none', padding: 0, margin: 0 },
  listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', padding: '8px 4px' },
  empty: { color: '#64748b', padding: 10 },
  deleteIcon: { border: 'none', background: 'transparent', color: '#dc2626', cursor: 'pointer' },
  modalBackdrop: { position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.35)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 200 },
  modal: { background: '#fff', borderRadius: 12, width: 'min(720px, 95vw)', padding: 20, boxShadow: '0 16px 32px rgba(15,23,42,0.18)' },
  modalTitle: { margin: 0, fontSize: 18, fontWeight: 700 },
  form: { marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14 },
  row: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 12, color: '#475569' },
  input: { border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 10px', fontSize: 14, outline: 'none' },
  modalActions: { gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 },
  saveBtn: { background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', cursor: 'pointer' },
  cancelBtn: { background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: 8, padding: '10px 16px', cursor: 'pointer' }
};