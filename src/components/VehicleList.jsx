import React, { useEffect, useRef, useState } from 'react';
import { getLieuShort } from './LieuSelector';

export default function VehicleList({ vehicles, matches, currentMatch, onMark, onUnmark, search, lieuxCustom, justValidatedId }) {
  const currentMatchRef = useRef(null);

  useEffect(() => {
    if (currentMatch && currentMatchRef.current) {
      currentMatchRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentMatch]);

  if (vehicles.length === 0) {
    return (
      <div style={styles.empty}>
        <div style={{ fontSize: 36 }}>🔍</div>
        <div style={styles.emptyText}>Aucun véhicule à afficher</div>
      </div>
    );
  }

  return (
    <div style={styles.list}>
      {vehicles.map((v) => {
        const isMatch = matches.some((m) => m.id === v.id);
        const isCurrent = currentMatch && currentMatch.id === v.id;
        const query = search.trim().toUpperCase();
        const keys = Object.keys(v.raw);
        const marque = keys[0] ? v.raw[keys[0]] : '';
        const modele = keys[1] ? v.raw[keys[1]] : '';

        return (
          <VehicleCard
            key={v.id}
            v={v}
            isMatch={isMatch}
            isCurrent={isCurrent}
            query={query}
            marque={marque}
            modele={modele}
            onMark={onMark}
            onUnmark={onUnmark}
            lieuxCustom={lieuxCustom}
            justValidatedId={justValidatedId}
            ref={isCurrent ? currentMatchRef : null}
          />
        );
      })}
      <div style={{ height: 80 }} />
    </div>
  );
}

const VehicleCard = React.forwardRef(({ v, isMatch, isCurrent, query, marque, modele, onMark, onUnmark, lieuxCustom, justValidatedId }, ref) => {
  const [confirming, setConfirming] = useState(false);
  const timerRef = useRef(null);
  const isFlashing = justValidatedId === v.id;

  const startConfirm = () => {
    setConfirming(true);
    timerRef.current = setTimeout(() => setConfirming(false), 5000);
  };

  const cancelConfirm = () => { clearTimeout(timerRef.current); setConfirming(false); };
  const confirmUnmark = () => { clearTimeout(timerRef.current); setConfirming(false); onUnmark(v.id); };

  const lieuShort = v.lieu ? getLieuShort(v.lieu, lieuxCustom) : null;

  return (
    <div
      ref={ref}
      style={{
        ...styles.card,
        ...(v.found ? styles.cardFound : {}),
        ...(isCurrent && !v.found ? styles.cardCurrent : {}),
        ...(isMatch && !v.found && !isCurrent ? styles.cardMatch : {}),
        ...(isFlashing ? styles.cardFlash : {}),
      }}
    >
      {/* Main row */}
      <div style={styles.cardRow}>
        {/* Marque */}
        <span style={{ ...styles.marque, ...(v.found ? styles.marqueFound : isCurrent ? styles.marqueCurrent : {}) }}>
          {marque || '—'}
        </span>
        <div style={{ ...styles.sep, background: v.found ? '#bbf7d0' : isCurrent ? '#bfdbfe' : '#e2e8f0' }} />

        {/* Modele */}
        <span style={{ ...styles.modele, color: v.found ? '#16a34a' : isCurrent ? '#2563eb' : '#64748b' }}>
          {modele || '—'}
        </span>
        <div style={{ ...styles.sep, background: v.found ? '#bbf7d0' : isCurrent ? '#bfdbfe' : '#e2e8f0' }} />

        {/* VIN + lieu en dessous */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <VinDisplay vin={v.vin} query={query} isMatch={isMatch && !v.found} isCurrent={isCurrent} found={v.found} />
          {v.found && lieuShort && (
            <div style={styles.lieuBelow}>📍 {v.lieu}</div>
          )}
        </div>

        {/* Boutons */}
        <div style={styles.actions}>
          {v.found ? (
            <>
              <div style={styles.badge}>✓</div>
              <button
                style={{ ...styles.unmarkBtn, background: confirming ? '#fef2f2' : '#fff', borderColor: confirming ? '#fca5a5' : '#bbf7d0', color: confirming ? '#dc2626' : '#94a3b8' }}
                onClick={confirming ? cancelConfirm : startConfirm}
              >↩</button>
            </>
          ) : (
            <button
              style={{ ...styles.markBtn, ...(isCurrent ? styles.markBtnCurrent : {}) }}
              onClick={() => onMark(v.id)}
            >
              {isCurrent ? '✓ Valider' : '✓'}
            </button>
          )}
        </div>
      </div>

      {/* Confirmation */}
      {confirming && (
        <div style={styles.confirmRow}>
          <span style={styles.confirmText}>Annuler la validation ?</span>
          <button style={styles.confirmYes} onClick={confirmUnmark}>Oui</button>
          <button style={styles.confirmNo} onClick={cancelConfirm}>Non</button>
        </div>
      )}
    </div>
  );
});

function VinDisplay({ vin, query, isMatch, isCurrent, found }) {
  const baseColor = found ? '#4ade80' : '#94a3b8';
  const strongColor = found ? '#16a34a' : '#334155';

  if (isCurrent && query && query.length >= 4) {
    const idx = vin.lastIndexOf(query);
    if (idx !== -1) {
      // début gris, 2 avant en orange, 4 derniers grands bleu
      const before = vin.slice(0, -6);
      const orange2 = vin.slice(-6, -4);
      const big4 = vin.slice(-4);
      return (
        <div style={{ fontFamily: 'monospace', display: 'flex', alignItems: 'baseline', gap: 0, flex: 1, minWidth: 0, overflow: 'hidden' }}>
          <span style={{ fontSize: 17, color: '#1d4ed8' }}>{before}</span>
          <span style={{ fontSize: 17, color: '#1d4ed8', fontWeight: 700 }}>{orange2}</span>
          <span style={{ fontSize: 21, fontWeight: 800, color: '#1d4ed8', lineHeight: 1, flexShrink: 0 }}>{big4}</span>
        </div>
      );
    }
  }

  if (!isMatch || !query || query.length < 4) {
    return (
      <div style={{ fontFamily: 'monospace', fontSize: 17, color: baseColor, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {vin.slice(0, -4)}<span style={{ color: strongColor, fontWeight: 700 }}>{vin.slice(-4)}</span>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'monospace', fontSize: 17, color: baseColor, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
      {vin.slice(0, -4)}<span style={{ color: strongColor, fontWeight: 700 }}>{vin.slice(-4)}</span>
    </div>
  );
}

const styles = {
  list: { overflowY: 'auto', flex: 1, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 },
  card: { background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 12, padding: '14px 12px', transition: 'all 0.2s' },
  cardFound: { background: '#f0fdf4', border: '0.5px solid #bbf7d0', opacity: 0.85 },
  cardMatch: { background: '#f8fafc', border: '1px solid #bfdbfe' },
  cardCurrent: { background: '#eff6ff', border: '2px solid #2563eb' },
  cardFlash: { background: '#eff6ff', border: '2px solid #2563eb', boxShadow: '0 0 12px rgba(37,99,235,0.2)' },
  cardRow: { display: 'flex', alignItems: 'center', gap: 0, minWidth: 0 },
  sep: { width: 1, alignSelf: 'stretch', margin: '0 4px', flexShrink: 0 },
  marque: { flexShrink: 0, background: '#dbeafe', color: '#1d4ed8', fontSize: 13, fontWeight: 700, padding: "4px 9px", borderRadius: 6, fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif" },
  marqueFound: { background: '#dcfce7', color: '#16a34a' },
  marqueCurrent: { background: '#2563eb', color: '#fff' },
  modele: { flexShrink: 0, fontSize: 14, fontWeight: 600, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' },
  lieuBadge: { flexShrink: 0, background: '#dcfce7', color: '#16a34a', fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 5, whiteSpace: 'nowrap', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' },
  lieuBelow: { fontSize: 11, color: '#16a34a', fontWeight: 600, marginTop: 3, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' },
  actions: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginLeft: 8, flexShrink: 0 },
  badge: { width: 40, height: 40, borderRadius: '50%', background: '#dcfce7', border: '2px solid #16a34a', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800 },
  unmarkBtn: { width: 40, height: 24, borderRadius: 6, border: '0.5px solid #bbf7d0', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, WebkitAppearance: 'none' },
  markBtn: { minWidth: 40, height: 40, borderRadius: '50%', background: '#f8fafc', border: '1.5px solid #e2e8f0', color: '#94a3b8', fontSize: 16, fontWeight: 700, cursor: 'pointer', WebkitAppearance: 'none', padding: '0 8px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' },
  markBtnCurrent: { background: '#2563eb', border: '2px solid #1d4ed8', color: '#fff', borderRadius: 10, padding: '0 12px', fontSize: 13 },
  confirmRow: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, paddingTop: 8, borderTop: '0.5px solid #bbf7d0' },
  confirmText: { color: '#f59e0b', fontSize: 11, fontWeight: 600, flex: 1, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' },
  confirmYes: { padding: '5px 12px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, color: '#dc2626', fontSize: 11, fontWeight: 700, cursor: 'pointer', WebkitAppearance: 'none', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' },
  confirmNo: { padding: '5px 12px', background: '#f8fafc', border: '0.5px solid #e2e8f0', borderRadius: 8, color: '#94a3b8', fontSize: 11, cursor: 'pointer', WebkitAppearance: 'none', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' },
  empty: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, opacity: 0.4, padding: 40 },
  emptyText: { color: '#64748b', fontSize: 15, fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' },
};
