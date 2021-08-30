FROM node:14-alpine
ARG PKG_VER=${PKG_VER}
ENV NODE_ENV=production
WORKDIR /app
RUN npm install @x-poppy/poppy-server@${PKG_VER}
ENTRYPOINT [ "node", "node_modules/@x-poppy/poppy-server/dist/main.js" ]
EXPOSE 7001
