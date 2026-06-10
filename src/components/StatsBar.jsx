import React from 'react';

export default function StatsBar({ stats }) {
  return (
    <div style={styles.wrap}>
      <div style={styles.progressTrack}>
        <div style={{ ...styles.progressBar, width: `${stats.pct}%` }} />
      </div>
      <div style={styles.row}>
        <Stat label="Total"      value={stats.total}     color="#1e293b" bg="#f8fafc" border="#e2e8f0" />
        <Stat label="Trouvés"    value={stats.found}     color="#16a34a" bg="#f0fdf4" border="#bbf7d0" />
        <Stat label="Restants"   value={stats.remaining} color="#ea580c" bg="#fff7ed" border="#fed7aa" />
        <Stat label="Avancement" value={`${stats.pct}%`} color="#2563eb" bg="#eff6ff" border="#bfdbfe" />
      </div>
    </div>
  );
}

function Stat({ label, value, color, bg, border }) {
  return (
    <div style={{ ...styles.stat, background: bg, border: `0.5px solid ${border}` }}>
      <span style={{ ...styles.val, color }}>{value}</span>
      <span style={styles.lbl}>{label}</span>
    </div>
  );
}

const styles = {
  wrap: { background: '#fff', borderBottom: '0.5px solid #e2e8f0', padding: '12px 14px' },
  progressTrack: { height: 5, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden', marginBottom: 12 },
  progressBar: { height: '100%', background: '#2563eb', borderRadius: 4, transition: 'width 0.4s ease' },
  row: { display: 'flex', gap: 8 },
  stat: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, borderRadius: 10, padding: '9px 4px' },
  val: { fontSize: 19, fontWeight: 700, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', letterSpacing: '-0.3px' },
  lbl: { fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' },
};
