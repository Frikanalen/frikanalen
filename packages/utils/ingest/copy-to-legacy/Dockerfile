FROM python:3-buster

WORKDIR /app

COPY requirements.txt .

RUN pip install -r ./requirements.txt

COPY ./ ./

CMD ["./copy-to-legacy"]
