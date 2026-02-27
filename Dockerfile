FROM node:22 as build-stage

# set working directory
RUN mkdir /usr/app
WORKDIR /usr/app
#copy all files from current directory to docker
COPY . /usr/app
WORKDIR /usr/app
CMD ["permission.sh"]
# install and cache app dependencies
RUN npm install --omit=dev
#RUN npm run build
CMD ["npm","start"]
# add `/usr/src/app/node_modules/.bin` to $PATH

#RUN npm run build

# Stage 2
# Copy the react app build above in nginx
#FROM nginx:alpine

# Set working directory to nginx asset directory
#WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
#RUN rm -rf ./*

# Copy static assets from builder stage
#COPY --from=build-stage /usr/app/dist .
#RUN build --no-cache nginx
# Containers run nginx with global directives and daemon off
#ENTRYPOINT ["nginx", "-g", "daemon off;"]