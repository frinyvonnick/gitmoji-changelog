FROM  mhart/alpine-node:11.0.0

# install dependencies
RUN apk add git

# build gitmoji-changelog from source
COPY . /usr/src/gitmoji-changelog
WORKDIR /usr/src/gitmoji-changelog
RUN yarn

# this folder is the target of the host folder that contains git repository
WORKDIR /usr/src/app

# run gitmoji-changelog on /usr/src/app
ENTRYPOINT ["/usr/src/gitmoji-changelog/node_modules/.bin/gitmoji-changelog"]
