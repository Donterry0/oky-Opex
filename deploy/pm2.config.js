// PM2 process configuration for running oky-Opex on a Hostinger VPS.
//
// Usage (after `npm ci && npx prisma generate && npx prisma migrate deploy && npm run build`):
//   pm2 start deploy/pm2.config.js
//   pm2 save
//   pm2 startup   # follow the printed instructions to enable start-on-boot
//
// See HOSTINGER_DEPLOYMENT.md for the full deployment walkthrough.
module.exports = {
  apps: [
    {
      name: 'oky-opex',
      script: 'npm',
      args: 'start',
      cwd: __dirname + '/..',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
