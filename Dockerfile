# -------------- Build stage --------------
FROM node:25-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --silent
COPY . .
RUN npm run build

# -------------- Runtime stage --------------
FROM nginx:alpine
RUN apk add --no-cache gettext
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
COPY public/env.template.js /usr/share/nginx/html/env.template.js
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]