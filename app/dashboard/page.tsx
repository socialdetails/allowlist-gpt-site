'use client';
import { useState } from 'react';
export default function Dashboard() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('witty, helpful, concise');
  const [cta, setCta] = useState('Follow for more tips!');
  const [numPosts, setNumPosts] = useState(5);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  async function generate(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setOutput('');
    const res = await fetch('/api/generate', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ topic, tone, cta, numPosts }) });
    const data = await res.json(); setLoading(false);
    setOutput(data?.error ? ('Error: ' + data.error) : (data.text || ''));
  }
  return (<main>
    <div style={{ padding:'1.5rem', background:'#11152B', borderRadius:16 }}>
      <h2 style={{ margin:0, marginBottom:12 }}>🧵 Facebook Text Thread Generator </h2>
      <form onSubmit={generate} style={{ display:'grid', gap:12 }}>
        <label style={{ display:'grid', gap:6 }}><span>Topic</span>
          <input value={topic} onChange={e=>setTopic(e.target.value)} required placeholder="e.g., Ways to be more productive"
            style={{ padding:'12px 14px', borderRadius:12, border:'1px solid #2a335c', background:'#0c1230', color:'#fff' }} /></label>
        <label style={{ display:'grid', gap:6 }}><span>Tone/Style</span>
          <input value={tone} onChange={e=>setTone(e.target.value)}
            style={{ padding:'12px 14px', borderRadius:12, border:'1px solid #2a335c', background:'#0c1230', color:'#fff' }} /></label>
        <label style={{ display:'grid', gap:6 }}><span>Call to Action</span>
          <input value={cta} onChange={e=>setCta(e.target.value)}
            style={{ padding:'12px 14px', borderRadius:12, border:'1px solid #2a335c', background:'#0c1230', color:'#fff' }} /></label>
        <label style={{ display:'grid', gap:6 }}><span>Number of Posts</span>
          <input type="number" min={3} max={12} value={numPosts} onChange={e=>setNumPosts(parseInt(e.target.value||'5'))}
            style={{ padding:'12px 14px', borderRadius:12, border:'1px solid #2a335c', background:'#0c1230', color:'#fff', width:120 }} /></label>
        <button type="submit" disabled={loading} style={{ padding:'12px 16px', borderRadius:12, border:'1px solid #2a335c', background:'#2a3470', color:'#fff', width:200 }}>
          {loading ? 'Generating…' : 'Generate Thread'}
        </button>
      </form>
    </div>
    {output && (<div style={{ padding:'1.5rem', background:'#0e1433', borderRadius:16, marginTop:16, whiteSpace:'pre-wrap' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
  <h3 style={{ marginTop: 0 }}>Result</h3>
  <button
    onClick={async () => {
      try {
        await navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {}
    }}
    style={{
      padding: '8px 12px',
      borderRadius: 10,
      border: '1px solid #243056',
      background: copied ? '#3044A3' : '#2B3B8C',
      color: 'white',
      cursor: 'pointer',
      fontSize: 13
    }}
    aria-label="Copy the generated thread to clipboard"
  >
    {copied ? 'Copied!' : 'Copy Thread'}
  </button>
</div>
      <pre style={{ whiteSpace:'pre-wrap', fontFamily:'ui-monospace, Menlo, monospace' }}>{output}</pre>
    </div>)}
  </main>);
}
