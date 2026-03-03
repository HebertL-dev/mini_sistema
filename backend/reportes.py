# backend/reportes.py

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse, StreamingResponse
from db import get_connection
import pandas as pd
from pathlib import Path
import time
import json

# Carpeta donde se guardarán los reportes
OUTPUT_DIR = Path("reportes")
OUTPUT_DIR.mkdir(exist_ok=True)

router = APIRouter()


# ============================================================
# Función reutilizable para generar el Excel
# ============================================================
def generar_reporte(rfc: str) -> Path | None:
    conn = get_connection()
    try:
        df = pd.read_sql_query(
            "EXEC dbo.sp_consulta_plazas_rfc @rfc=?",
            conn,
            params=[rfc]
        )

        if df.empty:
            return None

        file_path = OUTPUT_DIR / f"reporte_{rfc}.xlsx"
        df.to_excel(file_path, index=False)

        return file_path

    finally:
        conn.close()


# ============================================================
# Endpoint de STREAM (SSE) — VA PRIMERO
# ============================================================
@router.get("/stream/{rfc}")
def stream_reporte_endpoint(rfc: str):

    def event_generator():
        try:
            conn = get_connection()
            df = pd.read_sql_query(
                "EXEC dbo.sp_consulta_plazas_rfc @rfc=?",
                conn,
                params=[rfc]
            )
            conn.close()

            total = len(df)

            if total == 0:
                yield f"data: {json.dumps({'error': 'No se encontraron datos'})}\n\n"
                return

            for i, row in df.iterrows():
                payload = {
                    "fila": i + 1,
                    "total": total,
                    "datos": row.to_dict()
                }

                yield f"data: {json.dumps(payload)}\n\n"

                # Simula progreso visible
                time.sleep(0.2)

        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream"
    )


# ============================================================
# Endpoint para descargar Excel completo
# ============================================================
@router.get("/{rfc}")
def generar_reporte_endpoint(rfc: str):

    file_path = generar_reporte(rfc)

    if not file_path:
        raise HTTPException(
            status_code=404,
            detail="No se encontraron datos"
        )

    return FileResponse(
        path=file_path,
        filename=file_path.name,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )