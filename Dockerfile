ARG NODE_IMAGE=node:22-bookworm
ARG RUST_IMAGE=rust:1.96-bookworm
ARG RUNTIME_IMAGE=debian:bookworm-slim

FROM ${NODE_IMAGE} AS web-builder
WORKDIR /app
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY pnpm-lock.yaml ./
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN corepack enable && pnpm install --frozen-lockfile
COPY apps/web apps/web
COPY packages/shared packages/shared
RUN pnpm --filter @liteyuki-shelf/web build

FROM ${RUST_IMAGE} AS api-builder
WORKDIR /app
COPY Cargo.toml ./
COPY Cargo.lock ./
COPY apps/api apps/api
COPY apps/desktop/src-tauri apps/desktop/src-tauri
RUN cargo build --release --locked --manifest-path apps/api/Cargo.toml

FROM ${RUNTIME_IMAGE}
WORKDIR /app
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=api-builder /app/target/release/liteyuki-shelf-api /usr/local/bin/liteyuki-shelf-api
COPY --from=web-builder /app/apps/web/dist /app/apps/web/dist
EXPOSE 8899
ENV HOST=0.0.0.0
ENV PORT=8899
CMD ["/usr/local/bin/liteyuki-shelf-api"]
