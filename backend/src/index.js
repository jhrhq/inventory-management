import dotenv from 'dotenv';
import { app } from './app.js';

dotenv.config({ path: './.env' });

app.listen(5000, () => {
  console.log('listening on port ', 5000);
});
