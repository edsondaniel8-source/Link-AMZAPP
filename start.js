// Script dev simples
console.log('Starting frontend...');
require('child_process').exec('cd frontend && npm run dev', (err, stdout, stderr) => {
  if (err) console.error(err);
  if (stdout) console.log(stdout);
  if (stderr) console.error(stderr);
});