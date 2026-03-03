import pyodbc

DB_CONFIG = {
    "server": "localhost",
    "database": "nominas",
    "driver": "ODBC Driver 17 for SQL Server",
    "trusted_connection": True
}

def get_connection():
    conn_str = (
        f"DRIVER={{{DB_CONFIG['driver']}}};"
        f"SERVER={DB_CONFIG['server']};"
        f"DATABASE={DB_CONFIG['database']};"
        f"Trusted_Connection={'yes' if DB_CONFIG['trusted_connection'] else 'no'};"
    )
    return pyodbc.connect(conn_str)