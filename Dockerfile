FROM node:latest as build-stage

# set working directory
RUN mkdir /usr/app
WORKDIR /usr/app
#copy all files from current directory to docker
COPY . .
RUN sh permission.sh
# install and cache app dependencies
RUN npm install --omit=dev
#RUN npm run build 

CMD ["npm","start"]
