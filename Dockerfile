# syntax=docker/dockerfile:1
# FROM node:lts-slim (Version: 20.17.0)
FROM node@sha256:9fb20391a0320aed25636d8312f4332f9be734c5acef4c94722048c2bed5a87d AS gitmoji-changelog-base

RUN apt-get update && apt-get install -y git \
&& apt-get clean \
&& rm -rf /var/lib/apt/lists/* \
&& git config --global --add safe.directory /app

# copy gitmoji-changelog into the image
WORKDIR /usr/src/gitmoji-changelog
COPY . .

# install dependencies
RUN yarn install \
&& yarn cache clean

# make gitmoji-changelog availabel as command
WORKDIR /usr/src/gitmoji-changelog/packages/gitmoji-changelog-cli
RUN npm link

WORKDIR /app

ENTRYPOINT ["gitmoji-changelog"]
