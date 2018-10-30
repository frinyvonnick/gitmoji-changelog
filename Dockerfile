FROM node:10-alpine

# install dependencies
RUN apk add --no-cache git
ENV NODE_ENV=production

# build gitmoji-changelog from source
COPY . /usr/src/gitmoji-changelog
WORKDIR /usr/src/gitmoji-changelog
RUN yarn

# run gitmoji-changelog on /usr/src/app
ENTRYPOINT ["/usr/src/gitmoji-changelog/node_modules/.bin/gitmoji-changelog"]
