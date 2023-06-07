const fs = require('fs');
const Redis = require('ioredis');

const client = new Redis("redis://default:6603de326e414020a35aee64c592604a@engaging-flamingo-37264.upstash.io:37264");
// upload BSC.json to Upstash
const jsonData = fs.readFileSync('./BSC.json', 'utf-8');
client.set('BSC', jsonData);
console.log('BSC.json uploaded to Upstash');
//get BSC.json from Upstash
const data =  client.get('BSC');
console.log('BSC.json downloaded from Upstash');