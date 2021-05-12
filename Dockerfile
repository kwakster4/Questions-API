# syntax=docker/dockerfile:1
FROM node:12-alpine
ENV NODE_ENV = production
RUN mkdir /Questions-Api
COPY . /Questions-Api
WORKDIR /Questions-Api
RUN npm install
EXPOSE 3001
CMD ["node", "server/index.js"]
