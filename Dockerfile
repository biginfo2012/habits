FROM node:14
WORKDIR /usr/src/app
RUN apt update
RUN apt -y install vim
RUN apt clean
COPY . . 
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]