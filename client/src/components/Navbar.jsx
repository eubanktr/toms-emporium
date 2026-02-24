import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header style={styles.header}>
      <Link to="/" style={styles.brand}>
  Tom&apos;s Emporium
</Link>

      <nav style={styles.nav}>
        {!user && (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}

        {user && (
          <>
            <Link to="/sale" style={styles.link}>For Sale</Link>
            <Link to="/wanted" style={styles.link}>Wanted</Link>
            <Link to="/contact" style={styles.link}>Contact</Link>
            <button onClick={logout} style={styles.button}>Logout</button>
          </>
        )}
      </nav>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    background: "#111827",
    color: "white"
  },
  nav: {
    display: "flex",
    gap: "20px",
    alignItems: "center"
  },
  link: {
    color: "white",
    textDecoration: "none"
  },
  button: {
    background: "white",
    color: "#111827",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer"
  },
  brand: {
  margin: 0,
  fontSize: 20,
  fontWeight: 700,
  color: "white",
  textDecoration: "none",
  cursor: "pointer"
}
};