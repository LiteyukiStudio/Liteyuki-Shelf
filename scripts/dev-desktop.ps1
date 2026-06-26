$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

$apiJob = Start-Job -ScriptBlock {
    param($root)

    Set-Location $root
    cargo run --manifest-path apps/api/Cargo.toml
} -ArgumentList $repoRoot

$webJob = Start-Job -ScriptBlock {
    param($root)

    Set-Location $root
    pnpm --filter @liteyuki-shelf/web dev --host 127.0.0.1
} -ArgumentList $repoRoot

try {
    $apiReady = $false
    $webReady = $false

    for ($i = 0; $i -lt 30; $i++) {
        Start-Sleep -Seconds 1

        try {
            $health = Invoke-RestMethod 'http://127.0.0.1:8899/api/health'
            if ($health.status -eq 'ok') {
                $apiReady = $true
                break
            }
        }
        catch {
        }
    }

    for ($i = 0; $i -lt 60; $i++) {
        Start-Sleep -Seconds 1

        try {
            $response = Invoke-WebRequest 'http://127.0.0.1:5173' -UseBasicParsing
            if ($response.StatusCode -ge 200) {
                $webReady = $true
                break
            }
        }
        catch {
        }
    }

    if (-not $apiReady) {
        throw 'API did not become ready on http://127.0.0.1:8899.'
    }

    if (-not $webReady) {
        throw 'Web dev server did not become ready on http://127.0.0.1:5173.'
    }

    cargo run --manifest-path apps/desktop/src-tauri/Cargo.toml
}
finally {
    Stop-Job $apiJob -ErrorAction SilentlyContinue | Out-Null
    Stop-Job $webJob -ErrorAction SilentlyContinue | Out-Null
    Remove-Job $apiJob -Force -ErrorAction SilentlyContinue | Out-Null
    Remove-Job $webJob -Force -ErrorAction SilentlyContinue | Out-Null
}
