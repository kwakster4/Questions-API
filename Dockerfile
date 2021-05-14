# syntax=docker/dockerfile:1
FROM node:12-alpine
# ENV NODE_ENV = production
WORKDIR ~/
COPY . .
# WORKDIR /Questions-Api
RUN npm ci
ARG hostname
ARG username
ARG password
ENV HOST=${hostname}
ENV USER1=${username}
ENV PWD=${password}
EXPOSE 3001
CMD ["node", "./server/index.js"]
# RUN mkdir /Questions-Api
# COPY . /Questions-Api
# RUN npm install
