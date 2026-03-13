import React from "react";

const LandingPage = () => {
  const pageStyle = {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#fdfdfd",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "80px",
  };

  const heroSection = {
    width: "100%",
    maxWidth: "1100px",
    padding: "4rem 1.5rem 4rem",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "2.5rem",
  };

  const heroText = {
    flex: 1,
    textAlign: "left",
  };

  const heroTitle = {
    fontFamily: "Josefin Sans, sans-serif",
    fontSize: "2rem",
    lineHeight: 1.3,
    color: "#111827",
    marginBottom: "1rem",
    fontWeight: 700,
  };

  const heroSubtitle = {
    fontFamily: "Montserrat, sans-serif",
    fontSize: "0.95rem",
    color: "#4b5563",
    marginBottom: "1.25rem",
  };

  const heroLine = {
    height: "4px",
    width: "160px",
    backgroundColor: "#d9b02aff",
    borderRadius: "999px",
    margin: "1rem 0 1.5rem",
  };

  const heroBody = {
    fontFamily: "Montserrat, sans-serif",
    fontSize: "0.9rem",
    color: "#4b5563",
  };

  const heroImageWrapper = {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  };

  const heroImage = {
    maxWidth: "350px",
    width: "100%",
    transition: "transform 0.3s ease",
  };

  const sectionWrapper = {
    width: "100%",
    maxWidth: "1100px",
    padding: "2.5rem 1.5rem 4rem",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "2.5rem",
  };

  const sectionTitle = {
    fontFamily: "Josefin Sans, sans-serif",
    fontSize: "1.6rem",
    lineHeight: 1.4,
    color: "#111827",
    marginBottom: "1rem",
  };

  const sectionText = {
    fontFamily: "Montserrat, sans-serif",
    fontSize: "0.9rem",
    color: "#4b5563",
  };

  const waveFooter = {
    width: "100%",
    marginTop: "2rem",
    background:
      "radial-gradient(circle at 30% 0, #e9ce60ff 0, #f0d92aff 35%, #e9ce60ff  80%)",
    color: "#111827",
    position: "relative",
    paddingTop: "3rem",
    paddingBottom: "2.5rem",
    clipPath: "ellipse(140% 100% at 50% 0%)",
  };

  const footerInner = {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "0 1.5rem",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: "2rem",
    fontFamily: "Montserrat, sans-serif",
    fontSize: "0.8rem",
  };

  const footerColumnTitle = {
    fontWeight: 600,
    marginBottom: "0.5rem",
  };

  const footerLink = {
    display: "block",
    marginBottom: "0.25rem",
    cursor: "pointer",
  };

  return (
    <div style={pageStyle}>
      {/* Hero */}
      <section style={heroSection}>
        <div style={heroText}>
          <h1 style={heroTitle}>PopTheSkills, Connect, Swap, Learn!!</h1>
          <p style={heroSubtitle}>
            SkillSwap is the go‑to platform for social skill swapping anytime, anywhere.
          </p>
          <div style={heroLine} />
          <p style={heroBody}>
            SkillSwap exists to make it easy for you to connect with talented people nearby or
            afar and swap skills that help you grow. Share what you know, learn something new
            or share your talents that have never been seen! Our platform is designed to be
            simple, fun, and accessible for everyone.
          </p>
        </div>
        <div style={heroImageWrapper}>
          <img 
            src="/assets/images/1.1.png" 
            alt="People learning" 
            style={heroImage}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          />
        </div>
      </section>

      {/* How it works */}
      <section style={sectionWrapper} id="why-skill-swap">
        <div style={heroImageWrapper}>
          <img 
            src="/assets/images/1.2.png" 
            alt="Community" 
            style={heroImage}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          />
        </div>
        <div style={heroText}>
          <h2 style={sectionTitle}>How does social skill swapping work?</h2>
          <p style={sectionText}>
            On SkillSwap, everyone has something to teach and something to learn. Post the skills
            you can offer, and discover people who can help you level up in return. Whether it&apos;s
            coding, languages, music, design, or soft skills, you&apos;ll find peers ready to share
            their experience. Learning has never been this easy, social, and rewarding.
          </p>
        </div>
      </section>

      {/* Wavy footer band */}
      <footer style={waveFooter}>
        <div style={footerInner}>
          <div>
            <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>SkillSwap</div>
            <div>Swap skills. Grow together.</div>
          </div>
          <div>
            <div style={footerColumnTitle}>Company</div>
            <span style={footerLink}>About</span>
            <span style={footerLink}>Terms of Use</span>
            <span style={footerLink}>Privacy Policy</span>
          </div>
          <div>
            <div style={footerColumnTitle}>Contact us</div>
            <span style={footerLink}>skillswap@example.com</span>
            <span style={footerLink}>+91 123 345 6890</span>
          </div>
          <div>
            <div style={footerColumnTitle}>More</div>
            <span style={footerLink}>Community Guidelines</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
