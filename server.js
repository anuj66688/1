import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter, authMiddleware } from './server/routes.js';
import { isSupabaseConfigured } from './server/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Parse JSON request bodies & cookies
app.use(express.json());
app.use(cookieParser());

// Authentication & session middleware
app.use(authMiddleware);

// Mount production API routes under /api
app.use('/api', apiRouter);

// Serve static assets from project root
app.use(express.static(__dirname, {
  extensions: ['html']
}));

// Fallback to index.html for client-side routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`[CodeAtlas] Server online at http://${HOST}:${PORT}`);
  if (isSupabaseConfigured()) {
    console.log('[CodeAtlas] Connected to Supabase PostgreSQL & Auth');
  } else {
    console.log('[CodeAtlas] Running with built-in PostgreSQL schema adapter (awaiting SUPABASE_URL / SUPABASE_ANON_KEY in settings)');
  }
});
