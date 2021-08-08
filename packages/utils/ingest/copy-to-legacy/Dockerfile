FROM python:3-buster AS builder

WORKDIR /app

COPY requirements.txt .

RUN pip install -r ./requirements.txt

FROM builder

COPY copy-to-legacy .

CMD ["./copy-to-legacy"]
