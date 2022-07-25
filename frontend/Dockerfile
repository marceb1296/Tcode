FROM node:18.4.0-alpine3.16
WORKDIR /app

COPY . /app

RUN npm install --production=false
RUN npm i sass --save-dev
RUN npm audit --production


EXPOSE 3000
RUN chown -R node /app
USER node
CMD [ "npm", "start" ]