import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrganization } from '../../../hooks/useOrganization';

export default function Settings() {
  const navigate = useNavigate();
  const { organization, loading, error, updateOrgName, updateFounderName, updateContactInfo, updateTaxInfo } = useOrganization();
  const [editingOrgName, setEditingOrgName] = useState(false);
  const [editingFounderName, setEditingFounderName] = useState(false);
  const [editingContactInfo, setEditingContactInfo] = useState(false);
  const [editingTaxInfo, setEditingTaxInfo] = useState(false);
  const [newOrgName, setNewOrgName] = useState(organization?.name || '');
  const [newFounderName, setNewFounderName] = useState(organization?.founder_name || '');
  const [newPhone, setNewPhone] = useState(organization?.contactInfo?.phone || '');
  const [newEmail, setNewEmail] = useState(organization?.contactInfo?.email || '');
  const [newGST, setNewGST] = useState(organization?.taxInfo?.gst || '');
  const [newPAN, setNewPAN] = useState(organization?.taxInfo?.pan || '');
  const [newAadhar, setNewAadhar] = useState(organization?.taxInfo?.aadhar || '');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Sync form fields when organization data updates
  useEffect(() => {
    setNewOrgName(organization?.name || '');
    setNewFounderName(organization?.founder_name || '');
    setNewPhone(organization?.contactInfo?.phone || '');
    setNewEmail(organization?.contactInfo?.email || '');
    setNewGST(organization?.taxInfo?.gst || '');
    setNewPAN(organization?.taxInfo?.pan || '');
    setNewAadhar(organization?.taxInfo?.aadhar || '');
  }, [organization]);

  const handleSaveOrgName = async () => {
    if (!newOrgName.trim()) {
      setSaveError('Organization name cannot be empty');
      return;
    }

    if (newOrgName === organization?.name) {
      setEditingOrgName(false);
      return;
    }

    try {
      setSaving(true);
      setSaveError(null);
      setSaveSuccess(false);

      await updateOrgName(newOrgName);

      setSaveSuccess(true);
      setEditingOrgName(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save organization name';
      setSaveError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFounderName = async () => {
    if (!newFounderName.trim()) {
      setSaveError('Founder name cannot be empty');
      return;
    }

    if (newFounderName === organization?.founder_name) {
      setEditingFounderName(false);
      return;
    }

    try {
      setSaving(true);
      setSaveError(null);
      setSaveSuccess(false);

      await updateFounderName(newFounderName);

      setSaveSuccess(true);
      setEditingFounderName(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save founder name';
      setSaveError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setNewOrgName(organization?.name || '');
    setNewFounderName(organization?.founder_name || '');
    setNewPhone(organization?.contactInfo?.phone || '');
    setNewEmail(organization?.contactInfo?.email || '');
    setNewGST(organization?.taxInfo?.gst || '');
    setNewPAN(organization?.taxInfo?.pan || '');
    setNewAadhar(organization?.taxInfo?.aadhar || '');
    setEditingOrgName(false);
    setEditingFounderName(false);
    setEditingContactInfo(false);
    setEditingTaxInfo(false);
    setSaveError(null);
  };

  const handleSaveContactInfo = async () => {
    if (!newPhone.trim() || !newEmail.trim()) {
      setSaveError('Phone and email are required');
      return;
    }

    if (newPhone === organization?.contactInfo?.phone && newEmail === organization?.contactInfo?.email) {
      setEditingContactInfo(false);
      return;
    }

    try {
      setSaving(true);
      setSaveError(null);
      setSaveSuccess(false);

      await updateContactInfo(newPhone, newEmail);

      setSaveSuccess(true);
      setEditingContactInfo(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save contact info';
      setSaveError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveTaxInfo = async () => {
    if (!newGST.trim() && !newPAN.trim() && !newAadhar.trim()) {
      setSaveError('At least one tax field is required');
      return;
    }

    if (newGST === organization?.taxInfo?.gst && newPAN === organization?.taxInfo?.pan && newAadhar === organization?.taxInfo?.aadhar) {
      setEditingTaxInfo(false);
      return;
    }

    try {
      setSaving(true);
      setSaveError(null);
      setSaveSuccess(false);

      await updateTaxInfo(newGST, newPAN, newAadhar);

      setSaveSuccess(true);
      setEditingTaxInfo(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save tax info';
      setSaveError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Filter categories based on search
  const categories = [
    {
      title: 'Organization',
      description: 'Company details and basic info',
      icon: '🏢',
      items: [
        { label: 'Organization Name', description: 'Your company name', settingKey: 'orgName' },
        { label: 'Founder Name', description: 'Name of the organization creator', settingKey: 'founderName' },
        { label: 'Contact Information', description: 'Phone, email, address', settingKey: 'contact' },
        { label: 'Tax Information', description: 'GST, PAN, Aadhar', settingKey: 'tax' }
      ]
    },
    {
      title: 'User & Access',
      description: 'Manage users and permissions',
      icon: '👥',
      items: [
        { label: 'Team Members', description: 'Add, edit, or remove users', settingKey: 'team' },
        { label: 'Roles & Permissions', description: 'Create and assign roles', settingKey: 'roles' },
        { label: 'Departments', description: 'Manage organizational departments', settingKey: 'access' },
        { label: 'Access Control', description: 'Module-level permissions', settingKey: 'security' }
      ]
    }
  ];

  const filteredCategories = categories.filter(cat =>
    cat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.items.some(item => item.label.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={s.root}>
      <style>{`
        .settings-box { transition: all 0.2s ease; }
        .settings-box:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.1) !important; }
        .settings-item { transition: background 0.15s; cursor: pointer; }
        .settings-item:hover { background: rgba(59,130,246,0.05); }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { background: white; border-radius: 12px; padding: 24px; max-width: 500px; width: 90%; box-shadow: 0 20px 25px rgba(0,0,0,0.15); }
        input[type="text"]:focus, input[type="tel"]:focus, input[type="email"]:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
        input[type="text"]:disabled, input[type="tel"]:disabled, input[type="email"]:disabled { background-color: #f1f5f9; cursor: not-allowed; }
        button:hover { opacity: 0.9; }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      {/* Header */}
      <div style={s.header}>
        <div>
          <h2 style={s.title}>Settings</h2>
          <p style={s.sub}>Manage your organization's preferences and configurations</p>
        </div>
      </div>

      {/* Messages */}
      {saveSuccess && (
        <div style={s.successMessage}>
          ✓ {editingOrgName ? 'Organization name' : 'Founder name'} updated successfully
        </div>
      )}

      {saveError && (
        <div style={s.errorMessage}>
          ✗ {saveError}
        </div>
      )}

      {error && (
        <div style={s.errorMessage}>
          ✗ {error}
        </div>
      )}

      {/* Search bar */}
      <div style={s.searchBar}>
        <span style={s.searchIcon}>🔍</span>
        <input
          type="text"
          placeholder="Search settings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={s.searchInput}
        />
      </div>

      {/* Settings grid */}
      <div style={s.grid}>
        {filteredCategories.map((category, idx) => (
          <div key={idx} className="settings-box" style={s.settingsBox}>
            {/* Category header */}
            <div style={s.categoryHeader}>
              <div style={s.categoryIcon}>{category.icon}</div>
              <div style={s.categoryTitle}>
                <h3 style={s.categoryName}>{category.title}</h3>
                <p style={s.categoryDesc}>{category.description}</p>
              </div>
            </div>

            {/* Settings items */}
            <div style={s.itemsList}>
              {category.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className="settings-item"
                  style={s.settingsItem}
                  onClick={() => {
                    if (item.settingKey === 'team' || item.settingKey === 'roles' || item.settingKey === 'access') {
                      navigate('/dashboard/hr');
                    } else if (item.settingKey === 'security') {
                      navigate('/dashboard/access-control');
                    } else if (item.settingKey === 'orgName') {
                      setEditingOrgName(true);
                      setNewOrgName(organization?.name || '');
                      setSaveError(null);
                    } else if (item.settingKey === 'founderName') {
                      setEditingFounderName(true);
                      setNewFounderName(organization?.founder_name || '');
                      setSaveError(null);
                    } else if (item.settingKey === 'contact') {
                      setEditingContactInfo(true);
                      setNewPhone(organization?.contactInfo?.phone || '');
                      setNewEmail(organization?.contactInfo?.email || '');
                      setSaveError(null);
                    } else if (item.settingKey === 'tax') {
                      setEditingTaxInfo(true);
                      setNewGST(organization?.taxInfo?.gst || '');
                      setNewPAN(organization?.taxInfo?.pan || '');
                      setNewAadhar(organization?.taxInfo?.aadhar || '');
                      setSaveError(null);
                    }
                  }}
                >
                  <div style={s.itemLabel}>{item.label}</div>
                  <div style={s.itemDesc}>
                    {item.settingKey === 'orgName'
                      ? organization?.name || 'Not set'
                      : item.settingKey === 'founderName'
                      ? organization?.founder_name || 'Not set'
                      : item.settingKey === 'contact'
                      ? `Phone: ${organization?.contactInfo?.phone || 'Not set'} | Email: ${organization?.contactInfo?.email || 'Not set'}`
                      : item.settingKey === 'tax'
                      ? `GST: ${organization?.taxInfo?.gst || 'Not set'} | PAN: ${organization?.taxInfo?.pan || 'Not set'} | Aadhar: ${organization?.taxInfo?.aadhar || 'Not set'}`
                      : item.description}
                  </div>
                  <div style={s.itemArrow}>›</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredCategories.length === 0 && (
        <div style={s.emptyState}>
          <p style={s.emptyText}>No settings found matching "{searchTerm}"</p>
        </div>
      )}

      {/* Organization Name Edit Modal */}
      {editingOrgName && (
        <div style={s.modalOverlay} onClick={handleCancel}>
          <div style={s.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={s.modalTitle}>Edit Organization Name</h3>
            <p style={s.modalSubtitle}>Change your organization's name across the entire platform</p>

            <input
              type="text"
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
              placeholder="Enter organization name"
              style={s.modalInput}
              disabled={saving}
              autoFocus
            />

            {saveError && (
              <div style={s.modalError}>{saveError}</div>
            )}

            <div style={s.modalActions}>
              <button
                onClick={handleCancel}
                style={s.btnCancel}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveOrgName}
                style={s.btnSave}
                disabled={saving || !newOrgName.trim()}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Founder Name Edit Modal */}
      {editingFounderName && (
        <div style={s.modalOverlay} onClick={handleCancel}>
          <div style={s.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={s.modalTitle}>Edit Founder Name</h3>
            <p style={s.modalSubtitle}>Update the name of the organization creator</p>

            <input
              type="text"
              value={newFounderName}
              onChange={(e) => setNewFounderName(e.target.value)}
              placeholder="Enter founder name"
              style={s.modalInput}
              disabled={saving}
              autoFocus
            />

            {saveError && (
              <div style={s.modalError}>{saveError}</div>
            )}

            <div style={s.modalActions}>
              <button
                onClick={handleCancel}
                style={s.btnCancel}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFounderName}
                style={s.btnSave}
                disabled={saving || !newFounderName.trim()}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Information Edit Modal */}
      {editingContactInfo && (
        <div style={s.modalOverlay} onClick={handleCancel}>
          <div style={s.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={s.modalTitle}>Edit Contact Information</h3>
            <p style={s.modalSubtitle}>Update your organization's phone and email</p>

            <input
              type="tel"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="Enter phone number"
              style={s.modalInput}
              disabled={saving}
              autoFocus
            />

            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter email address"
              style={s.modalInput}
              disabled={saving}
            />

            {saveError && (
              <div style={s.modalError}>{saveError}</div>
            )}

            <div style={s.modalActions}>
              <button
                onClick={handleCancel}
                style={s.btnCancel}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveContactInfo}
                style={s.btnSave}
                disabled={saving || !newPhone.trim() || !newEmail.trim()}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tax Information Edit Modal */}
      {editingTaxInfo && (
        <div style={s.modalOverlay} onClick={handleCancel}>
          <div style={s.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={s.modalTitle}>Edit Tax Information</h3>
            <p style={s.modalSubtitle}>Update your organization's tax details</p>

            <input
              type="text"
              value={newGST}
              onChange={(e) => setNewGST(e.target.value)}
              placeholder="Enter GST number"
              style={s.modalInput}
              disabled={saving}
              autoFocus
            />

            <input
              type="text"
              value={newPAN}
              onChange={(e) => setNewPAN(e.target.value)}
              placeholder="Enter PAN number"
              style={s.modalInput}
              disabled={saving}
            />

            <input
              type="text"
              value={newAadhar}
              onChange={(e) => setNewAadhar(e.target.value)}
              placeholder="Enter Aadhar number"
              style={s.modalInput}
              disabled={saving}
            />

            {saveError && (
              <div style={s.modalError}>{saveError}</div>
            )}

            <div style={s.modalActions}>
              <button
                onClick={handleCancel}
                style={s.btnCancel}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTaxInfo}
                style={s.btnSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  root: { display: 'flex', flexDirection: 'column', gap: 24 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 24, color: '#1e293b', margin: 0 },
  sub: { fontSize: 14, color: '#64748b', marginTop: 4 },
  successMessage: {
    background: '#d1fae5',
    color: '#065f46',
    padding: '12px 16px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    border: '1px solid #a7f3d0'
  },
  errorMessage: {
    background: '#fee2e2',
    color: '#991b1b',
    padding: '12px 16px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    border: '1px solid #fecaca'
  },
  searchBar: { display: 'flex', alignItems: 'center', gap: 12, position: 'relative' },
  searchIcon: { position: 'absolute', left: 14, fontSize: 16, color: '#94a3b8' },
  searchInput: { flex: 1, border: '1px solid #e2e8f0', borderRadius: 8, padding: '11px 14px 11px 40px', fontSize: 14, outline: 'none', fontFamily: "'DM Sans',sans-serif", color: '#1e293b' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, '@media (max-width: 768px)': { gridTemplateColumns: '1fr' } },
  settingsBox: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  categoryHeader: { display: 'flex', alignItems: 'center', gap: 12, padding: '16px 16px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' },
  categoryIcon: { fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, background: 'rgba(59,130,246,0.1)', borderRadius: 8 },
  categoryTitle: { flex: 1 },
  categoryName: { fontSize: 14, fontWeight: 700, color: '#1e293b', margin: '0 0 2px' },
  categoryDesc: { fontSize: 12, color: '#94a3b8', margin: 0 },
  itemsList: { display: 'flex', flexDirection: 'column', padding: 0 },
  settingsItem: { display: 'flex', flexDirection: 'column', padding: '12px 16px', borderBottom: '1px solid #f1f5f9', position: 'relative', cursor: 'pointer' },
  itemLabel: { fontSize: 13, fontWeight: 600, color: '#1e293b', marginBottom: 2 },
  itemDesc: { fontSize: 12, color: '#94a3b8', marginBottom: 8 },
  itemArrow: { position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1', fontSize: 18 },
  emptyState: { textAlign: 'center', padding: '48px 24px', background: '#f8fafc', borderRadius: 12, border: '1px dashed #e2e8f0' },
  emptyText: { color: '#94a3b8', fontSize: 14, margin: 0 },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    background: 'white',
    borderRadius: 12,
    padding: 24,
    maxWidth: 500,
    width: '90%',
    boxShadow: '0 20px 25px rgba(0,0,0,0.15)',
    pointerEvents: 'auto'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#1e293b',
    margin: '0 0 8px'
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748b',
    margin: '0 0 16px'
  },
  modalInput: {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    fontSize: 14,
    fontFamily: "'DM Sans',sans-serif",
    outline: 'none',
    marginBottom: 12,
    boxSizing: 'border-box',
    background: '#ffffff',
    color: '#1e293b',
    pointerEvents: 'auto',
    cursor: 'text'
  } as React.CSSProperties & { '&:focus': React.CSSProperties },
  modalError: {
    background: '#fee2e2',
    color: '#991b1b',
    padding: '10px 12px',
    borderRadius: 6,
    fontSize: 12,
    marginBottom: 16,
    border: '1px solid #fecaca'
  },
  modalActions: {
    display: 'flex',
    gap: 12,
    justifyContent: 'flex-end'
  },
  btnCancel: {
    padding: '10px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: 6,
    background: '#f8fafc',
    color: '#1e293b',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s'
  } as React.CSSProperties,
  btnSave: {
    padding: '10px 16px',
    border: 'none',
    borderRadius: 6,
    background: '#3b82f6',
    color: 'white',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s'
  } as React.CSSProperties
};
