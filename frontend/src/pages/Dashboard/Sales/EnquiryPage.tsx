import { useEffect, useState } from "react";
import { getEnquiries } from "../../../services/enquiry.service";
import { getStoredOrganizationId } from "../../../services/session.service";
import EnquiryTable from "./components/EnquiryTable";
import EnquiryFormModal from "./Modal/EnquiryFormModal";
import "../../../components/global/Sales/enquiry.css";

export default function EnquiryPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [orgId, setOrgId] = useState("");

  const load = async () => {
    const resolvedOrgId = getStoredOrganizationId();

    setOrgId(resolvedOrgId);
    setLoading(true);

    if (!resolvedOrgId) {
      setData([]);
      setError("Organization not found. Please log in again to load enquiries.");
      setLoading(false);
      return;
    }

    try {
      const res = await getEnquiries(resolvedOrgId);
      setData(Array.isArray(res) ? res : []);
      setError("");
    } catch (err) {
      setData([]);
      setError(err instanceof Error ? err.message : "Failed to load enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="enquiry-container">

      <div className="enquiry-header">
        <h2>Enquiries</h2>
        <button disabled={!orgId} onClick={() => setShowModal(true)}>
          + Add Enquiry
        </button>
      </div>

      {loading ? (
        <p className="enquiry-info">Loading enquiries...</p>
      ) : error ? (
        <p className="enquiry-error">{error}</p>
      ) : data.length === 0 ? (
        <div style={emptyStateStyles.container}>
          <style>{emptyStateCSS}</style>
          <div style={emptyStateStyles.card}>
            <div style={emptyStateStyles.iconContainer}>
              <span style={{ fontSize: 64 }}>💬</span>
            </div>
            <h3 style={emptyStateStyles.title}>No enquiries yet</h3>
            <p style={emptyStateStyles.description}>
              Create your first enquiry to start tracking customer conversations and follow-ups.
            </p>
            <button 
              onClick={() => setShowModal(true)} 
              disabled={!orgId}
              style={emptyStateStyles.button}
            >
              + Create Your First Enquiry
            </button>
          </div>
        </div>
      ) : (
        <EnquiryTable data={data} reload={load} />
      )}

      {showModal && (
        <EnquiryFormModal
          orgId={orgId}
          reload={load}
          onClose={() => setShowModal(false)}
        />
      )}

    </div>
  );
}

const emptyStateStyles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    padding: '40px 20px'
  } as React.CSSProperties,
  card: {
    background: '#fff',
    border: '2px dashed #e2e8f0',
    borderRadius: '16px',
    padding: '48px 32px',
    maxWidth: '500px',
    textAlign: 'center' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
  } as React.CSSProperties,
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100px',
    height: '100px',
    background: '#f8fafc',
    border: '2px solid #e2e8f0',
    borderRadius: '50%',
    marginBottom: '8px'
  } as React.CSSProperties,
  title: {
    fontFamily: "'Syne',sans-serif",
    fontWeight: 700,
    fontSize: '24px',
    color: '#1e293b',
    margin: '0',
  } as React.CSSProperties,
  description: {
    fontSize: '14px',
    color: '#64748b',
    margin: '0',
    lineHeight: '1.6'
  } as React.CSSProperties,
  button: {
    background: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'all 0.2s'
  } as React.CSSProperties
};

const emptyStateCSS = `
  button:hover:not(:disabled) {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
