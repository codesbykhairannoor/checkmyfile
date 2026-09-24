@echo off
set TASK_NAME=HandleMyFile-DailyGoogleIndexing

echo Removing Windows Scheduled Task "%TASK_NAME%"...
schtasks /delete /tn "%TASK_NAME%" /f

if %ERRORLEVEL% equ 0 (
    echo [SUCCESS] Scheduled Task "%TASK_NAME%" has been removed.
) else (
    echo [NOTE] Task was not found or failed to remove.
)

pause
