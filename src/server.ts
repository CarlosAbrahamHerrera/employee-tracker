import express, { Request, Response } from 'express';
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';

await connectToDb();

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Remove the favorite_books queries and add a basic test query to verify connection
pool.query('SELECT NOW()', (err: Error, result: QueryResult) => {
  if (err) {
    console.log('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
  }
});

app.use((_req: Request, res: Response) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});