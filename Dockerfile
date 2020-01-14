FROM node:12.14.1-alpine3.11
ENV NODE_ENV=production

# install dependencies
RUN apk add --no-cache git=2.24.1-r0

# build gitmoji-changelog from source
WORKDIR /usr/src/gitmoji-changelog
COPY . .
RUN yarn --frozen-lockfile && yarn cache clean

# run gitmoji-changelog on container startup
RUN ln -s /usr/src/gitmoji-changelog/node_modules/.bin/gitmoji-changelog /usr/bin
WORKDIR /app
ENTRYPOINT ["gitmoji-changelog"]
USER node
