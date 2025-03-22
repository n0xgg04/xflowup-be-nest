FROM oven/bun:1

WORKDIR /usr/src/app

COPY package.json ./

RUN bun install --production

COPY . .

RUN bun build

COPY prisma ./prisma
COPY db ./db
COPY migrations ./migrations
COPY @types ./@types
COPY utils ./utils

RUN bun prisma generate

RUN bun prisma migrate deploy

RUN bun prisma db seed

EXPOSE 3000

CMD ["bun", "dist/main"]
