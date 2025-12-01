# Etapa 1: Construcción
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package.json y package-lock.json (o yarn.lock)
COPY package*.json ./

# Instalar dependencias
RUN npm install --force

# Copiar el resto del código
COPY . .

# Construir la app para producción
RUN npm run build

# Etapa 2: Producción - servidor ligero
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copiar solo lo necesario desde builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

# Exponer puerto 3000 (por defecto de Next.js)
EXPOSE 3000

# Comando para iniciar Next.js en modo producción
CMD ["npm", "start"]
