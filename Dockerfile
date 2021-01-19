FROM node
RUN mkdir /js && chmod -R 777 /js
COPY js/* /js/
RUN npm install pg
CMD ["node", "/js/server.js"]
