FROM node:14-alpine
LABEL maintainer="Digiluonto"
LABEL service="GraphQL Mesh"

ENV DEBUG=false

COPY package.json /src/package.json
RUN cd /src && yarn install --loglevel error

COPY . /src
WORKDIR /src

EXPOSE 4000

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

CMD /wait && yarn mesh build && yarn mesh start
