# Build stage
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# We need the API key at build time for Vite, but we can pass a dummy one if it's injected later, 
# or we can just let Vite build the code (since we switched to REST, the string is injected at runtime if we used process.env, 
# but Vite replaces import.meta.env at build time. 
# Wait, Vite replaces import.meta.env at build time! 
# Let's adjust the Dockerfile to pass the arg.
ARG VITE_GEMINI_API_KEY
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY
RUN npm run build

# Production stage
FROM nginx:alpine
# Copy the built assets
COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
