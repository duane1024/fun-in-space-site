// Visit pings: posts a short Telegram message for each human page view.
// Runs as a Cloudflare Pages Function in front of the static site. It never changes
// the response, and any failure is swallowed so the site can't break because of it.
//
// Required Pages environment variables (Settings -> Variables and Secrets, encrypted):
//   TG_BOT_TOKEN  Telegram bot token
//   TG_CHAT_ID    chat to notify (Duane's DM)
// Optional:
//   VISIT_PING_IGNORE_IPS  comma-separated IPs to skip (e.g. your home IP)

const BOT_UA = /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|quora link|pinterest|vkshare|whatsapp|telegrambot|discord|slack|skype|bitly|curl|wget|python|go-http|java\/|okhttp|axios|node-fetch|headless|lighthouse|pingdom|uptime|monitor|scan|ahrefs|semrush|mj12|dotbot|petal|bytespider|gptbot|claude|perplexity|ccbot|chatgpt|amazonbot|applebot|bingpreview|google-inspectiontool|feedfetcher|rss|validator/i;

// Hosting/cloud networks: almost always bots, scanners or link-preview fetchers.
// Cloudflare's own ASN is deliberately NOT listed: iCloud Private Relay and WARP users egress
// through it, so blocking it silently drops real iPhone/Safari visitors.
const DATACENTER_ASN = new Set([
  16509, 14618, 8987, // AWS
  15169, 396982, 19527, // Google / GCP
  8075, 8068, // Microsoft / Azure
  14061, // DigitalOcean
  24940, 213230, // Hetzner
  16276, // OVH
  63949, // Linode/Akamai
  20473, // Vultr
  45102, 37963, // Alibaba
  132203, // Tencent
  31898, // Oracle
  9009, // M247
  212238, // Datacamp
]);

const PAGE_EXT = /\.(html?|pdf)$/i;
const ASSET_EXT = /\.[a-z0-9]{1,5}$/i;

function isPageView(request, url) {
  if (request.method !== 'GET') return false;
  const h = request.headers;
  // Real browsers send Fetch Metadata on a top-level navigation; scanners and scripts almost never do.
  if (h.get('sec-fetch-mode') !== 'navigate' || h.get('sec-fetch-dest') !== 'document') return false;
  // Speculative prefetch/prerender is not a visit.
  if (/prefetch|prerender/i.test((h.get('sec-purpose') || '') + (h.get('purpose') || '') + (h.get('x-moz') || ''))) return false;
  const p = url.pathname;
  if (PAGE_EXT.test(p)) return true;
  if (ASSET_EXT.test(p)) return false; // css/js/img/fonts/php/env/etc.
  return (h.get('accept') || '').includes('text/html');
}

// One ping per visitor per SEEN_HOURS: a cookie remembers the visitor (and any ?r= tags already seen).
const SEEN_COOKIE = 'fis_v';
const SEEN_HOURS = 12;
function seenTags(request) {
  const m = (request.headers.get('cookie') || '').match(new RegExp(`(?:^|;\\s*)${SEEN_COOKIE}=([^;]*)`));
  return m ? decodeURIComponent(m[1]).split('|') : null; // null = never seen
}

function device(ua) {
  const os = /iPhone/.test(ua) ? 'iPhone' : /iPad/.test(ua) ? 'iPad' : /Android/.test(ua) ? 'Android'
    : /Mac OS X/.test(ua) ? 'Mac' : /Windows/.test(ua) ? 'Windows' : /CrOS/.test(ua) ? 'ChromeOS'
    : /Linux/.test(ua) ? 'Linux' : 'Unknown OS';
  const br = /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /Firefox\//.test(ua) ? 'Firefox'
    : /CriOS|Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'other browser';
  // In-app browsers (X, LinkedIn, Instagram...) are a strong hint of where the click came from.
  const app = /Twitter/i.test(ua) ? ' (X app)' : /LinkedInApp/i.test(ua) ? ' (LinkedIn app)'
    : /Instagram/i.test(ua) ? ' (Instagram app)' : /FBAN|FBAV/i.test(ua) ? ' (Facebook app)' : '';
  return app ? `${os}${app}` : `${os} · ${br}`;
}

function referrerLabel(ref, host) {
  if (!ref) return 'direct / app';
  try {
    const r = new URL(ref);
    if (r.hostname === host || r.hostname === 'www.' + host) return null; // internal navigation
    const h = r.hostname.replace(/^www\./, '');
    if (h === 't.co' || h === 'x.com' || h === 'twitter.com') return 'X / Twitter';
    if (h.endsWith('linkedin.com') || h === 'lnkd.in') return 'LinkedIn';
    if (h.startsWith('mail.') || h.includes('outlook') || h.includes('mail.google')) return `email (${h})`;
    return h + (r.pathname && r.pathname !== '/' ? r.pathname.slice(0, 60) : '');
  } catch { return ref.slice(0, 80); }
}

// Best guess at where a visit came from when the browser sends no Referer header
// (most app links, email, Messages, Slack, bookmarks, typed URLs).
function sourceLabel(request, host) {
  const ref = referrerLabel(request.headers.get('referer'), host);
  if (ref !== 'direct / app') return ref;
  const ua = request.headers.get('user-agent') || '';
  const app = /Twitter/i.test(ua) ? 'X app' : /LinkedInApp/i.test(ua) ? 'LinkedIn app'
    : /Instagram/i.test(ua) ? 'Instagram app' : /FBAN|FBAV/i.test(ua) ? 'Facebook app'
    : /Telegram/i.test(ua) ? 'Telegram app' : /GSA\//.test(ua) ? 'Google app'
    : /Line\//.test(ua) ? 'LINE app' : '';
  if (app) return `${app} (in-app browser)`;
  const site = request.headers.get('sec-fetch-site');
  if (site === 'none') return 'no referrer: typed URL, bookmark, or a link opened from an app (email, Messages, Slack, notes…)';
  if (site === 'cross-site') return 'link on another site that hides its referrer';
  return 'unknown (no referrer sent)';
}

