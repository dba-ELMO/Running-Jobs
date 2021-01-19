FROM node
RUN mkdir /js && chmod -R 777 /js
COPY js/* /js/
WORKDIR /js
RUN npm install pg
CMD ["node", "/js/server.js"]
