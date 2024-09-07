FROM node:20.17.0-alpine@sha256:9fde95f2c4d8aa5abe327ef69565dd944321ed8541b1df86041b41d63d54c215 as build

ARG VERSION=dev
ENV VITE_APP_VERSION=${VERSION}

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27.1-alpine-slim@sha256:0949d39b39437d09a4414e3cd9f260959513b8d19dbb98356e4523ca6854733a

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
