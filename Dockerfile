# syntax=docker/dockerfile:1
FROM node:lts-alpine3.20
ENV NODE_ENV=production

# install dependencies
RUN apk add --no-cache git \
&& git config --global --add safe.directory /app

# build gitmoji-changelog from source
WORKDIR /usr/src/gitmoji-changelog
COPY . .
RUN yarn --frozen-lockfile && yarn cache clean

# run gitmoji-changelog on container startup
RUN ln -s /usr/src/gitmoji-changelog/node_modules/.bin/gitmoji-changelog /usr/bin
WORKDIR /app
ENTRYPOINT ["gitmoji-changelog"]
