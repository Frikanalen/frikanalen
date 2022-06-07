FROM node:16-alpine AS builder

WORKDIR /usr/app

COPY package.json yarn.lock ./

RUN yarn install --quiet

FROM builder

ENV NODE_ENV production
ENV NEXT_PUBLIC_ENV production

COPY . .

RUN yarn build

USER node

CMD yarn run start
