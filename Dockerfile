FROM node
RUN mkdir /js && chmod -R 777 /js
COPY js/* /js/
CMD ["node", "/js/server.js"]
