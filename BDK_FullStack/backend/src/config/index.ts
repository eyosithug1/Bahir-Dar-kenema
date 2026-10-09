import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'bahir_dar_kenema_dev_secret_key_2026',
  clubName: 'Bahir Dar Kenema Football Club',
  clubNickname: 'The Waves of Tana (የጣና ሞገዶች)',
  stadium: 'Bahir Dar International Stadium (Capacity: 60,000)',
  founded: 1973,
};
