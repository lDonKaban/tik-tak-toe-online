#!/bin/sh
set -e

if [ -z "$SESSION_SECRET" ]; then
  echo "ERROR: SESSION_SECRET is not set or empty. Check your .env.production file."
  exit 1
fi

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Starting application..."
exec npx next start -p 3000
