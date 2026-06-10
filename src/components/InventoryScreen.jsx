import React from 'react';
import StatsBar from './StatsBar';
import SearchBar from './SearchBar';
import FilterBar from './FilterBar';
import VehicleList from './VehicleList';
import ActionMenu from './ActionMenu';
import LieuSelector from './LieuSelector';

export default function InventoryScreen({
  vehicles, filteredVehicles, vinColumn, concessionnaire,
  search, setSearch, filter, setFilter,
  lieu, setLieu, lieuxCustom, setLieuxCustom,
  matchIndex, setMatchIndex, currentMatch,
  stats, statsByLieu, matches, searchRef,
  markFound, unmarkFound, resetInventory, fullReset, onNewFile, justValidatedId,
}) {
  return (
    <div style={styles.screen}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logoBox}>
          <span style={{ fontSize: 18 }}>🍸</span>
          <span style={{ fontSize: 9, color: '#c8922a', position: 'absolute', top: 1, right: 2 }}>⭐</span>
        </div>
        <div style={styles.headerText}>
          <span style={styles.appName}>YNK IP</span>
          {concessionnaire && (
            <>
              <span style={styles.dot}>·</span>
              <span style={styles.concession} numberOfLines={1}>{concessionnaire}</span>
            </>
          )}
        </div>
        <div style={{ flex: 1 }} />
      </div>

      <StatsBar stats={stats} />
      <LieuSelector lieu={lieu} setLieu={setLieu} lieuxCustom={lieuxCustom} setLieuxCustom={setLieuxCustom} statsByLieu={statsByLieu} />
      <SearchBar search={search} setSearch={setSearch} searchRef={searchRef} matchCount={matches.length} matchIndex={matchIndex} setMatchIndex={setMatchIndex} />
      <FilterBar filter={filter} setFilter={setFilter} />

      <div style={styles.listWrap}>
        <VehicleList
          vehicles={filteredVehicles}
          matches={matches}
          currentMatch={currentMatch}
          onMark={markFound}
          onUnmark={unmarkFound}
          search={search}
          vinColumn={vinColumn}
          lieuxCustom={lieuxCustom}
          justValidatedId={justValidatedId}
        />
      </div>

      <ActionMenu vehicles={vehicles} onReset={resetInventory} onFullReset={fullReset} onNewFile={onNewFile} />
    </div>
  );
}

const styles = {
  screen: { height: '100dvh', display: 'flex', flexDirection: 'column', background: '#f8fafc', overflow: 'hidden' },
  header: { background: '#fff', borderBottom: '0.5px solid #e2e8f0', padding: '10px 14px', paddingTop: 'max(env(safe-area-inset-top), 10px)', display: 'flex', alignItems: 'center', gap: 10 },
  logoBox: { width: 32, height: 32, borderRadius: 8, background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', overflow: 'hidden' },
  headerText: { display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden', flex: 1 },
  appName: { fontSize: 15, fontWeight: 800, color: '#1e293b', whiteSpace: 'nowrap', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' },
  dot: { color: '#cbd5e1', fontSize: 12, flexShrink: 0 },
  concession: { fontSize: 11, fontWeight: 500, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' },
  listWrap: { flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' },
};
