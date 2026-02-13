import React from "react";

const Modal = ({ title, onClose, children }) => {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.5)" }}>
      <div
        className="card"
        style={{ maxWidth: "520px", margin: "80px auto", position: "relative" }}
      >
        <button
          onClick={onClose}
          className="button secondary"
          style={{ position: "absolute", top: 12, right: 12 }}
        >
          Close
        </button>
        <h3>{title}</h3>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
