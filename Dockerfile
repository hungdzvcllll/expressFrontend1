FROM node:latest as build-stage

# set working directory
RUN mkdir /usr/app
WORKDIR /usr/app
COPY . .
#copy all files from current directory to docker
RUN npm install --omit=dev
RUN npm install -g vite
COPY . .
RUN ls -R /&& echo "done"
RUN sh permission.sh
# install and cache app dependencies

#RUN npm run build 
#=FROM nginx:alpine

# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy static assets from builder stage
COPY --from= /usr/app/** .
RUN build --no-cache nginx
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
