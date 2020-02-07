FROM node:10

WORKDIR /home/node/app

COPY package.json .
RUN yarn install --quiet

COPY . .
