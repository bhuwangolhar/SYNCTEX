import { useState } from "react";
import { createEnquiry } from "../../../../services/enquiry.service";

export default function EnquiryFormModal({ orgId, reload, onClose }: any) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!orgId) {
      setError("Organization not found. Please log in again.");
      return;
    }

    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!form.message.trim()) {
      setError("Message is required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await createEnquiry({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
        organization_id: orgId
      });

      await reload();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create enquiry");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="enquiry-modal-overlay">

      <div className="enquiry-modal">

        <h3>Add Enquiry</h3>

        {error ? <p className="enquiry-form-error">{error}</p> : null}

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <textarea
          placeholder="Message"
          value={form.message}
          onChange={(e) =>
            setForm({ ...form, message: e.target.value })
          }
        />

        <button className="enquiry-primary-btn" onClick={handleSubmit} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
        <button className="enquiry-secondary-btn" onClick={onClose} disabled={saving}>Cancel</button>

      </div>

    </div>
  );
}
