FROM node:latest
WORKDIR /app

COPY package.json /app
COPY .. /app
RUN npm install --omit=dev
RUN npm run build
EXPOSE 80
CMD ["npm", "run","start"]
