@echo off
setlocal
set "ROOT=%~dp0"
set "NODE_DIR=C:\Program Files\nodejs"
set "PATH=%NODE_DIR%;%PATH%"

cd /d "%ROOT%bms-backend"
if not exist node_modules (
  echo Installing backend dependencies...
  call npm install
)

cd /d "%ROOT%bms-frontend"
if not exist node_modules (
  echo Installing frontend dependencies...
  call npm install
)

start "BMS Backend" cmd /k "cd /d "%ROOT%bms-backend" && npm run dev"
start "BMS Frontend" cmd /k "cd /d "%ROOT%bms-frontend" && npm run dev -- --host 0.0.0.0"

echo.
echo Project started.
echo Backend: http://localhost:9000/
echo Frontend: http://localhost:5173/
echo.
