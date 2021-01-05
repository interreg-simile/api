FROM node:12.3.1-alpine

LABEL maintainer="Edoardo Pessina <edoardopessina.priv@gmail.com>" \
      name="simile-api" \
      description="A RESTFul API that powers project SIMILE applications." \
      version="1.0.0"

ENV NODE_ENV=production
ENV HTTP_PORT=8000
ENV LOG_LEVEL=debug
ENV UPLOAD_PATH=./uploads
ENV MONGO_URL=mongodb://127.0.0.1:27017/SIMILE
ENV JWT_PK=MIIBVgIBADANBgkqhkiG9w0BAQEFAASCAUAwggE8AgEAAkEA0SBVBHPgigsIentqw8aRXT4kQIsu4BpJ0PyYUuwEdfTYRFGbyjQqgXr3N0rUmHxm11/bg2Dbtd3ayI56o3r10wIDAQABAkEAhy3KJu2seC73lQzQD6r8bfRsRJhzfYMgsgmFgRx1KbUnHfmrHGCTnTzre5jPB/3kuaRPCGzbDpnhZUdOKTKJqQIhAOyjV+9AxPexpM5IZCqReGDAdZuCdATcOGzout/J6HuVAiEA4jy5GpkQQDLAWKhjsj9CKm9asbqGV0Lo5kAG7O3WEccCIQDLi6Uz0w6Z0F/mYDZot0BIWMPQw+Fv3M1cQMOdg1tKEQIgHobJB0C+A5uVfqECCswkVmt+Flsvw1iA6oibJp8U8oMCIQCAiQ1lQ1Se8V5Y4Bsih3VaBV0LDKl19aYgKG75vwdwsg==
ENV OPEN_WEATHER_KEY=825c7680bd38cf7abefefd756f7724ed

WORKDIR /home/node/app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 8080

USER node

CMD ["npm", "start"]
