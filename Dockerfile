FROM node:current-alpine3.12 as appbuild
WORKDIR /todo-app
COPY ./package.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:current-alpine3.12
WORKDIR /todo-app
COPY --from=appbuild /todo-app/dist ./dist
COPY ./package.json .
RUN npm install
EXPOSE 3000
CMD ["node", "./dist/main.js"]
