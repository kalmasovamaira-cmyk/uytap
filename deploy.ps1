param(
    [string]$ServerIp = '72.60.182.72'
)

$DeployScript = @"
if [ -d /root/uytap ]; then
    cd /root/uytap
    git pull origin main
else
    git clone https://github.com/kalmasovamaira-cmyk/uytap /root/uytap
    cd /root/uytap
fi

# Build and restart containers using Docker Compose
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up --build -d
"@

Write-Host "Connecting and deploying..."
ssh -o StrictHostKeyChecking=no root@$ServerIp $DeployScript
