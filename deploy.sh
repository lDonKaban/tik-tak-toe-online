#!/bin/bash
# deploy.sh — деплой на Yandex Cloud VM
set -e

# ---------- Настройки (замените на свои) ----------
VM_USER="yc-user"
VM_IP="111.88.247.64"                     # Публичный IP виртуалки
SSH_KEY="$HOME/.ssh/id_rsa"

# ---------- 1. Создание VM (один раз) ----------
# Раскомментируйте и выполните при первом деплое:
#
# yc compute instance create \
#   --name ttt-vm \
#   --zone ru-central1-a \
#   --network-interface subnet-name=ttt-subnet,nat-ip-version=ipv4 \
#   --create-boot-disk image-folder-id=standard-images,image-family=ubuntu-2204-lts,size=20,type=network-ssd \
#   --cores 2 \
#   --memory 2GB \
#   --ssh-key ~/.ssh/id_rsa.pub

# ---------- 2. Установка Docker на VM (один раз) ----------
# Раскомментируйте и выполните при первом деплое:
#
# ssh "$VM_USER@$VM_IP" << 'EOF'
#   sudo apt update
#   sudo apt install -y docker.io docker-compose-v2
#   sudo usermod -aG docker $USER
#   sudo systemctl enable docker
# EOF

# ---------- 3. Копирование проекта и деплой ----------
echo "📦 Архивирую проект..."
tar --exclude='node_modules' --exclude='.next' --exclude='.git' \
  --exclude='.env' --exclude='.env.development' \
  -czf app.tar.gz .

echo "📤 Копирую на сервер..."
scp app.tar.gz "$VM_USER@$VM_IP:~/"
rm -f app.tar.gz

echo "🐳 Запускаю контейнеры..."
ssh "$VM_USER@$VM_IP" << 'EOF'
  mkdir -p ~/app
  tar -xzf ~/app.tar.gz -C ~/app
  rm -f ~/app.tar.gz
  cd ~/app
  docker compose -f docker-compose.prod.yaml down --remove-orphans
  docker compose -f docker-compose.prod.yaml build --no-cache
  docker compose -f docker-compose.prod.yaml up -d
EOF

echo "✅ Деплой завершён! Приложение доступно на http://$VM_IP:3000"
