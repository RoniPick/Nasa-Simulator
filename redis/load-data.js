import { promises as fs } from 'fs';
import Redis from "ioredis"


const client = new Redis("redis://default:6603de326e414020a35aee64c592604a@engaging-flamingo-37264.upstash.io:37264");
// upload BSC.json to Upstash
const data = await fs.readFile('./BSC.json', 'utf8');
const jsonData = JSON.parse(data);

await client.set('BSC', JSON.stringify(jsonData));
console.log('BSC.json uploaded to Upstash');
// get BSC.json from Upstash
const BSC = await client.get('BSC');
console.log('BSC.json downloaded from Upstash');