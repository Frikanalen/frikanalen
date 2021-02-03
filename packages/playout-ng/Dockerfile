# This used to be a staged build, but it was more trouble than it was worth,
# with builds missing requirements seemingly at random. Since this is such
# a mission-critical component, and updates are relatively infrequent, I've
# decided to incur the penalty of building from scratch every time.
FROM python:3-buster

COPY requirements.txt .

RUN pip install -r ./requirements.txt

# copy in the rest of the app
COPY ./ ./

CMD ["./playout"]
