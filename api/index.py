from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.responses import Response
import csv
import io
from api.db import get_db_connection, init_db

app = FastAPI()

class FormData(BaseModel):
    papa: float
    ingreso: float
    dependientes: int
    traslado: float

# Initialize DB on startup (for simplicity in this prototype)
# In production, migration scripts are better.
try:
    init_db()
except Exception as e:
    print(f"DB Init Warning: {e}")

@app.post("/api/submit")
def submit_form(data: FormData):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO responses (papa, ingreso, dependientes, traslado) VALUES (%s, %s, %s, %s)",
            (data.papa, data.ingreso, data.dependientes, data.traslado)
        )
        conn.commit()
        cur.close()
        conn.close()
        return {"status": "success"}
    except Exception as e:
        print(f"Error submitting form: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/download")
def download_csv():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT papa, ingreso, dependientes, traslado, created_at FROM responses")
        rows = cur.fetchall()
        cur.close()
        conn.close()

        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(['PAPA', 'Ingreso', 'Dependientes', 'Traslado', 'Fecha'])
        writer.writerows(rows)
        
        return Response(
            content=output.getvalue(),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=datos_algebra.csv"}
        )
    except Exception as e:
        print(f"Error downloading CSV: {e}")
        raise HTTPException(status_code=500, detail=str(e))
