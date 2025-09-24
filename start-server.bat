@echo off
echo 🚀 Starting Blog Application Server...
echo.

REM Check if we're in the right directory
if not exist "server.js" (
    echo ❌ Error: server.js not found in current directory
    echo 💡 Make sure you're running this from the blog_app directory
    pause
    exit /b 1
)

echo 📁 Current directory: %CD%
echo 🔧 Starting Node.js server...
echo.

node server.js

pause