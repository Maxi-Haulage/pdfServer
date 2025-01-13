FROM node:22

WORKDIR /

COPY ./src ./src
COPY package*.json ./

RUN npm install 

RUN apt-get install -y wget
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \ 
    && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list
RUN apt-get update && apt-get -y install google-chrome-stable

EXPOSE 3000

CMD [ "node", "./src/index.mjs" ]