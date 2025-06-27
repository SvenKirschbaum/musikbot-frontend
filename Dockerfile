FROM node:22.17.0-alpine@sha256:5340cbfc2df14331ab021555fdd9f83f072ce811488e705b0e736b11adeec4bb as build

ARG VERSION=dev
ENV VITE_APP_VERSION=${VERSION}

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.29.0-alpine-slim@sha256:e4e764cb35f666f44dd4e1da4291a5f73bb8bff2a9464ccecd8a05a2b7226ad5

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
