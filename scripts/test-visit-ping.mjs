// Local test harness for functions/_middleware.js (not deployed: lives outside functions/ and public/).
// Usage: node scripts/test-visit-ping.mjs            -> mocked, prints messages that would be sent
//        REAL=1 TG_BOT_TOKEN=... TG_CHAT_ID=... node scripts/test-visit-ping.mjs  -> sends one real sample
import { onRequest } from '../functions/_middleware.js';

const real = process.env.REAL === '1';
if (real && !process.env.TG_BOT_TOKEN) {
  // Read the bot token from ~/.hermes/.env without printing it.
  const fs = await import('node:fs'); const os = await import('node:os');
  for (const line of fs.readFileSync(os.homedir() + '/.hermes/.env', 'utf8').split('\n')) {
    if (line.startsWith('TELEGRAM_BOT_TOKEN=')) process.env.TG_BOT_TOKEN = line.split('=', 2)[1].trim().replace(/^["']|["']$/g, '');
  }
}
const sent = [];
const realFetch = globalThis.fetch;
if (!real) {
  globalThis.fetch = async (u, init) => { sent.push(JSON.parse(init.body).text); return new Response('{}'); };
}

const env = { TG_BOT_TOKEN: process.env.TG_BOT_TOKEN || 'x', TG_CHAT_ID: process.env.TG_CHAT_ID || '1', VISIT_PING_IGNORE_IPS: '9.9.9.9' };
const iphoneX = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Twitter for iPhone/10.80';
const macChrome = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36';

const cases = [
  { name: 'tagged link from X app', url: 'https://fun-in-space.com/?r=amp', ua: iphoneX, ref: 'https://t.co/abc', cf: { city: 'New York', regionCode: 'NY', country: 'US', asn: 701, asOrganization: 'Verizon Business' }, expect: 1 },
  { name: 'direct visit, desktop', url: 'https://fun-in-space.com/projects/', ua: macChrome, ref: '', cf: { city: 'San Francisco', regionCode: 'CA', country: 'US', asn: 7922, asOrganization: 'Comcast Cable' }, expect: 1 },
  { name: 'PDF download', url: 'https://fun-in-space.com/docs/ncsa_access_10_3_opt.pdf', ua: macChrome, ref: 'https://www.google.com/', cf: { city: 'Boston', country: 'US', asn: 7922, asOrganization: 'Comcast Cable' }, expect: 1 },
  { name: 'internal navigation (skip)', url: 'https://fun-in-space.com/about/', ua: macChrome, ref: 'https://fun-in-space.com/', cf: {}, expect: 0 },
  { name: 'Twitterbot preview (skip)', url: 'https://fun-in-space.com/', ua: 'Twitterbot/1.0', ref: '', cf: {}, expect: 0 },
  { name: 'AWS datacenter (skip)', url: 'https://fun-in-space.com/', ua: macChrome, ref: '', cf: { asn: 16509, asOrganization: 'Amazon.com' }, expect: 0 },
  { name: 'iCloud Private Relay (Cloudflare ASN) pings', url: 'https://fun-in-space.com/?r=test', ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1', ref: '', cf: { city: 'New York', country: 'US', asn: 13335, asOrganization: 'Cloudflare, Inc.' }, expect: 1 },
  { name: 'Telegram Android in-app browser pings', url: 'https://fun-in-space.com/', ua: 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Mobile Safari/537.36 Telegram-Android/11.0', ref: '', cf: { asn: 21928, asOrganization: 'T-Mobile USA' }, expect: 1 },
  { name: 'TelegramBot preview (skip)', url: 'https://fun-in-space.com/', ua: 'TelegramBot (like TwitterBot)', ref: '', cf: {}, expect: 0 },
  { name: 'CSS asset (skip)', url: 'https://fun-in-space.com/_astro/index.css', ua: macChrome, ref: '', cf: {}, accept: 'text/css', expect: 0 },
  { name: 'ignored IP (skip)', url: 'https://fun-in-space.com/', ua: macChrome, ref: '', cf: {}, ip: '9.9.9.9', expect: 0 },
  { name: '404 (skip)', url: 'https://fun-in-space.com/nope/', ua: macChrome, ref: '', cf: {}, status: 404, expect: 0 },
];

let fails = 0;
for (const c of (real ? cases.slice(0, 1) : cases)) {
  const before = sent.length;
  const headers = new Headers({ 'user-agent': c.ua, accept: c.accept || 'text/html,application/xhtml+xml', 'cf-connecting-ip': c.ip || '1.2.3.4' });
  if (c.ref) headers.set('referer', c.ref);
  const request = new Request(c.url, { headers });
  Object.defineProperty(request, 'cf', { value: c.cf });
  const waits = [];
  const res = await onRequest({ request, env, next: async () => new Response('ok', { status: c.status || 200 }), waitUntil: (p) => waits.push(p) });
  await Promise.all(waits);
  if (res.status !== (c.status || 200)) { console.log('FAIL response changed', c.name); fails++; }
  if (!real) {
    const got = sent.length - before;
    const ok = got === c.expect;
    if (!ok) fails++;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${c.name}  (pings: ${got})`);
    if (got) console.log('   ' + sent[sent.length - 1].replace(/\n/g, '\n   '));
  } else {
    console.log('real ping sent for:', c.name);
  }
}
if (!real) {
  // Diagnostics endpoint: returns JSON, sends no message, never leaks the token.
  const before = sent.length;
  globalThis.fetch = async (u) => new Response(JSON.stringify(String(u).includes('getMe') ? { ok: true, result: { username: 'testbot' } } : { ok: true }));
  const request = new Request('https://fun-in-space.com/__visit-ping', { headers: { 'user-agent': macChrome } });
  Object.defineProperty(request, 'cf', { value: { asn: 16509, asOrganization: 'Amazon.com' } });
  const res = await onRequest({ request, env, next: async () => { throw new Error('should not reach site'); }, waitUntil: () => {} });
  const body = await res.text(); const j = JSON.parse(body);
  const ok = j.function && j.tg_bot_token_set && j.bot_ok && j.chat_ok && j.would_ping_reason_skipped === 'datacenter network AS16509' && !body.includes(env.TG_BOT_TOKEN === 'x' ? 'NOPE' : env.TG_BOT_TOKEN) && sent.length === before;
  if (!ok) fails++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  diagnostics endpoint`, ok ? '' : body);
}
globalThis.fetch = realFetch;
console.log(fails ? `${fails} failure(s)` : 'all checks passed');
process.exit(fails ? 1 : 0);
