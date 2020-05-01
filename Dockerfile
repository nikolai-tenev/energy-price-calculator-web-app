FROM node:current-alpine as build-stage

WORKDIR /app

COPY package.json /app/
COPY package-lock.json /app/

RUN npm install

COPY ./ /app/

RUN npm run build




FROM nginx:alpine

COPY --from=build-stage /app/build/ /usr/share/nginx/html
COPY /nginx.conf /etc/nginx/conf.d/default.conf
