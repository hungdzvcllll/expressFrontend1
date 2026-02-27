FROM node:latest
WORKDIR /app

COPY package.json /app
COPY .. /app
RUN npm install --omit=dev
EXPOSE 5173
CMD ["npm", "run","start"]
