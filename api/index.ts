import express from 'express';
import { apiRouter } from '../server/apiRouter.js';

const app = express();

app.use(express.json({ limit: '10mb' }));

// Mount on both /api and / to handle direct and rewritten requests
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;
