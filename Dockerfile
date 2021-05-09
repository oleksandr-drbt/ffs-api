FROM node:12.18.4-alpine

WORKDIR /app

RUN apk --no-cache add --virtual builds-deps build-base python vips

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000
