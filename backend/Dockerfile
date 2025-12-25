FROM oven/bun:latest AS build

WORKDIR /app

# Copy file chứa dependencies trước để cache hiệu quả
COPY package.json bun.lock ./
RUN bun install

# Copy toàn bộ source
COPY . .

# Build backend
RUN bun run build:bun

# --- Runtime Stage ---
FROM oven/bun:latest

WORKDIR /app

# Copy thư mục build (dir/)
COPY --from=build /app/dist ./dist

EXPOSE 3000
ENV TZ=Asia/Ho_Chi_Minh
CMD ["bun", "dist/app.js"]
