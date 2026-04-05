import React from 'react';

export default function AccessControl() {
  return (
    <div style={s.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .coming-soon-card {
          animation: fadeIn 0.5s ease-out;
        }
        .construction-emoji {
          animation: bounce 2s infinite;
          display: inline-block;
        }
      `}</style>

      <div style={s.container}>
        {/* Header */}
        <div style={s.header}>
          <h1 style={s.title}>Access Control</h1>
          <p style={s.subtitle}>Module-level permissions</p>
        </div>

        {/* Coming Soon Card */}
        <div className="coming-soon-card" style={s.card}>
          <div style={s.iconContainer}>
            <span style={{ fontSize: 64 }} className="construction-emoji">🔒</span>
          </div>

          <h2 style={s.cardTitle}>Coming Soon</h2>
          <p style={s.cardDescription}>
            We're working hard to bring you advanced access control features. This module will allow you to manage module-level permissions and security settings for your organization.
          </p>

          <div style={s.features}>
            <div style={s.feature}>
              <span style={s.featureIcon}>✓</span>
              <span style={s.featureText}>Module-level access control</span>
            </div>
            <div style={s.feature}>
              <span style={s.featureIcon}>✓</span>
              <span style={s.featureText}>Fine-grained permission management</span>
            </div>
            <div style={s.feature}>
              <span style={s.featureIcon}>✓</span>
              <span style={s.featureText}>Security audit logs</span>
            </div>
            <div style={s.feature}>
              <span style={s.featureIcon}>✓</span>
              <span style={s.featureText}>Role-based access automation</span>
            </div>
          </div>

          <p style={s.updateText}>
            We'll notify you when this feature is ready to use.
          </p>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    padding: '24px 0',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
    alignItems: 'center',
  },
  header: {
    textAlign: 'center',
    width: '100%',
  },
  title: {
    fontFamily: "'Syne',sans-serif",
    fontWeight: 700,
    fontSize: 32,
    color: '#1e293b',
    margin: 0,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    margin: 0,
  },
  card: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 16,
    padding: 48,
    maxWidth: 500,
    width: '100%',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 24,
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '50%',
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: "'Syne',sans-serif",
    fontWeight: 700,
    fontSize: 28,
    color: '#1e293b',
    margin: 0,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    margin: 0,
    lineHeight: '1.6',
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    width: '100%',
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  featureIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    background: '#d1fae5',
    color: '#065f46',
    borderRadius: '50%',
    fontSize: 12,
    fontWeight: 700,
    flexShrink: 0,
  },
  featureText: {
    fontSize: 13,
    color: '#475569',
  },
  updateText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    margin: 0,
    marginTop: 8,
    fontStyle: 'italic',
  },
};
