// src/components/services/reporteService.js

const BASE_URL = "http://127.0.0.1:8000/reporte"; // tu backend FastAPI

// Genera el reporte completo y devuelve un blob (archivo Excel)
export async function generarReporte(rfc) {
  try {
    const response = await fetch(`${BASE_URL}/${rfc}`);
    if (!response.ok) throw new Error(`Error: ${response.statusText}`);
    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Stream de datos parciales, útil para barra de progreso
export async function streamReporte(rfc, onData) {
  try {
    const response = await fetch(`${BASE_URL}/stream/${rfc}`);
    if (!response.ok) throw new Error(`Error: ${response.statusText}`);

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      chunk.split("\n\n").forEach(line => {
        if (line.startsWith("data: ")) {
          const data = JSON.parse(line.replace("data: ", ""));
          onData(data);
        }
      });
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Función para suscribirse a los resultados de manera reactiva (barra de progreso)
export function subscribeResultados(rfc, onData, onError) {
  let canceled = false;

  streamReporte(rfc, (data) => {
    if (!canceled) {
      onData(data);
    }
  }).catch(err => {
    if (!canceled && onError) onError(err.message || "Error en el stream");
  });

  // Devuelve función para cancelar la suscripción
  return () => {
    canceled = true;
  };
}

// Función para descargar el Excel usando generarReporte
export async function descargarExcel(rfc) {
  try {
    const blob = await generarReporte(rfc);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte_${rfc}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
    throw error;
  }
}