import React, { useState } from 'react';

const LIEUX_DEFAULT = [
  { key: 'Showroom', icon: '🏪', short: 'SR' },
  { key: 'Parking',  icon: '🅿️', short: 'PK' },
  { key: 'Dépôt',   icon: '🏭', short: 'DP' },
  { key: 'Atelier', icon: '🔧', short: 'AT' },
];

const LIEU_COLORS = {
  Showroom: { bg: '#f0fdf4', border: '#bbf7d0', color: '#16a34a', countColor: '#4ade80' },
  Parking:  { bg: '#eff6ff', border: '#bfdbfe', color: '#2563eb', countColor: '#93c5fd' },
  Dépôt:    { bg: '#fefce8', border: '#fde68a', color: '#ca8a04', countColor: '#d97706' },
  Atelier:  { bg: '#fff7ed', border: '#fed7aa', color: '#ea580c', countColor: '#fb923c' },
};

function getLieuColor(key) {
  return LIEU_COLORS[key] || { bg: '#f8fafc', border: '#e2e8f0', color: '#64748b', countColor: '#94a3b8' };
}

export function getLieuShort(key, lieuxCustom = []) {
  const found = LIEUX_DEFAULT.find(l => l.key === key);
  if (found) return found.short;
  return key.slice(0, 2).toUpperCase();
}

export default function LieuSelector({ lieu, setLieu, lieuxCustom, setLieuxCustom, statsByLieu }) {
  const [adding, setAdding] = useState(false);
  const [newLieu, setNewLieu] = useState('');

  const allLieux = [
    ...LIEUX_DEFAULT,
    ...lieuxCustom.map((k) => ({ key: k, icon: '📌', short: k.slice(0, 2).toUpperCase() })),
  ];

  const handleAdd = () => {
    const val = newLieu.trim();
    if (!val) return;
    const exists = allLieux.find((l) => l.key.toLowerCase() === val.toLowerCase());
    if (exists) {
      setLieu(exists.key);
    } else {
      setLieuxCustom((prev) => [...prev, val]);
      setLieu(val);
    }
    setAdding(false);
    setNewLieu('');
  };

  const handleRemove = (key, e) => {
    e.stopPropagation();
    setLieuxCustom((prev) => prev.filter((l) => l !== key));
    if (lieu === key) setLieu('Showroom');
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.label}>📍 Lieu actuel</div>
      <div style={styles.row}>
        {allLieux.map((l) => {
          const isActive = lieu === l.key;
          const count = statsByLieu[l.key] || 0;
          const colors = getLieuColor(l.key);
          const isCustom = lieuxCustom.includes(l.key);

          return (
            <div
              key={l.key}
              style={{
                ...styles.btn,
                background: isActive ? '#2563eb' : count > 0 ? colors.bg : '#fff',
                border: isActive ? '2px solid #1d4ed8' : count > 0 ? `1.5px solid ${colors.border}` : '0.5px solid #e2e8f0',
                position: 'relative',
              }}
              onClick={() => setLieu(l.key)}
            >
              <span style={styles.icon}>{l.icon}</span>
              <span style={{ ...styles.name, color: isActive ? '#fff' : count > 0 ? colors.color : '#64748b', fontWeight: isActive ? 700 : 500 }}>
                {l.key}
              </span>
              <span style={{ ...styles.count, color: isActive ? '#93c5fd' : count > 0 ? colors.countColor : '#cbd5e1' }}>
                {count > 0 ? `${count} trouvés` : '0 trouvés'}
              </span>
              {isCustom && (
                <button style={styles.removeBtn} onClick={(e) => handleRemove(l.key, e)}>✕</button>
              )}
            </div>
          );
        })}

        {adding ? (
          <div style={styles.addingWrap}>
            <input
              autoFocus
              type="text"
              placeholder="Nom…"
              value={newLieu}
              onChange={(e) => setNewLieu(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') { setAdding(false); setNewLieu(''); } }}
              style={styles.input}
              maxLength={20}
            />
            <button style={styles.confirmBtn} onClick={handleAdd}>OK</button>
            <button style={styles.cancelBtn} onClick={() => { setAdding(false); setNewLieu(''); }}>✕</button>
          </div>
        ) : (
          <div style={{ ...styles.btn, border: '1.5px dashed #cbd5e1', background: '#fff', justifyContent: 'center', minWidth: 54 }} onClick={() => setAdding(true)}>
            <span style={{ color: '#94a3b8', fontSize: 18, lineHeight: 1 }}>＋</span>
            <span style={{ color: '#94a3b8', fontSize: 10, whiteSpace: 'nowrap' }}>Ajouter</span>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrap: { background: '#fff', padding: '10px 14px', borderBottom: '0.5px solid #e2e8f0' },
  label: { color: '#94a3b8', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8, fontWeight: 500, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' },
  row: { display: 'flex', gap: 7, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 2 },
  btn: { flexShrink: 0, borderRadius: 12, padding: '7px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, cursor: 'pointer', minWidth: 64, WebkitAppearance: 'none' },
  icon: { fontSize: 14 },
  name: { fontSize: 11, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', whiteSpace: 'nowrap' },
  count: { fontSize: 10, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', whiteSpace: 'nowrap' },
  removeBtn: { position: 'absolute', top: -6, right: -6, width: 16, height: 16, borderRadius: 8, background: '#fee2e2', border: '1px solid #fca5a5', color: '#dc2626', fontSize: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, WebkitAppearance: 'none' },
  addingWrap: { display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 },
  input: { width: 90, background: '#f8fafc', border: '1.5px solid #2563eb', borderRadius: 8, color: '#1e293b', fontSize: 13, padding: '6px 8px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', outline: 'none', WebkitAppearance: 'none' },
  confirmBtn: { padding: '6px 10px', background: '#eff6ff', border: '1.5px solid #2563eb', borderRadius: 8, color: '#2563eb', fontSize: 12, fontWeight: 700, cursor: 'pointer', WebkitAppearance: 'none', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' },
  cancelBtn: { padding: '6px 8px', background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: 8, color: '#dc2626', fontSize: 12, cursor: 'pointer', WebkitAppearance: 'none', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' },
};
