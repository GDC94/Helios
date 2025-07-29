#!/bin/bash
echo "🚀 Starting production server..."

echo "🗄️ Running database migrations..."
npx prisma migrate deploy

if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully"
    echo "🎯 Starting server..."
    npm start
else
    echo "❌ Migration failed"
    exit 1
fi 