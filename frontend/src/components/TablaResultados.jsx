export default function TablaResultados({ datos }) {
  if (!datos.length) return null;

  const columnas = Object.keys(datos[0]);

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "1rem",
        }}
      >
        <thead>
          <tr>
            {columnas.map((col) => (
              <th
                key={col}
                style={{
                  textAlign: "left",
                  padding: "0.75rem",
                  borderBottom: "1px solid #e5e7eb",
                  fontSize: "0.9rem",
                  color: "#374151",
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {datos.map((fila, i) => (
            <tr
              key={i}
              style={{
                backgroundColor: i % 2 === 0 ? "#f9fafb" : "white",
              }}
            >
              {columnas.map((col) => (
                <td
                  key={col}
                  style={{
                    padding: "0.75rem",
                    borderBottom: "1px solid #f3f4f6",
                    fontSize: "0.85rem",
                  }}
                >
                  {fila[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}