from node:16-alpine as builder

workdir /app

copy . .

RUN "yarn"
RUN ["yarn", "build"]

from node:16-alpine

workdir /app

copy package.json yarn.lock ./

copy --from=builder /app/dist dist
copy --from=builder /app/node_modules node_modules

EXPOSE 8081
EXPOSE 8082

CMD ["yarn", "run", "start", "monitoring"]
