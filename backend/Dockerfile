FROM oven/bun:latest AS build

WORKDIR /app

# Copy file chứa dependencies trước để cache hiệu quả
COPY package.json bun.lockb ./
RUN bun install

# Copy toàn bộ source
COPY . .

# Build backend
RUN bun run build:bun

# --- Runtime Stage ---
FROM oven/bun:latest

WORKDIR /app

# Copy thư mục build (dir/)
COPY --from=build /app/dir ./dir

EXPOSE 3000

CMD ["bun", "dir/app.js"]
