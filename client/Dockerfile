# PHASE 1
FROM node:16-alpine as builder
WORKDIR /usr/app
COPY ./package.json ./
RUN npm install
COPY ./ ./
RUN npm run build

# PHASE 2
FROM nginx
EXPOSE 3000
# Here we copy the new default nginx configuration
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/app/build /usr/share/nginx/html