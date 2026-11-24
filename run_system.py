"""
Balavignesh B — Unified Portfolio System Server
Runs all 3 services concurrently in one single process:
  - Port 8000: FastAPI REST API & Database
  - Port 3000: Public Portfolio Website
  - Port 5500: Admin Panel Dashboard
"""

import os
import sys
import threading
import time
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, "backend")
PUBLIC_DIR = os.path.join(BASE_DIR, "public-portfolio")
ADMIN_DIR = os.path.join(BASE_DIR, "admin-panel")

# Add backend directory to sys.path so app imports work seamlessly
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)


class DualStackServer(ThreadingHTTPServer):
    allow_reuse_address = True
    daemon_threads = True


def run_static_server(directory, port, name):
    handler = partial(SimpleHTTPRequestHandler, directory=directory)
    try:
        # Binding to 0.0.0.0 accepts both localhost and 127.0.0.1
        with DualStackServer(("0.0.0.0", port), handler) as httpd:
            print(f"[{name}] Serving {directory} at http://localhost:{port} (and http://127.0.0.1:{port})")
            httpd.serve_forever()
    except Exception as e:
        print(f"[{name}] Error on port {port}: {e}")


def run_backend(port=8000):
    try:
        from app.main import app
        import uvicorn
        print(f"[Backend API] Starting FastAPI at http://localhost:{port} (and http://127.0.0.1:{port})")
        uvicorn.run(app, host="0.0.0.0", port=port, log_level="warning")
    except Exception as e:
        print(f"[Backend API] Error on port {port}: {e}")


def main():
    print("=" * 60)
    print("Launching Balavignesh B Unified Portfolio System")
    print("=" * 60)

    # 1. Start Public Portfolio (Port 3000)
    t_public = threading.Thread(
        target=run_static_server,
        args=(PUBLIC_DIR, 3000, "Public Portfolio"),
        daemon=True,
    )
    t_public.start()

    # 2. Start Admin Panel (Port 5500)
    t_admin = threading.Thread(
        target=run_static_server,
        args=(ADMIN_DIR, 5500, "Admin Panel"),
        daemon=True,
    )
    t_admin.start()

    # Give static servers a split second
    time.sleep(0.5)

    print("\nAll services are active:")
    print("  * Public Portfolio: http://localhost:3000  (http://127.0.0.1:3000)")
    print("  * Admin Panel:      http://localhost:5500  (http://127.0.0.1:5500)")
    print("  * Backend REST API: http://localhost:8000  (http://127.0.0.1:8000)")
    print("  * API Swagger Docs: http://localhost:8000/docs")
    print("  * Default Admin:    admin@balavignesh.dev / Balavignesh@2026")
    print("=" * 60 + "\n")

    # 3. Start Backend API on main thread (Port 8000)
    run_backend(8000)


if __name__ == "__main__":
    main()
