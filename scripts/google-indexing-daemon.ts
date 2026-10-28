import { runGoogleIndexing } from './submit-google-indexing';

function getMillisecondsUntilNextRun(): number {
  const now = new Date();
  const next = new Date(now);
  // Schedule for 01:00 AM next day
  next.setDate(next.getDate() + 1);
  next.setHours(1, 0, 0, 0);
  return next.getTime() - now.getTime();
}

async function startDaemon() {
  if (process.env.FORCE_GOOGLE_INDEXING !== 'true') {
    console.log('🛑 [SAFETY GUARD] Google Indexing Daily Daemon is DISABLED.');
    console.log('   Reason: Google Indexing API is strictly reserved for JobPosting and BroadcastEvent schemas.');
    console.log('   Pinging 200 regular web URLs daily triggers spam/crawl penalties from Google WRS.');
    console.log('   Set FORCE_GOOGLE_INDEXING=true if you explicitly wish to override.');
    process.exit(0);
  }

  console.log('🤖 Google Indexing Daily Daemon Started.');
  console.log('⚡ Running initial cycle immediately...');

  await runGoogleIndexing();

  const loop = async () => {
    const delay = getMillisecondsUntilNextRun();
    const hours = (delay / (1000 * 3600)).toFixed(2);
    console.log(`\n⏳ Next indexing run scheduled in ${hours} hours... (Daemon is sleeping)`);

    setTimeout(async () => {
      console.log(`\n[${new Date().toISOString()}] 🚀 Triggering scheduled daily Google Indexing run...`);
      try {
        await runGoogleIndexing();
      } catch (err) {
        console.error('Daemon run error:', err);
      }
      loop();
    }, delay);
  };

  loop();
}

startDaemon();
