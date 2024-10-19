FROM node:18
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

RUN npm install
COPY . .
# Expose port 5000 to the host
EXPOSE 5000

# Define environment variables (optional)
ENV PORT=5000
ENV DB_URI=mongodb://mongo:27017/mydatabase

CMD ["node", "server.js"]
