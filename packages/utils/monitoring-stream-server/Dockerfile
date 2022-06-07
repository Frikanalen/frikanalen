from node:16-alpine as builder

copy . .

RUN "yarn"
RUN ["yarn", "build"]

from node:16-alpine as runner

copy package.json .
copy yarn.lock .

copy --from=builder dist .
copy --from=builder node_modules .

EXPOSE 8081
EXPOSE 8082

CMD ["yarn", "run", "start", "monitoring"]
