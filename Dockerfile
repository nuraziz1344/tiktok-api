FROM node:20-alpine

WORKDIR /app
COPY . /app

RUN npm i -g typescript
RUN yarn install
RUN yarn build

CMD ["yarn", "start"]