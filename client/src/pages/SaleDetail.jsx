import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

function cleanUrl(u) {
  if (!u) return "";
  return String(u).trim().replace(/^"+|"+$/g, "");
}

export default function SaleDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(`/api/sale/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
        if (!cancelled) {
          setItem(data);
          setActiveIdx(0);
        }
      } catch (e) {
        if (!cancelled) setErr(String(e?.message || e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const photos = useMemo(() => {
    const arr = Array.isArray(item?.photos) ? item.photos : [];
    return arr.map(cleanUrl).filter(Boolean);
  }, [item]);

  const activePhoto = photos[activeIdx] || photos[0] || "";
  const card = item?.card || {};

  const priceCents =
    typeof item?.priceCents === "number" ? item.priceCents : item?.priceCents ? Number(item.priceCents) : 0;

  const priceLabel = priceCents > 0 ? `$${(priceCents / 100).toFixed(2)}` : "—";

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;
  if (err) return <div style={{ padding: 24, color: "#b91c1c" }}>{err}</div>;
  if (!item) return <div style={{ padding: 24 }}>Listing not found.</div>;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <Link to="/sale" style={{ textDecoration: "none", color: "#111827", fontWeight: 700 }}>
          ← Back to Cards For Sale
        </Link>
      </div>

      <div style={styles.layout}>
        {/* Images */}
        <div>
          <div style={styles.heroWrap}>
            {activePhoto ? (
              <img src={activePhoto} alt={card.name || "Card"} style={styles.heroImg} />
            ) : (
              <div style={styles.heroPlaceholder}>No photos</div>
            )}
          </div>

          {photos.length > 1 && (
            <div style={styles.thumbRow}>
              {photos.map((p, idx) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  style={{
                    ...styles.thumbBtn,
                    outline: idx === activeIdx ? "2px solid #111827" : "none",
                  }}
                  aria-label={`Select photo ${idx + 1}`}
                >
                  <img src={p} alt={`Photo ${idx + 1}`} style={styles.thumbImg} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div style={styles.panel}>
          <div style={styles.titleRow}>
            <h2 style={{ margin: 0 }}>{card.name || "Unknown Card"}</h2>
            {card.foil ? <span style={styles.badge}>Foil</span> : null}
          </div>

          <div style={styles.price}>{priceLabel}</div>

          <div style={styles.grid}>
            <div><strong>Set:</strong> {card.set || "—"}</div>
            <div><strong>Number:</strong> {card.number || "—"}</div>
            <div><strong>Rarity:</strong> {card.rarity || "—"}</div>
            <div><strong>Type:</strong> {card.type || "—"}</div>
            <div><strong>Edition:</strong> {card.edition || "—"}</div>
            <div><strong>Qty:</strong> {item.quantity ?? 1}</div>
            <div><strong>Condition:</strong> {item.condition || "—"}</div>
          </div>

          {item.notes ? (
            <div style={{ marginTop: 16 }}>
              <h4 style={{ margin: "0 0 8px 0" }}>Notes</h4>
              <div style={styles.notes}>{item.notes}</div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const styles = {
  layout: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
    gap: 20,
    alignItems: "start",
  },
  heroWrap: {
    width: "100%",
    height: 520,
    background: "#f3f4f6",
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid #e5e7eb",
  },
  heroImg: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    background: "#fff",
  },
  heroPlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280",
  },
  thumbRow: {
    marginTop: 12,
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  thumbBtn: {
    border: "1px solid #e5e7eb",
    background: "#fff",
    borderRadius: 12,
    padding: 0,
    cursor: "pointer",
    width: 90,
    height: 90,
    overflow: "hidden",
  },
  thumbImg: { width: "100%", height: "100%", objectFit: "cover" },
  panel: {
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 16,
    background: "#fff",
    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  badge: {
    fontSize: 12,
    fontWeight: 800,
    padding: "6px 10px",
    borderRadius: 999,
    background: "#111827",
    color: "#fff",
    whiteSpace: "nowrap",
  },
  price: { fontWeight: 900, fontSize: 22, marginTop: 10 },
  grid: {
    marginTop: 14,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    fontSize: 14,
  },
  notes: {
    padding: 12,
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    background: "#f9fafb",
  },
};