$ErrorActionPreference = "Stop"

$nodeVersion = "v20.11.0"
$zipName = "node-$nodeVersion-win-x64.zip"
$folderName = "node-$nodeVersion-win-x64"
$downloadUrl = "https://nodejs.org/dist/$nodeVersion/$zipName"
$destDir = "$PSScriptRoot\bin"
$zipPath = "$destDir\$zipName"

Write-Host "Setting up portable Node.js environment..."

# Create bin directory
if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir | Out-Null
}

# Check if already installed
if (Test-Path "$destDir\$folderName\node.exe") {
    Write-Host "Node.js portable is already installed."
    exit 0
}

# Download
Write-Host "Downloading Node.js $nodeVersion (approx 25MB)..."
Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath

# Extract
Write-Host "Extracting..."
Expand-Archive -Path $zipPath -DestinationPath $destDir -Force

# Cleanup
Remove-Item -Path $zipPath

Write-Host "Node.js installed successfully in $destDir\$folderName"
