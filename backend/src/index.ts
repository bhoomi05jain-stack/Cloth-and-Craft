import dotenv from 'dotenv';
import { createApp } from './app';
import { seedDemoUser } from './lib/seedDemo';

dotenv.config();

const app = createApp();
const PORT = Number(process.env.PORT || 4000);

if (process.env.NODE_ENV !== 'test') {
  seedDemoUser().catch(() => undefined);
  app.listen(PORT, () => {
    console.log(`✨ Closet Craft API running on http://localhost:${PORT}`);
    console.log(`📋 Health: http://localhost:${PORT}/api/health`);
    console.log(`📘 Docs: http://localhost:${PORT}/api/docs`);
  });
}

export default app;
