FROM node:13.8-alpine as base

WORKDIR /app
RUN yarn global add typescript

COPY package.json ./
COPY yarn.lock ./

RUN yarn

FROM base as prod
WORKDIR /app

COPY . .
RUN yarn build
RUN yarn cache clean

USER node
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "/app/dist/index.js"]


FROM base as test

ENV NODE_ENV=test
WORKDIR /app
COPY . .

CMD ["yarn", "ci:test"]