import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  // If user is already logged in (info present), skip login page
  useEffect(() => {
    const userInfoString = localStorage.getItem("userInfo");
    if (userInfoString) {
      navigate("/discover");
    }
  }, [navigate]);

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/auth/google";
  };

  const containerStyle = {
    minHeight: "90.4vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "var(--bg)",
    padding: "2rem 1rem",
  };

  const loginBoxStyle = {
    minHeight: "220px",
    width: "min(520px, 92vw)",
    display: "flex",
    background: "linear-gradient(180deg, var(--surface), var(--surface-2))",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "28px",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    boxShadow: "var(--shadow-md)",
    zIndex: "999",
  };

  const titleStyle = {
    fontSize: "38px",
    fontFamily: "var(--font-display)",
    color: "var(--text)",
    textAlign: "center",
    letterSpacing: "0.08em",
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "center",
  };

  const buttonStyle = {
    backgroundColor: "var(--brand-line)",
    color: "var(--text)",
    fontFamily: "var(--font-body)",
    border: "none",
    padding: "10px 20px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: 600,
  };

  const hoverButtonStyle = {
    backgroundColor: "var(--brand-orange)",
    color: "var(--text)",
    fontFamily: "var(--font-body)",
    border: "none",
    padding: "10px 20px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: 600,
    transition: "background-color 0.25s ease-in-out",
  };

  const imageStyle = {
    position: "absolute",
    left: "10px",
    top: "90px",
    width: "320px",
    opacity: 0.7,
    pointerEvents: "none",
  };

  const imageBelowStyle = {
    position: "absolute",
    right: "10px",
    bottom: "60px",
    width: "320px",
    opacity: 0.7,
    pointerEvents: "none",
  };

  return (
    <div style={containerStyle}>
      <img src={"/assets/images/1.png"} alt="Above Image" style={imageStyle} />
      <div style={loginBoxStyle}>
        <h1 style={titleStyle}>LOGIN</h1>
        <div style={buttonContainerStyle}>
          <Button
            style={isHovered ? hoverButtonStyle : buttonStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleGoogleLogin}
          >
            <FaGoogle /> Login with Google
          </Button>
        </div>
      </div>
      <img src={"/assets/images/2.png"} alt="Below Image" style={imageBelowStyle} />
    </div>
  );
};

export default Login;
