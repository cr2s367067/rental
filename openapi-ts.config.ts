import { defineConfig } from '@hey-api/openapi-ts';
export default defineConfig({
  input: 'backend/OpenAPI/openapi.yaml',
  output: 'frontend/Generated',
  plugins: ['@hey-api/typescript', '@hey-api/sdk', '@hey-api/client-fetch'],
});
