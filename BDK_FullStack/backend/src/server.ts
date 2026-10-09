import { createApp } from './app.js';
import { config } from './config/index.js';

const app = createApp();

app.listen(config.port, () => {
  console.log(`================================================`);
  console.log(`⚽ ${config.clubName} API Server`);
  console.log(`🌊 ${config.clubNickname}`);
  console.log(`🚀 Server running in ${config.nodeEnv} mode`);
  console.log(`🌐 URL: http://localhost:${config.port}`);
  console.log(`📡 Health: http://localhost:${config.port}/api/v1/health`);
  console.log(`================================================`);
});
