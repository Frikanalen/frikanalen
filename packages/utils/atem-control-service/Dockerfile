FROM node:10-alpine

WORKDIR /home/node/app

COPY package.json .
RUN yarn install --quiet

ENV PORT 80
ENV ATEM_HOST 10.3.2.1
ENV FK_API_URL https://frikanalen.no/api

EXPOSE 80

COPY . .

CMD ["yarn", "start"]
