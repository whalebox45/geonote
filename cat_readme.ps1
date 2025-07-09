$frontend = Get-Content .\frontend\README.md -Encoding UTF8
$backend = Get-Content .\backend\README.md -Encoding UTF8
$combined = $frontend + $backend
$combined | Set-Content README.md -Encoding UTF8
