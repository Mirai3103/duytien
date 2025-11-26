# --- Build Stage ---
FROM node:22-alpine AS build   
WORKDIR /app

# Copy file cấu hình
COPY package.json ./
RUN npm install --no-audit --no-fund

# Copy toàn bộ source
COPY . .

# Build
RUN npm run build

# --- Serve Stage với Caddy ---
FROM caddy:2.10.2-alpine

# Copy thư mục build từ Node
COPY --from=build /app/dist /srv

# Tạo thư mục Caddy config (mount file Caddyfile vào)
RUN mkdir -p /etc/caddy

EXPOSE 80
EXPOSE 443

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
