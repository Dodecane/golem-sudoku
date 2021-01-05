FROM node:15-alpine
COPY ./golem /golem
WORKDIR /golem/entrypoints
RUN npm install
VOLUME /golem/work /golem/output
WORKDIR /