FROM node:20.10-bullseye-slim AS base

RUN apt-get update && apt-get install -y \
    bash \
    net-tools 

WORKDIR /app

RUN npm install -g --arch=x64 --platform=linux --libc=glibc sharp@0.33.0-rc.2
RUN npm install --force @img/sharp-linux-x64
COPY package.json ./

RUN yarn global add node-gyp
RUN yarn install --frozen-lockfile

ENV PATH /app/node_modules/.bin:$PATH

COPY . .

EXPOSE 1337

CMD ["yarn", "strapi", "develop"]

