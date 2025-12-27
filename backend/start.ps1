# Load environment variables from .env file
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^#][^=]+)=(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        Set-Item -Path "env:$name" -Value $value
        Write-Host "Set $name" -ForegroundColor Green
    }
}

Write-Host "`nStarting backend server..." -ForegroundColor Cyan
npm run dev
