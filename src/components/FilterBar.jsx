import React from 'react';

const FILTERS = [
  { key: 'all',       label: 'Tous' },
  { key: 'remaining', label: 'Restants' },
  { key: 'found',     label: 'Trouvés' },
];

export default function FilterBar({ filter, setFilter }) {
  return (
    <div style={styles.bar}>
      {FILTERS.map((f) => (
        <button
          key={f.key}
          style={{ ...styles.btn, ...(filter === f.key ? styles.active : {}) }}
          onClick={() => setFilter(f.key)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

const styles = {
  bar: { display: 'flex', gap: 6, padding: '6px 14px', background: '#fff', borderBottom: '0.5px solid #e2e8f0', alignItems: 'center' },
  btn: { borderRadius: 20, padding: '5px 14px', background: '#f8fafc', border: '0.5px solid #e2e8f0', color: '#94a3b8', fontSize: 11, fontWeight: 500, cursor: 'pointer', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', WebkitAppearance: 'none', whiteSpace: 'nowrap' },
  active: { background: '#2563eb', border: '0.5px solid #2563eb', color: '#fff', fontWeight: 600 },
};
