Installation & Usage

```bash
git clone https://github.com/febriantokristiandev/unofficial-nodejs-chatgpt-api.git
cd unofficial-nodejs-chatgpt-api
npm install
npm run start
```

Endpoint

```bash
curl --location 'http://127.0.0.1:3000/send-message' \
--header 'Content-Type: application/json' \
--data '{
  "message": "Hello ChatGPT"
}'
```