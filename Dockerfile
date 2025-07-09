FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
COPY . .

RUN npx prisma generate
RUN npm run build

# Apply migrations before starting the app
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
