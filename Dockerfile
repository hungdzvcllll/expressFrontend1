FROM node:lts-alpine AS build

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
FROM caddy
# Create and change to the app directory.
WORKDIR /usr/app
# Copy Caddyfile to the container image.
COPY Caddyfile ./
# Copy local code to the container image.
RUN caddy fmt Caddyfile --overwrite
# Copy files to the container image.
COPY --from=build /usr/app/dist ./dist
# Use Caddy to run/serve the app
CMD ["caddy", "run", "--config", "Caddyfile", "--adapter", "caddyfile"]