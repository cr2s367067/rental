FROM oven/bun@sha256:e10577f0db68676a7024391c6e5cb4b879ebd17188ab750cf10024a6d700e5c4
WORKDIR /app
COPY package.json bun.lock ./
COPY frontend/package.json frontend/package.json
COPY backend/package.json backend/package.json
RUN --mount=type=cache,target=/root/.bun/install/cache bun install --frozen-lockfile --ignore-scripts --network-concurrency 8
COPY . .
RUN bun run db:generate && bun run --filter backend build
CMD ["bun","backend/dist/Src/main.js"]
