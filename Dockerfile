FROM node:20.11.1-alpine@sha256:121edf6661770d20483818426b32042da33323b6fd30fc1ad4cd6890a817e240 as build

ARG VERSION=dev
ENV VITE_APP_VERSION=${VERSION}

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.25.4-alpine-slim@sha256:cbbb87ca9417ed5cac0fe5dbbc489b18296721afd20c0b88000e3bea1cae3b4b

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
