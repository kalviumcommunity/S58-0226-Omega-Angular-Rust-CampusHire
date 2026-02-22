@echo off
echo Starting Rust Backend...
cd backend
start cmd /k "cargo run"
cd ..

echo.
echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Angular Frontend...
cd frontend
start cmd /k "npm start"
cd ..

echo.
echo ===================================
echo Both servers are starting!
echo ===================================
echo Backend: http://localhost:8080
echo Frontend: http://localhost:4200
echo ===================================
