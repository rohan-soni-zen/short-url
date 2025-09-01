FROM node:24-slim 

COPY . .

RUN npm ci --omit=dev

EXPOSE 3000

CMD ["npm", "start"]