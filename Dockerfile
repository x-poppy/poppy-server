FROM node:14-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY ./dist .
RUN npm ci
ENTRYPOINT [ "node", "./main.js" ]
EXPOSE 7001
