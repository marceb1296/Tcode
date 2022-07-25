FROM node:18.4.0-alpine3.16
WORKDIR /app

COPY . /app

RUN npm install --production=false --silent
RUN npm i sass --save-dev --silent
RUN npm audit --production


EXPOSE 3000
RUN chown -R node /app
USER node
CMD [ "npm", "start" ]