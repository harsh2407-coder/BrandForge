import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from './server/apiRouter.js';

dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

app.use(express.json());

// Controlled Stage Generation Gateway
app.use('/api', apiRouter);

// Serve frontend in production build
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const distPath = path.resolve(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[BrandForge Server] Gateway listening on http://localhost:${PORT}`);
  console.log(`[BrandForge Server] Groq Key: ${process.env.GROQ_API_KEY ? 'Configured' : 'Missing'}`);
});

export default app;
