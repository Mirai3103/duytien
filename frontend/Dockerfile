# --- Build Stage ---
FROM oven/bun:latest AS build

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install

COPY . .
RUN bun run build
# --- Serve Stage với Caddy ---
FROM caddy:2.10.2-alpine

# Copy thư mục build từ Bun
COPY --from=build /app/dist /srv

# Tạo thư mục Caddy config (mount file Caddyfile vào)
RUN mkdir -p /etc/caddy

EXPOSE 80
EXPOSE 443

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
