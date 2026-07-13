$ErrorActionPreference = 'Stop'
$nodePath = 'C:\Program Files\nodejs'
if (-not ($env:Path -split ';' | Where-Object { $_ -eq $nodePath })) {
  $env:Path = "$nodePath;$env:Path"
}

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

$backend = Join-Path $root 'bms-backend'
$frontend = Join-Path $root 'bms-frontend'

Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backend'; npm run dev" -WorkingDirectory $backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$frontend'; npm run dev -- --host 0.0.0.0" -WorkingDirectory $frontend

Write-Host 'Started backend and frontend dev servers.'
Write-Host 'Backend: http://localhost:9000/'
Write-Host 'Frontend: http://localhost:5173/'
