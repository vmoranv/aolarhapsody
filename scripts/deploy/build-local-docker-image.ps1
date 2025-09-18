# Windows PowerShell script for building Docker containers
$ErrorActionPreference = "Stop"

# Get the directory of the script
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$LogFile = Join-Path $ScriptDir "build-local-docker-image.log"
$ProjectRoot = Join-Path $ScriptDir "..\..\"

# Create log file if it doesn't exist
if (!(Test-Path $LogFile)) {
    New-Item -ItemType File -Path $LogFile -Force | Out-Null
}

# Log function
function Write-Log {
    param([string]$message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] $message"
    Write-Host $message
    Add-Content -Path $LogFile -Value $logMessage
}

Write-Log "Info: Starting Docker Compose build"

# Change to project root
Set-Location $ProjectRoot

try {
    # Build and run the services in detached mode
    Write-Log "Building and starting Docker containers..."
    
    # Execute docker-compose and capture output separately
    $output = docker-compose up --build -d 2>&1
    $exitCode = $LASTEXITCODE
    
    # Write all output to log file
    $output | ForEach-Object { Write-Log $_ }
    
    if ($exitCode -eq 0) {
        Write-Log "Docker containers built and started successfully."
        Write-Log "Frontend should be available at http://localhost:61444"
        Write-Log "Backend is running on port 3000"
        Write-Host "`n=== Build Summary ===" -ForegroundColor Green
        Write-Host "✅ Docker containers built and started successfully" -ForegroundColor Green
        Write-Host "🌐 Frontend: http://localhost:61444" -ForegroundColor Cyan
        Write-Host "🔧 Backend: http://localhost:3000" -ForegroundColor Cyan
        Write-Host "📋 Full log available at: $LogFile" -ForegroundColor Yellow
    } else {
        Write-Log "Error: Docker Compose build failed with exit code $exitCode."
        throw "Docker Compose build failed. Check $LogFile for details."
    }
} catch {
    Write-Log "Error: $($_.Exception.Message)"
    Write-Host "`n❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "📋 Check log file for details: $LogFile" -ForegroundColor Yellow
    exit 1
}