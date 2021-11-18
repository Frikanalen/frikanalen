from node:16-alpine as builder

copy package.json .
copy yarn.lock .

RUN "yarn"

from builder as running

copy server.js .

EXPOSE 8081
EXPOSE 8082

CMD ["yarn", "run", "start", "monitoring"]
