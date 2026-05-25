import React, { useState } from "react";
import axios from "axios";

const PRESET_SECTIONS = [
  { id: "Soft Skills", label: "Soft Skills" },
  { id: "Technical", label: "Technical" },
  { id: "Leadership", label: "Leadership" },
  { id: "Communication", label: "Communication" },
  { id: "Problem Solving", label: "Problem Solving" },
];

function App() {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [sections, setSections] = useState([]);
  const [customSection, setCustomSection] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckbox = (value) => {
    setSections((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  };

  const addCustomSection = () => {
    const trimmed = customSection.trim();
    if (trimmed && !sections.includes(trimmed)) {
      setSections((prev) => [...prev, trimmed]);
      setCustomSection("");
    }
  };

  const removeSection = (value) => {
    setSections((prev) => prev.filter((s) => s !== value));
  };

  const handleSubmit = async () => {
    if (!role || !experience || sections.length === 0) {
      setError("⚠️ Please fill in Role, Experience, and select at least one section.");
      return;
    }
    setLoading(true);
    setError("");
    setData(null);

    try {
  const response = await axios.post(
    "https://ai-performance-management-system.onrender.com/form_generation",
    {
      role,
      experience,
      sections,
    }
  );
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setData(response.data);
      }
    } catch (err) {
      console.error(err);
      setError("⚠️ Failed to connect to backend. Make sure Flask is running on port 5000.");
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Performance Management System</h1>
        <p style={styles.subtitle}>AI-powered feedback form generator</p>
      </div>

      <div style={styles.container}>
        {/* FORM CARD */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📋 Employee Details</h2>

          <label style={styles.label}>Role</label>
          <input
            style={styles.input}
            placeholder="e.g., Software Engineer, Data Analyst"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />

          <label style={styles.label}>Experience</label>
          <input
            style={styles.input}
            placeholder="e.g., 2 years, Senior Level"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />

          <label style={styles.label}>Evaluation Sections</label>
          <div style={styles.checkboxGrid}>
            {PRESET_SECTIONS.map((s) => (
              <label key={s.id} style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={sections.includes(s.id)}
                  onChange={() => handleCheckbox(s.id)}
                  style={styles.checkbox}
                />
                {s.label}
              </label>
            ))}
          </div>

          {/* Custom Section Input */}
          <div style={styles.customRow}>
            <input
              style={{ ...styles.input, marginBottom: 0, flex: 1 }}
              placeholder="Add custom section (e.g., Innovation)"
              value={customSection}
              onChange={(e) => setCustomSection(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustomSection()}
            />
            <button style={styles.addBtn} onClick={addCustomSection}>
              + Add
            </button>
          </div>

          {/* Selected Sections Tags */}
          {sections.length > 0 && (
            <div style={styles.tagRow}>
              {sections.map((s) => (
                <span key={s} style={styles.tag}>
                  {s}
                  <span
                    style={styles.tagRemove}
                    onClick={() => removeSection(s)}
                  >
                    ×
                  </span>
                </span>
              ))}
            </div>
          )}

          <button
            style={loading ? { ...styles.button, opacity: 0.7 } : styles.button}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Generating... ⏳" : "Generate Feedback Form 🚀"}
          </button>
        </div>

        {/* ERROR */}
        {error && <div style={styles.errorBox}>{error}</div>}

        {/* OUTPUT */}
        {data && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>✅ Generated Feedback Form</h2>

            {/* Employee Info */}
            <div style={styles.infoRow}>
              <div style={styles.infoPill}>
                👤 <b>Role:</b> {data.employee_information?.role || "N/A"}
              </div>
              <div style={styles.infoPill}>
                📅 <b>Experience:</b> {data.employee_information?.experience || "N/A"}
              </div>
            </div>

            {/* Feedback Sections */}
            <h3 style={styles.sectionTitle}>Feedback Questions</h3>
            {data.feedback_sections &&
            Object.keys(data.feedback_sections).length > 0 ? (
              Object.entries(data.feedback_sections).map(([section, value]) => (
                <div key={section} style={styles.sectionCard}>
                  <h4 style={styles.sectionName}>{section}</h4>
                  <ol style={styles.questionList}>
                    {value.questions?.map((q, idx) => (
                      <li key={idx} style={styles.questionItem}>
                        {Object.values(q)[0]}
                      </li>
                    ))}
                  </ol>
                </div>
              ))
            ) : (
              <p>No feedback sections available</p>
            )}

            {/* Open Ended Feedback */}
            {data.open_ended_feedback && (
              <>
                <h3 style={styles.sectionTitle}>Open-Ended Feedback</h3>
                <div style={styles.sectionCard}>
                  <p>
                    <b>🔧 Areas for Improvement:</b>{" "}
                    {data.open_ended_feedback.areas_for_improvement}
                  </p>
                  <p>
                    <b>💪 Strengths:</b> {data.open_ended_feedback.strengths}
                  </p>
                  <p>
                    <b>🌱 Suggestions for Growth:</b>{" "}
                    {data.open_ended_feedback.suggestions_for_growth}
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'Segoe UI', sans-serif",
    background: "#f0f4f8",
    minHeight: "100vh",
  },
  header: {
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    padding: "40px 20px",
    textAlign: "center",
    color: "#fff",
  },
  title: {
    margin: 0,
    fontSize: "2rem",
    fontWeight: 700,
    letterSpacing: "0.5px",
  },
  subtitle: {
    margin: "8px 0 0",
    opacity: 0.7,
    fontSize: "1rem",
  },
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "30px 20px",
  },
  card: {
    background: "#fff",
    padding: "28px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    marginBottom: "24px",
  },
  cardTitle: {
    margin: "0 0 20px",
    fontSize: "1.2rem",
    color: "#1a1a2e",
  },
  label: {
    display: "block",
    fontWeight: 600,
    marginBottom: "6px",
    color: "#333",
    fontSize: "0.9rem",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    marginBottom: "16px",
    borderRadius: "8px",
    border: "1.5px solid #dde1e7",
    fontSize: "0.95rem",
    boxSizing: "border-box",
    outline: "none",
    transition: "border 0.2s",
  },
  checkboxGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "16px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "#f5f7fa",
    padding: "8px 14px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "0.9rem",
    border: "1.5px solid #dde1e7",
  },
  checkbox: {
    accentColor: "#0f3460",
  },
  customRow: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginBottom: "12px",
  },
  addBtn: {
    padding: "10px 18px",
    background: "#0f3460",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  tagRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "16px",
  },
  tag: {
    background: "#e8f0fe",
    color: "#0f3460",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  tagRemove: {
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "1rem",
    color: "#555",
  },
  button: {
    width: "100%",
    padding: "13px",
    background: "linear-gradient(135deg, #0f3460, #16213e)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: 600,
    marginTop: "8px",
    letterSpacing: "0.3px",
  },
  errorBox: {
    background: "#fff0f0",
    color: "#c0392b",
    border: "1px solid #f5c6cb",
    borderRadius: "8px",
    padding: "14px 18px",
    marginBottom: "16px",
  },
  infoRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  infoPill: {
    background: "#f0f4f8",
    padding: "10px 16px",
    borderRadius: "8px",
    fontSize: "0.95rem",
  },
  sectionTitle: {
    fontSize: "1rem",
    color: "#1a1a2e",
    borderBottom: "2px solid #f0f4f8",
    paddingBottom: "8px",
    marginBottom: "14px",
  },
  sectionCard: {
    background: "#f8fafc",
    border: "1.5px solid #e8edf2",
    borderRadius: "10px",
    padding: "16px 20px",
    marginBottom: "12px",
  },
  sectionName: {
    margin: "0 0 10px",
    color: "#0f3460",
    fontSize: "0.95rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  questionList: {
    margin: 0,
    paddingLeft: "20px",
  },
  questionItem: {
    marginBottom: "8px",
    color: "#333",
    fontSize: "0.93rem",
    lineHeight: 1.5,
  },
};

export default App;