import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";

export default function Main() {
  const navigate = useNavigate();

  const tiles = [
    { title: "Cards for Sale", desc: "Browse cards currently available.", path: "/sale" },
    { title: "Cards Wanted", desc: "See what we’re looking to buy.", path: "/wanted" },
    { title: "Contact", desc: "Get in touch with Tom’s Emporium.", path: "/contact" },
  ];

  return (
    <div style={styles.page}>
    <div style={styles.content}>
      <h2 style={styles.heading}>Explore</h2>
      <p style={styles.subheading}>Choose where you’d like to go.</p>

      <div style={styles.grid}>
        {tiles.map((t) => (
          <button key={t.path} style={styles.tile} onClick={() => navigate(t.path)}>
            <div style={styles.tileTitle}>{t.title}</div>
            <div style={styles.tileDesc}>{t.desc}</div>
          </button>
        ))}
      </div>
    </div>
      <Footer />
    </div>
  );
}

const styles = {
  page: {
    padding: 24,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  heading: {
    margin: 0,
    fontSize: 26,
    fontWeight: 800,
  },
  subheading: {
    marginTop: 8,
    marginBottom: 18,
    color: "#6b7280",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16,
  },
  tile: {
    textAlign: "left",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 18,
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
  },
  tileTitle: {
    fontSize: 18,
    fontWeight: 800,
    marginBottom: 6,
    color: "#111827",
  },
  tileDesc: {
    fontSize: 14,
    color: "#6b7280",
  },
  content: {
  flex: 1,
  padding: 24,
},
};