FROM node:23-alpine

WORKDIR /app

COPY ./dist /app/dist
COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock
COPY ./.env /app/.env
COPY ./prisma /app/prisma

RUN yarn install --production

EXPOSE 3000

CMD ["node", "dist/src/main"]
