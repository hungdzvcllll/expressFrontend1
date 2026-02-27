FROM node:latest
WORKDIR /app

COPY package.json /app
COPY .. /app
RUN npm install --omit=dev
RUN npm run build
FROM nginx:stable-alpine AS production
COPY /app/build  /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
