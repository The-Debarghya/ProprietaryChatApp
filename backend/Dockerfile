FROM node:lts-slim AS builder

WORKDIR /build

COPY package*.json .
RUN npm i -g typescript
RUN npm i

COPY tsconfig.json .
COPY ./src ./src
RUN mkdir /build/dist

RUN tsc

FROM node:lts-slim AS deps

WORKDIR /deps

COPY package*.json .
RUN npm install --omit=dev


FROM node:lts-alpine AS final

WORKDIR /app
ENV PORT=3000

COPY --from=builder /build/dist/ ./dist
COPY --from=deps /deps/node_modules/ ./node_modules
COPY package*.json .

EXPOSE ${PORT}

RUN adduser -D user --shell /usr/sbin/nologin \
   && chown -R user:user /app

USER user

CMD [ "npm", "run", "start" ]