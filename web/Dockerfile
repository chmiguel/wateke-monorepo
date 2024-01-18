FROM node:12.16.1 as builder
ARG REACT_APP_BASIC_URL
ENV REACT_APP_BASIC_URL=$REACT_APP_BASIC_URL
WORKDIR /app
ADD . .
RUN yarn install
RUN npm run build

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

FROM  nginx
COPY docker/nginx.conf  /etc/nginx/conf.d/default.conf   
COPY --from=builder /app/build /app
CMD ["/usr/sbin/nginx","-g", "daemon off;"]

