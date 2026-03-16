const NotFound = () => {
  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div
        className="theme-surface"
        style={{
          padding: "2.5rem",
          textAlign: "center",
          maxWidth: "520px",
          width: "100%",
          background: "linear-gradient(180deg, #ffffff, #fff7cc)",
        }}
      >
        <h2 style={{ fontFamily: "Josefin Sans, sans-serif", color: "#111827", marginBottom: "0.75rem" }}>
          Page not found
        </h2>
        <p style={{ fontFamily: "Montserrat, sans-serif", color: "#4b5563", marginBottom: "1.25rem" }}>
          The page you’re looking for doesn’t exist or was moved.
        </p>
        <a
          href="/"
          style={{
            display: "inline-block",
            textDecoration: "none",
            backgroundColor: "#b38900",
            color: "#111827",
            padding: "0.7rem 1.2rem",
            borderRadius: "999px",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
          }}
        >
          Go home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
