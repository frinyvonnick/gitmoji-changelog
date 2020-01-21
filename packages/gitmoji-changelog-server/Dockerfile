FROM node:12-alpine
RUN apk add --no-cache git
WORKDIR /usr/local/app
COPY package.json package-lock.json ./
RUN npm ci
COPY src/ src
CMD ["npm", "start"]
