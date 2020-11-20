FROM node:14-alpine

WORKDIR /usr/app

COPY package.json .

RUN yarn install --quiet

COPY . .

ENV NEXT_PUBLIC_ENV production

RUN yarn build

CMD yarn run start
