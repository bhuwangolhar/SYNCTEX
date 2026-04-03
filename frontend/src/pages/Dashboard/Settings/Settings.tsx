import { useState } from 'react';

// Define settings categories with items
const SETTINGS_CATEGORIES = [
  {
    title: 'Organization',
    description: 'Company details and basic info',
    icon: '🏢',
    items: [
      { label: 'Organization Name', description: 'Your company name' },
      { label: 'Organization Logo', description: 'Upload company logo' },
      { label: 'Contact Information', description: 'Phone, email, address' },
      { label: 'Tax Information', description: 'GST, PAN, other tax IDs' }
    ]
  },
  {
    title: 'User & Access',
    description: 'Manage users and permissions',
    icon: '👥',
    items: [
      { label: 'Team Members', description: 'Add, edit, or remove users' },
      { label: 'Roles & Permissions', description: 'Create and assign roles' },
      { label: 'Access Control', description: 'Module-level permissions' },
      { label: 'Security Settings', description: 'Password policies, 2FA' }
    ]
  },
  {
    title: 'Localization',
    description: 'Language, timezone, and locale',
    icon: '🌍',
    items: [
      { label: 'Language', description: 'Set default language' },
      { label: 'Timezone', description: 'Select your timezone' },
      { label: 'Date Format', description: 'Choose date display format' },
      { label: 'Currency', description: 'Default currency settings' }
    ]
  },
  {
    title: 'Integrations',
    description: 'Connect external services',
    icon: '🔗',
    items: [
      { label: 'Payment Gateway', description: 'Configure payment processing' },
      { label: 'Email Service', description: 'SMTP and email settings' },
      { label: 'API Keys', description: 'Generate and manage API keys' },
      { label: 'Webhooks', description: 'Configure webhook endpoints' }
    ]
  }
];

export default function Settings() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter categories based on search
  const filteredCategories = SETTINGS_CATEGORIES.filter(cat =>
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
      `}</style>

      {/* Header */}
      <div style={s.header}>
        <div>
          <h2 style={s.title}>Settings</h2>
          <p style={s.sub}>Manage your organization's preferences and configurations</p>
        </div>
      </div>

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

      {/* Settings grid with 4 cards */}
      <div style={s.grid}>
        {filteredCategories.map((category, idx) => (
          <div
            key={idx}
            className="settings-box"
            style={s.settingsBox}
            onClick={() => setActiveCategory(activeCategory === category.title ? null : category.title)}
          >
            {/* Category header */}
            <div style={s.categoryHeader}>
              <div style={s.categoryIcon}>{category.icon}</div>
              <div style={s.categoryTitle}>
                <h3 style={s.categoryName}>{category.title}</h3>
                <p style={s.categoryDesc}>{category.description}</p>
              </div>
              <div style={s.chevron}>{activeCategory === category.title ? '▼' : '▶'}</div>
            </div>

            {/* Settings items - always visible */}
            <div style={s.itemsList}>
              {category.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className="settings-item"
                  style={s.settingsItem}
                >
                  <div style={s.itemLabel}>{item.label}</div>
                  <div style={s.itemDesc}>{item.description}</div>
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
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  root: { display: 'flex', flexDirection: 'column', gap: 24 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 24, color: '#1e293b', margin: 0 },
  sub: { fontSize: 14, color: '#64748b', marginTop: 4 },
  searchBar: { display: 'flex', alignItems: 'center', gap: 12, position: 'relative' },
  searchIcon: { position: 'absolute', left: 14, fontSize: 16, color: '#94a3b8' },
  searchInput: { flex: 1, border: '1px solid #e2e8f0', borderRadius: 8, padding: '11px 14px 11px 40px', fontSize: 14, outline: 'none', fontFamily: "'DM Sans',sans-serif", color: '#1e293b' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 },
  settingsBox: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  categoryHeader: { display: 'flex', alignItems: 'center', gap: 12, padding: '16px 16px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', background: '#f8fafc' },
  categoryIcon: { fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, background: 'rgba(59,130,246,0.1)', borderRadius: 8 },
  categoryTitle: { flex: 1 },
  categoryName: { fontSize: 14, fontWeight: 700, color: '#1e293b', margin: '0 0 2px' },
  categoryDesc: { fontSize: 12, color: '#94a3b8', margin: 0 },
  chevron: { fontSize: 12, color: '#94a3b8', fontWeight: 600, width: 20, textAlign: 'right', transition: 'transform 0.2s' },
  itemsList: { display: 'flex', flexDirection: 'column', padding: 0 },
  settingsItem: { display: 'flex', flexDirection: 'column', padding: '12px 16px', borderBottom: '1px solid #f1f5f9', position: 'relative' },
  itemLabel: { fontSize: 13, fontWeight: 600, color: '#1e293b', marginBottom: 2 },
  itemDesc: { fontSize: 12, color: '#94a3b8', marginBottom: 8 },
  itemArrow: { position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1', fontSize: 18 },
  emptyState: { textAlign: 'center', padding: '48px 24px', background: '#f8fafc', borderRadius: 12, border: '1px dashed #e2e8f0' },
  emptyText: { color: '#94a3b8', fontSize: 14, margin: 0 }
};
