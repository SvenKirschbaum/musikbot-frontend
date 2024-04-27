FROM node:20.12.2-alpine@sha256:e18f74fc454fddd8bf66f5c632dfc78a32d8c2737d1ba4e028ee60cfc6f95a9b as build

ARG VERSION=dev
ENV VITE_APP_VERSION=${VERSION}

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.26.0-alpine-slim@sha256:8545de7d520d684e2683e05447696dcaeab9d9776a9562682f70944966043666

RUN echo -e "\
server_tokens off;\
server {\
    listen       80;\
    location / {\
        root   /usr/share/nginx/html;\
        index  index.html;\
        try_files \$uri /index.html;\
    }\
}\
" > /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

COPY --from=build /build/build ./
