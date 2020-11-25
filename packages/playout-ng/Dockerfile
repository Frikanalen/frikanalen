########
# Python dependencies builder
#
# Full official Debian-based Python image
FROM python:3-buster AS builder

# Always set a working directory
WORKDIR /app
# Sets utf-8 encoding for Python et al
ENV LANG=C.UTF-8
# Turns off writing .pyc files; superfluous on an ephemeral container.
ENV PYTHONDONTWRITEBYTECODE=1
# Seems to speed things up
ENV PYTHONUNBUFFERED=1

# Ensures that the python and pip executables used
# in the image will be those from our virtualenv.
ENV PATH="/venv/bin:$PATH"

# Setup the virtualenv
RUN python -m venv /venv
# or "virtualenv /venv" for Python 2

# Install Python deps
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

########
# django app container
#
# Smaller official Debian-based Python image
FROM python:3-slim-buster

# Extra python env
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PIP_DISABLE_PIP_VERSION_CHECK=1
ENV PATH="/venv/bin:$PATH"

WORKDIR /app

CMD ["./playout"]

# copy in Python environment
COPY --from=builder /venv /venv

# copy in the rest of the app
COPY ./ ./
