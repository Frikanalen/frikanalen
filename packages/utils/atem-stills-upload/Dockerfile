FROM node:10-alpine

WORKDIR /home/node/app

COPY package.json .
RUN yarn install --quiet

ENV PORT 80
ENV ATEM_HOST 10.3.2.1

EXPOSE 80

COPY . .

CMD ["yarn", "start"]
