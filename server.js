import express from 'express';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './config/connection.js';
import routes from './routes/index.js';




const __filename = fileURLToPath(import.meta.url); // fileURLToPath() converts a file URL to a file path
const __dirname = path.dirname(__filename); // path.dirname() returns the directory name of a path

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true })); // express.urlencoded() parses incoming request bodies with URL-encoded payloads
app.use(express.json()); // express.json() parses incoming request bodies with JSON payloads

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});