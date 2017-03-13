FROM node:7
MAINTAINER Nick Galloway <blackarctic@icloud.com>

RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get -y install xvfb x11-xkb-utils xfonts-100dpi xfonts-75dpi xfonts-scalable xfonts-cyrillic x11-apps clang libdbus-1-dev libgtk2.0-dev libnotify-dev libgnome-keyring-dev libgconf2-dev libasound2-dev libcap-dev libcups2-dev libxtst-dev libxss1 libnss3-dev gcc-multilib g++-multilib

RUN mkdir -p /usr/app
COPY package.json /usr/app
WORKDIR /usr/app
RUN npm install --production

COPY . /usr/app
WORKDIR /usr/app

CMD ["npm", "run", "start-dev"]