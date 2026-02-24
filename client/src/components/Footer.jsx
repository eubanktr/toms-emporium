export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <span style={styles.text}>Follow Tom's Emporium</span>

        <div style={styles.links}>
          <a
            href="https://instagram.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.link}
          >
            Instagram
          </a>

          <a
            href="https://youtube.com/@yourchannel"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.link}
          >
            YouTube
          </a>

          <a
            href="https://discord.gg/yourinvite"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.link}
          >
            Discord
          </a>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    marginTop: "auto",
    padding: "20px",
    background: "#111827",
    color: "#fff",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  text: {
    fontWeight: "600",
  },
  links: {
    display: "flex",
    gap: "20px",
  },
  link: {
    color: "#60a5fa",
    textDecoration: "none",
    fontWeight: "500",
  },
};