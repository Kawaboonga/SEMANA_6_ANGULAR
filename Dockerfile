# ==========================================================
# ETAPA 1: Build Angular
# ==========================================================
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration=production


# ==========================================================
# ETAPA 2: NGINX
# ==========================================================
FROM nginx:alpine

# Copiamos la configuración SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# IMPORTANTE: copiamos DESDE /browser
COPY --from=build /app/dist/Proyecto-semana4/browser /usr/share/nginx/html

EXPOSE 80