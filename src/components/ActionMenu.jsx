import React, { useState } from 'react';
import { exportXLSX, exportCSV } from '../utils/exporter';

export default function ActionMenu({ vehicles, onReset, onFullReset, onNewFile }) {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const doReset = (type) => {
    if (confirm === type) {
      if (type === 'reset') onReset();
      if (type === 'full') onFullReset();
      setConfirm(null); setOpen(false);
    } else { setConfirm(type); }
  };

  return (
    <>
      <button style={styles.fab} onClick={() => setOpen(true)}>⋯</button>
      {open && (
        <div style={styles.overlay} onClick={() => { setOpen(false); setConfirm(null); }}>
          <div style={styles.sheet} onClick={(e) => e.stopPropagation()}>
            <div style={styles.handle} />
            <div style={styles.sheetTitle}>Actions</div>
            <ActionBtn icon="📥" label="Exporter Excel (.xlsx)" color="#16a34a" onClick={() => { exportXLSX(vehicles); setOpen(false); }} />
            <ActionBtn icon="📄" label="Exporter CSV" color="#2563eb" onClick={() => { exportCSV(vehicles); setOpen(false); }} />
            <div style={{ height: 8 }} />
            <ActionBtn icon="📂" label="Importer un nouveau fichier" color="#7c3aed" onClick={() => { onNewFile(); setOpen(false); }} />
            <ActionBtn icon="🔄" label={confirm === 'reset' ? '⚠️ Confirmer la réinitialisation' : 'Réinitialiser les validations'} color={confirm === 'reset' ? '#ea580c' : '#94a3b8'} onClick={() => doReset('reset')} />
            <ActionBtn icon="🗑️" label={confirm === 'full' ? '⚠️ Confirmer la suppression complète' : 'Supprimer toutes les données'} color={confirm === 'full' ? '#dc2626' : '#94a3b8'} onClick={() => doReset('full')} />
            <button style={styles.cancel} onClick={() => { setOpen(false); setConfirm(null); }}>Annuler</button>
          </div>
        </div>
      )}
    </>
  );
}

function ActionBtn({ icon, label, color, onClick }) {
  return (
    <button style={styles.actionBtn} onClick={onClick}>
      <span style={styles.actionIcon}>{icon}</span>
      <span style={{ ...styles.actionLabel, color }}>{label}</span>
    </button>
  );
}

const styles = {
  fab: { position: 'fixed', bottom: 'calc(20px + env(safe-area-inset-bottom))', right: 20, width: 48, height: 48, borderRadius: 24, background: '#2563eb', border: 'none', color: '#fff', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 16px rgba(37,99,235,0.35)', WebkitAppearance: 'none', lineHeight: 1, zIndex: 100 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 200, display: 'flex', alignItems: 'flex-end', backdropFilter: 'blur(2px)' },
  sheet: { background: '#fff', borderRadius: '20px 20px 0 0', width: '100%', padding: '12px 16px', paddingBottom: 'calc(16px + env(safe-area-inset-bottom))', borderTop: '0.5px solid #e2e8f0' },
  handle: { width: 36, height: 4, background: '#e2e8f0', borderRadius: 4, margin: '0 auto 16px' },
  sheetTitle: { color: '#94a3b8', fontSize: 11, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' },
  actionBtn: { display: 'flex', alignItems: 'center', gap: 14, width: '100%', background: 'none', border: 'none', padding: '14px 4px', cursor: 'pointer', borderBottom: '0.5px solid #f1f5f9', WebkitAppearance: 'none' },
  actionIcon: { fontSize: 20, width: 28, textAlign: 'center' },
  actionLabel: { fontSize: 15, fontWeight: 600, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' },
  cancel: { display: 'block', width: '100%', marginTop: 12, padding: '14px', background: '#f8fafc', border: '0.5px solid #e2e8f0', borderRadius: 12, color: '#94a3b8', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', WebkitAppearance: 'none' },
};
