<script>
  import { onDestroy } from 'svelte'

  const CONFIGS = {
    beginner:     { rows: 9,  cols: 9,  mines: 10 },
    intermediate: { rows: 16, cols: 16, mines: 40 },
    expert:       { rows: 16, cols: 30, mines: 99 },
  }

  const NUM_COLORS = ['', '#2563eb', '#16a34a', '#dc2626', '#1d4ed8', '#991b1b', '#0891b2', '#374151', '#9ca3af']

  let difficulty = $state('beginner')
  let board     = $state([])
  let status    = $state('idle') // idle | playing | won | lost
  let minesLeft = $state(10)
  let elapsed   = $state(0)

  let firstClick = true
  let timerId    = null

  const face = $derived(status === 'won' ? '😎' : status === 'lost' ? '😵' : '🙂')

  function cfg() { return CONFIGS[difficulty] }

  function reset() {
    clearInterval(timerId)
    timerId = null
    firstClick = true
    const { rows, cols, mines } = cfg()
    board = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({
        mine: false, revealed: false, flagged: false, adjacent: 0,
      }))
    )
    minesLeft = mines
    status    = 'idle'
    elapsed   = 0
  }

  function placeMines(safeR, safeC) {
    const { rows, cols, mines } = cfg()
    let placed = 0
    while (placed < mines) {
      const r = Math.floor(Math.random() * rows)
      const c = Math.floor(Math.random() * cols)
      if (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) continue
      if (board[r][c].mine) continue
      board[r][c].mine = true
      placed++
    }
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c].mine) continue
        let n = 0
        for (let dr = -1; dr <= 1; dr++)
          for (let dc = -1; dc <= 1; dc++) {
            if (!dr && !dc) continue
            const nr = r + dr, nc = c + dc
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].mine) n++
          }
        board[r][c].adjacent = n
      }
    }
  }

  function doReveal(r, c) {
    if (status === 'won' || status === 'lost') return
    const cell = board[r][c]
    if (cell.revealed || cell.flagged) return

    if (firstClick) {
      firstClick = false
      placeMines(r, c)
      status  = 'playing'
      timerId = setInterval(() => elapsed++, 1000)
    }

    cell.revealed = true

    if (cell.mine) {
      status = 'lost'
      clearInterval(timerId)
      for (const row of board) for (const cl of row) if (cl.mine) cl.revealed = true
      return
    }

    if (cell.adjacent === 0) flood(r, c)
    checkWin()
  }

  function flood(startR, startC) {
    const { rows, cols } = cfg()
    const queue = [[startR, startC]]
    const seen  = new Set([`${startR},${startC}`])
    while (queue.length) {
      const [cr, cc] = queue.shift()
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (!dr && !dc) continue
          const nr = cr + dr, nc = cc + dc
          const key = `${nr},${nc}`
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue
          if (seen.has(key)) continue
          seen.add(key)
          const nb = board[nr][nc]
          if (nb.revealed || nb.flagged || nb.mine) continue
          nb.revealed = true
          if (nb.adjacent === 0) queue.push([nr, nc])
        }
      }
    }
  }

  function doFlag(r, c) {
    if (status === 'won' || status === 'lost') return
    const cell = board[r][c]
    if (cell.revealed) return
    cell.flagged  = !cell.flagged
    minesLeft    += cell.flagged ? -1 : 1
  }

  function handleRightClick(e, r, c) {
    e.preventDefault()
    doFlag(r, c)
  }

  function checkWin() {
    if (board.every(row => row.every(cell => cell.mine || cell.revealed))) {
      status = 'won'
      clearInterval(timerId)
    }
  }

  function pad(n, len = 3) {
    return String(Math.min(Math.max(n, -99), 999)).padStart(len, '0')
  }

  reset()
  onDestroy(() => clearInterval(timerId))
</script>

