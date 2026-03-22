# Secure Code Assist - Windows Setup Script
# This script sets up the local environment and creates a desktop shortcut.

$ErrorActionPreference = "Stop"

Write-Host "--- Secure Code Assist: Local Privacy Guard Setup ---" -ForegroundColor Cyan

# 0. Verify Location
if (-not (Test-Path "package.json")) {
    Write-Host "`n[ERROR] package.json not found in the current directory!" -ForegroundColor Red
    Write-Host "Please make sure you have extracted the ZIP file and placed this script INSIDE the project folder."
    Write-Host "Current Directory: $PSScriptRoot"
    Write-Host "`nPress any key to exit..."
    $null = [Console]::ReadKey($true)
    exit
}

# 0.1 Sanitize Filenames (Fix Windows compatibility for migrated history)
Write-Host "[0.1] Sanitizing filenames for Windows compatibility..." -NoNewline
Get-ChildItem -Path "$PSScriptRoot\migrated_prompt_history" -Filter "*:*" -Recurse -ErrorAction SilentlyContinue | ForEach-Object {
    $newName = $_.Name -replace ':', '-'
    Rename-Item -Path $_.FullName -NewName $newName
}
Write-Host " Done." -ForegroundColor Green

# 1. Check for Node.js
Write-Host "[1/4] Checking for Node.js..." -NoNewline
try {
    $nodeVersion = node -v
    Write-Host " Found ($nodeVersion)" -ForegroundColor Green
} catch {
    Write-Host " Not Found!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/ before continuing."
    exit
}

# 2. Install Dependencies
Write-Host "[2/4] Installing dependencies (this may take a minute)..."
npm install

# 3. Build Application
Write-Host "[3/4] Building production assets..."
npm run build

# 4. Create Desktop Shortcut
Write-Host "[4/4] Creating Desktop Shortcut..."
$WshShell = New-Object -ComObject WScript.Shell
$ShortcutPath = [System.IO.Path]::Combine([Environment]::GetFolderPath("Desktop"), "Secure Code Assist.lnk")
$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = "powershell.exe"
$Shortcut.Arguments = "-NoExit -Command `"cd '$PSScriptRoot'; npm run dev`""
$Shortcut.WorkingDirectory = $PSScriptRoot
$Shortcut.IconLocation = "shell32.dll,45" # Lock icon
$Shortcut.Description = "Launch Secure Code Assist Local Privacy Guard"
$Shortcut.Save()

Write-Host "`nSetup Complete!" -ForegroundColor Green
Write-Host "You can now launch the application using the 'Secure Code Assist' shortcut on your Desktop."
Write-Host "The application will run locally on http://localhost:3000"
Write-Host "`n[TIP] If http://localhost:3000 shows a blank page, try http://127.0.0.1:3000 instead."
Write-Host "`nPress any key to exit..."
$null = [Console]::ReadKey($true)
