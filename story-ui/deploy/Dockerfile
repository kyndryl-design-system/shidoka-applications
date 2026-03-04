# Story UI Server for deploy previews
# Deploy to Railway/Render/Fly.io with these env vars set in the platform dashboard:
#   OPENAI_BASE_URL        — OpenRouter URL (e.g. https://openrouter.ai/api/v1)
#   OPENAI_API_KEY         — OpenRouter API key
#   OPENAI_MODEL           — e.g. qwen/qwen-2.5-coder-32b-instruct
#   STORY_UI_PRODUCTION    — true (uses in-memory mode, no filesystem writes)
#   STORY_UI_ALLOWED_ORIGINS — Netlify preview URL pattern

FROM node:22-alpine

WORKDIR /app

# Install dependencies first (cacheable layer)
COPY package*.json ./
RUN npm ci --legacy-peer-deps --ignore-scripts

# Copy Story UI config and supporting files
COPY story-ui/story-ui.config.js ./story-ui/
COPY story-ui/docs/ ./story-ui/docs/
COPY story-ui/story-ui-considerations.md ./story-ui/
COPY custom-elements.json .

# Symlink so story-ui package finds config at expected root location
RUN ln -s story-ui/story-ui.config.js story-ui.config.js

EXPOSE 4001

CMD ["npx", "story-ui", "start", "--port", "4001"]
