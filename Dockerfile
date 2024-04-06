FROM node:20.12.1-alpine@sha256:eca3b795767baded421fb73ef18f2fdb47c87fd3e53d093148cbc8275e03c9fa as build

ARG VERSION=dev
ENV VITE_APP_VERSION=${VERSION}

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.25.4-alpine-slim@sha256:b841779b72c127bdcb6e58b2ae3d810f890e020460858d84c7bd38d15cf26ddf

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
