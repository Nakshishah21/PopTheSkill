import React from "react";
import { Container, Navbar } from "react-bootstrap";

const Footer = () => {
  return (
    <>
      <Navbar variant="light" style={{ backgroundColor: "#e6c233", borderTop: "1px solid rgba(17,24,39,0.12)" }}>
        <Container className="mx-auto w-100 d-flex justify-content-center">
          <div className="text-center" style={{ fontFamily: "Montserrat, sans-serif", color: "#111827" }}>
            Copyright &copy; 2024 SkillSwap. All rights reserved.
          </div>
        </Container>
      </Navbar>
    </>
  );
};

export default Footer;
