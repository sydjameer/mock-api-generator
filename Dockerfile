FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN npm install


COPY . .

# Expose port
EXPOSE 3002

# Run the app
CMD ["node", "server.js"]
