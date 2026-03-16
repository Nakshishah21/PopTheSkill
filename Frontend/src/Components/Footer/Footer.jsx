import React, { useState, useEffect } from "react";
import { Container, Navbar } from "react-bootstrap";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Show footer when user is within 100px of the bottom
      const isNearBottom = scrollTop + windowHeight >= documentHeight - 100;
      setIsVisible(isNearBottom);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Navbar 
      variant="light" 
      style={{ 
        backgroundColor: "#e6c233", 
        borderTop: "1px solid rgba(17,24,39,0.12)",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transform: isVisible ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.3s ease-in-out"
      }}
    >
      <Container className="mx-auto w-100 d-flex justify-content-center">
        <div className="text-center" style={{ fontFamily: "Montserrat, sans-serif", color: "#111827" }}>
          Copyright &copy; 2026 SkillSwap. All rights reserved.
        </div>
      </Container>
    </Navbar>
  );
};

export default Footer;
