FROM node:14-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY dist .
RUN npm ci --ignore-scripts
ENTRYPOINT [ "node", "./dist/main.js" ]
EXPOSE 7001
