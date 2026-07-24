const fetch = require('node-fetch');

async function testBulk() {
  const texts = ["Hello", "World", "How are you?", "This is a test", "Rasterize PDF"];
  const combined = texts.join(' ||| ');
  
  const params = new URLSearchParams();
  params.append('q', combined);
  
  const res = await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=id&dt=t', {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  
  const data = await res.json();
  const fullText = data[0].map(x => x[0]).join('');
  console.log(fullText.split(' ||| '));
}

testBulk();