function esc(s) {
  return String(s ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}

// Returns why a request would NOT ping, or null if it would.
function skipReason(env, request, url) {
  const ua = request.headers.get('user-agent') || '';
  if (!ua) return 'no user-agent';
  if (BOT_UA.test(ua)) return 'bot/preview user-agent';
  const cf = request.cf || {};
  if (cf.asn && DATACENTER_ASN.has(Number(cf.asn))) return `datacenter network AS${cf.asn}`;
  if (cf.botManagement && cf.botManagement.verifiedBot) return 'verified bot';
  const ip = request.headers.get('cf-connecting-ip') || '';
  const ignore = (env.VISIT_PING_IGNORE_IPS || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (ip && ignore.includes(ip)) return 'ignored IP';
  if (referrerLabel(request.headers.get('referer'), url.hostname) === null) return 'internal navigation';
  const mode = (env.VISIT_PING_MODE || 'all').toLowerCase();
  const tag = visitTag(url);
  if (mode === 'off') return 'pings turned off (VISIT_PING_MODE=off)';
  if (mode === 'tagged' && !tag) return 'untagged visit (VISIT_PING_MODE=tagged)';
  const seen = seenTags(request);
  if (seen && (!tag || seen.includes(tag))) return 'already pinged for this visitor';
  return null;
}

function visitTag(url) {
  const t = url.searchParams.get('r') || url.searchParams.get('ref') || url.searchParams.get('utm_source');
  return t ? t.slice(0, 40).replace(/[|;,\s]/g, '') : '';
}

// GET /__visit-ping : health check. Reports whether the Function is deployed, whether the
// env vars are set and the bot can reach the chat (via getMe/getChat, which send nothing),
// and whether *this* request would have pinged. Never returns the token or chat id.
async function diagnostics(env, request, url) {
  const cf = request.cf || {};
  const out = {
    function: 'visit-ping v3',
    commit: env.CF_PAGES_COMMIT_SHA || null,
    tg_bot_token_set: Boolean(env.TG_BOT_TOKEN),
    tg_chat_id_set: Boolean(env.TG_CHAT_ID),
    bot_ok: null,
    chat_ok: null,
    you: { asn: cf.asn || null, network: cf.asOrganization || null, country: cf.country || null },
    would_ping_reason_skipped: skipReason(env, request, url),
  };
  if (env.TG_BOT_TOKEN) {
    try {
      const me = await (await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/getMe`)).json();
      out.bot_ok = Boolean(me.ok);
      if (me.ok) out.bot = me.result.username;
      if (me.ok && env.TG_CHAT_ID) {
        const ch = await (await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/getChat?chat_id=${encodeURIComponent(env.TG_CHAT_ID)}`)).json();
        out.chat_ok = Boolean(ch.ok);
        if (!ch.ok) out.chat_error = ch.description || 'unknown';
      }
    } catch (e) { out.bot_ok = false; out.error = String(e).slice(0, 120); }
  }
  return new Response(JSON.stringify(out, null, 2), {
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' },
  });
}

async function ping(env, request, url) {
  if (skipReason(env, request, url)) return;
  const ua = request.headers.get('user-agent') || '';
  const cf = request.cf || {};
  const ref = sourceLabel(request, url.hostname);

  // ?r=<tag> marks personalised links (e.g. ?r=amp). Also show utm_source if present.
  const tag = visitTag(url);

  const place = [cf.city, cf.regionCode || cf.region, cf.country].filter(Boolean).join(', ') || 'unknown location';
  const when = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York', weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });

  const lines = [
    tag ? `🔖 <b>${esc(tag)}</b> link opened` : '👀 Site visit',
    `<b>Page:</b> ${esc(url.pathname)}`,
    `<b>From:</b> ${esc(place)}`,
    `<b>Network:</b> ${esc(cf.asOrganization || 'unknown')}${cf.asn ? ` (AS${cf.asn})` : ''}`,
    `<b>Device:</b> ${esc(device(ua))}`,
    `<b>Source:</b> ${esc(ref)}`,
    `<b>When:</b> ${esc(when)} ET`,
  ];

  await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: env.TG_CHAT_ID, text: lines.join('\n'), parse_mode: 'HTML', disable_web_page_preview: true }),
  });
}

export async function onRequest(context) {
  const { request, env } = context;
  try {
    const u = new URL(request.url);
    if (u.pathname === '/__visit-ping') return await diagnostics(env, request, u);
  } catch { /* fall through to the site */ }
  const response = await context.next();
  try {
    const url = new URL(request.url);
    if (env.TG_BOT_TOKEN && env.TG_CHAT_ID && response.status < 400 && isPageView(request, url)
        && !skipReason(env, request, url)) {
      context.waitUntil(ping(env, request, url).catch(() => {}));
      // Remember this visitor so further pages/reloads in the next SEEN_HOURS don't ping again.
      const tags = new Set((seenTags(request) || []).filter(Boolean));
      const tag = visitTag(url);
      if (tag) tags.add(tag);
      const value = encodeURIComponent([...tags].slice(-10).join('|') || '1');
      const out = new Response(response.body, response);
      out.headers.append('set-cookie', `${SEEN_COOKIE}=${value}; Max-Age=${SEEN_HOURS * 3600}; Path=/; Secure; HttpOnly; SameSite=Lax`);
      return out;
    }
  } catch { /* never break the site */ }
  return response;
}
