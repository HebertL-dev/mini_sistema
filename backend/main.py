# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from reportes import router as reportes_router

# =====================================================
# CREACIÓN DE LA APP
# =====================================================

app = FastAPI(title="Sistema de Reportes de Plazas")

# =====================================================
# CONFIGURACIÓN CORS (NECESARIO PARA REACT)
# =====================================================

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# REGISTRO DE ROUTERS
# =====================================================

app.include_router(
    reportes_router,
    prefix="/reporte",
    tags=["Reportes"]
)