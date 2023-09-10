FROM node:18-alpine

# Create application working directory
WORKDIR /home/node/app

# Install dependencies
COPY package.json /home/node/app/
RUN npm install
RUN npm audit fix

# Copy bundle resources to application directory
COPY . /home/node/app

# Build 'dist' folder
RUN npm run build

# Expose application port
EXPOSE 4000

# Start application
CMD ["npm", "run", "start:prod"]
