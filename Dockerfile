FROM node:12-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY dist .
RUN npm ci --only=production
ENTRYPOINT [ "node", "./main.js" ]
EXPOSE 5001
