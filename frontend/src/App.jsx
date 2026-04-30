import React, { useState, useEffect } from "react";
import { getUsers, registerUser, getStats, checkHealth } from "./services/api";

// ─── Inline Styles (keeping same neon aesthetic as original) ───────────────
const styles = {
  body: {
    margin: 0,
    background: "radial-gradient(circle at top left, #0d0d0d, #000)",
    color: "#fff",
    fontFamily: "'Poppins', sans-serif",
    minHeight: "100vh",
  },
  navbar: {
    background: "rgba(0,0,0,0.9)",
    borderBottom: "2px solid #00f5ff",
    padding: "14px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "sticky",
    top: 0,
    zIndex: 100,
    backdropFilter: "blur(10px)",
  },
  brand: {
    fontWeight: 700,
    color: "#00f5ff",
    fontSize: "1.4rem",
    textShadow: "0 0 8px #00f5ff",
    textDecoration: "none",
  },
  navLinks: { display: "flex", gap: "24px", listStyle: "none", margin: 0, padding: 0 },
  navLink: { color: "#fff", textDecoration: "none", transition: "0.3s" },
  hero: {
    background: "linear-gradient(135deg, rgba(0,245,255,0.08), rgba(255,0,255,0.08))",
    textAlign: "center",
    padding: "100px 20px",
    borderBottom: "1px solid rgba(0,245,255,0.2)",
  },
  heroTitle: {
    fontSize: "3.2rem",
    fontWeight: 700,
    color: "#00f5ff",
    textShadow: "0 0 20px #00f5ff",
    marginBottom: "16px",
  },
  heroSub: { color: "#ccc", fontSize: "1.2rem", marginBottom: "32px" },
  statsRow: {
    display: "flex",
    justifyContent: "center",
    gap: "40px",
    flexWrap: "wrap",
    marginTop: "40px",
  },
  statBox: {
    background: "rgba(0,245,255,0.08)",
    border: "1px solid #00f5ff",
    borderRadius: "12px",
    padding: "20px 32px",
    textAlign: "center",
  },
  statNum: { fontSize: "2.4rem", fontWeight: 700, color: "#00f5ff" },
  statLabel: { color: "#aaa", fontSize: "0.9rem" },
  section: { padding: "70px 20px", maxWidth: "900px", margin: "0 auto" },
  sectionTitle: {
    textAlign: "center",
    fontWeight: 700,
    color: "#00f5ff",
    fontSize: "1.8rem",
    textShadow: "0 0 10px #00f5ff",
    marginBottom: "40px",
  },
  form: {
    maxWidth: "560px",
    margin: "0 auto",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "20px",
    padding: "35px",
    boxShadow: "0 0 20px rgba(0,245,255,0.3)",
  },
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(0,245,255,0.3)",
    borderRadius: "8px",
    color: "#fff",
    padding: "10px 14px",
    fontSize: "1rem",
    marginBottom: "18px",
    boxSizing: "border-box",
    outline: "none",
  },
  select: {
    width: "100%",
    background: "#111",
    border: "1px solid rgba(0,245,255,0.3)",
    borderRadius: "8px",
    color: "#fff",
    padding: "10px 14px",
    fontSize: "1rem",
    marginBottom: "18px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    background: "linear-gradient(90deg, #00f5ff, #ff00ff)",
    border: "none",
    borderRadius: "50px",
    color: "#fff",
    fontWeight: 600,
    padding: "12px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "0.3s",
  },
  label: { display: "block", color: "#ccc", marginBottom: "6px", fontSize: "0.9rem" },
  plansGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "24px",
  },
  card: {
    background: "linear-gradient(145deg, rgba(0,0,0,0.8), rgba(0,245,255,0.1))",
    border: "1px solid #00f5ff",
    borderRadius: "20px",
    padding: "28px",
    textAlign: "center",
    transition: "0.3s",
  },
  cardTitle: { color: "#00f5ff", fontWeight: 700, fontSize: "1.2rem", marginBottom: "8px" },
  cardPrice: { color: "#fff", fontSize: "1.5rem", fontWeight: 700, marginBottom: "16px" },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 8px",
    textAlign: "center",
  },
  thead: { background: "linear-gradient(90deg, #00f5ff, #ff00ff)" },
  th: { padding: "12px 16px", color: "#000", fontWeight: 700 },
  td: { padding: "12px 16px", background: "rgba(255,255,255,0.04)" },
  alert: (type) => ({
    padding: "12px 18px",
    borderRadius: "8px",
    marginBottom: "18px",
    fontSize: "0.95rem",
    background: type === "error" ? "rgba(255,0,100,0.15)" : "rgba(0,245,255,0.1)",
    border: `1px solid ${type === "error" ? "#ff0064" : "#00f5ff"}`,
    color: type === "error" ? "#ff6b9d" : "#00f5ff",
  }),
  footer: {
    background: "#000",
    borderTop: "2px solid #00f5ff",
    textAlign: "center",
    padding: "24px",
    color: "#ccc",
    fontSize: "0.9rem",
  },
  backendStatus: (ok) => ({
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    background: ok ? "rgba(0,255,100,0.1)" : "rgba(255,0,0,0.1)",
    border: `1px solid ${ok ? "#00ff64" : "#ff4444"}`,
    color: ok ? "#00ff64" : "#ff4444",
    marginLeft: "12px",
  }),
};

