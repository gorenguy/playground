# Build stage
FROM node:18 AS build

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Serve stage (production)
FROM nginx:alpine AS prod
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

# Development stage
FROM node:18 AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install
# Source code will be mounted from the host, so no COPY . . here
EXPOSE 3000
CMD ["npm", "start"]

