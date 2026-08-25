# IndexNow Submission Script
# Run this script whenever you update your portfolio to notify search engines instantly.

$hostName = "vedant-beladiya.vercel.app"
$key = "e4b2a8d16f394c50b71e892d5c3fa108"
$keyLocation = "https://$hostName/$key.txt"
$urlList = @(
    "https://$hostName/"
)

$payload = @{
    host = $hostName
    key = $key
    keyLocation = $keyLocation
    urlList = $urlList
} | ConvertTo-Json

Write-Host "Submitting URL to IndexNow API (Bing, Yandex, Naver, Seznam)..." -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri "https://api.indexnow.org/indexnow" -Method POST -Body $payload -ContentType "application/json; charset=utf-8" -UseBasicParsing
    Write-Host "Submission successful! HTTP Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Notice: $($_.Exception.Message)" -ForegroundColor Yellow
}
