FROM node:10.16.0-alpine

# install dependencies
RUN apk add --no-cache git=2.20.1-r0
ENV NODE_ENV=production

# build gitmoji-changelog from source
WORKDIR /usr/src/gitmoji-changelog
COPY . .
RUN yarn --frozen-lockfile && yarn cache clean

# run gitmoji-changelog on /usr/src/app
ENTRYPOINT ["/usr/src/gitmoji-changelog/node_modules/.bin/gitmoji-changelog"]
