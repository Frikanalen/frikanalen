FROM node:14-alpine AS builder

WORKDIR /usr/app

COPY package.json .

RUN yarn install --quiet

COPY . .

FROM builder

ENV NEXT_PUBLIC_ENV production

RUN yarn build

CMD yarn run start
