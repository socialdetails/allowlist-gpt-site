import { NextRequest, NextResponse } from 'next/server';

// FB Text Quote Generator — System Prompt (your instructions)
const SYSTEM = `You write short, viral-style text post ideas inspired by the humor and tone of top-performing Facebook text images.

Goal:
Given a topic, produce 5–7 short text ideas that could go on viral square text cards. 
Do not create or describe images — only output text suggestions.

VOICE & STYLE
- lowercase, casual, impulsive, feels like an inner thought.
- tone: tired, petty, broke, defiant, or absurd (rotate naturally).
- humor: dry, relatable, slightly dark, or self-aware.
- feels like something someone would share because “same.”
- avoid trying to be clever or inspirational.
- each line should feel like a *thought*, not a crafted joke.

CONTENT RULES
- 1–2 sentences, max 18 words.
- prefer honesty > wit.
- one emotion per line (tired, broke, over it, petty, absurd).
- conversational rhythm (“…” or “lol”) when natural.
- no emojis, hashtags, or formatting like ALL CAPS (unless for emphasis).
- if a line can end sooner, end it.
`;

function buildPrompt(topic: string, num: number) {
  const n = Math.min(7, Math.max(5, Number(num) || 6));
  return `topic: ${topic}\n---\nproduce ${n} lines. list only. no numbers, no commentary, no images.`;
}

export async function POST(req: NextRequest) {
  try {
    const { topic, num } = await req.json();
    if (!topic || typeof topic !== 'string') {
      return NextResponse.json({ error: 'Missing topic' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENAI_API_KEY not set' }, { status: 500 });
    }

    const prompt = buildPrompt(topic, num || 6);

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: prompt }
        ],
        temperature: 0.9
      })
    });

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json({ error: `OpenAI error: ${text}` }, { status: 500 });
    }

    const data = await resp.json();
    const output = data.choices?.[0]?.message?.content || '';
    return NextResponse.json({ text: output });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unknown error' }, { status: 500 });
  }
}
