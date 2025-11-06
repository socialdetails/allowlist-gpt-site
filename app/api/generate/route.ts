import { NextRequest, NextResponse } from 'next/server';
import { getSessionEmail } from '../../../src/lib/session';

function buildPrompt(topic: string, tone: string, cta: string, numPosts: number) {
  const header = `Create a Facebook thread with ${numPosts} short posts on: "${topic}".`;

  const rules = [
    `Tone/style: ${tone || 'helpful, concise, conversational'}`,
    'Audience: business owners and creators.',
    'The first post should be a bold hook with no number label — make it grab attention.',
    'After that, number the remaining posts starting from 1. (1., 2., 3., etc.).',
    'Each post should be 1–3 short sentences, scannable, and avoid hashtags.',
    'Add exactly one emoji per sentence that fits the meaning or emotion.',
    'End the last post with the CTA.'
  ].join('\n');

  const format = [
    'Return in this format:',
    '[Hook line with no number]',
    '1. ...',
    '2. ...',
    '3. ...',
    '...'
  ].join('\n');

  return `${header}\n\n${rules}\n\nCTA: ${cta}\n\n${format}`;
}
export async function POST(req: NextRequest) {
  const email = getSessionEmail(req);
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { topic, tone, cta, numPosts } = await req.json();
  if (!topic || typeof topic !== 'string') return NextResponse.json({ error: 'Missing topic' }, { status: 400 });
  const n = Math.max(3, Math.min(12, Number(numPosts) || 5));
  const prompt = buildPrompt(topic, String(tone||''), String(cta||''), n);
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'OPENAI_API_KEY not set on server.' }, { status: 500 });
    const system = process.env.CUSTOM_GPT_SYSTEM_PROMPT || 'You are a social media copy assistant. Keep things crisp.';
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method:'POST',
      headers:{ 'Authorization':`Bearer ${apiKey}`, 'Content-Type':'application/json' },
      body: JSON.stringify({ model:'gpt-4o-mini', messages:[{ role:'system', content: system }, { role:'user', content: prompt }], temperature:0.7 })
    });
    if (!resp.ok) return NextResponse.json({ error: `OpenAI error: ${await resp.text()}` }, { status: 500 });
    const data = await resp.json();
    const text = data.choices?.[0]?.message?.content || '';
    return NextResponse.json({ text });
  } catch (e:any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
}
