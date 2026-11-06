$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$previousSystemCa = $env:NODE_USE_SYSTEM_CA

Push-Location -LiteralPath $projectRoot
try {
  # Use Windows' trusted CA store while retaining TLS verification.
  $env:NODE_USE_SYSTEM_CA = '1'
  & npm.cmd ci
  if ($LASTEXITCODE -ne 0) { throw 'npm ci failed.' }
  & npm.cmd run browsers:install
  if ($LASTEXITCODE -ne 0) { throw 'Playwright browser installation failed.' }
  Write-Output 'Setup complete. Run npm run check, then npm run dev.'
}
finally {
  $env:NODE_USE_SYSTEM_CA = $previousSystemCa
  Pop-Location
}
