FROM node:18

RUN corepack enable

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3100

CMD ["yarn", "start:dev"]