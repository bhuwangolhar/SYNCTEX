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
        <p className="enquiry-empty">No enquiries yet</p>
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
