# Buddy Backend

Proxy server for the Buddy frontend. It keeps the Windsurf token on the server
and forwards OpenAI-compatible chat requests to Codeium/Windsurf.

## Local run

```bash
npm install
copy .env.example .env
npm start
```

Set `WINDSURF_TOKEN` in `.env` before starting.

## Railway variables

Required:

```text
WINDSURF_TOKEN=your_windsurf_token_here
```

Optional:

```text
ALLOWED_ORIGIN=https://your-vercel-app.vercel.app
CODEIUM_API_URL=https://api.codeium.com/chat/completions
```

## Endpoint

```text
POST /v1/chat/completions
```

The frontend should call:

```text
https://your-railway-url.up.railway.app/v1/chat/completions
```
