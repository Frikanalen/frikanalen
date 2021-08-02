FROM node:14-alpine AS builder

WORKDIR /usr/app

COPY package.json .

RUN yarn install --quiet

COPY . .

FROM builder

RUN yarn build

CMD yarn run start
