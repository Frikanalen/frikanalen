from node:12-alpine as builder

copy package.json .

RUN "yarn"

from builder as running

copy server.js .

EXPOSE 8081
EXPOSE 8082

CMD ["yarn", "run", "start", "monitoring"]
