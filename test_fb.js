const https = require('https'); 
const req = https.request('https://blind-ranking-5c5fa-default-rtdb.firebaseio.com/test_write.json', { method: 'PUT' }, res => { 
  let data = ''; 
  res.on('data', c => data += c); 
  res.on('end', () => console.log('STATUS:', res.statusCode, 'DATA:', data)); 
}); 
req.write('"hello"'); 
req.end();
