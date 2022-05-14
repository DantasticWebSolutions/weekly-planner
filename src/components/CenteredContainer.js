import React from "react";
import { Container } from "react-bootstrap";

export default function CenteredContainer({ children }) {
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "calc(100vh - 56px)" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        {children}
      </div>
    </Container>
  );
}
