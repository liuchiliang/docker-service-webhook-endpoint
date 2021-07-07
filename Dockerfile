FROM node
EXPOSE 80
COPY /*.js /
CMD [ "node", "index.js" ]
