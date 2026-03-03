export default function Toast({ message, type }) {
  if (!message) return null;

  const bg = type === "error" ? "#f44336" : "#4caf50";

  return (
    <div style={{
      position: "fixed",
      top: "1rem",
      right: "1rem",
      background: bg,
      color: "white",
      padding: "1rem",
      borderRadius: "4px",
      zIndex: 1000
    }}>
      {message}
    </div>
  );
}