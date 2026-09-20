$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root
npm run build
$dest = Join-Path $root 'android-native/app/src/main/assets/www'
if (Test-Path $dest) { Remove-Item -Recurse -Force $dest }
New-Item -ItemType Directory -Path $dest -Force | Out-Null
Copy-Item -Recurse (Join-Path $root 'dist/*') $dest
Write-Host 'Copied dist into Android assets.'
