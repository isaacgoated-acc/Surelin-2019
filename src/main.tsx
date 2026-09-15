import React from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import './style.css';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = url && key ? createClient(url, key) : null;

function App() {
  const [games, setGames] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    async function load() {
      if (!supabase) { setError('Supabase environment variables are not configured.'); setLoading(false); return; }
      const { data, error } = await supabase.from('games').select('id,name,description,creator_id,created_at').eq('is_public', true).order('created_at', { ascending: false });
      if (error) setError(error.message); else setGames(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  return <div className="app">
    <header className="topbar"><div className="brand">Surelin</div><nav><a>Home</a><a>Games</a><a>Avatar</a><a>Community</a></nav><button>Sign Up</button></header>
    <main>
      <section className="hero"><h1>Play. Create. Connect.</h1><p>Discover games made by the Surelin community.</p><div><button className="primary">Explore Games</button><button className="secondary">Create</button></div></section>
      <section><div className="section-head"><h2>Discover</h2><span>{games.length} public games</span></div>
        {loading && <p className="muted">Loading real games...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && games.length === 0 && <div className="empty">No public games yet.</div>}
        <div className="grid">{games.map(game => <article className="card" key={game.id}><div className="thumb"></div><h3>{game.name}</h3><p>{game.description || 'No description.'}</p></article>)}</div>
      </section>
    </main>
    <footer>Surelin • An original game platform</footer>
  </div>;
}

createRoot(document.getElementById('root')!).render(<App />);