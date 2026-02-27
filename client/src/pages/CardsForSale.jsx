import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addToCart, toggleWishlist, isInWishlist } from "../utils/storageLists.js";

function cleanUrl(u) {
  if (!u) return "";
  return String(u).trim().replace(/^"+|"+$/g, "");
}

function getMongoId(x) {
  if (!x?._id) return "";
  if (typeof x._id === "string") return x._id;
  if (typeof x._id === "object" && x._id.$oid) return x._id.$oid;
  return String(x._id);
}
function parseCents(v) {
  if (v == null) return 0;
  if (typeof v === "number") return Number.isFinite(v) ? Math.round(v) : 0;
  
  const s = String(v).trim().replace(/,/g, "");
  const n = Number(s);
  return Number.isFinite(n) ? Math.round(n) : 0;
}

function getPriceCents(x) {
  return parseCents(x?.priceCents);
}

function getPriceLabel(x) {
  const cents = getPriceCents(x);
  if (!cents) return "Not Priced";
  return `$${(cents / 100).toFixed(2)}`;
}

export default function CardsForSale() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [tick, setTick] = useState(0); // force rerender after wishlist toggle

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const API = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${API}/api/sale`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <div style={styles.header}>
        <div>
          <h2 style={{ margin: 0 }}>Cards For Sale</h2>
          <p style={{ marginTop: 6, color: "#6b7280" }}>
            {loading ? "Loading…" : `${items.length} listing(s)`}
          </p>
          {err ? <div style={{ marginTop: 8, color: "#b91c1c" }}>{err}</div> : null}
        </div>

        <button style={styles.btn} onClick={load}>Refresh</button>
      </div>

      <div style={styles.grid}>
        {items.map((x) => {
          const mongoId = getMongoId(x);
          const card = x.card || {};
          const photos = Array.isArray(x.photos) ? x.photos.map(cleanUrl).filter(Boolean) : [];
          const firstPhoto = photos[0] || "";

          const priceCents = getPriceCents(x);
          const priceLabel = getPriceLabel(x);

          const summary = {
            id: mongoId,
            name: card.name || "Unknown Card",
            set: card.set || "",
            number: card.number || "",
            priceCents,
            photo: firstPhoto || "",
          };

          const wished = mongoId ? isInWishlist(mongoId) : false;

          const Wrapper = mongoId ? Link : "div";
          const wrapperProps = mongoId
            ? { to: `/sale/${mongoId}`, style: styles.cardLink }
            : { style: styles.cardLinkDisabled };

          return (
            <Wrapper key={mongoId || `${card.name}-${x.createdAt}`} {...wrapperProps}>
              <div style={styles.card}>
                <div style={styles.photoWrap}>
                  {firstPhoto ? (
                    <img src={firstPhoto} alt={card.name || "Card"} style={styles.photo} />
                  ) : (
                    <div style={styles.photoPlaceholder}>No photo</div>
                  )}
                </div>

                <div style={styles.body}>
                  {/* Order: Name -> Set -> Number -> Price */}
                  <div style={styles.name}>{card.name || "Unknown Card"}</div>
                  <div style={styles.line}><strong>Set:</strong> {card.set || "—"}</div>
                  <div style={styles.line}><strong>Number:</strong> {card.number || "—"}</div>
                  <div style={styles.price}>{priceLabel}</div>

                  <div style={styles.actions}>
                    <button
                      type="button"
                      style={styles.actionBtn}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!mongoId) return;
                        addToCart(summary);
                        alert("Added to cart!");
                      }}
                    >
                      Add to Cart
                    </button>

                    <button
                      type="button"
                      style={styles.actionBtnSecondary}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!mongoId) return;
                        toggleWishlist(summary);
                        setTick((t) => t + 1);
                      }}
                    >
                      {wished ? "★ Wishlisted" : "☆ Wishlist"}
                    </button>
                  </div>

                  <span style={{ display: "none" }}>{tick}</span>
                </div>
              </div>
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    marginBottom: 16,
  },
  btn: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16,
  },

  cardLink: { textDecoration: "none", color: "inherit", display: "block" },
  cardLinkDisabled: { textDecoration: "none", color: "inherit", display: "block", cursor: "not-allowed" },

  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
  },
  photoWrap: { width: "100%", height: 180, background: "#f3f4f6" },
  photo: { width: "100%", height: "100%", objectFit: "cover" },
  photoPlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280",
  },

  body: { padding: 14 },
  name: { fontWeight: 900, fontSize: 16, color: "#111827" },
  line: { marginTop: 8, fontSize: 13, color: "#111827" },
  price: {
    marginTop: 12,
    fontWeight: 900,
    fontSize: 18,
    color: "#111827",
    background: "#f3f4f6",
    padding: "6px 10px",
    borderRadius: 10,
    display: "inline-block",
  },

  actions: { marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" },
  actionBtn: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #111827",
    background: "#111827",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 800,
  },
  actionBtnSecondary: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 800,
  },
};