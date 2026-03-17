#!/bin/bash
if [ -d /root/uytap ]; then
    cd /root/uytap
    git pull origin main
else
    git clone https://github.com/kalmasovamaira-cmyk/uytap /root/uytap
    cd /root/uytap
fi

docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up --build -d
echo "Deployment finished."
