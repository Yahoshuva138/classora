const { execSync } = require('child_process');

const port = process.env.PORT || 5000;

function killPort(p) {
  try {
    if (process.platform === 'win32') {
      const output = execSync(`netstat -ano | findstr :${p}`, { stdio: ['pipe', 'pipe', 'ignore'] }).toString();
      const lines = output.trim().split('\n');
      const pids = new Set();
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && pid !== '0' && pid !== `${process.pid}`) {
          pids.add(pid);
        }
      }
      if (pids.size === 0) {
        console.log(`[Classora Port Utility] Port ${p} is already free.`);
        return;
      }
      for (const pid of pids) {
        console.log(`[Classora Port Utility] Terminating conflicting process PID ${pid} on port ${p}...`);
        try {
          execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
        } catch {}
      }
      console.log(`✅ [Classora Port Utility] Port ${p} successfully freed!`);
    } else {
      execSync(`lsof -t -i:${p} | xargs kill -9`, { stdio: 'ignore' });
      console.log(`✅ [Classora Port Utility] Port ${p} successfully freed!`);
    }
  } catch (e) {
    console.log(`[Classora Port Utility] Port ${p} is already free.`);
  }
}

killPort(port);
