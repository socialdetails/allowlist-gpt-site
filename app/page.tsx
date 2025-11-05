'use client';
import { useState } from 'react';
export default function Page() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle'|'loading'|'error'>('idle');
  const [error, setError] = useState<string>('');
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading'); setError('');
    const res = await fetch('/api/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email }) });
    if (res.ok) {
      const params = new URLSearchParams(window.location.search);
      window.location.href = params.get('from') || '/dashboard';
    } else {
      const data = await res.json().catch(()=>({}));
      setError(data?.error || 'Not allowed'); setStatus('error');
    }
  }
  return (<main>
    <div style={{ padding:'2rem', background:'#121832', borderRadius:16 }}>
      <h2 style={{ margin:0, marginBottom:12 }}>Welcome</h2>
      <p style={{ marginTop:0, opacity:0.75 }}>Enter your email to continue.</p>
      <form onSubmit={onSubmit} style={{ display:'flex', gap:8 }}>
        <input type="email" placeholder="you@example.com" required value={email} onChange={e=>setEmail(e.target.value)}
          style={{ flex:1, padding:'12px 14px', borderRadius:12, border:'1px solid #2a335c', background:'#0c1230', color:'#fff' }} />
        <button type="submit" disabled={status==='loading'} style={{ padding:'12px 16px', borderRadius:12, border:'1px solid #2a335c', background:'#212a5e', color:'#fff' }}>
          {status==='loading' ? 'Checking...' : 'Continue'}
        </button>
      </form>
      {status==='error' && <p style={{ color:'#ffb4b4', marginTop:12 }}>{error}</p>}
    </div>
  </main>);
}
