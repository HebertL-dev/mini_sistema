import { useState } from "react";

export default function InputRFC({ onSubmit }) {
  const [rfc, setRfc] = useState("");

  const handleSubmit = () => {
    if (!rfc) return;
    onSubmit(rfc.toUpperCase());
  };

return (
  <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
    <input
      type="text"
      placeholder="Ingresa RFC"
      value={rfc}
      onChange={(e) => setRfc(e.target.value)}
    />
    <button
      onClick={handleSubmit}
      style={{
        padding: "0.6rem 1.2rem",
        backgroundColor: "#111827",
        color: "white",
        fontWeight: 500,
      }}
    >
      Generar
    </button>
  </div>
);
}