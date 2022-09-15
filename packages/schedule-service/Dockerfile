FROM python:3.8-alpine as base

WORKDIR /srv/frikanalen

RUN apk update && apk add postgresql-dev gcc python3-dev musl-dev

FROM base AS dependencies

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

FROM dependencies

COPY . .

CMD ["flask", "run", "-h", "0.0.0.0", "-p", "80"]

EXPOSE 80
