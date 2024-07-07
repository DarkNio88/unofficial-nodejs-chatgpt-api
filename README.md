# ChatGPT Message Sender

A simple Node.js application using Express and Puppeteer to automate sending messages to a web page and retrieving responses. This application allows you to send messages to a web page, such as a ChatGPT interface, and get the response programmatically.

## Features

- **Send Messages**: Post messages to a specified URL and receive responses.
- **Close Browser**: Send a special command to close the browser session.
- **Stealth Mode**: Uses Puppeteer's stealth plugin to avoid detection.

## Requirements

- Node.js (>= 14.x)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/chatgpt-message-sender.git
   ```
2. Navigate to the project directory:
   ```bash 
   cd chatgpt-message-sender
   ```
3. Install dependencies:
    ```bash
    npm install
    ```

## Usage

1. Start the server:
   ```bash
   npm run start
   ```
   The server will start and listen on port 3000 (or any other port specified in the PORT environment variable).

2. Send a POST request to `/send-message` with a JSON body containing the message parameter. You can use tools like Postman or curl for testing.
   
   Example `curl` command:

   ```bash
    curl -X POST http://localhost:3000/send-message -H "Content-Type: application/json" -d '{"message": "Hello, ChatGPT!"}'
   ```
  Special Command: Sending the message /bye will close the browser session.

## Example
Here is an example of a successful request and response:


Request:

```json
POST http://localhost:3000/send-message
Content-Type: application/json

{
  "message": "How are you?"
}
```

Response:
```json
{
  "text": "I am doing great, thank you!"
}
```

