# -----> Imagem de build
FROM node:latest AS build
RUN apt update && apt install -y --no-install-recommends dumb-init
WORKDIR /usr/src/app
COPY . ./
RUN npm install && (cd ./frontend && npm install)
RUN npm run build && (cd ./frontend && npm run build)




# -----> Imagem de produção
FROM node:18.13.0-bullseye-slim

COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init

# Criar pasta do banco de dados; um volume será montado aqui
RUN mkdir /data && chown node /data && chgrp node /data

ENV NODE_ENV production
USER node
WORKDIR /usr/src/app

# Instalar dependências
COPY --chown=node:node --from=build /usr/src/app/package* /usr/src/app
RUN npm install --production

# Copiar arquivos da aplicação
COPY --chown=node:node --from=build /usr/src/app/build /usr/src/app/build 
COPY --chown=node:node --from=build /usr/src/app/frontend/build /usr/src/app/public 

# A aplicação usa a porta 8000 internamente
EXPOSE 8000

CMD ["dumb-init", "node", "build/index.js"]