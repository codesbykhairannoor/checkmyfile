const fetch = require('node-fetch');

async function testPost() {
  const texts = ["Hello", "World", "How are you?"];
  const params = new URLSearchParams();
  texts.forEach(t => params.append('q', t));
  
  const res = await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=id&dt=t', {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

testPost();
