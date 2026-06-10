import React from 'react';

export default function SearchBar({ search, setSearch, searchRef, matchCount, matchIndex, setMatchIndex }) {
  return (
    <div style={styles.wrap}>
      <div style={styles.inputWrap}>
        <input
          ref={searchRef}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          placeholder=""
          value={search}
          onChange={(e) => { setSearch(e.target.value.toUpperCase()); setMatchIndex(0); }}
          style={styles.input}
        />
        {search.length > 0 && (
          <button style={styles.clear} onClick={() => { setSearch(''); setMatchIndex(0); }}>✕</button>
        )}
        <span style={styles.icon}>🔍</span>
      </div>

      {search.trim().length > 0 && search.trim().length < 4 && (
        <div style={styles.hint}>Saisissez au moins 4 caractères</div>
      )}
      {search.trim().length >= 4 && matchCount === 0 && (
        <div style={styles.count}><span style={styles.none}>Aucune correspondance</span></div>
      )}
      {search.trim().length >= 4 && matchCount === 1 && (
        <div style={styles.count}><span style={styles.one}>1 correspondance — appuyez ✓ pour valider</span></div>
      )}
      {search.trim().length >= 4 && matchCount > 1 && (
        <div style={styles.navRow}>
          <button style={styles.navBtn} onClick={() => setMatchIndex((i) => (i - 1 + matchCount) % matchCount)}>◀</button>
          <span style={styles.navText}>{matchIndex + 1} / {matchCount} correspondances</span>
          <button style={styles.navBtn} onClick={() => setMatchIndex((i) => (i + 1) % matchCount)}>▶</button>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap: { padding: '10px 14px 8px', background: '#fff', borderBottom: '0.5px solid #e2e8f0' },
  inputWrap: { display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: 12, padding: '0 14px', gap: 8, border: '0.5px solid #e2e8f0' },
  input: { flex: 1, background: 'none', border: 'none', outline: 'none', color: '#1e293b', fontSize: 18, fontWeight: 600, padding: '12px 0', fontFamily: '"SF Mono", "Courier New", monospace', letterSpacing: '1px', caretColor: '#2563eb', WebkitAppearance: 'none' },
  clear: { background: 'none', border: 'none', color: '#94a3b8', fontSize: 14, cursor: 'pointer', padding: '4px 0', WebkitAppearance: 'none' },
  icon: { fontSize: 16, opacity: 0.6, flexShrink: 0 },
  hint: { color: '#94a3b8', fontSize: 12, marginTop: 6, paddingLeft: 4, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' },
  count: { marginTop: 6, paddingLeft: 4, fontSize: 13, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' },
  none: { color: '#dc2626' },
  one: { color: '#16a34a', fontWeight: 700 },
  navRow: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 },
  navBtn: { width: 36, height: 32, borderRadius: 8, background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', fontSize: 14, fontWeight: 700, cursor: 'pointer', WebkitAppearance: 'none' },
  navText: { flex: 1, textAlign: 'center', color: '#ea580c', fontSize: 13, fontWeight: 600, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' },
};
