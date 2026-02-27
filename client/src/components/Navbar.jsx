import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthed = !!user;

  const navLinks = useMemo(() => {
    // Links shown inside the hamburger menu
    const base = [
      { to: "/", label: "Home" },
      { to: "/main", label: "Main" },
      { to: "/sale", label: "Cards For Sale" },
      { to: "/wanted", label: "Cards Wanted" },
      { to: "/contact", label: "Contact" },
    ];
    return base;
  }, []);

  // Close drawer whenever route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Esc to close
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <header style={styles.header}>
        <div style={styles.left}>
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            style={styles.iconBtn}
          >
            {/* Hamburger icon */}
            <span style={styles.hamburger} />
            <span style={styles.hamburger} />
            <span style={styles.hamburger} />
          </button>

          <Link to="/" style={styles.brand}>
            Tom&apos;s Emporium
          </Link>
        </div>

        <div style={styles.right}>
          {!isAuthed ? (
            <>
              <Link to="/login" style={styles.linkBtn}>
                Login
              </Link>
              <Link to="/register" style={styles.primaryBtn}>
                Register
              </Link>
            </>
          ) : (
            <>
              <span style={styles.userPill}>{user?.username ? `Hi, ${user.username}` : "Member"}</span>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                style={styles.linkBtnButton}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </header>

      {/* Backdrop */}
      {open && <div style={styles.backdrop} onClick={() => setOpen(false)} />}

      {/* Drawer */}
      <aside
        style={{
          ...styles.drawer,
          transform: open ? "translateX(0)" : "translateX(-110%)",
        }}
        aria-hidden={!open}
      >
        <div style={styles.drawerTop}>
          <div style={styles.drawerTitle}>Menu</div>
          <button type="button" onClick={() => setOpen(false)} style={styles.closeBtn} aria-label="Close menu">
            ✕
          </button>
        </div>

        <nav style={styles.drawerNav}>
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} style={styles.drawerLink}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div style={styles.drawerBottom}>
          {!isAuthed ? (
            <div style={styles.drawerActions}>
              <Link to="/login" style={styles.drawerActionBtn}>
                Login
              </Link>
              <Link to="/register" style={styles.drawerActionBtnPrimary}>
                Register
              </Link>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/");
              }}
              style={styles.drawerActionBtn}
            >
              Logout
            </button>
          )}

          <div style={styles.drawerHint}>
            Tip: press <strong>Esc</strong> to close
          </div>
        </div>
      </aside>

      {/* Spacer so content doesn’t hide under fixed header */}
      <div style={{ height: 64 }} />
    </>
  );
}

const styles = {
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(229,231,235,0.9)",
    zIndex: 50,
  },
  left: { display: "flex", alignItems: "center", gap: 12 },
  right: { display: "flex", alignItems: "center", gap: 10 },

  brand: {
    textDecoration: "none",
    color: "#111827",
    fontWeight: 900,
    letterSpacing: "-0.02em",
    fontSize: 18,
  },

  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    background: "#fff",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    boxShadow: "0 10px 20px rgba(0,0,0,0.06)",
  },
  hamburger: {
    width: 18,
    height: 2,
    background: "#111827",
    borderRadius: 999,
    display: "block",
  },

  linkBtn: {
    textDecoration: "none",
    color: "#111827",
    fontWeight: 800,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    background: "#fff",
  },
  linkBtnButton: {
    color: "#111827",
    fontWeight: 800,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    background: "#fff",
    cursor: "pointer",
  },
  primaryBtn: {
    textDecoration: "none",
    color: "#fff",
    fontWeight: 900,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #111827",
    background: "#111827",
  },
  userPill: {
    padding: "8px 10px",
    borderRadius: 999,
    background: "#f3f4f6",
    border: "1px solid #e5e7eb",
    fontWeight: 800,
    color: "#111827",
    fontSize: 13,
    whiteSpace: "nowrap",
  },

  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(17,24,39,0.45)",
    zIndex: 60,
  },

  drawer: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    width: 320,
    maxWidth: "86vw",
    background: "#fff",
    zIndex: 70,
    borderRight: "1px solid #e5e7eb",
    boxShadow: "0 30px 60px rgba(0,0,0,0.18)",
    transition: "transform 180ms ease",
    display: "flex",
    flexDirection: "column",
  },
  drawerTop: {
    height: 64,
    padding: "0 14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #e5e7eb",
  },
  drawerTitle: { fontWeight: 900, fontSize: 16, color: "#111827" },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    background: "#fff",
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 900,
    color: "#111827",
  },
  drawerNav: { padding: 12, display: "flex", flexDirection: "column", gap: 8 },
  drawerLink: {
    textDecoration: "none",
    color: "#111827",
    fontWeight: 850,
    padding: "12px 12px",
    borderRadius: 14,
    border: "1px solid #f3f4f6",
    background: "#fafafa",
  },
  drawerBottom: {
    marginTop: "auto",
    padding: 12,
    borderTop: "1px solid #e5e7eb",
  },
  drawerActions: { display: "flex", gap: 10 },
  drawerActionBtn: {
    flex: 1,
    textDecoration: "none",
    textAlign: "center",
    color: "#111827",
    fontWeight: 900,
    padding: "12px 12px",
    borderRadius: 14,
    border: "1px solid #e5e7eb",
    background: "#fff",
  },
  drawerActionBtnPrimary: {
    flex: 1,
    textDecoration: "none",
    textAlign: "center",
    color: "#fff",
    fontWeight: 900,
    padding: "12px 12px",
    borderRadius: 14,
    border: "1px solid #111827",
    background: "#111827",
  },
  drawerHint: { marginTop: 10, fontSize: 12, color: "#6b7280" },
};