// ─── App Component ────────────────────────────────────────────────────────
export default function App() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [backendOk, setBackendOk] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", plan: "Basic" });
  const [message, setMessage] = useState(null); // { type: "success"|"error", text }
  const [loading, setLoading] = useState(false);

  // On mount: check backend health, load users & stats
  useEffect(() => {
    loadData();
  }, []);

  const isMockMode = !process.env.REACT_APP_API_URL;

  const loadData = async () => {
    try {
      const health = await checkHealth();
      setBackendOk(health.status === "mock" ? null : true);
    } catch {
      setBackendOk(false);
    }

    // Load users
    try {
      const usersData = await getUsers();
      setUsers(usersData);
    } catch (e) {
      console.error("Error loading users:", e);
    }

    // Load stats
    try {
      const statsData = await getStats();
      setStats(statsData);
    } catch (e) {
      console.error("Error loading stats:", e);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const result = await registerUser(form);
      setMessage({ type: "success", text: result.message });
      setForm({ name: "", email: "", plan: "Basic" });
      await loadData(); // Refresh user list
    } catch (err) {
      setMessage({ type: "error", text: "❌ " + err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.body}>
      {/* ── Navbar ── */}
      <nav style={styles.navbar}>
        <a href="#" style={styles.brand}>⚡ FitForge Gym</a>
        <span style={styles.backendStatus(isMockMode ? null : backendOk)}>
          {isMockMode ? "✦ Demo Mode" : backendOk === null ? "Connecting..." : backendOk ? "● API Connected" : "● API Offline"}
        </span>
        <ul style={styles.navLinks}>
          {["Register", "Plans", "Members"].map((item) => (
            <li key={item}>
              <a href={`#${item.toLowerCase()}`} style={styles.navLink}>{item}</a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Hero ── */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Push Beyond Limits 💪</h1>
        <p style={styles.heroSub}>Transform your strength and mindset at FitForge.</p>
        <div style={styles.statsRow}>
          <div style={styles.statBox}>
            <div style={styles.statNum}>{stats?.totalMembers ?? "—"}</div>
            <div style={styles.statLabel}>Total Members</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statNum}>3</div>
            <div style={styles.statLabel}>Training Plans</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statNum}>24/7</div>
            <div style={styles.statLabel}>Open Always</div>
          </div>
        </div>
      </section>

      {/* ── Register Form ── */}
      <section id="register" style={styles.section}>
        <h2 style={styles.sectionTitle}>👤 Register Now</h2>
        <div style={styles.form}>
          {message && <div style={styles.alert(message.type)}>{message.text}</div>}
          <form onSubmit={handleSubmit}>
            <label style={styles.label}>Full Name</label>
            <input
              style={styles.input}
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
            />
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              name="email"
              type="email"
              placeholder="example@gmail.com"
              value={form.email}
              onChange={handleChange}
              required
            />
            <label style={styles.label}>Select Plan</label>
            <select style={styles.select} name="plan" value={form.plan} onChange={handleChange}>
              <option>Basic</option>
              <option>Pro</option>
              <option>Elite</option>
            </select>
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Registering..." : "Register Now"}
            </button>
          </form>
        </div>
      </section>

      {/* ── Plans ── */}
      <section id="plans" style={{ ...styles.section, background: "rgba(0,245,255,0.02)" }}>
        <h2 style={styles.sectionTitle}>🔥 Choose Your Plan</h2>
        <div style={styles.plansGrid}>
          {[
            { name: "Basic Plan", price: "₹999", perks: ["Gym Access", "Locker Room", "Basic Equipment"] },
            { name: "Pro Plan", price: "₹1999", perks: ["All Basic", "Personal Trainer", "Nutrition Guide"] },
            { name: "Elite Plan", price: "₹2999", perks: ["All Pro", "Priority Booking", "Supplements Kit"] },
          ].map((plan) => (
            <div key={plan.name} style={styles.card}>
              <div style={styles.cardTitle}>{plan.name}</div>
              <div style={styles.cardPrice}>{plan.price}<span style={{ fontSize: "0.9rem", color: "#aaa" }}>/month</span></div>
              <ul style={{ textAlign: "left", color: "#ccc", paddingLeft: "18px", margin: "0 0 16px" }}>
                {plan.perks.map((p) => <li key={p} style={{ marginBottom: "6px" }}>✓ {p}</li>)}
              </ul>
              <a href="#register">
                <button style={{ ...styles.button, width: "auto", padding: "8px 24px" }}>Apply Now</button>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── Members Table ── */}
      <section id="members" style={styles.section}>
        <h2 style={styles.sectionTitle}>👥 Members List</h2>
        {users.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666" }}>No members yet. Be the first to register!</p>
        ) : (
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Plan</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={styles.td}>{u.id}</td>
                  <td style={styles.td}>{u.name}</td>
                  <td style={styles.td}>{u.email}</td>
                  <td style={styles.td}>
                    <span style={{
                      padding: "3px 12px",
                      borderRadius: "20px",
                      background: u.plan === "Elite" ? "rgba(255,0,255,0.15)" : u.plan === "Pro" ? "rgba(0,245,255,0.15)" : "rgba(255,255,255,0.08)",
                      border: `1px solid ${u.plan === "Elite" ? "#ff00ff" : u.plan === "Pro" ? "#00f5ff" : "#444"}`,
                      color: u.plan === "Elite" ? "#ff00ff" : u.plan === "Pro" ? "#00f5ff" : "#fff",
                    }}>
                      {u.plan}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* ── Footer ── */}
      <footer style={styles.footer}>
        <p>© 2025 FitForge Gym | Built with ⚡ React + Spring Boot + MySQL</p>
      </footer>
    </div>
  );
}
