export const openApiSpec = {
  openapi: '3.0.3',
  info: { title: 'Closet Craft API', version: '2.0.0', description: 'Personal styling and outfit generation' },
  servers: [{ url: 'http://localhost:4000' }],
  paths: {
    '/api/health': { get: { summary: 'Health', responses: { '200': { description: 'OK' } } } },
    '/api/auth/register': { post: { summary: 'Register', responses: { '201': { description: 'Created' } } } },
    '/api/outfits/generate': { post: { summary: 'Generate outfits', responses: { '200': { description: 'OK' } } } }
  }
};
