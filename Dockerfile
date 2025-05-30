FROM oven/bun:1.2

WORKDIR /app

# Copy package manager files and install dependencies
COPY bun.lockb package.json ./
RUN bun install

# Install openssl for Prisma
RUN apt-get update -y && apt-get install -y openssl

# Copy the rest of the app
COPY . .

# Generate Prisma Client (harus setelah schema.prisma dicopy)
RUN bunx prisma generate

EXPOSE 3000

CMD ["bun", "run", "start"]