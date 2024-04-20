FROM node:20.12.2-alpine@sha256:5cf32127b55467ea639dc805a13c6f51b2facebc5eb11f9c5d49e3059f3c0aa4 as build

ARG VERSION=dev
ENV VITE_APP_VERSION=${VERSION}

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.25.5-alpine-slim@sha256:b27fd01b23890c5f807a00f48b7d636929356f50c1432579ae291752e49465f4

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
