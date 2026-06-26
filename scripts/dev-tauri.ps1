$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

$webJob = Start-Job -ScriptBlock {
    param($root)

    Set-Location $root
    pnpm --filter @liteyuki-shelf/web dev --host 127.0.0.1
} -ArgumentList $repoRoot

try {
    $webReady = $false

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

    if (-not $webReady) {
        throw 'Web dev server did not become ready on http://127.0.0.1:5173.'
    }

    cargo run --manifest-path apps/desktop/src-tauri/Cargo.toml
}
finally {
    Stop-Job $webJob -ErrorAction SilentlyContinue | Out-Null
    Remove-Job $webJob -Force -ErrorAction SilentlyContinue | Out-Null
}
