// src/config/db.js

import pkg from 'pg'; // import modul 'pg'
import dotenv from 'dotenv';

dotenv.config(); // baca file .env

const { Pool } = pkg; // gunakan Pool untuk koneksi efisien

// Buat pool koneksi ke PostgreSQL (Supabase)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Supabase butuh SSL
  },
});

// Tes koneksi
pool
  .connect()
  .then(() => console.log('✅ Database connected successfully'))
  .catch((err) => console.error('❌ Database connection failed:', err.stack));

export default pool;
