import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";

export default function Home() {
  const navigate = useNavigate();

 return (
    <div style={styles.page}>
      <div style={styles.content}>
        <div style={styles.card}>
          <h1 style={styles.title}>Tom&apos;s Emporium</h1>
          <p style={styles.subtitle}>
            Buy, sell, and trade collectible cards.
          </p>

          <div style={styles.buttonGroup}>
            <button style={styles.primaryBtn} onClick={() => navigate("/login")}>
              Login
            </button>
            <button style={styles.secondaryBtn} onClick={() => navigate("/register")}>
              Register
            </button>
          </div>

          <div style={{ marginTop: 20 }}>
            <button style={styles.guestLink} onClick={() => navigate("/main")}>
              Continue as Guest
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    
    padding: 24,
  },
  card: {
    width: 420,
    background: "#ffffff",
    borderRadius: 18,
    padding: 40,
    border: "1px solid #d1d5db",
    boxShadow: "0 18px 40px rgba(0,0,0,0.10)",
    textAlign: "center",
  },
  title: { margin: 0, fontSize: 28, fontWeight: 800 },
  subtitle: { marginTop: 10, marginBottom: 28, color: "#6b7280" },
  buttonGroup: { display: "flex", flexDirection: "column", gap: 12 },
  primaryBtn: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "none",
    background: "#111827",
    color: "#fff",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #111827",
    background: "#fff",
    color: "#111827",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
  },
  guestLink: {
    background: "none",
    border: "none",
    color: "#2563eb",
    fontSize: 14,
    cursor: "pointer",
    textDecoration: "underline",
  },
};