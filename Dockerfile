FROM node:12-alpine as appbuild
RUN apk update && apk add yarn curl bash python g++ make && rm -rf /var/cache/apk/*
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin
WORKDIR /todo-app
COPY ./package.json .
COPY ./package-lock.json .
RUN npm install
COPY . .
RUN npm run build
RUN npm prune --production
RUN /usr/local/bin/node-prune

FROM node:12-alpine
WORKDIR /todo-app
COPY --from=appbuild /todo-app/dist ./dist
COPY --from=appbuild /todo-app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "./dist/main.js"]
