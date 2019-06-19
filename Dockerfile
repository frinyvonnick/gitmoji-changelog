FROM node:10-alpine

# install dependencies
RUN apk add --no-cache git
ENV NODE_ENV=production

# build gitmoji-changelog from source
COPY . /usr/src/gitmoji-changelog
WORKDIR /usr/src/gitmoji-changelog
RUN yarn --frozen-lockfile && yarn cache clean

# run gitmoji-changelog on container startup
RUN ln -s /usr/src/gitmoji-changelog/node_modules/.bin/gitmoji-changelog /usr/bin
ENTRYPOINT ["gitmoji-changelog"]
