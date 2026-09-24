@echo off
echo ===================================================================
echo Setting up Windows Daily Scheduled Task for Google Indexing API...
echo ===================================================================

set TASK_NAME=HandleMyFile-DailyGoogleIndexing
set BAT_PATH=%~dp0run-daily-indexing.bat

:: Create scheduled task to run every day at 08:00 AM
schtasks /create /tn "%TASK_NAME%" /tr "\"%BAT_PATH%\"" /sc daily /st 08:00 /f

if %ERRORLEVEL% equ 0 (
    echo.
    echo [SUCCESS] Scheduled Task "%TASK_NAME%" has been created!
    echo It will automatically execute everyday at 08:00 AM.
    echo Log file will be saved at: scripts\indexing-daily.log
) else (
    echo.
    echo [NOTE] If permission denied, please right-click this .bat and select "Run as administrator".
)

pause
