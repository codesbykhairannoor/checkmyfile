@echo off
cd /d "%~dp0\.."
echo ======================================================== >> scripts\indexing-daily.log
echo [%%DATE%% %%TIME%%] Starting Daily Google Indexing Run >> scripts\indexing-daily.log
echo ======================================================== >> scripts\indexing-daily.log

call npx tsx scripts/submit-google-indexing.ts >> scripts\indexing-daily.log 2>&1

echo [%%DATE%% %%TIME%%] Run finished. >> scripts\indexing-daily.log
echo. >> scripts\indexing-daily.log
