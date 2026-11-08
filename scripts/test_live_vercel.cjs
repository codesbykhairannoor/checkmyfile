const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('=== TESTING LIVE PRODUCTION: https://handlemyfile.com ===\n');

  // Test 1: Root Page & Headers
  try {
    const root = await fetchUrl('https://handlemyfile.com/');
    console.log(`[TEST 1] Root (/) Status: ${root.statusCode}`);
    console.log(`  - Link Header: ${root.headers['link'] || 'NONE'}`);
    console.log(`  - X-Robots-Tag: ${root.headers['x-robots-tag'] || 'NONE'}`);
    console.log(`  - Content-Signal: ${root.headers['content-signal'] || 'NONE'}`);
    console.log(`  - Has #static-seo: ${root.body.includes('id="static-seo"')}`);
    console.log(`  - Cloaking 1px #anti-fouc removed: ${!root.body.includes('id="anti-fouc"') && !root.body.includes('clip: rect(0,0,0,0)')}`);
    console.log(`  - Has Wikidata sameAs: ${root.body.includes('wikidata.org/wiki/Q28853')}`);
    console.log(`  - Fake aggregateRating removed: ${!root.body.includes('"aggregateRating"')}`);
  } catch (err) {
    console.error('[TEST 1] Error:', err.message);
  }

  // Test 2: robots.txt
  try {
    const robots = await fetchUrl('https://handlemyfile.com/robots.txt');
    console.log(`\n[TEST 2] robots.txt Status: ${robots.statusCode}`);
    console.log(`  - Has OAI-SearchBot: ${robots.body.includes('OAI-SearchBot')}`);
    console.log(`  - Has PerplexityBot: ${robots.body.includes('PerplexityBot')}`);
    console.log(`  - Has Claude-Web: ${robots.body.includes('Claude-Web')}`);
    console.log(`  - Has llms.txt reference: ${robots.body.includes('llms.txt')}`);
  } catch (err) {
    console.error('[TEST 2] Error:', err.message);
  }

  // Test 3: llms.txt & llms-id.txt
  try {
    const llmsEn = await fetchUrl('https://handlemyfile.com/llms.txt');
    console.log(`\n[TEST 3a] llms.txt Status: ${llmsEn.statusCode}`);
    console.log(`  - Length: ${llmsEn.body.length} bytes`);
    console.log(`  - Has Direct Q&A: ${llmsEn.body.includes('Direct-Answer Snippets')}`);

    const llmsId = await fetchUrl('https://handlemyfile.com/llms-id.txt');
    console.log(`[TEST 3b] llms-id.txt Status: ${llmsId.statusCode}`);
    console.log(`  - Length: ${llmsId.body.length} bytes`);
    console.log(`  - Has Indonesian Q&A: ${llmsId.body.includes('Tanya Jawab Langsung') || llmsId.body.includes('HandleMyFile')}`);
  } catch (err) {
    console.error('[TEST 3] Error:', err.message);
  }

  // Test 4: agents.json
  try {
    const agents = await fetchUrl('https://handlemyfile.com/.well-known/agents.json');
    console.log(`\n[TEST 4] agents.json Status: ${agents.statusCode}`);
    let json = {};
    try { json = JSON.parse(agents.body); } catch(e){}
    console.log(`  - @type: ${json['@type']}`);
    console.log(`  - isAccessibleForFree: ${json.isAccessibleForFree}`);
    console.log(`  - sameAs Wikidata: ${json.sameAs}`);
  } catch (err) {
    console.error('[TEST 4] Error:', err.message);
  }

  // Test 5: Tool Pages: /pdf-to-word & /id/pdf-ke-word
  try {
    const toolEn = await fetchUrl('https://handlemyfile.com/pdf-to-word');
    console.log(`\n[TEST 5a] /pdf-to-word Status: ${toolEn.statusCode}`);
    console.log(`  - Has Static SEO Content: ${toolEn.body.includes('id="static-seo"')}`);
    console.log(`  - Has Title: ${toolEn.body.includes('<title>')}`);

    const toolId = await fetchUrl('https://handlemyfile.com/id/pdf-ke-word');
    console.log(`[TEST 5b] /id/pdf-ke-word Status: ${toolId.statusCode}`);
    console.log(`  - Has Static SEO Content: ${toolId.body.includes('id="static-seo"')}`);
    console.log(`  - Indonesian Content: ${toolId.body.includes('Konversi PDF ke Word') || toolId.body.includes('Dokumen Word')}`);
  } catch (err) {
    console.error('[TEST 5] Error:', err.message);
  }

  // Test 7: Multilingual Pages (ES, DE, FR, ID, EN)
  const multiUrls = [
    'https://handlemyfile.com/pdf-to-word',
    'https://handlemyfile.com/id/pdf-ke-word',
    'https://handlemyfile.com/es/pdf-a-word',
    'https://handlemyfile.com/de/pdf-zu-word',
    'https://handlemyfile.com/fr/pdf-vers-word'
  ];
  console.log('\n[TEST 7] Multilingual Landing Pages:');
  for (const u of multiUrls) {
    try {
      const res = await fetchUrl(u);
      const titleMatch = res.body.match(/<title>([^<]+)<\/title>/);
      console.log(`  - ${u} -> Status: ${res.statusCode} | Has Static SEO: ${res.body.includes('id="static-seo"')} | Title: ${titleMatch ? titleMatch[1].substring(0, 45) + '...' : 'NO TITLE'}`);
    } catch(err) {
      console.log(`  - ${u} -> Error: ${err.message}`);
    }
  }
}

runTests();
