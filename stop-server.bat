@echo off
echo 🛑 Stopping Blog Application Server...
echo.

echo 🔍 Checking for processes using port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    echo 📝 Found process with PID: %%a
    echo 🔪 Terminating process...
    taskkill /PID %%a /F
)

echo.
echo ✅ All processes on port 3000 have been terminated.
echo 💡 You can now start the server again.
pause