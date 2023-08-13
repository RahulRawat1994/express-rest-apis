FROM node:alpine

WORKDIR /app

COPY . .

RUN yarn install --production 

CMD ["node", "src/index.js"]

EXPOSE 8080