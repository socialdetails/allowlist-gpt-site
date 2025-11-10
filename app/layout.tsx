export const metadata = { title: 'ThreadForge', description: '1 Click Facebook Text Posts' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body style={{ fontFamily: 'ui-sans-serif, system-ui', background:'#0b1020', color:'#e6e7ee' }}>
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '2rem' }}>
      <header style={{ display:'flex', justifyContent:'space-between', marginBottom:'2rem' }}>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <img src="/logo.svg" width={24} height={24} alt="Logo" />
          <h1 style={{ fontSize: 18, opacity: 0.9, margin: 0 }}>ThreadForge</h1>
        </div>
        <a href="/" style={{ fontSize: 14, opacity: 0.7 }}>Home</a>
      </header> <a href="/fb-text-quote" style={{ fontSize: 14, opacity: 0.7 }}>FB Text Quote</a>
      {children}
    </div>
  </body></html>);
}
