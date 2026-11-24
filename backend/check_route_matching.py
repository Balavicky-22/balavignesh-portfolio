import re
from app.main import app

with open(r"c:\Users\ELCOT\Desktop\To do APP project\portfolio-system\admin-panel\assets\js\admin.js", "r", encoding="utf-8") as f:
    js = f.read()

api_calls = re.findall(r'API\.(get|post|put|delete|patch|upload)\([\'\"`]([^\'\"`]+)[\'\"`]', js)

# Normalize api paths from admin.js: replace ${id} or ${...} with {id} or dynamic param
def norm_js_path(p):
    p = p.split('?')[0]
    p = re.sub(r'\$\{[^}]+\}', '{id}', p)
    return p

backend_routes = []
for r in app.routes:
    if hasattr(r, 'methods') and hasattr(r, 'path'):
        for m in r.methods:
            # normalize fastapi path e.g. {project_id} -> {id}
            norm_path = re.sub(r'\{[^}]+\}', '{id}', r.path)
            backend_routes.append((m, norm_path))

print(f"Total backend routes: {len(backend_routes)}")

# Check each admin.js call
missing = []
for method, path in sorted(set(api_calls)):
    m = "POST" if method == "upload" else method.upper()
    norm_p = norm_js_path(path)
    
    # Check if (m, norm_p) matches any backend route
    matched = False
    for bm, bp in backend_routes:
        if bm == m and bp == norm_p:
            matched = True
            break
    if not matched:
        missing.append((m, path, norm_p))

if missing:
    print("❌ MISMATCHED OR MISSING BACKEND ENDPOINTS:")
    for m, p, np in missing:
        print(f"  {m:6} {p}  (normalized: {np})")
else:
    print("✅ ALL admin.js API CALLS MATCH BACKEND ROUTES EXACTLY!")
