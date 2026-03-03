import React, { useState, useEffect } from "react";
import InputRFC from "./InputRFC.jsx";
import BarraProgreso from "./BarraProgreso.jsx";
import TablaResultados from "./TablaResultados.jsx";
import Toast from "./Toasts.jsx";
import { subscribeResultados, descargarExcel } from "./services/reporteService";

export default function App() {
  const [rfc, setRfc] = useState("");
  const [datos, setDatos] = useState([]);
  const [progreso, setProgreso] = useState(0);
  const [toast, setToast] = useState({ message: "", type: "" });

  useEffect(() => {
    if (!rfc) return;

    setDatos([]);
    setProgreso(0);

    let unsubscribe = () => {};

    try {
      unsubscribe = subscribeResultados(
        rfc,
        (data) => {
          if (data?.datos) {
            setDatos((prev) => [...prev, data.datos]);
            setProgreso(
              Math.round(((data.fila || 0) / (data.total || 1)) * 100)
            );
          }
        },
        (error) => {
          setToast({ message: error, type: "error" });
          setTimeout(() => setToast({ message: "", type: "" }), 5000);
        }
      );
    } catch (err) {
      console.error("Error en la suscripción:", err);
      setToast({
        message: err.message || "Error en el stream",
        type: "error",
      });
      setTimeout(() => setToast({ message: "", type: "" }), 5000);
    }

    return () => unsubscribe();
  }, [rfc]);

  const handleGenerar = (nuevoRfc) => setRfc(nuevoRfc);

  const handleDescargar = async () => {
    if (!rfc) return;

    try {
      await descargarExcel(rfc);
      setToast({
        message: "Excel descargado correctamente",
        type: "success",
      });
      setTimeout(() => setToast({ message: "", type: "" }), 5000);
    } catch (err) {
      console.error(err);
      setToast({
        message: err.message || "Error al descargar Excel",
        type: "error",
      });
      setTimeout(() => setToast({ message: "", type: "" }), 5000);
    }
  };

return (
  <div className="app-container">
    <div className="card">
      <h1 className="title">Sistema de Reportes de Plazas</h1>

      <InputRFC onSubmit={handleGenerar} />

      <BarraProgreso progreso={progreso} />

      <TablaResultados datos={datos || []} />

      {datos.length > 0 && (
        <button className="download-btn" onClick={handleDescargar}>
          Descargar Excel
        </button>
      )}

      <Toast message={toast.message} type={toast.type} />
    </div>
  </div>
);
}