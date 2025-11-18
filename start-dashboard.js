// Simple dashboard starter
import('./src/dashboard/server.js').then(module => {
  if (module.startDashboard) {
    module.startDashboard();
  }
}).catch(err => {
  console.error('Failed to start dashboard:', err);
  process.exit(1);
});
