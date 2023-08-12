FROM node:20-alpine as base
WORKDIR /app
ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-static /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"] 

COPY package*.json yarn.lock ./
RUN yarn install
COPY . .


CMD ["yarn", "run", "dev"]