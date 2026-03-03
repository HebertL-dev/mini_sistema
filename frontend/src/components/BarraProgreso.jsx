export default function BarraProgreso({ progreso }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <div
        style={{
          height: "8px",
          backgroundColor: "#e5e7eb",
          borderRadius: "6px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progreso}%`,
            height: "100%",
            backgroundColor: "#2563eb",
            transition: "width 0.3s ease",
          }}
        />
      </div>
      {progreso > 0 && (
        <p style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "#6b7280" }}>
          {progreso}% completado
        </p>
      )}
    </div>
  );
}