FROM node:latest
WORKDIR /app

COPY package.json /app
COPY .. /app
RUN npm install --omit=dev
RUN npm run build
FROM nginx:stable-alpine AS production-stage
WORKDIR  /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build-stage /app/build
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
