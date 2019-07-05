FROM node:10.16.0-alpine
ENV NODE_ENV=production

# install dependencies
RUN apk add --no-cache git=2.20.1-r0

# build gitmoji-changelog from source
WORKDIR /usr/src/gitmoji-changelog
COPY . .
RUN yarn --frozen-lockfile && yarn cache clean

# run gitmoji-changelog on container startup
RUN ln -s /usr/src/gitmoji-changelog/node_modules/.bin/gitmoji-changelog /usr/bin
WORKDIR /app
ENTRYPOINT ["gitmoji-changelog"]
