
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local manually
const envPath = path.resolve(__dirname, '../.env.local');
console.log(`Loading env from: ${envPath}`);

if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes if present
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
  console.log('Loaded .env.local');
} else {
    console.log('.env.local not found');
}

const prisma = new PrismaClient();

async function main() {
  console.log('Attempting to connect to the database...');
  try {
    // Try to query the database to verify connection
    const result = await prisma.$queryRaw`SELECT 1 as result`;
    console.log('Successfully connected to the database!');
    console.log('Connection test result:', result);

    // Check if tables exist by querying information_schema
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('Found tables:', tables);

    // Check for migrations table
    const migrations = await prisma.$queryRaw`
      SELECT * FROM "_prisma_migrations" ORDER BY started_at DESC LIMIT 5
    `;
    console.log('Recent migrations:', migrations);

  } catch (error) {
    console.error('Failed to connect to the database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