<div class="wrap">
  <!-- Difficulty -->
  <div class="difficulty-bar">
    {#each Object.keys(CONFIGS) as d}
      <button
        class="diff-btn"
        class:active={difficulty === d}
        onclick={() => { difficulty = d; reset() }}
      >{d[0].toUpperCase() + d.slice(1)}</button>
    {/each}
  </div>

  <div class="frame">
    <!-- Status bar -->
    <div class="status-bar">
      <span class="counter">{pad(minesLeft)}</span>
      <button class="face-btn" onclick={reset} aria-label="New game">{face}</button>
      <span class="counter">{pad(elapsed)}</span>
    </div>

    <!-- Board -->
    <div class="board-scroll">
    <div
      class="board"
      style="--cols: {cfg().cols}; --cell: {difficulty === 'expert' ? 28 : 32}px"
      oncontextmenu={e => e.preventDefault()}
    >
      {#each board as row, r}
        {#each row as cell, c}
          <button
            class="cell"
            class:revealed={cell.revealed}
            class:boom={cell.revealed && cell.mine}
            onclick={() => doReveal(r, c)}
            oncontextmenu={e => handleRightClick(e, r, c)}
            aria-label={cell.flagged ? 'Flagged' : cell.revealed ? (cell.mine ? 'Mine' : String(cell.adjacent)) : 'Hidden'}
          >
            {#if !cell.revealed && cell.flagged}
              🚩
            {:else if cell.revealed && cell.mine}
              💣
            {:else if cell.revealed && cell.adjacent > 0}
              <span style="color:{NUM_COLORS[cell.adjacent]}">{cell.adjacent}</span>
            {/if}
          </button>
        {/each}
      {/each}
    </div>
  </div>
  </div>

  <!-- Result -->
  {#if status === 'won'}
    <p class="result win">You cleared the board! 🎉</p>
  {:else if status === 'lost'}
    <p class="result loss">Boom! Click {face} to try again.</p>
  {/if}
</div>

<style>
  .wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  /* ── Difficulty ── */
  .difficulty-bar {
    display: flex;
    gap: 0.5rem;
  }

  .diff-btn {
    font-family: var(--font-display);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    padding: 0.35rem 1rem;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--bg-secondary);
    color: var(--text-muted);
    cursor: pointer;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }

  .diff-btn:hover,
  .diff-btn.active {
    background: var(--accent);
    color: #fff;
    border-color: var(--accent);
  }

  /* ── Frame ── */
  .frame {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem 1rem 1.25rem;
    background: var(--bg-secondary);
    border: 2px solid var(--border);
    border-radius: 8px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.06);
  }

  /* ── Status bar ── */
  .status-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
  }

  .counter {
    font-family: 'Courier New', monospace;
    font-size: 1.625rem;
    font-weight: 700;
    color: var(--accent);
    letter-spacing: 0.08em;
    min-width: 3ch;
    text-align: center;
  }

  .face-btn {
    font-size: 1.625rem;
    background: var(--bg-secondary);
    border: 2px solid var(--border);
    border-radius: 6px;
    cursor: pointer;
    padding: 0.15rem 0.5rem;
    line-height: 1;
    transition: transform 0.1s, box-shadow 0.1s;
    box-shadow: 0 2px 0 rgba(0,0,0,0.2);
  }

  .face-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 0 rgba(0,0,0,0.2);
  }

  .face-btn:active {
    transform: translateY(1px);
    box-shadow: none;
  }

  /* ── Board ── */
  .board-scroll {
    overflow-x: auto;
    max-width: 100%;
  }

  .board {
    display: grid;
    grid-template-columns: repeat(var(--cols), var(--cell));
    gap: 2px;
    background: color-mix(in srgb, var(--border) 60%, transparent);
    border-radius: 4px;
    padding: 2px;
  }

  .cell {
    width: var(--cell);
    height: var(--cell);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8125rem;
    font-weight: 700;
    background: var(--bg-secondary);
    border: none;
    border-radius: 3px;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    line-height: 1;
    box-shadow:
      inset -2px -2px 0 rgba(0,0,0,0.2),
      inset  2px  2px 0 rgba(255,255,255,0.3);
    transition: background 0.08s, box-shadow 0.08s;
  }

  .cell:hover:not(.revealed):not(.boom) {
    background: color-mix(in srgb, var(--accent) 18%, var(--bg-secondary));
  }

  .cell:active:not(.revealed):not(.boom) {
    box-shadow: inset 2px 2px 0 rgba(0,0,0,0.2);
  }

  .cell.revealed {
    background: var(--bg);
    box-shadow: inset 1px 1px 3px rgba(0,0,0,0.15);
    cursor: default;
  }

  .cell.boom {
    background: #dc2626;
    box-shadow: inset 0 0 8px rgba(0,0,0,0.3);
    animation: boom-flash 0.3s ease;
  }

  @keyframes boom-flash {
    0%   { background: #fff; }
    100% { background: #dc2626; }
  }

  /* ── Result ── */
  .result {
    font-family: var(--font-display);
    font-size: 0.9375rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    padding: 0.5rem 1.5rem;
    border-radius: var(--radius);
    text-align: center;
  }

  .win  { color: #16a34a; background: color-mix(in srgb, #16a34a 10%, transparent); border: 1px solid #16a34a; }
  .loss { color: #dc2626; background: color-mix(in srgb, #dc2626 10%, transparent); border: 1px solid #dc2626; }
</style>
