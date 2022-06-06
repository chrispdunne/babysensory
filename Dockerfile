FROM node:lts-alpine3.12

RUN apk update && apk add ffmpeg && rm -rf /var/cache/apk/*

RUN mkdir /app
COPY package.json /app
COPY package-lock.json /app
COPY index.js /app
COPY test /app/test
COPY src /app/src

WORKDIR "/app"

RUN npm install

CMD npm test
