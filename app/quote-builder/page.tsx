'use client';
import { useState } from 'react';

export default function QuoteBuilder() {
  const [topic, setTopic] = useState('');
  const [num, setNum] = useState(6); // 5–7 recommended
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOutput('');
   const res = await fetch('/quote-builder/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ topic, num })
});

    const data = await res.json();
    setLoading(false);
    setOutput(data?.text || data?.error || '');
  }

  return (
    <main style={{ maxWidth: 900, margin: '2rem auto' }}>
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E4E6EB',
        borderRadius: 12,
        padding: '1.5rem'
      }}>
        <h2 style={{ margin: 0, marginBottom: 12, color: '#1877F2' }}>
          FB Text Quote — Builder
        </h2>

        <form onSubmit={generate} style={{ display: 'grid', gap: 12 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span>Topic</span>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g., being broke before christmas"
              required
              style={{
                padding: '12px 14px',
                borderRadius: 10,
                border: '1px solid #E4E6EB',
                background: '#FFF',
                color: '#1C1E21'
              }}
            />
          </label>

          <label style={{ display: 'grid', gap: 6, width: 140 }}>
            <span>How many lines?</span>
            <input
              type="number"
              min={5}
              max={7}
              value={num}
              onChange={e => setNum(parseInt(e.target.value || '6'))}
              style={{
                padding: '12px 14px',
                borderRadius: 10,
                border: '1px solid #E4E6EB',
                background: '#FFF',
                color: '#1C1E21'
              }}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 16px',
              borderRadius: 10,
              background: '#1877F2',
              color: '#FFF',
              border: '1px solid #1877F2',
              cursor: 'pointer',
              width: 200
            }}
          >
            {loading ? 'Generating…' : 'Generate'}
          </button>
        </form>
      </div>

      {output && (
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E4E6EB',
          borderRadius: 12,
          padding: '1.5rem',
          marginTop: 16
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Result</h3>
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(output);
                setCopied(true); setTimeout(()=>setCopied(false), 1500);
              }}
              style={{
                padding: '8px 12px',
                borderRadius: 10,
                background: copied ? '#166FE5' : '#1877F2',
                color: '#FFF',
                border: '1px solid #1877F2',
                cursor: 'pointer'
              }}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, marginTop: 12, color: '#1C1E21' }}>
{output}
          </pre>
        </div>
      )}
    </main>
  );
}
