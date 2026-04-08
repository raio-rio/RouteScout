export const DASHBOARD_HTML = `<!doctype html>
<html lang="en" data-theme="light">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Route Scout Dashboard</title>
  <link rel="icon" type="image/png" href="/brand/logo.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/daisyui@5" rel="stylesheet" type="text/css" />
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <style>
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    :root {
      --shell: #ececec;
      --panel: #f6f6f6;
      --card: #ffffff;
      --border: #cfcfcf;
      --text: #1f1f1f;
      --muted: #727272;
      --accent: #dcdcdc;
      --accent-strong: #b9b9b9;
      --status-ok: #2f7a43;
      --status-err: #b13d3d;
      --gold: #d2b746;
      --tint-sand: #f6f1e6;
      --tint-sage: #edf4ee;
      --tint-mist: #eef2f1;
      --tint-rose: #f6eeeb;
      --method-post: #8a6a19;
      --method-put: #7b5d34;
      --method-patch: #7a5c75;
    }

    html[data-theme="dark"] {
      --shell: #1d1d1d;
      --panel: #2a2a2a;
      --card: #303030;
      --border: #494949;
      --text: #f3f3f3;
      --muted: #a6a6a6;
      --accent: #4a4f57;
      --accent-strong: #737b86;
      --status-ok: #59be75;
      --status-err: #ef7d7d;
      --gold: #d2b746;
      --tint-sand: #4a4030;
      --tint-sage: #2f4738;
      --tint-mist: #30434a;
      --tint-rose: #4a3338;
      --method-post: #f0d488;
      --method-put: #e0be97;
      --method-patch: #dfbce0;
    }

    html {
      font-family: "Instrument Sans", system-ui, sans-serif;
      font-size: 16.5px;
    }

    body {
      background: var(--shell);
      color: var(--text);
      font-family: inherit;
      line-height: 1.5;
      height: 100vh;
      min-height: 100dvh;
      max-width: 100vw;
      overflow-x: hidden;
      overflow: hidden;
    }

    .dashboard-root {
      width: 100%;
      height: 100%;
      min-height: 0;
      max-width: 100%;
      overflow-x: hidden;
    }

    body.reloading {
      cursor: progress;
    }

    button,
    summary,
    .btn,
    .history-card,
    .flow-arrow-btn,
    .checkbox-row,
    .menu li > *,
    label.btn,
    input[type="checkbox"],
    input[type="radio"] {
      cursor: pointer;
    }

    button:disabled,
    .btn[disabled],
    .btn.disabled,
    input:disabled,
    select:disabled,
    textarea:disabled {
      cursor: not-allowed;
    }

    textarea,
    pre,
    code,
    .font-mono {
      font-family: "JetBrains Mono", monospace;
    }

    .app-shell {
      border: 1px solid var(--border);
      background: var(--panel);
      display: block;
      width: 100%;
      height: 100%;
      max-width: 100%;
      border-radius: 22px;
      position: relative;
      overflow: hidden;
    }

    .layout-grid,
    .app-sidebar,
    .app-main,
    .app-rail,
    .surface,
    .section-card,
    .subsection-card,
    .code-editor-shell,
    .picker-dropdown,
    .picker-summary,
    .history-card,
    .history-meta-item {
      min-width: 0;
      max-width: 100%;
    }

    .surface {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 18px;
    }

    .brand-mark {
      display: grid;
      place-items: center;
      width: 3rem;
      height: 3rem;
      border-radius: 1.1rem;
      overflow: hidden;
      background: var(--panel);
      border: 1px solid var(--border);
      flex: 0 0 auto;
    }

    .brand-mark img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .section-card {
      background: transparent;
      border-radius: 18px;
    }

    .section-card.section-sand {
      background: transparent;
    }

    .section-card.section-sage {
      background: transparent;
    }

    .section-card.section-mist {
      background: transparent;
    }

    .section-card.section-rose {
      background: transparent;
    }

    .subsection-card {
      background: var(--card);
      border-radius: 14px;
    }

    .request-overview {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      align-items: center;
    }

    .request-overview-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.35rem 0.6rem;
      border-radius: 999px;
      background: var(--card);
      font-size: 0.72rem;
      box-shadow: inset 0 0 0 1px var(--border);
    }

    .request-overview-chip strong {
      font-weight: 600;
      color: var(--text);
    }

    .request-overview-note {
      flex-basis: 100%;
      margin-top: 0.05rem;
      font-size: 0.76rem;
      color: var(--muted);
    }

    .label-row {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      margin-bottom: 0.45rem;
      position: relative;
      z-index: 1;
      overflow: visible;
    }

    .label-row .control-label {
      margin-bottom: 0;
    }

    .picker-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 0.5rem;
      align-items: center;
    }

    .compact-select {
      padding-right: 2.55rem;
      background-position: right 1rem center;
      background-size: 0.8rem;
    }

    .picker-dropdown {
      width: 100%;
    }

    .picker-dropdown > summary {
      list-style: none;
    }

    .picker-dropdown > summary::-webkit-details-marker {
      display: none;
    }

    .picker-summary {
      justify-content: space-between;
      min-height: 2.65rem;
      padding-inline: 0.95rem;
      border-color: var(--border);
      background: var(--card);
      color: var(--text);
      font-weight: 500;
    }

    .picker-menu {
      margin-top: 0.35rem;
      padding: 0.4rem;
      border: 1px solid var(--border);
      background: var(--card);
      box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12);
    }

    .picker-dropdown .picker-summary {
      width: 100%;
    }

    .picker-dropdown .picker-menu {
      width: 100%;
      min-width: 100%;
    }

    .picker-menu button {
      width: 100%;
      text-align: left;
      color: var(--text);
      border-radius: 0.85rem;
    }

    .help-hint {
      position: relative;
      display: inline-grid;
      place-items: center;
      width: 1rem;
      height: 1rem;
      border-radius: 999px;
      background: var(--panel);
      color: var(--muted);
      font-size: 0.68rem;
      font-weight: 700;
      line-height: 1;
      box-shadow: inset 0 0 0 1px var(--border);
      cursor: help;
      user-select: none;
      outline: none;
      isolation: isolate;
    }

    .help-hint::before {
      content: "";
      position: absolute;
      left: 50%;
      bottom: calc(100% + 0.15rem);
      width: 0.6rem;
      height: 0.6rem;
      border-left: 1px solid var(--border);
      border-top: 1px solid var(--border);
      background: var(--card);
      transform: translateX(-50%) rotate(45deg);
      opacity: 0;
      visibility: hidden;
      transition: opacity 140ms ease, visibility 140ms ease, transform 140ms ease;
      pointer-events: none;
      z-index: 1401;
    }

    .help-hint::after {
      content: attr(data-tip);
      position: absolute;
      left: 50%;
      bottom: calc(100% + 0.45rem);
      width: min(300px, calc(100vw - 2rem));
      padding: 0.7rem 0.8rem;
      border: 1px solid var(--border);
      border-radius: 14px;
      background: var(--card);
      color: var(--text);
      font-size: 0.73rem;
      font-weight: 500;
      line-height: 1.45;
      letter-spacing: normal;
      text-transform: none;
      text-align: left;
      white-space: normal;
      box-shadow: 0 14px 30px rgba(0, 0, 0, 0.14);
      transform: translateX(-50%) translateY(4px);
      opacity: 0;
      visibility: hidden;
      transition: opacity 140ms ease, visibility 140ms ease, transform 140ms ease;
      pointer-events: none;
      z-index: 1402;
    }

    .help-hint:hover::before,
    .help-hint:hover::after,
    .help-hint:focus-visible::before,
    .help-hint:focus-visible::after {
      opacity: 1;
      visibility: visible;
    }

    .help-hint:hover::before,
    .help-hint:focus-visible::before {
      transform: translateX(-50%) rotate(45deg);
    }

    .help-hint:hover::after,
    .help-hint:focus-visible::after {
      transform: translateX(-50%) translateY(0);
    }

    .help-hint:hover,
    .help-hint:focus-visible {
      z-index: 1400;
    }

    .route-modal {
      z-index: 1250;
    }

    .route-modal::backdrop {
      background: rgba(17, 17, 17, 0.3);
    }

    .route-modal-box {
      width: min(100%, 640px);
      border-radius: 20px;
      border: 1px solid var(--border);
      background: var(--card);
      padding: 1rem;
      box-shadow: 0 18px 45px rgba(0, 0, 0, 0.12);
      overflow: visible !important;
    }

    .values-reference-modal-box {
      width: fit-content;
      min-width: min(920px, calc(100vw - 2rem));
      max-width: calc(100vw - 2rem);
      padding: 1.15rem 1.2rem;
    }

    .modal-heading {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .modal-grid {
      display: grid;
      gap: 0.75rem;
      overflow: visible;
    }

    .modal-note {
      font-size: 0.78rem;
      color: var(--muted);
    }

    .modal-note-list {
      display: grid;
      gap: 0.4rem;
    }

    .modal-header-fields {
      display: grid;
      gap: 0.55rem;
      max-height: none;
      overflow: visible;
      padding-right: 0.2rem;
      min-width: 0;
    }

    .modal-header-field {
      display: grid;
      gap: 0.25rem;
      min-width: 0;
    }

    .modal-header-title {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      gap: 0.45rem;
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--text);
      min-width: 0;
      overflow-wrap: anywhere;
    }

    .preset-header-name {
      flex: 1 1 auto;
      min-width: 0;
      overflow-wrap: anywhere;
      word-break: break-word;
      line-height: 1.35;
    }

    .modal-required {
      display: inline-flex;
      align-items: center;
      padding: 0.14rem 0.4rem;
      border-radius: 999px;
      background: var(--panel);
      font-size: 0.62rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--muted);
      box-shadow: inset 0 0 0 1px var(--border);
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.6rem;
      margin-top: 1rem;
    }

    .preset-modal-box {
      width: min(100%, 760px);
    }

    .preset-modal-grid {
      display: grid;
      gap: 0.7rem;
      min-width: 0;
      overflow: visible;
    }

    .preset-modal-extra {
      min-width: 0;
    }

    .section-divider {
      position: relative;
      padding-top: 1.2rem;
    }

    .section-divider::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: var(--border);
      opacity: 0.8;
    }

    .muted {
      color: var(--muted);
    }

    .control-label {
      display: block;
      margin-bottom: 0.45rem;
      color: var(--muted);
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    .checkbox-row {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      min-height: 2.75rem;
      padding: 0.7rem 0.9rem;
      border: 1px solid var(--border);
      border-radius: 14px;
      background: var(--card);
    }

    .override-choice-grid {
      display: grid;
      gap: 0.6rem;
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .override-option {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      min-height: 2.6rem;
      padding: 0.7rem 0.85rem;
      border: 1px solid var(--border);
      border-radius: 14px;
      background: var(--card);
      transition: border-color 140ms ease, background 140ms ease;
    }

    .override-option.active {
      border-color: color-mix(in srgb, var(--accent-strong) 34%, var(--border));
      background: color-mix(in srgb, var(--accent) 30%, var(--card));
    }

    .override-option-copy {
      display: grid;
      gap: 0.1rem;
      min-width: 0;
    }

    .override-option-title {
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--text);
    }

    .override-option-note {
      font-size: 0.7rem;
      color: var(--muted);
      line-height: 1.35;
    }

    .code-panel {
      border: 1px solid var(--border);
      border-radius: 14px;
      background: var(--card);
    }

    .code-panel code {
      display: block;
      font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .syntax-key {
      color: #2563eb;
      font-weight: 600;
    }

    .syntax-string {
      color: #0f9f6e;
    }

    .syntax-number {
      color: #d97706;
    }

    .syntax-boolean,
    .syntax-null {
      color: #7c3aed;
      font-weight: 600;
    }

    .syntax-punctuation {
      color: var(--muted);
    }

    .dark .syntax-string {
      color: #34d399;
    }

    .dark .syntax-number {
      color: #fbbf24;
    }

    .dark .syntax-boolean,
    .dark .syntax-null {
      color: #c084fc;
    }

    .dark .syntax-key {
      color: #60a5fa;
    }

    .code-editor-shell {
      position: relative;
      border: 1px solid var(--border);
      border-radius: 20px;
      background: var(--card);
      overflow: hidden;
    }

    .code-editor-highlight,
    .code-editor-input {
      margin: 0;
      min-height: 120px;
      width: 100%;
      padding: 0.9rem 1rem;
      font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
      font-size: 0.9rem;
      line-height: 1.6;
      white-space: pre-wrap;
      word-break: break-word;
      tab-size: 2;
    }

    .code-editor-highlight {
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
      color: var(--text);
      font-weight: 400;
      transition: opacity 100ms ease;
    }

    .code-editor-highlight .syntax-key,
    .code-editor-highlight .syntax-boolean,
    .code-editor-highlight .syntax-null {
      font-weight: 400;
    }

    .code-editor-input {
      position: relative;
      z-index: 1;
      resize: vertical;
      border: 0;
      background: transparent !important;
      color: transparent;
      caret-color: var(--text);
      -webkit-text-fill-color: transparent;
      transition: color 100ms ease;
    }

    .code-editor-input::selection {
      background: rgba(96, 165, 250, 0.28);
    }

    .code-editor-input:focus {
      outline: none;
      box-shadow: inset 0 0 0 1px var(--accent-strong);
    }

    .code-editor-shell:focus-within .code-editor-highlight {
      opacity: 0;
    }

    .code-editor-shell:focus-within .code-editor-input {
      color: var(--text);
      -webkit-text-fill-color: var(--text);
    }

    .auto-grow-editor {
      resize: none;
      overflow: hidden;
    }

    .field-invalid {
      border-color: var(--status-err) !important;
      box-shadow: inset 0 0 0 1px var(--status-err);
    }

    .validation-note {
      margin-top: 0.45rem;
      font-size: 0.74rem;
      line-height: 1.45;
      color: var(--status-err);
    }

    .validation-note.hidden {
      display: none;
    }

    .app-shell :where(.btn, .input, .select, .textarea, .toggle, .tabs-box, .badge) {
      box-shadow: none;
    }

    .app-shell :where(button, .btn, select, summary, .route-btn, .response-tab, .toggle, input[type="checkbox"], label.btn, .checkbox-row) {
      cursor: pointer;
    }

    .app-shell :where(.btn, .input, .select, .textarea, .toggle) {
      border-color: var(--border);
    }

    .app-shell :where(.input, .select, .textarea) {
      background: var(--card);
      color: var(--text);
    }

    .app-shell :where(.btn-ghost, .btn-outline) {
      background: var(--card);
      color: var(--text);
    }

    .app-shell :where(.btn-neutral) {
      background: var(--text);
      color: var(--card);
      border-color: var(--text);
    }

    .app-shell :where(.tabs-box) {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 12px;
    }

    .response-tab {
      color: var(--muted);
      border-radius: 10px;
    }

    .response-tab.tab-active {
      color: var(--text);
      background: var(--tint-mist);
      border: 1px solid var(--border);
    }

    .layout-grid {
      display: grid;
      grid-template-columns: 320px 12px minmax(640px, 1fr) 12px minmax(640px, 1fr);
      gap: 0;
      align-items: stretch;
      width: 100%;
      height: 100%;
      min-height: 0;
    }

    .resize-handle {
      background: transparent;
      cursor: col-resize;
      position: relative;
      user-select: none;
    }

    .resize-handle::after {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      left: 50%;
      width: 1px;
      transform: translateX(-50%);
      background: var(--border);
    }

    .resize-handle.active::after {
      background: var(--accent-strong);
      width: 2px;
    }

    .layout-gap {
      background: transparent;
    }

    .route-btn {
      border: 1px solid var(--border);
      background: var(--card);
      border-radius: 14px;
      transition: border-color 120ms ease, background 120ms ease, transform 120ms ease;
    }

    .route-btn:hover {
      border-color: var(--accent-strong);
      background: var(--panel);
      transform: translateY(-1px);
    }

    .route-btn.active {
      border-color: var(--text);
      background: var(--accent);
    }

    .route-framework {
      color: var(--muted);
    }

    .method-chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 3.25rem;
      padding: 0.2rem 0.55rem;
      border-radius: 999px;
      border: 1px solid var(--border);
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      background: var(--panel);
      color: var(--text);
    }

    .method-chip.route-method-get {
      background: color-mix(in srgb, var(--status-ok) 10%, var(--card));
      border-color: color-mix(in srgb, var(--status-ok) 22%, var(--border));
      color: var(--status-ok);
    }

    .method-chip.route-method-post {
      background: color-mix(in srgb, var(--gold) 14%, var(--card));
      border-color: color-mix(in srgb, var(--gold) 24%, var(--border));
      color: var(--method-post);
    }

    .method-chip.route-method-put {
      background: color-mix(in srgb, #a3845d 14%, var(--card));
      border-color: color-mix(in srgb, #a3845d 24%, var(--border));
      color: var(--method-put);
    }

    .method-chip.route-method-patch {
      background: color-mix(in srgb, #a07a9a 14%, var(--card));
      border-color: color-mix(in srgb, #a07a9a 24%, var(--border));
      color: var(--method-patch);
    }

    .method-chip.route-method-delete {
      background: color-mix(in srgb, var(--status-err) 10%, var(--card));
      border-color: color-mix(in srgb, var(--status-err) 20%, var(--border));
      color: var(--status-err);
    }

    .method-chip.route-method-default {
      background: color-mix(in srgb, var(--accent) 60%, var(--card));
      border-color: var(--border);
      color: var(--text);
    }

    .status-ok {
      color: var(--status-ok);
    }

    .status-err {
      color: var(--status-err);
    }

    .status-idle {
      color: var(--muted);
    }

    .toast-host {
      position: fixed;
      top: 18px;
      right: 18px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 8px;
      pointer-events: none;
      max-width: 360px;
    }

    .reload-lock {
      position: fixed;
      inset: 0;
      z-index: 1300;
      display: grid;
      place-items: center;
      background: rgba(29, 29, 29, 0.18);
      opacity: 0;
      pointer-events: none;
      transition: opacity 120ms ease;
    }

    .reload-lock.active {
      opacity: 1;
      pointer-events: auto;
      cursor: progress;
    }

    .reload-lock-card {
      border: 1px solid var(--border);
      background: var(--card);
      color: var(--text);
      border-radius: 14px;
      padding: 0.8rem 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .toast {
      border: 1px solid var(--border);
      background: var(--card);
      color: var(--text);
      padding: 0.85rem 1rem;
      border-radius: 18px;
      transform: translateY(-8px);
      opacity: 0;
      animation: toast-in 160ms ease forwards;
    }

    .toast.info {
      border-left: 4px solid var(--accent-strong);
    }

    .toast.success {
      border-left: 4px solid var(--status-ok);
    }

    .toast.error {
      border-left: 4px solid var(--status-err);
    }

    .toast.out {
      animation: toast-out 180ms ease forwards;
    }

    .confidence-text-high {
      color: var(--status-ok);
    }

    .confidence-text-medium {
      color: var(--gold);
    }

    .confidence-text-low {
      color: var(--status-err);
    }

    .confidence-chip {
      display: inline-flex;
      align-items: center;
      padding: 0.2rem 0.45rem;
      border-radius: 10px;
      background: var(--panel);
      box-shadow: inset 0 0 0 1px var(--border);
    }

    .expectation-source-wrap {
      position: relative;
      display: inline-flex;
      align-items: center;
      max-width: 100%;
    }

    .expectation-source-preview {
      position: absolute;
      left: 0;
      top: calc(100% + 0.45rem);
      z-index: 30;
      display: grid;
      gap: 0.35rem;
      width: min(420px, calc(100vw - 3rem));
      padding: 0.7rem 0.8rem;
      border: 1px solid var(--border);
      border-radius: 14px;
      background: var(--card);
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
      opacity: 0;
      visibility: hidden;
      transform: translateY(4px);
      transition: opacity 140ms ease, transform 140ms ease, visibility 140ms ease;
      pointer-events: none;
    }

    .expectation-source-wrap:hover .expectation-source-preview,
    .expectation-source-wrap:focus-within .expectation-source-preview {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .expectation-source-label {
      font-size: 0.62rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--muted);
    }

    .expectation-source-code {
      display: block;
      margin: 0;
      font-size: 0.68rem;
      line-height: 1.45;
      white-space: pre-wrap;
      word-break: break-word;
      color: var(--text);
    }

    .canvas-grid {
      background-image:
        linear-gradient(to right, rgba(114, 114, 114, 0.08) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(114, 114, 114, 0.08) 1px, transparent 1px);
      background-size: 24px 24px;
      position: relative;
      overflow: auto;
      border-radius: 16px;
    }

    .canvas-node {
      position: absolute;
      width: 220px;
      border: 1px solid var(--border);
      background: var(--card);
      cursor: grab;
      user-select: none;
      touch-action: none;
      border-radius: 14px;
    }

    .canvas-node.dragging {
      cursor: grabbing;
      opacity: 0.92;
    }

    .canvas-edges {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .flow-canvas {
      min-height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      border: 1px dashed var(--border);
      border-radius: 16px;
      background: color-mix(in srgb, var(--panel) 72%, transparent);
    }

    .flow-empty {
      min-height: 100%;
      display: grid;
      place-items: center;
      padding: 1rem;
      text-align: center;
    }

    .flow-chain {
      display: grid;
      justify-items: center;
      align-content: start;
      gap: 0.5rem;
      min-height: 100%;
      padding: 0.75rem 0.6rem 0.85rem;
    }

    .flow-node {
      width: min(100%, 188px);
      border: 1px solid var(--border);
      border-radius: 14px;
      background: var(--card);
      padding: 0.6rem 0.65rem;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.03);
    }

    .flow-node-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.45rem;
      margin-bottom: 0.22rem;
    }

    .flow-step-label {
      font-size: 0.58rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--muted);
    }

    .flow-node-title {
      font-size: 0.72rem;
      font-weight: 700;
      line-height: 1.3;
      color: var(--text);
    }

    .flow-node-route {
      margin-top: 0.12rem;
      font-size: 0.6rem;
      color: var(--muted);
    }

    .flow-node-actions {
      display: flex;
      gap: 0.35rem;
      margin-top: 0.35rem;
    }

    .flow-connector {
      display: grid;
      justify-items: center;
      gap: 0.22rem;
      min-width: 0;
    }

    .flow-arrow-line {
      width: 1px;
      height: 22px;
      background: var(--border);
      position: relative;
    }

    .flow-arrow-line::after {
      content: "";
      position: absolute;
      left: 50%;
      bottom: -1px;
      width: 7px;
      height: 7px;
      border-top: 1px solid var(--border);
      border-right: 1px solid var(--border);
      transform: translateX(-50%) rotate(135deg);
      background: var(--panel);
    }

    .flow-arrow-btn {
      display: inline-grid;
      place-items: center;
      width: 1.7rem;
      height: 1.7rem;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: var(--card);
      color: var(--text);
      font-size: 0.86rem;
      font-weight: 700;
      line-height: 1;
      cursor: pointer;
    }

    .flow-arrow-label {
      font-size: 0.56rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--muted);
      text-align: center;
    }

    .flow-order-item {
      border: 1px solid var(--border);
      border-radius: 14px;
      background: var(--panel);
      padding: 0.55rem 0.7rem;
    }

    .history-card {
      border: 1px solid var(--border);
      border-radius: 18px;
      background: var(--card);
      padding: 0.85rem 0.95rem;
      display: grid;
      gap: 0.5rem;
      align-self: start;
      cursor: pointer;
      transition: border-color 140ms ease, background 140ms ease;
    }

    @keyframes history-entry-in {
      0% {
        opacity: 0;
        transform: translateY(8px) scale(0.985);
      }

      65% {
        opacity: 1;
        transform: translateY(-1px) scale(1.003);
      }

      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .history-card.history-new {
      animation: history-entry-in 260ms ease-out;
    }

    .history-card:hover {
      border-color: color-mix(in srgb, var(--accent-strong) 32%, var(--border));
    }

    .history-card.history-open {
      border-color: color-mix(in srgb, var(--accent-strong) 46%, var(--border));
    }

    .history-card:focus-visible {
      outline: 2px solid color-mix(in srgb, var(--accent-strong) 55%, transparent);
      outline-offset: 2px;
    }

    .history-card.history-success {
      border-color: color-mix(in srgb, var(--status-ok) 28%, var(--border));
      background: color-mix(in srgb, var(--status-ok) 6%, var(--card));
    }

    .history-card.history-failure {
      border-color: color-mix(in srgb, var(--status-err) 30%, var(--border));
      background: color-mix(in srgb, var(--status-err) 5%, var(--card));
    }

    .history-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.2rem 0.5rem;
      border-radius: 999px;
      border: 1px solid var(--border);
      font-size: 0.67rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      background: var(--panel);
      color: var(--muted);
    }

    .history-badge.history-success {
      border-color: color-mix(in srgb, var(--status-ok) 28%, var(--border));
      color: var(--status-ok);
      background: color-mix(in srgb, var(--status-ok) 10%, var(--card));
    }

    .history-badge.history-failure {
      border-color: color-mix(in srgb, var(--status-err) 28%, var(--border));
      color: var(--status-err);
      background: color-mix(in srgb, var(--status-err) 10%, var(--card));
    }

    .history-list {
      display: grid;
      align-content: start;
      grid-auto-rows: max-content;
      gap: 0.75rem;
      transition: max-height 180ms ease;
    }

    .history-details {
      display: grid;
      gap: 0.6rem;
      padding-top: 0.1rem;
    }

    .history-meta-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.5rem;
    }

    .history-meta-item {
      border: 1px solid var(--border);
      border-radius: 14px;
      background: var(--panel);
      padding: 0.55rem 0.7rem;
      min-width: 0;
    }

    .history-meta-label {
      font-size: 0.62rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--muted);
    }

    .history-meta-value {
      margin-top: 0.2rem;
      font-size: 0.72rem;
      line-height: 1.45;
      color: var(--fg);
      min-width: 0;
      overflow-wrap: anywhere;
    }

    .history-detail-section {
      display: grid;
      gap: 0.3rem;
    }

    .history-detail-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }

    .history-detail-title {
      font-size: 0.62rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--muted);
    }

    .history-copy-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.5rem;
      height: 1.5rem;
      border: 1px solid var(--border);
      border-radius: 999px;
      background: var(--panel);
      color: var(--muted);
      font-size: 0.85rem;
      line-height: 1;
    }

    .history-copy-btn:hover {
      color: var(--text);
      border-color: color-mix(in srgb, var(--accent-strong) 28%, var(--border));
    }

    .selection-preview-summary {
      font-size: 0.82rem;
      color: var(--muted);
    }

    .selection-preview-section {
      display: grid;
      gap: 0.4rem;
    }

    .selection-preview-label {
      font-size: 0.62rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--muted);
    }

    .selection-preview-value {
      font-size: 0.85rem;
      line-height: 1.5;
      color: var(--text);
      overflow-wrap: anywhere;
    }

    .selection-preview-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }

    .selection-preview-chip {
      display: inline-flex;
      align-items: center;
      padding: 0.22rem 0.5rem;
      border-radius: 999px;
      background: var(--panel);
      box-shadow: inset 0 0 0 1px var(--border);
      font-size: 0.72rem;
      color: var(--text);
    }

    .value-reference-country-note {
      font-size: 0.72rem;
      color: var(--muted);
      line-height: 1.4;
    }

    .value-reference-about {
      display: grid;
      gap: 0.35rem;
      margin-bottom: 1rem;
      padding: 0.9rem 1rem;
      border: 1px solid var(--border);
      border-radius: 18px;
      background: var(--panel);
    }

    .value-reference-about-title {
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--muted);
    }

    .value-reference-about-copy {
      font-size: 0.8rem;
      line-height: 1.55;
      color: var(--text);
    }

    .value-reference-section-label {
      margin: 0.95rem 0 0.7rem;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--muted);
    }

    .value-reference-grid {
      display: grid;
      gap: 0.85rem;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      align-items: start;
    }

    @media (max-width: 1100px) {
      .value-reference-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 720px) {
      .value-reference-grid {
        grid-template-columns: minmax(0, 1fr);
      }
    }

    .value-reference-category {
      display: grid;
      gap: 0.65rem;
      padding: 0.8rem;
      border: 1px solid var(--border);
      border-radius: 18px;
      background: var(--panel);
      min-height: 100%;
    }

    .value-reference-category-title {
      font-size: 0.74rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--muted);
    }

    .value-reference-list {
      display: grid;
      gap: 0.65rem;
    }

    .value-reference-item {
      display: grid;
      gap: 0.25rem;
      padding: 0.75rem 0.85rem;
      border: 1px solid var(--border);
      border-radius: 14px;
      background: var(--card);
    }

    .value-reference-heading {
      display: flex;
      flex-wrap: wrap;
      align-items: start;
      justify-content: space-between;
      gap: 0.5rem;
    }

    .value-reference-title {
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--text);
    }

    .value-reference-input {
      width: 100%;
      min-width: 0;
      font-size: 0.78rem;
      font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
    }

    .value-reference-note {
      font-size: 0.74rem;
      line-height: 1.45;
      color: var(--muted);
    }

    .history-code-block {
      margin: 0;
      padding: 0.75rem 0.85rem;
      font-size: 0.7rem;
      line-height: 1.5;
      max-height: 180px;
      overflow: auto;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .flow-route-library {
      display: grid;
      gap: 0.4rem;
      max-height: 27vh;
      overflow: auto;
      padding-right: 0.2rem;
    }

    .flow-route-card {
      display: grid;
      gap: 0.35rem;
      border: 1px solid var(--border);
      border-radius: 14px;
      background: var(--panel);
      padding: 0.55rem 0.6rem;
      cursor: grab;
      user-select: none;
      transition: border-color 120ms ease, background 120ms ease, transform 120ms ease;
    }

    .flow-route-card:hover {
      border-color: var(--accent-strong);
      background: var(--card);
      transform: translateY(-1px);
    }

    .flow-route-card.dragging {
      opacity: 0.6;
      cursor: grabbing;
    }

    .flow-drop-target {
      transition: border-color 120ms ease, background 120ms ease, transform 120ms ease;
    }

    .flow-drop-target.drag-over {
      border-color: var(--accent-strong);
      background: var(--accent);
      transform: scale(1.04);
    }

    @keyframes toast-in {
      from {
        transform: translateY(-8px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @keyframes toast-out {
      from {
        transform: translateY(0);
        opacity: 1;
      }
      to {
        transform: translateY(-8px);
        opacity: 0;
      }
    }

    @media (max-width: 1200px) {
      body {
        height: auto;
        overflow: auto;
      }

      .dashboard-root {
        height: auto;
        min-height: 100dvh;
      }

      .app-shell {
        display: block;
        width: 100%;
        height: auto;
        min-height: calc(100dvh - 1rem);
        overflow: visible;
      }

      .layout-grid {
        grid-template-columns: 1fr;
        width: 100%;
        height: auto;
        min-height: 0;
        gap: 0.9rem;
      }

      .resize-handle {
        display: none;
      }

      .app-sidebar,
      .app-main,
      .app-rail {
        min-height: 0;
      }

      .app-main,
      .app-rail {
        overflow: visible;
      }

      .route-list-panel {
        max-height: min(42vh, 440px);
      }

      .picker-row {
        grid-template-columns: minmax(0, 1fr);
      }

      .picker-row > .btn {
        justify-self: end;
      }

      .override-choice-grid {
        grid-template-columns: 1fr;
      }

      .history-meta-grid {
        grid-template-columns: 1fr;
      }

      .history-list {
        max-height: min(52vh, 620px);
      }
    }

    @media (max-width: 768px) {
      html {
        font-size: 15.5px;
      }

      .dashboard-root {
        padding: 0.4rem;
      }

      .app-shell {
        border-radius: 18px;
        padding: 0.75rem;
      }

      .app-sidebar,
      .app-main,
      .app-rail {
        padding: 0.9rem !important;
      }

      .sidebar-header,
      .dashboard-header,
      .history-controls {
        flex-direction: column;
        align-items: stretch;
      }

      .sidebar-actions {
        justify-content: flex-end;
      }

      .dashboard-header h2 {
        font-size: 2rem;
      }

      .section-card {
        padding: 1rem !important;
      }

      .route-list-panel {
        max-height: min(38vh, 360px);
      }

      .history-list {
        max-height: min(48vh, 520px);
      }

      #output,
      #diff-output {
        max-height: min(42vh, 360px);
      }
    }
  </style>
</head>
<body class="h-screen overflow-hidden px-2 py-3 md:px-3 md:py-4">
  <div id="toast-host" class="toast-host" aria-live="polite" aria-atomic="false"></div>
  <div id="reload-lock" class="reload-lock" aria-hidden="true">
    <div class="reload-lock-card">Refreshing dashboard...</div>
  </div>
  <div class="dashboard-root h-full w-full">
    <div class="app-shell h-full w-full p-3">
      <div id="layout-grid" class="layout-grid h-full">
        <aside class="app-sidebar surface flex min-h-0 flex-col p-3">
          <div class="sidebar-header mb-4 flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="brand-mark">
                <img src="/brand/logo.png" alt="Route Scout logo" />
              </div>
              <div>
                <h1 class="text-lg font-semibold tracking-tight">Route Scout</h1>
                <p class="text-sm muted">Endpoint explorer</p>
              </div>
            </div>
            <div class="sidebar-actions flex items-center gap-2">
              <button id="open-values-reference-btn" class="btn btn-ghost btn-sm btn-square rounded-2xl" title="View auto-fill values" aria-label="View auto-fill values">
                <span>i</span>
              </button>
              <button id="theme-toggle" class="btn btn-ghost btn-sm btn-square rounded-2xl" title="Toggle dark mode" aria-label="Toggle dark mode">
                <span id="theme-icon">Light</span>
              </button>
            </div>
          </div>

          <div class="mb-4 flex items-center justify-between rounded-[20px] border px-4 py-3" style="border-color:var(--border);background:var(--panel);">
            <div>
              <span class="block text-sm font-semibold">Endpoints</span>
              <span class="text-xs muted">Browse your scanned routes</span>
            </div>
            <button id="reload-btn" class="btn btn-ghost btn-xs btn-square rounded-xl" title="Reload endpoints" aria-label="Reload endpoints">
              <span id="reload-icon" class="inline-block text-base leading-none">R</span>
            </button>
          </div>

          <div class="mb-4">
            <input id="route-search" placeholder="Search endpoints..." class="input input-bordered input-sm w-full rounded-2xl" />
          </div>

          <div id="route-list" class="route-list-panel min-h-0 flex-1 space-y-2 overflow-auto pr-1"></div>
          <div class="mt-3 hidden">
            <button id="open-workflow-canvas-btn" class="btn btn-outline btn-sm w-full rounded-2xl normal-case">
              Open Workflow Canvas
            </button>
          </div>
        </aside>

        <div id="handle-left" class="resize-handle" aria-hidden="true"></div>

        <main class="app-main surface min-h-0 overflow-auto space-y-4 p-5">
          <div class="dashboard-header flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 class="text-3xl font-semibold tracking-tight">Dashboard</h2>
              <p id="source-info" class="mt-1 text-sm muted">Select an endpoint.</p>
            </div>
            <div class="hidden flex flex-wrap items-center gap-2">
              <select id="profile-select" class="select select-bordered select-sm min-w-[220px] rounded-2xl"></select>
              <button id="set-profile-btn" class="btn btn-outline btn-sm rounded-2xl normal-case">Set Active</button>
              <button id="clear-profile-btn" class="btn btn-ghost btn-sm rounded-2xl normal-case">Clear</button>
            </div>
          </div>

          <div class="grid gap-3">
            <div>
              <label class="control-label">Base URL</label>
              <input id="base-url" class="input input-bordered w-full rounded-2xl text-sm" />
            </div>
            <div class="hidden">
              <label class="control-label">Profile Name</label>
              <input id="profile-name" placeholder="dev/staging/prod" class="input input-bordered w-full rounded-2xl text-sm" />
            </div>
            <div class="hidden flex items-end">
              <button id="save-profile-btn" class="btn btn-outline w-full rounded-2xl normal-case">Save Profile</button>
            </div>
          </div>

          <section class="section-card section-divider section-sage p-5">
            <h3 class="mb-3 text-base font-semibold">Endpoint Expects</h3>
            <div id="endpoint-expectations" class="grid gap-2 md:grid-cols-2"></div>
          </section>

          <section class="section-card section-divider section-mist p-4">
            <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <h3 class="text-base font-semibold">Guided Test Run</h3>
                <span class="help-hint" title="This section is where Route Scout turns the selected endpoint into a runnable backend test. It starts with the scanner's inferred request, then lets you apply presets, scenarios, or small overrides only when the test needs something specific.">?</span>
              </div>
              <button id="reset-generated-btn" class="btn btn-ghost btn-sm rounded-2xl normal-case">Reset to scan defaults</button>
            </div>

            <div class="mb-3 grid gap-2 md:grid-cols-2">
              <div>
                <div class="label-row">
                  <label class="control-label">Header Preset</label>
                  <span class="help-hint" title="Use this to quickly apply a reusable set of headers to the current endpoint test, such as auth tokens, API keys, or shared environment headers, without retyping them each time.">?</span>
                </div>
                <div class="picker-row">
                  <details id="preset-dropdown" class="dropdown picker-dropdown">
                    <summary id="preset-dropdown-trigger" class="btn btn-sm picker-summary rounded-2xl normal-case">No header preset</summary>
                    <ul id="preset-dropdown-menu" class="menu dropdown-content picker-menu rounded-2xl z-[60]"></ul>
                  </details>
                  <select id="preset-select" class="hidden"></select>
                  <button id="open-preset-modal-btn" class="btn btn-outline btn-sm btn-square rounded-2xl" title="Add header preset" aria-label="Add header preset">+</button>
                </div>
              </div>
              <div>
                <div class="label-row">
                  <label class="control-label">Saved Scenario</label>
                  <span class="help-hint" title="Use this to load a saved test variation for the current endpoint. A scenario can restore path params, query values, headers, and body content so you can rerun common backend test cases quickly.">?</span>
                </div>
                <div class="picker-row">
                  <details id="template-dropdown" class="dropdown picker-dropdown">
                    <summary id="template-dropdown-trigger" class="btn btn-sm picker-summary rounded-2xl normal-case">No saved scenario</summary>
                    <ul id="template-dropdown-menu" class="menu dropdown-content picker-menu rounded-2xl z-[60]"></ul>
                  </details>
                  <select id="template-select" class="hidden"></select>
                  <button id="open-scenario-modal-btn" class="btn btn-outline btn-sm btn-square rounded-2xl" title="Add saved scenario" aria-label="Add saved scenario">+</button>
                </div>
              </div>
            </div>
            <input id="template-name" type="hidden" />

            <div class="label-row">
              <label class="control-label">Generated Body Payload</label>
              <span class="help-hint" title="This is the request body Route Scout generated from the endpoint scan. It gives you a sensible starting payload for validation, so you only need to edit it when the backend test depends on specific body values.">?</span>
            </div>
            <div class="code-editor-shell">
              <pre id="body-highlight" class="code-editor-highlight" aria-hidden="true"></pre>
              <textarea id="body" class="auto-grow-editor code-editor-input textarea min-h-[120px] w-full rounded-[20px] text-sm font-mono">null</textarea>
            </div>
            <div id="request-validation-note" class="validation-note hidden"></div>

            <div class="mt-3 grid gap-3 lg:grid-cols-2">
              <details class="subsection-card p-3">
                <summary class="cursor-pointer select-none text-sm font-medium muted"><span class="inline-flex items-center gap-2">Override generated request <span class="help-hint" title="Open this when the auto-generated request needs a few manual adjustments. It lets you change path params, query values, or headers for edge cases and targeted backend checks without rebuilding the whole request.">?</span></span></summary>
                <div class="mt-2 grid gap-3">
                  <div class="label-row">
                    <label class="control-label">Choose What To Edit</label>
                    <span class="help-hint" title="Pick one request section first, then Route Scout will show that editor with the current generated contents so you can adjust only what matters for this test run.">?</span>
                  </div>
                  <div class="override-choice-grid">
                    <label id="override-option-path-label" class="override-option">
                      <input id="override-option-path" type="radio" name="override-target" value="path" class="radio radio-sm" />
                      <span class="override-option-copy">
                        <span class="override-option-title">Path Params</span>
                        <span class="override-option-note">Edit URL path values.</span>
                      </span>
                    </label>
                    <label id="override-option-query-label" class="override-option">
                      <input id="override-option-query" type="radio" name="override-target" value="query" class="radio radio-sm" />
                      <span class="override-option-copy">
                        <span class="override-option-title">Query</span>
                        <span class="override-option-note">Edit query string values.</span>
                      </span>
                    </label>
                    <label id="override-option-headers-label" class="override-option">
                      <input id="override-option-headers" type="radio" name="override-target" value="headers" class="radio radio-sm" />
                      <span class="override-option-copy">
                        <span class="override-option-title">Headers</span>
                        <span class="override-option-note">Edit request headers.</span>
                      </span>
                    </label>
                  </div>
                  <div id="override-empty-state" class="text-xs muted">Select one of the options above to edit that part of the generated request.</div>
                  <div id="override-path-panel" class="hidden">
                    <label class="control-label">Path Params</label>
                    <div class="code-editor-shell">
                      <pre id="path-params-highlight" class="code-editor-highlight" aria-hidden="true"></pre>
                      <textarea id="path-params" class="code-editor-input textarea min-h-[76px] w-full rounded-[18px] text-xs font-mono">{}</textarea>
                    </div>
                  </div>
                  <div id="override-query-panel" class="hidden">
                    <label class="control-label">Query</label>
                    <div class="code-editor-shell">
                      <pre id="query-highlight" class="code-editor-highlight" aria-hidden="true"></pre>
                      <textarea id="query" class="code-editor-input textarea min-h-[76px] w-full rounded-[18px] text-xs font-mono">{}</textarea>
                    </div>
                  </div>
                  <div id="override-headers-panel" class="hidden">
                    <label class="control-label">Headers</label>
                    <div class="code-editor-shell">
                      <pre id="headers-highlight" class="code-editor-highlight" aria-hidden="true"></pre>
                      <textarea id="headers" class="code-editor-input textarea min-h-[76px] w-full rounded-[18px] text-xs font-mono">{}</textarea>
                    </div>
                  </div>
                </div>
              </details>

              <details class="subsection-card p-3">
                <summary class="cursor-pointer select-none text-sm font-medium muted"><span class="inline-flex items-center gap-2">Developer exports <span class="help-hint" title="Use this when you want to take the current Route Scout test request outside the dashboard. It lets you copy the request as cURL or fetch for debugging, sharing, or reproducing the call elsewhere.">?</span></span></summary>
                <div class="mt-2 flex flex-wrap gap-2">
                  <button id="copy-curl-btn" class="btn btn-ghost rounded-2xl normal-case">Copy cURL</button>
                  <button id="copy-fetch-btn" class="btn btn-ghost rounded-2xl normal-case">Copy fetch</button>
                </div>
              </details>
            </div>

            <div class="mt-3 flex items-center gap-3">
              <button id="run-btn" class="btn btn-neutral rounded-2xl normal-case">Run Endpoint Test</button>
              <div id="status" class="status-idle text-sm">Idle</div>
            </div>
          </section>

          <section class="section-card section-divider section-mist p-4">
            <div class="mb-2 flex items-center justify-between gap-3">
              <h3 class="text-base font-semibold">Response</h3>
              <button id="copy-response-output-btn" class="btn btn-ghost btn-sm btn-square rounded-2xl" title="Copy response body" aria-label="Copy response body">⧉</button>
            </div>
            <div role="tablist" class="tabs tabs-box tabs-sm mb-3 gap-1 p-1">
              <button data-tab="body" class="response-tab tab flex-1">Body</button>
              <button data-tab="headers" class="response-tab tab flex-1">Headers</button>
              <button data-tab="raw" class="response-tab tab flex-1">Raw</button>
            </div>
            <pre id="output" class="code-panel max-h-[34vh] overflow-auto p-4 text-xs">No response yet.</pre>
          </section>

          <section class="section-card section-divider section-rose p-5 hidden">
            <h3 class="mb-3 text-base font-semibold">Testing Workflow</h3>
            <div class="grid gap-3 md:grid-cols-2">
              <div class="subsection-card p-4">
                <div class="mb-2 flex items-center justify-between">
                  <span class="text-sm font-semibold">Endpoint Suite</span>
                  <div class="flex gap-2">
                    <button id="save-suite-btn" class="btn btn-ghost btn-xs rounded-xl normal-case">Save</button>
                    <button id="run-suite-btn" class="btn btn-outline btn-xs rounded-xl normal-case">Run</button>
                  </div>
                </div>
                <select id="suite-select" class="select select-bordered select-sm mb-2 w-full rounded-2xl"></select>
                <textarea id="suite-json" class="textarea textarea-bordered min-h-[140px] w-full rounded-[18px] text-xs font-mono"></textarea>
              </div>
              <div class="subsection-card p-4">
                <div class="mb-2 flex items-center justify-between">
                  <span class="text-sm font-semibold">API Workflow</span>
                  <div class="flex gap-2">
                    <button id="save-workflow-btn" class="btn btn-ghost btn-xs rounded-xl normal-case">Save</button>
                    <button id="run-workflow-btn" class="btn btn-outline btn-xs rounded-xl normal-case">Run</button>
                  </div>
                </div>
                <select id="workflow-select" class="select select-bordered select-sm mb-2 w-full rounded-2xl"></select>
                <div class="mb-2 grid gap-2 md:grid-cols-3">
                  <input id="workflow-name" placeholder="Workflow name" class="input input-bordered input-sm rounded-2xl text-xs md:col-span-2" />
                  <label class="checkbox-row text-xs muted">
                    <input id="workflow-continue" type="checkbox" class="toggle toggle-sm" />
                    continue on failure
                  </label>
                </div>
                <div class="mb-2 flex flex-wrap items-center gap-2">
                  <select id="workflow-route-picker" class="select select-bordered select-sm min-w-[220px] rounded-2xl text-xs"></select>
                  <button id="workflow-add-step-btn" class="btn btn-outline btn-xs rounded-xl normal-case">Add Step</button>
                  <button id="workflow-clear-steps-btn" class="btn btn-ghost btn-xs rounded-xl normal-case">Clear Steps</button>
                </div>
                <div id="workflow-diagram" class="code-panel max-h-[220px] space-y-2 overflow-auto p-3"></div>
                <details class="section-card mt-3 p-3">
                  <summary class="cursor-pointer text-xs font-medium muted">Advanced JSON editor</summary>
                  <textarea id="workflow-json" class="textarea textarea-bordered mt-3 min-h-[120px] w-full rounded-[18px] text-xs font-mono"></textarea>
                  <div class="mt-2">
                    <button id="workflow-apply-json-btn" class="btn btn-outline btn-xs rounded-xl normal-case">Apply JSON</button>
                  </div>
                </details>
              </div>
            </div>
            <div class="mt-3 flex items-center gap-2">
              <button id="export-btn" class="btn btn-outline btn-sm rounded-2xl normal-case">Export Collections</button>
              <label class="btn btn-ghost btn-sm rounded-2xl normal-case">
                Import Collections
                <input id="import-file" type="file" accept="application/json" class="hidden" />
              </label>
            </div>
          </section>
        </main>

        <div id="handle-right" class="layout-gap" aria-hidden="true"></div>

        <section class="app-rail surface flex min-h-0 flex-col space-y-4 p-4">
          <div class="section-card section-rose p-4">
            <h3 class="mb-2 text-base font-semibold">Response Diff</h3>
            <p class="mb-2 text-xs muted">Compared with previous run on the same endpoint.</p>
            <pre id="diff-output" class="code-panel max-h-[16vh] overflow-auto p-4 text-xs">No diff yet.</pre>
          </div>

          <div class="section-card section-divider section-sage flex min-h-0 flex-1 flex-col p-4">
            <h3 class="mb-2 text-base font-semibold">History</h3>
            <div class="history-controls mb-2 flex items-center justify-between gap-3">
              <select id="history-code-filter" class="select select-bordered select-sm min-w-[220px] rounded-2xl text-xs">
                <option value="all">All history</option>
              </select>
              <button id="history-refresh-btn" class="btn btn-ghost btn-xs rounded-xl normal-case">Refresh</button>
            </div>
            <div id="history-output" class="history-list min-h-0 flex-1 overflow-auto pr-1 text-xs">No history loaded.</div>
          </div>
        </section>
      </div>
    </div>
  </div>

  <dialog id="preset-modal" class="modal route-modal">
    <div class="modal-box route-modal-box preset-modal-box">
      <div class="modal-heading">
        <div>
          <h3 class="text-base font-semibold">Create Header Preset</h3>
        </div>
        <button id="close-preset-modal-btn" class="btn btn-ghost btn-sm btn-square rounded-2xl" aria-label="Close preset modal">x</button>
      </div>
      <div class="preset-modal-grid">
        <div>
          <div class="label-row">
            <label class="control-label">Preset Name (Optional)</label>
            <span class="help-hint" title="This name helps you recognize and reuse the saved header set later. It is optional, and if you leave it blank Route Scout will automatically name it Header 1, Header 2, and so on.">?</span>
          </div>
          <input id="preset-modal-name" class="input input-bordered w-full rounded-2xl text-sm" placeholder="Leave blank for Header 1" />
        </div>
        <div>
          <div class="label-row">
            <label class="control-label">Headers Included</label>
            <span class="help-hint" title="These are the headers Route Scout believes this endpoint test may need, based on auth hints and detected header usage. Fill the required ones here so the saved preset is ready to apply on future runs.">?</span>
          </div>
          <div id="preset-modal-fields" class="modal-header-fields"></div>
        </div>
        <div class="preset-modal-extra">
          <div class="label-row">
            <label class="control-label">Additional Headers JSON</label>
            <span class="help-hint" title="Use this area to add any extra headers that were not inferred automatically but still matter for your environment or test setup. Enter them as a simple JSON object and they will be saved with the preset.">?</span>
          </div>
          <div class="code-editor-shell">
            <pre id="preset-modal-extra-headers-highlight" class="code-editor-highlight" aria-hidden="true"></pre>
            <textarea id="preset-modal-extra-headers" class="code-editor-input textarea min-h-[88px] w-full rounded-[18px] text-xs font-mono">{}</textarea>
          </div>
          <div id="preset-modal-validation-note" class="validation-note hidden"></div>
        </div>
      </div>
      <div class="modal-actions">
        <button id="cancel-preset-modal-btn" class="btn btn-ghost rounded-2xl normal-case">Cancel</button>
        <button id="save-preset-modal-btn" class="btn btn-neutral rounded-2xl normal-case">Save</button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button aria-label="Close preset modal">close</button>
    </form>
  </dialog>

  <dialog id="scenario-modal" class="modal route-modal">
    <div class="modal-box route-modal-box">
      <div class="modal-heading">
        <div>
          <h3 class="text-base font-semibold">Save Scenario</h3>
          <p class="modal-note">Capture the current generated request for this endpoint as a reusable scenario.</p>
        </div>
        <button id="close-scenario-modal-btn" class="btn btn-ghost btn-sm btn-square rounded-2xl" aria-label="Close scenario modal">x</button>
      </div>
      <div class="modal-grid">
        <div>
          <div class="label-row">
            <label class="control-label">Scenario Name (Optional)</label>
            <span class="help-hint" title="This name helps identify the saved backend test case later, such as happy path or invalid auth. It is optional, and if you leave it blank Route Scout will automatically name it Scenario 1, Scenario 2, and so on.">?</span>
          </div>
          <input id="scenario-modal-name" class="input input-bordered w-full rounded-2xl text-sm" placeholder="Leave blank for Scenario 1" />
        </div>
        <div>
          <div class="label-row">
            <label class="control-label">Save These Sections</label>
            <span class="help-hint" title="Choose which pieces of the current generated request should be stored in this scenario. This lets you save only the parts that matter for the test case instead of locking in every field.">?</span>
          </div>
          <div class="modal-note-list">
            <label class="checkbox-row text-sm">
              <input id="scenario-modal-include-path" type="checkbox" class="toggle toggle-sm" />
              path params
            </label>
            <label class="checkbox-row text-sm">
              <input id="scenario-modal-include-query" type="checkbox" class="toggle toggle-sm" />
              query
            </label>
            <label class="checkbox-row text-sm">
              <input id="scenario-modal-include-headers" type="checkbox" class="toggle toggle-sm" />
              headers
            </label>
            <label class="checkbox-row text-sm">
              <input id="scenario-modal-include-body" type="checkbox" class="toggle toggle-sm" />
              body
            </label>
          </div>
        </div>
      </div>
      <div class="modal-actions">
        <button id="cancel-scenario-modal-btn" class="btn btn-ghost rounded-2xl normal-case">Cancel</button>
        <button id="save-scenario-modal-btn" class="btn btn-neutral rounded-2xl normal-case">Save Scenario</button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button aria-label="Close scenario modal">close</button>
    </form>
  </dialog>

  <dialog id="selection-preview-modal" class="modal route-modal">
    <div class="modal-box route-modal-box">
      <div class="modal-heading">
        <div>
          <h3 id="selection-preview-title" class="text-base font-semibold">Selection Preview</h3>
          <p id="selection-preview-summary" class="modal-note">Preview what was just applied to this request.</p>
        </div>
        <button id="close-selection-preview-btn" class="btn btn-ghost btn-sm btn-square rounded-2xl" aria-label="Close selection preview modal">x</button>
      </div>
      <div id="selection-preview-content" class="modal-grid"></div>
      <div class="modal-actions">
        <button id="dismiss-selection-preview-btn" class="btn btn-ghost rounded-2xl normal-case">Close</button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button aria-label="Close selection preview modal">close</button>
    </form>
  </dialog>

  <dialog id="values-reference-modal" class="modal route-modal">
    <div class="modal-box route-modal-box values-reference-modal-box">
      <div class="modal-heading">
        <div>
          <h3 class="text-base font-semibold">Information</h3>
        </div>
        <button id="close-values-reference-btn" class="btn btn-ghost btn-sm btn-square rounded-2xl" aria-label="Close auto-fill values modal">x</button>
      </div>
      <div class="value-reference-about">
        <div class="value-reference-about-title">About</div>
        <div class="value-reference-about-copy">Route Scout uses these pre-made values when it auto-generates request bodies, path params, query params, and headers after scanning your backend. You can edit them here to change the defaults used for generated test runs, and you can still override anything before sending the request.</div>
      </div>
      <div class="value-reference-section-label">Dummy Variables Index</div>
      <div id="values-reference-content" class="value-reference-grid"></div>
      <div class="modal-actions">
        <button id="dismiss-values-reference-btn" class="btn btn-ghost rounded-2xl normal-case">Close</button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button aria-label="Close auto-fill values modal">close</button>
    </form>
  </dialog>

  <div id="workflow-canvas-view" class="fixed inset-0 z-[1200] hidden items-center justify-center overflow-auto p-4" style="background:rgba(0,0,0,0.28);">
    <div class="my-auto flex w-full max-w-[1180px] flex-col overflow-hidden rounded-[22px] border p-2 max-h-[calc(100vh-2rem)]" style="border-color:var(--border);background:var(--panel);">
      <div class="subsection-card mb-2 flex items-center justify-between gap-2 p-2">
        <div>
          <h3 class="text-base font-semibold">Workflow Canvas</h3>
          <p class="text-xs muted">Build a simple API call chain. Use the arrow connectors to place the next endpoint in the flow.</p>
        </div>
        <div class="flex items-center gap-2">
          <button id="canvas-save-workflow-btn" class="btn btn-ghost btn-xs rounded-xl normal-case">Save</button>
          <button id="canvas-run-workflow-btn" class="btn btn-outline btn-xs rounded-xl normal-case">Run</button>
          <button id="canvas-export-btn" class="btn btn-outline btn-xs rounded-xl normal-case">Export JSON</button>
          <label class="btn btn-ghost btn-xs rounded-xl normal-case">
            Import JSON
            <input id="canvas-import-file" type="file" accept="application/json" class="hidden" />
          </label>
          <button id="close-workflow-canvas-btn" class="btn btn-ghost btn-xs rounded-xl normal-case">Close</button>
        </div>
      </div>
      <div class="grid flex-1 min-h-0 gap-2 md:grid-cols-[246px_minmax(0,1fr)]" style="height:min(68vh,720px);">
        <div class="subsection-card min-h-0 space-y-2 overflow-auto p-2">
          <input id="canvas-workflow-name" placeholder="Workflow name" class="input input-bordered input-sm w-full rounded-2xl text-xs" />
          <label class="checkbox-row text-xs muted">
            <input id="canvas-workflow-continue" type="checkbox" class="toggle toggle-sm" />
            continue on failure
          </label>
          <select id="canvas-workflow-select" class="select select-bordered select-sm w-full rounded-2xl text-xs"></select>
          <div>
            <div class="mb-2 text-xs uppercase tracking-[0.16em] muted">Endpoint Library</div>
            <p class="mb-2 text-[11px] muted">Drag an API endpoint card into the flow builder. Drop it into the empty canvas to start, or onto an arrow to place the next call.</p>
            <div id="canvas-route-library" class="flow-route-library"></div>
          </div>
          <button id="canvas-clear-steps-btn" class="btn btn-ghost btn-sm w-full rounded-2xl normal-case">Clear Flow</button>
          <div>
            <div class="mb-1.5 text-xs uppercase tracking-[0.16em] muted">Call Order</div>
            <div id="canvas-step-list" class="space-y-1"></div>
          </div>
        </div>
        <div class="subsection-card flex min-h-0 flex-col p-2">
          <div class="mb-1.5">
            <h4 class="text-sm font-semibold">Flow Builder</h4>
            <p class="text-xs muted">Each card is an API call. Drag endpoint cards into the empty builder or onto an arrow to place the next step in the chain.</p>
          </div>
          <div id="workflow-canvas-area" class="flow-canvas flex-1 min-h-0 w-full"></div>
        </div>
      </div>
    </div>
  </div>

  <script>
    var state = {
      routes: [],
      selectedRoute: null,
      selectedRouteId: null,
      routeFilter: '',
      presets: [],
      templates: [],
      profiles: [],
      activeProfileId: '',
      suites: [],
      workflows: [],
      workflowDraft: null,
      workflowDragging: null,
      workflowCanvasDragRouteId: null,
      leftWidth: 320,
      responseTab: 'body',
      lastResponseByRoute: {},
      lastDiffByRoute: {},
      latestResponse: null,
      historyItems: [],
      historyLoading: false,
      historyLoadPromise: null,
      pendingHistoryAnimationKey: null,
      selectionPreviewSource: null,
      selectedHistoryKey: null,
      requestValidationAttempted: false,
      presetValidationAttempted: false,
      defaultValueOverrides: loadDefaultValueOverrides(),
      selectedPresetByRoute: {},
      selectedTemplateByRoute: {}
    };

    var htmlEl = document.documentElement;
    var bodyElRoot = document.body;
    var layoutGrid = document.getElementById('layout-grid');
    var handleLeft = document.getElementById('handle-left');
    var reloadLockEl = document.getElementById('reload-lock');

    var routeSearchEl = document.getElementById('route-search');
    var routeList = document.getElementById('route-list');
    var openWorkflowCanvasBtn = document.getElementById('open-workflow-canvas-btn');
    var reloadBtnEl = document.getElementById('reload-btn');
    var reloadIconEl = document.getElementById('reload-icon');
    var sourceInfo = document.getElementById('source-info');
    var baseUrlInput = document.getElementById('base-url');
    var profileSelect = document.getElementById('profile-select');
    var profileNameInput = document.getElementById('profile-name');
    var presetSelect = document.getElementById('preset-select');
    var presetDropdown = document.getElementById('preset-dropdown');
    var presetDropdownTrigger = document.getElementById('preset-dropdown-trigger');
    var presetDropdownMenu = document.getElementById('preset-dropdown-menu');
    var openPresetModalBtn = document.getElementById('open-preset-modal-btn');
    var templateSelect = document.getElementById('template-select');
    var templateDropdown = document.getElementById('template-dropdown');
    var templateDropdownTrigger = document.getElementById('template-dropdown-trigger');
    var templateDropdownMenu = document.getElementById('template-dropdown-menu');
    var openScenarioModalBtn = document.getElementById('open-scenario-modal-btn');
    var runBtnEl = document.getElementById('run-btn');
    var copyCurlBtnEl = document.getElementById('copy-curl-btn');
    var copyFetchBtnEl = document.getElementById('copy-fetch-btn');
    var historyRefreshBtnEl = document.getElementById('history-refresh-btn');
    var savePresetModalBtnEl = document.getElementById('save-preset-modal-btn');
    var saveScenarioModalBtnEl = document.getElementById('save-scenario-modal-btn');
    var templateNameInput = document.getElementById('template-name');
    var requestSummaryEl = document.getElementById('request-summary');
    var overrideOptionPathEl = document.getElementById('override-option-path');
    var overrideOptionQueryEl = document.getElementById('override-option-query');
    var overrideOptionHeadersEl = document.getElementById('override-option-headers');
    var overrideOptionPathLabelEl = document.getElementById('override-option-path-label');
    var overrideOptionQueryLabelEl = document.getElementById('override-option-query-label');
    var overrideOptionHeadersLabelEl = document.getElementById('override-option-headers-label');
    var overrideEmptyStateEl = document.getElementById('override-empty-state');
    var overridePathPanelEl = document.getElementById('override-path-panel');
    var overrideQueryPanelEl = document.getElementById('override-query-panel');
    var overrideHeadersPanelEl = document.getElementById('override-headers-panel');
    var pathParamsEl = document.getElementById('path-params');
    var pathParamsHighlightEl = document.getElementById('path-params-highlight');
    var queryEl = document.getElementById('query');
    var queryHighlightEl = document.getElementById('query-highlight');
    var headersEl = document.getElementById('headers');
    var headersHighlightEl = document.getElementById('headers-highlight');
    var bodyEl = document.getElementById('body');
    var bodyHighlightEl = document.getElementById('body-highlight');
    var requestValidationNoteEl = document.getElementById('request-validation-note');
    var statusEl = document.getElementById('status');
    var outputEl = document.getElementById('output');
    var copyResponseOutputBtn = document.getElementById('copy-response-output-btn');
    var diffOutputEl = document.getElementById('diff-output');
    var historyOutputEl = document.getElementById('history-output');
    var historyCodeFilterEl = document.getElementById('history-code-filter');
    var expectationsEl = document.getElementById('endpoint-expectations');
    var toastHostEl = document.getElementById('toast-host');
    var openValuesReferenceBtn = document.getElementById('open-values-reference-btn');
    var themeToggleEl = document.getElementById('theme-toggle');
    var themeIconEl = document.getElementById('theme-icon');
    var suiteSelect = document.getElementById('suite-select');
    var suiteJson = document.getElementById('suite-json');
    var workflowSelect = document.getElementById('workflow-select');
    var workflowNameInput = document.getElementById('workflow-name');
    var workflowContinueEl = document.getElementById('workflow-continue');
    var workflowRoutePicker = document.getElementById('workflow-route-picker');
    var workflowDiagramEl = document.getElementById('workflow-diagram');
    var workflowJson = document.getElementById('workflow-json');
    var workflowCanvasView = document.getElementById('workflow-canvas-view');
    var closeWorkflowCanvasBtn = document.getElementById('close-workflow-canvas-btn');
    var canvasSaveWorkflowBtn = document.getElementById('canvas-save-workflow-btn');
    var canvasRunWorkflowBtn = document.getElementById('canvas-run-workflow-btn');
    var canvasExportBtn = document.getElementById('canvas-export-btn');
    var canvasImportFile = document.getElementById('canvas-import-file');
    var canvasWorkflowNameInput = document.getElementById('canvas-workflow-name');
    var canvasWorkflowContinueEl = document.getElementById('canvas-workflow-continue');
    var canvasWorkflowSelect = document.getElementById('canvas-workflow-select');
    var canvasRouteLibrary = document.getElementById('canvas-route-library');
    var canvasClearStepsBtn = document.getElementById('canvas-clear-steps-btn');
    var canvasStepList = document.getElementById('canvas-step-list');
    var workflowCanvasArea = document.getElementById('workflow-canvas-area');
    var presetModal = document.getElementById('preset-modal');
    var presetModalName = document.getElementById('preset-modal-name');
    var presetModalFields = document.getElementById('preset-modal-fields');
    var presetModalExtraHeaders = document.getElementById('preset-modal-extra-headers');
    var presetModalExtraHeadersHighlight = document.getElementById('preset-modal-extra-headers-highlight');
    var presetModalValidationNoteEl = document.getElementById('preset-modal-validation-note');
    var scenarioModal = document.getElementById('scenario-modal');
    var scenarioModalName = document.getElementById('scenario-modal-name');
    var scenarioIncludePath = document.getElementById('scenario-modal-include-path');
    var scenarioIncludeQuery = document.getElementById('scenario-modal-include-query');
    var scenarioIncludeHeaders = document.getElementById('scenario-modal-include-headers');
    var scenarioIncludeBody = document.getElementById('scenario-modal-include-body');
    var selectionPreviewModal = document.getElementById('selection-preview-modal');
    var selectionPreviewTitleEl = document.getElementById('selection-preview-title');
    var selectionPreviewSummaryEl = document.getElementById('selection-preview-summary');
    var selectionPreviewContentEl = document.getElementById('selection-preview-content');
    var valuesReferenceModal = document.getElementById('values-reference-modal');
    var valuesReferenceContentEl = document.getElementById('values-reference-content');

    function isDesktop() {
      return window.matchMedia('(min-width: 1201px)').matches;
    }

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function applyGridTemplate() {
      if (!isDesktop()) {
        layoutGrid.style.removeProperty('grid-template-columns');
        return;
      }
      layoutGrid.style.gridTemplateColumns = state.leftWidth + 'px 12px minmax(640px,1fr) 12px minmax(640px,1fr)';
      localStorage.setItem('api_scout_left_width', String(state.leftWidth));
    }

    function startResize(event) {
      if (!isDesktop()) {
        return;
      }
      event.preventDefault();
      var rect = layoutGrid.getBoundingClientRect();
      var leftEdge = rect.left;
      handleLeft.classList.add('active');

      function onMove(moveEvent) {
        state.leftWidth = clamp(moveEvent.clientX - leftEdge, 260, 640);
        applyGridTemplate();
      }

      function onUp() {
        handleLeft.classList.remove('active');
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
      }

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    }

    function setTheme(theme) {
      htmlEl.setAttribute('data-theme', theme);
      localStorage.setItem('api_scout_theme', theme);
      themeIconEl.textContent = theme === 'dark' ? 'Dark' : 'Light';
    }

    function initTheme() {
      var saved = localStorage.getItem('api_scout_theme');
      if (saved === 'dark' || saved === 'light') {
        setTheme(saved);
      } else {
        setTheme('light');
      }
    }

    function initColumnSizes() {
      var savedLeft = Number(localStorage.getItem('api_scout_left_width'));
      if (Number.isFinite(savedLeft)) state.leftWidth = clamp(savedLeft, 260, 640);
      applyGridTemplate();
    }

    function initHelpHints() {
      document.querySelectorAll('.help-hint').forEach(function(node) {
        if (!(node instanceof HTMLElement)) return;
        var tip = node.getAttribute('data-tip') || node.getAttribute('title') || '';
        if (!tip) return;
        node.setAttribute('data-tip', tip);
        node.removeAttribute('title');
        if (!node.hasAttribute('tabindex')) {
          node.setAttribute('tabindex', '0');
        }
        if (!node.hasAttribute('aria-label')) {
          node.setAttribute('aria-label', tip);
        }
      });
    }

    async function fetchJson(url, options) {
      var res = await fetch(url, options);
      if (!res.ok) {
        var txt = await res.text();
        throw new Error('HTTP ' + res.status + ': ' + txt);
      }
      return res.json();
    }

    function pretty(value) {
      return JSON.stringify(value, null, 2);
    }

    function parseJsonArea(el) {
      try {
        return JSON.parse(el.value || '{}');
      } catch (err) {
        throw new Error('Invalid JSON in ' + el.id + ': ' + err.message);
      }
    }

    function readObjectArea(el, fallback) {
      try {
        var parsed = parseJsonArea(el);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return parsed;
        }
      } catch (_error) {}
      return fallback || {};
    }

    function showToast(message, type, durationMs) {
      if (!toastHostEl) return;
      var toast = document.createElement('div');
      var variant = type === 'success' ? 'alert-success' : type === 'error' ? 'alert-error' : 'alert-info';
      toast.className = 'toast alert ' + variant + ' ' + (type || 'info');
      toast.textContent = message;
      toastHostEl.appendChild(toast);
      var timeout = Number.isFinite(durationMs) ? durationMs : 2600;
      setTimeout(function() {
        toast.classList.add('out');
        setTimeout(function() { toast.remove(); }, 220);
      }, timeout);
    }

    function setStatus(message, mode) {
      statusEl.textContent = message;
      statusEl.className = 'text-sm ' + (mode === 'ok' ? 'status-ok' : mode === 'err' ? 'status-err' : 'status-idle');
    }

    function setReloading(isReloading) {
      reloadBtnEl.disabled = isReloading;
      reloadBtnEl.classList.toggle('opacity-60', isReloading);
      reloadBtnEl.classList.toggle('cursor-progress', isReloading);
      reloadIconEl.classList.toggle('animate-spin', isReloading);
      bodyElRoot.classList.toggle('reloading', isReloading);
      if (reloadLockEl) {
        reloadLockEl.classList.toggle('active', isReloading);
        reloadLockEl.setAttribute('aria-hidden', isReloading ? 'false' : 'true');
      }
    }

    function setHistoryRefreshing(isRefreshing) {
      if (!historyRefreshBtnEl) return;
      if (!historyRefreshBtnEl.dataset.defaultLabel) {
        historyRefreshBtnEl.dataset.defaultLabel = historyRefreshBtnEl.textContent || 'Refresh';
      }
      historyRefreshBtnEl.disabled = isRefreshing;
      historyRefreshBtnEl.classList.toggle('opacity-60', isRefreshing);
      historyRefreshBtnEl.classList.toggle('cursor-progress', isRefreshing);
      historyRefreshBtnEl.textContent = isRefreshing
        ? 'Refreshing...'
        : historyRefreshBtnEl.dataset.defaultLabel;
      historyRefreshBtnEl.setAttribute('aria-busy', isRefreshing ? 'true' : 'false');
    }

    function escapeHtml(value) {
      return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
    }

    function highlightJsonText(value) {
      var source = String(value || '');
      var tokenPattern = /"(?:\\u[0-9a-fA-F]{4}|\\[^u]|[^\\"])*"(?=\s*:)|"(?:\\u[0-9a-fA-F]{4}|\\[^u]|[^\\"])*"|true|false|null|-?\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?|[{}[\],:]/g;
      var lastIndex = 0;
      var html = '';
      source.replace(tokenPattern, function(match, offset) {
        html += escapeHtml(source.slice(lastIndex, offset));
        var className = 'syntax-punctuation';
        if (match[0] === '"') {
          className = /^\s*:/.test(source.slice(offset + match.length)) ? 'syntax-key' : 'syntax-string';
        } else if (/^-?\d/.test(match)) {
          className = 'syntax-number';
        } else if (match === 'true' || match === 'false') {
          className = 'syntax-boolean';
        } else if (match === 'null') {
          className = 'syntax-null';
        }
        html += '<span class="' + className + '">' + escapeHtml(match) + '</span>';
        lastIndex = offset + match.length;
        return match;
      });
      html += escapeHtml(source.slice(lastIndex));
      return html;
    }

    function renderCodeBlockHtml(value, mode) {
      var text = String(value || '');
      if (mode === 'json') {
        return '<code>' + highlightJsonText(text) + '</code>';
      }
      return '<code>' + escapeHtml(text) + '</code>';
    }

    function renderCodePanel(el, value, mode) {
      el.innerHTML = renderCodeBlockHtml(value, mode);
    }

    function syncJsonEditor(textareaEl, highlightEl, emptyValue) {
      if (!textareaEl || !highlightEl) return;
      highlightEl.innerHTML = renderCodeBlockHtml(textareaEl.value || emptyValue, 'json');
      highlightEl.scrollTop = textareaEl.scrollTop;
      highlightEl.scrollLeft = textareaEl.scrollLeft;
    }

    function autoGrowTextarea(textareaEl) {
      if (!textareaEl) return;
      var minHeight = parseFloat(window.getComputedStyle(textareaEl).minHeight || '0') || 0;
      textareaEl.style.height = '0px';
      textareaEl.style.height = Math.max(textareaEl.scrollHeight, minHeight) + 'px';
    }

    function syncBodyEditor() {
      autoGrowTextarea(bodyEl);
      syncJsonEditor(bodyEl, bodyHighlightEl, 'null');
    }

    function syncPathParamsEditor() {
      syncJsonEditor(pathParamsEl, pathParamsHighlightEl, '{}');
    }

    function syncQueryEditor() {
      syncJsonEditor(queryEl, queryHighlightEl, '{}');
    }

    function syncHeadersEditor() {
      syncJsonEditor(headersEl, headersHighlightEl, '{}');
    }

    function syncPresetExtraHeadersEditor() {
      syncJsonEditor(presetModalExtraHeaders, presetModalExtraHeadersHighlight, '{}');
    }

    function setOverrideTarget(target) {
      var normalized = target === 'path' || target === 'query' || target === 'headers' ? target : '';
      if (overrideOptionPathEl) overrideOptionPathEl.checked = normalized === 'path';
      if (overrideOptionQueryEl) overrideOptionQueryEl.checked = normalized === 'query';
      if (overrideOptionHeadersEl) overrideOptionHeadersEl.checked = normalized === 'headers';
      if (overrideOptionPathLabelEl) overrideOptionPathLabelEl.classList.toggle('active', normalized === 'path');
      if (overrideOptionQueryLabelEl) overrideOptionQueryLabelEl.classList.toggle('active', normalized === 'query');
      if (overrideOptionHeadersLabelEl) overrideOptionHeadersLabelEl.classList.toggle('active', normalized === 'headers');
      if (overrideEmptyStateEl) overrideEmptyStateEl.classList.toggle('hidden', Boolean(normalized));
      if (overridePathPanelEl) overridePathPanelEl.classList.toggle('hidden', normalized !== 'path');
      if (overrideQueryPanelEl) overrideQueryPanelEl.classList.toggle('hidden', normalized !== 'query');
      if (overrideHeadersPanelEl) overrideHeadersPanelEl.classList.toggle('hidden', normalized !== 'headers');
    }

    function normalizedAutoFillKey(name) {
      return String(name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    }

    var AUTO_FILL_GROUPS = [
      {
        title: 'Identity',
        items: [
          { id: 'email', label: 'Email', defaultValue: 'sample@dummy.com', note: 'Used for email, emailAddress, and email-like fields.', type: 'string' },
          { id: 'name', label: 'Name', defaultValue: 'Sample User', note: 'Used for name, fullName, and displayName style fields.', type: 'string' },
          { id: 'username', label: 'Username', defaultValue: 'sample_user', note: 'Used for username, handle, and login fields.', type: 'string' },
          { id: 'password', label: 'Password', defaultValue: 'DummyPass123!', note: 'Used for password and passcode fields.', type: 'string' },
          { id: 'phone', label: 'Phone', defaultValue: '+15551234567', note: 'Used for phone, mobile, and telephone fields.', type: 'string' },
          { id: 'uuid', label: 'UUID', defaultValue: '11111111-1111-4111-8111-111111111111', note: 'Used for uuid fields and uuid-formatted strings.', type: 'string' },
          { id: 'identifier', label: 'Identifier', defaultValue: '101', note: 'Used for id and numeric identifier path/query/body values.', type: 'number' }
        ]
      },
      {
        title: 'Network And Auth',
        items: [
          { id: 'url', label: 'URL', defaultValue: 'https://example.com/sample', note: 'Used for url, uri, website, image, and avatar style fields.', type: 'string' },
          { id: 'token', label: 'Token', defaultValue: 'dummy-token', note: 'Used for token, secret, and auth-like string fields.', type: 'string' },
          { id: 'authorization_header', label: 'Authorization Header', defaultValue: 'Bearer dummy-token', note: 'Used for Authorization and similar auth header names.', type: 'string' },
          { id: 'api_key_header', label: 'API Key Header', defaultValue: 'dummy-api-key', note: 'Used for X-API-Key and apiKey style headers.', type: 'string' },
          { id: 'cookie_header', label: 'Cookie Header', defaultValue: 'session=dummy-session', note: 'Used for Cookie headers.', type: 'string' }
        ]
      },
      {
        title: 'Dates And Numbers',
        items: [
          { id: 'date', label: 'Date', defaultValue: '2026-01-01', note: 'Used for date fields and date-formatted strings.', type: 'string' },
          { id: 'datetime', label: 'Date Time', defaultValue: '2026-01-01T09:00:00.000Z', note: 'Used for datetime, timestamp, and date-time formatted values.', type: 'string' },
          { id: 'amount', label: 'Amounts', defaultValue: '99.99', note: 'Used for amount, total, balance, and price-style number fields.', type: 'number' },
          { id: 'age', label: 'Age', defaultValue: '21', note: 'Used for age-style number fields.', type: 'number' }
        ]
      },
      {
        title: 'Location And Text',
        items: [
          { id: 'location', label: 'Location', defaultValue: '123 Sample Street / Sample City / 12345', note: 'Used for address, city, state, country, and postal-style fields.', type: 'string' },
          { id: 'title', label: 'Title', defaultValue: 'Sample Title', note: 'Used for title and subject-style fields.', type: 'string' },
          { id: 'description', label: 'Description', defaultValue: 'Sample description', note: 'Used for description, summary, bio, and about fields.', type: 'string' },
          { id: 'message', label: 'Message', defaultValue: 'Sample text', note: 'Used for message, content, comment, and text fields.', type: 'string' }
        ]
      }
    ];

    function loadDefaultValueOverrides() {
      try {
        var parsed = JSON.parse(localStorage.getItem('route_scout_default_value_overrides') || '{}');
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
      } catch (err) {
        return {};
      }
    }

    function findDefaultValueItem(id) {
      for (var i = 0; i < AUTO_FILL_GROUPS.length; i += 1) {
        for (var j = 0; j < AUTO_FILL_GROUPS[i].items.length; j += 1) {
          if (AUTO_FILL_GROUPS[i].items[j].id === id) return AUTO_FILL_GROUPS[i].items[j];
        }
      }
      return null;
    }

    function resolveDefaultValue(id) {
      var item = findDefaultValueItem(id);
      if (!item) return '';
      var override = state.defaultValueOverrides && Object.prototype.hasOwnProperty.call(state.defaultValueOverrides, id)
        ? state.defaultValueOverrides[id]
        : undefined;
      return override == null || override === '' ? item.defaultValue : String(override);
    }

    function saveDefaultValueOverrides() {
      localStorage.setItem('route_scout_default_value_overrides', JSON.stringify(state.defaultValueOverrides || {}));
    }

    function defaultNameParts() {
      var fullName = resolveDefaultValue('name').trim();
      var parts = fullName ? fullName.split(/\s+/) : ['Sample', 'User'];
      return {
        first: parts[0] || 'Sample',
        last: parts.length > 1 ? parts.slice(1).join(' ') : (parts[0] || 'User')
      };
    }

    function defaultLocationParts() {
      var raw = resolveDefaultValue('location');
      var parts = raw.split('/').map(function(part) { return part.trim(); }).filter(Boolean);
      return {
        street: parts[0] || raw || '123 Sample Street',
        city: parts[1] || 'Sample City',
        postal: parts[2] || '12345'
      };
    }

    function matchDefaultValueId(name, location) {
      var key = normalizedAutoFillKey(name);
      if (!key) return '';
      if (location === 'header') {
        if (key.includes('authorization')) return 'authorization_header';
        if (key.includes('apikey') || key.includes('clientid')) return 'api_key_header';
        if (key.includes('cookie')) return 'cookie_header';
        if (key.includes('token') || key.includes('secret')) return 'token';
      }
      if (key.includes('email')) return 'email';
      if (key.includes('uuid')) return 'uuid';
      if (key.includes('firstname') || key.includes('givenname') || key.includes('forename')) return 'name';
      if (key.includes('lastname') || key.includes('surname') || key.includes('familyname')) return 'name';
      if (key === 'name' || key.includes('fullname') || key.includes('displayname')) return 'name';
      if (key.includes('username') || key.includes('handle') || key.includes('login')) return 'username';
      if (key.includes('password') || key.includes('passcode')) return 'password';
      if (isPhoneLikeKey(key)) return 'phone';
      if (key.includes('title') || key.includes('subject')) return 'title';
      if (key.includes('description') || key.includes('summary') || key.includes('bio') || key.includes('about')) return 'description';
      if (key.includes('message') || key.includes('content') || key.includes('comment') || key === 'text') return 'message';
      if (key.includes('address') || key.includes('street') || key.includes('city') || key.includes('state') || key.includes('province') || key.includes('region') || key.includes('country') || key.includes('postal') || key.includes('zipcode') || key === 'zip') return 'location';
      if (key.includes('date') && !key.includes('time')) return 'date';
      if (key.includes('time') || key.includes('timestamp')) return 'datetime';
      if (key.includes('url') || key.includes('uri') || key.includes('website') || key.includes('avatar') || key.includes('image') || key.includes('photo')) return 'url';
      if (key.includes('id')) return 'identifier';
      if (key.includes('price') || key.includes('amount') || key.includes('total') || key.includes('balance')) return 'amount';
      if (key.includes('age')) return 'age';
      if (key.includes('token') || key.includes('secret')) return 'token';
      return '';
    }

    function isPhoneLikeKey(name) {
      var key = normalizedAutoFillKey(name);
      return key.includes('phone') || key.includes('mobile') || key.includes('telephone') || key === 'tel';
    }

    function buildValuesReferenceGroups() {
      return AUTO_FILL_GROUPS.map(function(group) {
        return {
          title: group.title,
          items: group.items.map(function(item) {
            return {
              id: item.id,
              label: item.label,
              value: resolveDefaultValue(item.id),
              note: item.note,
              type: item.type
            };
          })
        };
      });
    }

    function coerceDefaultValueForField(id, originalValue, keyName) {
      var resolved = resolveDefaultValue(id);
      var key = normalizedAutoFillKey(keyName);
      if (id === 'name') {
        var parts = defaultNameParts();
        if (key.includes('firstname') || key.includes('givenname') || key.includes('forename')) return parts.first;
        if (key.includes('lastname') || key.includes('surname') || key.includes('familyname')) return parts.last;
      }
      if (id === 'location') {
        var locationParts = defaultLocationParts();
        if (key.includes('city')) return locationParts.city;
        if (key.includes('postal') || key.includes('zipcode') || key === 'zip') return locationParts.postal;
        if (key.includes('address') || key.includes('street')) return locationParts.street;
        return originalValue;
      }
      if (typeof originalValue === 'number') {
        var numericValue = Number(resolved);
        return Number.isFinite(numericValue) ? numericValue : originalValue;
      }
      return resolved;
    }

    function applyDefaultValueOverridesToBody(value, keyHint) {
      if (Array.isArray(value)) {
        return value.map(function(item) {
          return applyDefaultValueOverridesToBody(item, keyHint);
        });
      }
      if (value && typeof value === 'object') {
        return Object.fromEntries(Object.entries(value).map(function(entry) {
          return [entry[0], applyDefaultValueOverridesToBody(entry[1], entry[0])];
        }));
      }
      var matchedId = matchDefaultValueId(keyHint, 'body');
      if (!matchedId) return value;
      return coerceDefaultValueForField(matchedId, value, keyHint);
    }

    function requestStringSample(name, location) {
      var key = normalizedAutoFillKey(name);
      var matchedId = matchDefaultValueId(name, location);
      if (location === 'header') {
        if (matchedId === 'authorization_header') return resolveDefaultValue('authorization_header');
        if (matchedId === 'api_key_header') return resolveDefaultValue('api_key_header');
        if (matchedId === 'cookie_header') return resolveDefaultValue('cookie_header');
        if (matchedId === 'token') return resolveDefaultValue('token');
        if (key.includes('contenttype') || key === 'accept') return 'application/json';
      }
      if (matchedId === 'email') return resolveDefaultValue('email');
      if (matchedId === 'uuid') return resolveDefaultValue('uuid');
      if (matchedId === 'name') return coerceDefaultValueForField('name', '', name);
      if (matchedId === 'username') return resolveDefaultValue('username');
      if (matchedId === 'password') return resolveDefaultValue('password');
      if (matchedId === 'phone') return resolveDefaultValue('phone');
      if (key.includes('slug')) return 'sample-slug';
      if (matchedId === 'title') return resolveDefaultValue('title');
      if (matchedId === 'description') return resolveDefaultValue('description');
      if (matchedId === 'message') return resolveDefaultValue('message');
      if (matchedId === 'location' && (key.includes('address') || key.includes('street') || key.includes('city') || key.includes('postal') || key.includes('zipcode') || key === 'zip')) {
        return coerceDefaultValueForField('location', '', name);
      }
      if (key.includes('state') || key.includes('province') || key.includes('region')) return 'Sample State';
      if (key.includes('country')) return 'Sample Country';
      if (key.includes('company') || key.includes('organization') || key === 'org') return 'Sample Company';
      if (key.includes('role')) return 'member';
      if (matchedId === 'date') return resolveDefaultValue('date');
      if (matchedId === 'datetime') return resolveDefaultValue('datetime');
      if (matchedId === 'url') return resolveDefaultValue('url');
      if (matchedId === 'identifier') return resolveDefaultValue('identifier');
      if (key.includes('page')) return '1';
      if (key.includes('limit') || key.includes('size') || key.includes('count') || key.includes('quantity')) return '10';
      if (matchedId === 'amount') return resolveDefaultValue('amount');
      if (matchedId === 'age') return resolveDefaultValue('age');
      return 'sample';
    }

    function renderValuesReference() {
      if (!valuesReferenceContentEl) return;
      valuesReferenceContentEl.innerHTML = buildValuesReferenceGroups().map(function(group) {
        return '<section class="value-reference-category">' +
          '<div class="value-reference-category-title">' + escapeHtml(group.title) + '</div>' +
          '<div class="value-reference-list">' +
            group.items.map(function(item) {
              return '<div class="value-reference-item">' +
                '<div class="value-reference-heading">' +
                  '<label class="value-reference-title" for="default-value-' + escapeHtml(item.id) + '">' + escapeHtml(item.label) + '</label>' +
                  '<input id="default-value-' + escapeHtml(item.id) + '" class="input input-sm rounded-2xl value-reference-input" data-default-id="' + escapeHtml(item.id) + '" type="text" value="' + escapeHtml(item.value) + '" />' +
                '</div>' +
                '<div class="value-reference-note">' + escapeHtml(item.note) + '</div>' +
              '</div>';
            }).join('') +
          '</div>' +
        '</section>';
      }).join('');
    }

    function setValidationNote(noteEl, message) {
      if (!noteEl) return;
      noteEl.textContent = message || '';
      noteEl.classList.toggle('hidden', !message);
    }

    function setFieldInvalid(el, invalid) {
      if (!el) return;
      el.classList.toggle('field-invalid', Boolean(invalid));
    }

    function setButtonsDisabled(buttons, disabled, title) {
      (buttons || []).forEach(function(button) {
        if (!button) return;
        button.disabled = Boolean(disabled);
        button.classList.toggle('opacity-60', Boolean(disabled));
        button.title = disabled ? (title || '') : '';
      });
    }

    function parseJsonInput(rawValue, label, fallbackText) {
      try {
        return { ok: true, value: JSON.parse(String(rawValue || '').trim() ? rawValue : fallbackText) };
      } catch (err) {
        return { ok: false, message: label + ' has invalid JSON: ' + err.message };
      }
    }

    function parseObjectInput(rawValue, label) {
      var parsed = parseJsonInput(rawValue, label, '{}');
      if (!parsed.ok) return parsed;
      if (!parsed.value || typeof parsed.value !== 'object' || Array.isArray(parsed.value)) {
        return { ok: false, message: label + ' must be a JSON object.' };
      }
      return parsed;
    }

    function inferredBodySchema(route) {
      if (!route || route.bodySchema) return route ? route.bodySchema : undefined;
      var bodyFields = (route.inferredFields || []).filter(function(field) {
        return field.location === 'body' && field.name;
      });
      if (!bodyFields.length) return undefined;
      var properties = {};
      var required = [];
      bodyFields.forEach(function(field) {
        properties[field.name] = {
          type: field.type && field.type !== 'unknown' ? field.type : undefined,
          format: field.format,
          minimum: field.minimum,
          maximum: field.maximum,
          minLength: field.minLength,
          maxLength: field.maxLength,
          pattern: field.pattern,
          enum: field.enum
        };
        if (field.required) {
          required.push(field.name);
        }
      });
      return {
        type: 'object',
        properties: properties,
        required: required
      };
    }

    function schemaTypes(schema) {
      if (!schema) return [];
      if (Array.isArray(schema.type)) return schema.type.slice();
      if (schema.type) return [schema.type];
      if (schema.properties) return ['object'];
      if (schema.items) return ['array'];
      return [];
    }

    function schemaTypeMatches(value, typeName) {
      if (typeName === 'null') return value === null;
      if (typeName === 'array') return Array.isArray(value);
      if (typeName === 'object') return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
      if (typeName === 'integer') return typeof value === 'number' && Number.isInteger(value);
      if (typeName === 'number') return typeof value === 'number' && Number.isFinite(value);
      if (typeName === 'string') return typeof value === 'string';
      if (typeName === 'boolean') return typeof value === 'boolean';
      return true;
    }

    function validateAgainstSchema(value, schema, path, issues) {
      if (!schema) return;

      if (schema.anyOf && schema.anyOf.length) {
        var anyOfPasses = schema.anyOf.some(function(option) {
          var optionIssues = [];
          validateAgainstSchema(value, option, path, optionIssues);
          return optionIssues.length === 0;
        });
        if (!anyOfPasses) {
          issues.push(path + ' does not match any allowed shape.');
        }
        return;
      }

      if (schema.oneOf && schema.oneOf.length) {
        var matches = schema.oneOf.filter(function(option) {
          var optionIssues = [];
          validateAgainstSchema(value, option, path, optionIssues);
          return optionIssues.length === 0;
        }).length;
        if (matches !== 1) {
          issues.push(path + ' must match exactly one allowed shape.');
        }
        return;
      }

      if (schema.allOf && schema.allOf.length) {
        schema.allOf.forEach(function(option) {
          validateAgainstSchema(value, option, path, issues);
        });
      }

      var allowedTypes = schemaTypes(schema);
      if (value === null) {
        if (schema.nullable || allowedTypes.indexOf('null') >= 0 || !allowedTypes.length) {
          return;
        }
        issues.push(path + ' must be ' + schemaTypeLabel(schema) + '.');
        return;
      }

      if (allowedTypes.length && !allowedTypes.some(function(typeName) { return schemaTypeMatches(value, typeName); })) {
        issues.push(path + ' must be ' + schemaTypeLabel(schema) + '.');
        return;
      }

      if (schema.enum && schema.enum.length) {
        var matchesEnum = schema.enum.some(function(option) { return option === value; });
        if (!matchesEnum) {
          issues.push(path + ' must match one of the allowed values.');
        }
      }

      if (typeof value === 'string') {
        if (typeof schema.minLength === 'number' && value.length < schema.minLength) {
          issues.push(path + ' must be at least ' + schema.minLength + ' characters.');
        }
        if (typeof schema.maxLength === 'number' && value.length > schema.maxLength) {
          issues.push(path + ' must be at most ' + schema.maxLength + ' characters.');
        }
        if (schema.pattern) {
          try {
            if (!(new RegExp(schema.pattern)).test(value)) {
              issues.push(path + ' does not match the expected format.');
            }
          } catch (_error) {}
        }
      }

      if (typeof value === 'number') {
        if (typeof schema.minimum === 'number' && value < schema.minimum) {
          issues.push(path + ' must be >= ' + schema.minimum + '.');
        }
        if (typeof schema.exclusiveMinimum === 'number' && value <= schema.exclusiveMinimum) {
          issues.push(path + ' must be > ' + schema.exclusiveMinimum + '.');
        }
        if (typeof schema.maximum === 'number' && value > schema.maximum) {
          issues.push(path + ' must be <= ' + schema.maximum + '.');
        }
        if (typeof schema.exclusiveMaximum === 'number' && value >= schema.exclusiveMaximum) {
          issues.push(path + ' must be < ' + schema.exclusiveMaximum + '.');
        }
      }

      if (Array.isArray(value) && schema.items) {
        value.forEach(function(item, index) {
          validateAgainstSchema(item, schema.items, path + '[' + index + ']', issues);
        });
      }

      if (value && typeof value === 'object' && !Array.isArray(value) && schema.properties) {
        (schema.required || []).forEach(function(key) {
          if (value[key] === undefined) {
            issues.push(path + '.' + key + ' is required.');
          }
        });
        Object.keys(schema.properties).forEach(function(key) {
          if (value[key] !== undefined) {
            validateAgainstSchema(value[key], schema.properties[key], path + '.' + key, issues);
          }
        });
      }
    }

    function validateRequestInputs() {
      var issues = [];
      var fieldErrors = {};
      var pathResult = parseObjectInput(pathParamsEl.value, 'Path params');
      var queryResult = parseObjectInput(queryEl.value, 'Query');
      var headersResult = parseObjectInput(headersEl.value, 'Headers');
      var bodyResult = parseJsonInput(bodyEl.value, 'Body payload', '{}');

      if (!pathResult.ok) {
        fieldErrors.path = pathResult.message;
        issues.push(pathResult.message);
      }
      if (!queryResult.ok) {
        fieldErrors.query = queryResult.message;
        issues.push(queryResult.message);
      }
      if (!headersResult.ok) {
        fieldErrors.headers = headersResult.message;
        issues.push(headersResult.message);
      }
      if (!bodyResult.ok) {
        fieldErrors.body = bodyResult.message;
        issues.push(bodyResult.message);
      } else if (state.selectedRoute) {
        var bodyIssues = [];
        validateAgainstSchema(bodyResult.value, inferredBodySchema(state.selectedRoute), 'Body', bodyIssues);
        if (bodyIssues.length) {
          fieldErrors.body = bodyIssues[0];
          Array.prototype.push.apply(issues, bodyIssues);
        }
      }

      return {
        valid: issues.length === 0,
        issues: issues,
        fieldErrors: fieldErrors,
        payload: issues.length === 0 && state.selectedRoute ? {
          routeId: state.selectedRoute.id,
          baseUrl: String(baseUrlInput.value || '').trim() || undefined,
          pathParams: pathResult.value,
          query: queryResult.value,
          headers: headersResult.value,
          body: bodyResult.value,
          presetName: presetSelect.value || undefined
        } : null
      };
    }

    function validatePresetModalInputs() {
      var issues = [];
      var missing = [];
      if (presetModalFields) {
        presetModalFields.querySelectorAll('[data-preset-header]').forEach(function(input) {
          var headerName = input.getAttribute('data-preset-header') || '';
          var value = String(input.value || '').trim();
          var invalid = input.hasAttribute('required') && !value;
          setFieldInvalid(input, invalid);
          if (invalid) {
            missing.push(headerName);
          }
        });
      }
      if (missing.length) {
        issues.push('Fill required headers: ' + missing.join(', '));
      }
      var extraHeadersResult = parseObjectInput(presetModalExtraHeaders.value, 'Additional headers JSON');
      if (!extraHeadersResult.ok) {
        issues.push(extraHeadersResult.message);
      }
      return {
        valid: issues.length === 0,
        issues: issues,
        extraHeaders: extraHeadersResult.ok ? extraHeadersResult.value : {}
      };
    }

    function updateRequestValidationUI(showErrors) {
      var validation = validateRequestInputs();
      var visible = Boolean(showErrors);
      setFieldInvalid(bodyEl.parentElement, visible && Boolean(validation.fieldErrors.body));
      setFieldInvalid(pathParamsEl, visible && Boolean(validation.fieldErrors.path));
      setFieldInvalid(queryEl, visible && Boolean(validation.fieldErrors.query));
      setFieldInvalid(headersEl, visible && Boolean(validation.fieldErrors.headers));
      setValidationNote(requestValidationNoteEl, visible ? (validation.issues[0] || '') : '');
      setButtonsDisabled(
        [runBtnEl, copyCurlBtnEl, copyFetchBtnEl, openScenarioModalBtn, saveScenarioModalBtnEl],
        false,
        ''
      );
      return validation;
    }

    function updatePresetModalValidationUI(showErrors) {
      var validation = validatePresetModalInputs();
      var visible = Boolean(showErrors);
      setFieldInvalid(presetModalExtraHeaders.parentElement, visible && !parseObjectInput(presetModalExtraHeaders.value, 'Additional headers JSON').ok);
      setValidationNote(presetModalValidationNoteEl, visible ? (validation.issues[0] || '') : '');
      setButtonsDisabled([savePresetModalBtnEl], false, '');
      return validation;
    }

    function buildPayload() {
      return {
        routeId: state.selectedRoute.id,
        baseUrl: String(baseUrlInput.value || '').trim() || undefined,
        pathParams: parseJsonArea(pathParamsEl),
        query: parseJsonArea(queryEl),
        headers: parseJsonArea(headersEl),
        body: parseJsonArea(bodyEl),
        presetName: presetSelect.value || undefined
      };
    }

    function routeButtonClass(active) {
      return active ? 'route-btn active w-full px-4 py-3 text-left' : 'route-btn w-full px-4 py-3 text-left';
    }

    function routeMethodClass(method) {
      var normalized = String(method || '').toUpperCase();
      if (normalized === 'GET') return 'route-method-get';
      if (normalized === 'POST') return 'route-method-post';
      if (normalized === 'PUT') return 'route-method-put';
      if (normalized === 'PATCH') return 'route-method-patch';
      if (normalized === 'DELETE') return 'route-method-delete';
      return 'route-method-default';
    }

    function filteredRoutes() {
      var needle = (state.routeFilter || '').trim().toLowerCase();
      if (!needle) return state.routes;
      return state.routes.filter(function(route) {
        return (route.method + ' ' + route.path).toLowerCase().includes(needle);
      });
    }

    function renderRoutes() {
      var routes = filteredRoutes();
      routeList.innerHTML = '';
      if (routes.length === 0) {
        routeList.innerHTML = '<div class="rounded-2xl border px-4 py-3 text-sm muted" style="border-color:var(--border);background:var(--panel);">No endpoints found</div>';
        return;
      }

      for (var i = 0; i < routes.length; i += 1) {
        var route = routes[i];
        var button = document.createElement('button');
        button.dataset.routeId = route.id;
        button.className = routeButtonClass(route.id === state.selectedRouteId);
        button.innerHTML =
          '<div class="route-framework mb-2 text-[11px] font-semibold uppercase tracking-[0.16em]">' + route.framework.toUpperCase() + '</div>' +
          '<div class="flex items-center gap-2"><span class="method-chip ' + routeMethodClass(route.method) + '">' + route.method + '</span><span class="font-mono text-xs muted">' + route.path + '</span></div>';
        button.addEventListener('click', (function(r) {
          return function() { selectRoute(r); };
        })(route));
        routeList.appendChild(button);
      }

      if (!state.selectedRouteId || !routes.some(function(route) { return route.id === state.selectedRouteId; })) {
        selectRoute(routes[0]);
      }
    }

    var selectDropdownRegistry = {};

    function closeOpenDropdownsExcept(target) {
      Object.keys(selectDropdownRegistry).forEach(function(key) {
        var dropdownRefs = selectDropdownRegistry[key];
        if (!dropdownRefs || !dropdownRefs.detailsEl || !dropdownRefs.detailsEl.open) return;
        if (target && dropdownRefs.detailsEl.contains(target)) return;
        dropdownRefs.detailsEl.open = false;
      });
    }

    function renderPresets() {
      presetSelect.innerHTML = '';
      var none = document.createElement('option');
      none.value = '';
      none.textContent = 'No header preset';
      presetSelect.appendChild(none);
      for (var i = 0; i < state.presets.length; i += 1) {
        var preset = state.presets[i];
        var opt = document.createElement('option');
        opt.value = preset.name;
        opt.textContent = preset.name;
        presetSelect.appendChild(opt);
      }
      renderSelectDropdown(presetSelect, 'No header preset', {
        detailsEl: presetDropdown,
        triggerEl: presetDropdownTrigger,
        menuEl: presetDropdownMenu
      });
    }

    function renderTemplates() {
      templateSelect.innerHTML = '';
      var none = document.createElement('option');
      none.value = '';
      none.textContent = 'No saved scenario';
      templateSelect.appendChild(none);
      if (!state.selectedRoute) return;
      var filtered = state.templates.filter(function(item) {
        return item.routeId === state.selectedRoute.id;
      });
      for (var i = 0; i < filtered.length; i += 1) {
        var template = filtered[i];
        var opt = document.createElement('option');
        opt.value = template.id;
        opt.textContent = template.name;
        templateSelect.appendChild(opt);
      }
      var rememberedTemplateId = state.selectedTemplateByRoute[state.selectedRoute.id] || '';
      templateSelect.value = filtered.some(function(item) { return item.id === rememberedTemplateId; }) ? rememberedTemplateId : '';
      renderSelectDropdown(templateSelect, 'No saved scenario', {
        detailsEl: templateDropdown,
        triggerEl: templateDropdownTrigger,
        menuEl: templateDropdownMenu
      });
    }

    function ensureSelectDropdown(selectEl, fallbackText, refs) {
      if (!selectEl) return null;
      var key = selectEl.id || fallbackText;
      if (!selectDropdownRegistry[key]) {
        var detailsEl = refs && refs.detailsEl ? refs.detailsEl : document.createElement('details');
        var triggerEl = refs && refs.triggerEl ? refs.triggerEl : document.createElement('summary');
        var menuEl = refs && refs.menuEl ? refs.menuEl : document.createElement('ul');

        if (!refs) {
          detailsEl.className = 'dropdown';
          triggerEl.className = 'btn btn-sm picker-summary rounded-2xl normal-case';
          menuEl.className = 'menu dropdown-content picker-menu rounded-2xl z-[60]';
          detailsEl.appendChild(triggerEl);
          detailsEl.appendChild(menuEl);
          if (selectEl.parentNode) {
            selectEl.parentNode.insertBefore(detailsEl, selectEl);
          }
        }

        selectEl.classList.add('hidden');
        selectDropdownRegistry[key] = {
          detailsEl: detailsEl,
          triggerEl: triggerEl,
          menuEl: menuEl,
          fallbackText: fallbackText
        };
      }
      return selectDropdownRegistry[key];
    }

    function updateDropdownLabel(selectEl, fallbackText, refs) {
      var dropdownRefs = ensureSelectDropdown(selectEl, fallbackText, refs);
      if (!dropdownRefs || !dropdownRefs.triggerEl) return;
      var option = selectEl.options[selectEl.selectedIndex] || selectEl.options[0];
      dropdownRefs.triggerEl.textContent = option ? option.textContent : fallbackText;
    }

    function renderSelectDropdown(selectEl, fallbackText, refs) {
      var dropdownRefs = ensureSelectDropdown(selectEl, fallbackText, refs);
      if (!selectEl || !dropdownRefs || !dropdownRefs.menuEl || !dropdownRefs.triggerEl) return;
      dropdownRefs.menuEl.innerHTML = '';

      for (var i = 0; i < selectEl.options.length; i += 1) {
        var option = selectEl.options[i];
        var li = document.createElement('li');
        var button = document.createElement('button');
        button.type = 'button';
        button.textContent = option.textContent;
        button.className = option.value === selectEl.value ? 'active' : '';
        button.addEventListener('click', (function(value) {
          return function() {
            selectEl.value = value;
            if (selectEl === presetSelect || selectEl === templateSelect) {
              state.selectionPreviewSource = value ? selectEl.id : null;
            }
            renderSelectDropdown(selectEl, fallbackText, refs);
            selectEl.dispatchEvent(new Event('change', { bubbles: true }));
            if (dropdownRefs.detailsEl) {
              dropdownRefs.detailsEl.open = false;
            }
          };
        })(option.value));
        li.appendChild(button);
        dropdownRefs.menuEl.appendChild(li);
      }

      updateDropdownLabel(selectEl, fallbackText, refs);
    }

    function nextAutoName(prefix, existingNames) {
      var seen = {};
      (existingNames || []).forEach(function(name) {
        var key = String(name || '').trim().toLowerCase();
        if (key) seen[key] = true;
      });

      var index = 1;
      while (seen[(prefix + ' ' + index).toLowerCase()]) {
        index += 1;
      }
      return prefix + ' ' + index;
    }

    function buildPresetHeaderPrompts(route) {
      var prompts = [];
      var seen = {};

      function addPrompt(name, options) {
        var headerName = String(name || '').trim();
        if (!headerName) return;
        var key = headerName.toLowerCase();
        if (seen[key]) return;
        seen[key] = true;
        prompts.push({
          name: headerName,
          required: Boolean(options && options.required),
          placeholder: options && options.placeholder ? options.placeholder : '',
          note: options && options.note ? options.note : ''
        });
      }

      (route.authRequirements || []).forEach(function(item) {
        var kind = String(item.kind || '').toLowerCase();
        if (kind === 'bearer') {
          addPrompt(item.headerName || 'Authorization', { required: true, placeholder: 'Bearer <token>', note: 'auth requirement' });
        } else if (item.headerName) {
          addPrompt(item.headerName, { required: true, placeholder: kind === 'apikey' ? 'your-api-key' : '', note: 'auth requirement' });
        } else if (kind === 'cookie' || kind === 'session') {
          addPrompt('Cookie', { required: true, placeholder: item.cookieName ? item.cookieName + '=...' : 'session=...', note: 'auth requirement' });
        }
      });

      (route.inferredFields || []).forEach(function(field) {
        if (field.location === 'header') {
          addPrompt(field.name, { required: Boolean(field.required), note: field.required ? 'required header' : 'inferred header' });
        }
      });

      (route.headers || []).forEach(function(name) {
        addPrompt(name, { required: false, note: 'route header' });
      });

      return prompts;
    }

    function resetRequestInputsFromRoute(route) {
      if (!route) return;
      templateNameInput.value = '';
      presetSelect.value = state.selectedPresetByRoute[route.id] || '';
      templateSelect.value = state.selectedTemplateByRoute[route.id] || '';
      renderSelectDropdown(presetSelect, 'No header preset', {
        detailsEl: presetDropdown,
        triggerEl: presetDropdownTrigger,
        menuEl: presetDropdownMenu
      });
      renderSelectDropdown(templateSelect, 'No saved scenario', {
        detailsEl: templateDropdown,
        triggerEl: templateDropdownTrigger,
        menuEl: templateDropdownMenu
      });
      applyCurrentSelectionsToRequestInputs(route);
    }

    function applyCurrentSelectionsToRequestInputs(route) {
      if (!route) return;
      var pathObj = Object.fromEntries((route.pathParams || []).map(function(p) { return [p, requestStringSample(p, 'path')]; }));
      var queryObj = Object.fromEntries((route.queryParams || []).map(function(p) { return [p, requestStringSample(p, 'query')]; }));
      var headerObj = Object.fromEntries((route.headers || []).map(function(h) { return [h, requestStringSample(h, 'header')]; }));
      var bodyValue = applyDefaultValueOverridesToBody(route.dummyBody ?? null);

      var selectedTemplate = templateSelect.value
        ? state.templates.find(function(item) { return item.id === templateSelect.value; })
        : null;
      if (selectedTemplate) {
        templateNameInput.value = selectedTemplate.name;
        pathObj = selectedTemplate.pathParams ? { ...selectedTemplate.pathParams } : {};
        queryObj = selectedTemplate.query ? { ...selectedTemplate.query } : {};
        headerObj = selectedTemplate.headers ? { ...selectedTemplate.headers } : {};
        bodyValue = selectedTemplate.body ?? null;
      } else {
        templateNameInput.value = '';
      }

      var selectedPreset = presetSelect.value
        ? state.presets.find(function(item) { return item.name === presetSelect.value; })
        : null;
      if (selectedPreset) {
        headerObj = { ...(selectedPreset.headers || {}), ...headerObj };
      }

      pathParamsEl.value = pretty(pathObj);
      queryEl.value = pretty(queryObj);
      headersEl.value = pretty(headerObj);
      bodyEl.value = pretty(bodyValue);
      syncPathParamsEditor();
      syncQueryEditor();
      syncHeadersEditor();
      syncBodyEditor();
      renderRequestSummary(route);
      state.requestValidationAttempted = false;
      updateRequestValidationUI(false);
    }

    function renderRequestSummary(route) {
      if (!requestSummaryEl) return;
      if (!route) {
        requestSummaryEl.innerHTML = '';
        return;
      }
      var bodyFields = (route.inferredFields || []).filter(function(field) { return field.location === 'body'; }).length;
      var authCount = (route.authRequirements || []).length;
      var loadedScenario = templateSelect.value
        ? state.templates.find(function(item) { return item.id === templateSelect.value; })
        : null;
      var bodyLabel = route.bodySchema || bodyFields || route.dummyBody !== undefined ? 'body inferred' : 'no body expected';
      var chips = [
        '<span class="request-overview-chip"><strong>Mode</strong><span>auto-filled from scan</span></span>',
        '<span class="request-overview-chip"><strong>Path</strong><span>' + String((route.pathParams || []).length) + '</span></span>',
        '<span class="request-overview-chip"><strong>Query</strong><span>' + String((route.queryParams || []).length) + '</span></span>',
        '<span class="request-overview-chip"><strong>Headers</strong><span>' + String((route.headers || []).length) + '</span></span>',
        '<span class="request-overview-chip"><strong>Auth</strong><span>' + (authCount ? String(authCount) + ' hint' + (authCount === 1 ? '' : 's') : 'none inferred') + '</span></span>',
        '<span class="request-overview-chip"><strong>Body</strong><span>' + bodyLabel + '</span></span>'
      ];
      if (presetSelect.value) {
        chips.push('<span class="request-overview-chip"><strong>Preset</strong><span>' + escapeHtml(presetSelect.value) + '</span></span>');
      }
      if (loadedScenario) {
        chips.push('<span class="request-overview-chip"><strong>Scenario</strong><span>' + escapeHtml(loadedScenario.name) + '</span></span>');
      }
      requestSummaryEl.innerHTML = chips.join('');
    }

    function closeModal(modalEl) {
      if (modalEl && typeof modalEl.close === 'function' && modalEl.open) {
        modalEl.close();
      }
    }

    function openModal(modalEl) {
      if (modalEl && typeof modalEl.showModal === 'function' && !modalEl.open) {
        modalEl.showModal();
      }
    }

    function openPresetModal() {
      if (!state.selectedRoute) {
        showToast('Select an endpoint first.', 'info', 1800);
        return;
      }

      var currentHeaders = readObjectArea(headersEl, {});
      var prompts = buildPresetHeaderPrompts(state.selectedRoute);
      var extras = {};
      presetModalName.value = '';

      presetModalFields.innerHTML = prompts.length
        ? prompts.map(function(prompt) {
            var currentValue = currentHeaders[prompt.name] !== undefined ? String(currentHeaders[prompt.name]) : '';
            if (currentHeaders[prompt.name] !== undefined) {
              delete currentHeaders[prompt.name];
            }
            return '<label class="modal-header-field">' +
              '<div class="modal-header-title"><span class="preset-header-name font-mono text-xs">' + escapeHtml(prompt.name) + '</span>' +
              (prompt.required ? '<span class="modal-required">required</span>' : '') +
              (prompt.note ? '<span class="text-[11px] muted">' + escapeHtml(prompt.note) + '</span>' : '') +
              '</div>' +
              '<input data-preset-header="' + escapeHtml(prompt.name) + '" ' + (prompt.required ? 'required ' : '') + 'class="input input-bordered w-full rounded-2xl text-sm" placeholder="' + escapeHtml(prompt.placeholder || prompt.name) + '" value="' + escapeHtml(currentValue) + '" />' +
            '</label>';
          }).join('')
        : '<div class="text-xs muted">No inferred header requirements for this endpoint. You can still add custom headers below.</div>';

      for (var key in currentHeaders) {
        extras[key] = String(currentHeaders[key]);
      }
      presetModalExtraHeaders.value = pretty(extras);
      syncPresetExtraHeadersEditor();
      state.presetValidationAttempted = false;
      updatePresetModalValidationUI(false);
      openModal(presetModal);
      presetModalName.focus();
    }

    async function savePresetFromModal() {
      if (!state.selectedRoute) return;
      var routeId = state.selectedRoute.id;
      var name = (presetModalName.value || '').trim();
      if (!name) {
        name = nextAutoName('Header', state.presets.map(function(item) { return item.name; }));
      }

      var headers = {};
      var missing = [];
      presetModalFields.querySelectorAll('[data-preset-header]').forEach(function(input) {
        var headerName = input.getAttribute('data-preset-header') || '';
        var value = String(input.value || '').trim();
        if (input.hasAttribute('required') && !value) {
          missing.push(headerName);
          return;
        }
        if (value) {
          headers[headerName] = value;
        }
      });

      if (missing.length) {
        showToast('Fill required headers: ' + missing.join(', '), 'error', 2600);
        return;
      }

      state.presetValidationAttempted = true;
      var presetValidation = updatePresetModalValidationUI(true);
      if (!presetValidation.valid) {
        showToast(presetValidation.issues[0], 'error', 2600);
        return;
      }

      var extraHeaders = presetValidation.extraHeaders;
      for (var key in extraHeaders) {
        if (extraHeaders[key] !== undefined && extraHeaders[key] !== null && String(extraHeaders[key]).trim() !== '') {
          headers[key] = String(extraHeaders[key]);
        }
      }

      await fetchJson('/api/presets', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: name, headers: headers })
      });
      state.selectedPresetByRoute[routeId] = name;
      closeModal(presetModal);
      showToast('Header preset saved.', 'success', 1800);
      await loadAll();
    }

    function openScenarioModal() {
      if (!state.selectedRoute) {
        showToast('Select an endpoint first.', 'info', 1800);
        return;
      }

      state.requestValidationAttempted = true;
      var validation = updateRequestValidationUI(true);
      if (!validation.valid) {
        showToast(validation.issues[0], 'error', 2400);
        return;
      }

      var payload = validation.payload;
      scenarioModalName.value = (templateNameInput.value || '').trim();
      scenarioIncludePath.checked = Boolean(payload.pathParams && Object.keys(payload.pathParams).length);
      scenarioIncludeQuery.checked = Boolean(payload.query && Object.keys(payload.query).length);
      scenarioIncludeHeaders.checked = Boolean(payload.headers && Object.keys(payload.headers).length);
      scenarioIncludeBody.checked = payload.body !== undefined && payload.body !== null;
      openModal(scenarioModal);
      scenarioModalName.focus();
    }

    function openSelectionPreviewModal(title, summary, contentHtml) {
      if (!selectionPreviewModal || !selectionPreviewTitleEl || !selectionPreviewSummaryEl || !selectionPreviewContentEl) return;
      selectionPreviewTitleEl.textContent = title;
      selectionPreviewSummaryEl.textContent = summary;
      selectionPreviewContentEl.innerHTML = contentHtml;
      openModal(selectionPreviewModal);
      var closeBtn = document.getElementById('close-selection-preview-btn');
      if (closeBtn) closeBtn.focus();
    }

    function previewPresetSelection(name) {
      var preset = state.presets.find(function(item) { return item.name === name; });
      if (!preset) return;
      var headerKeys = Object.keys(preset.headers || {});
      openSelectionPreviewModal(
        'Header Preset Applied',
        'This header preset is now merged into the current request headers.',
        '<div class="selection-preview-summary">Use this preset when the endpoint needs the same auth or environment headers repeatedly.</div>' +
        '<div class="selection-preview-section">' +
          '<div class="selection-preview-label">Preset Name</div>' +
          '<div class="selection-preview-value font-mono">' + escapeHtml(preset.name) + '</div>' +
        '</div>' +
        '<div class="selection-preview-section">' +
          '<div class="selection-preview-label">Headers Included</div>' +
          '<div class="selection-preview-chips">' + (headerKeys.length
            ? headerKeys.map(function(key) { return '<span class="selection-preview-chip font-mono">' + escapeHtml(key) + '</span>'; }).join('')
            : '<span class="text-xs muted">No headers saved.</span>') + '</div>' +
        '</div>' +
        '<div class="selection-preview-section">' +
          '<div class="selection-preview-label">Header Values</div>' +
          '<pre class="code-panel history-code-block">' + renderCodeBlockHtml(pretty(preset.headers || {}), 'json') + '</pre>' +
        '</div>' +
        '<div class="selection-preview-section">' +
          '<div class="selection-preview-label">Updated</div>' +
          '<div class="selection-preview-value font-mono">' + escapeHtml(formatHistoryTimestamp(preset.updatedAt)) + '</div>' +
        '</div>'
      );
    }

    function previewScenarioSelection(templateId) {
      var template = state.templates.find(function(item) { return item.id === templateId; });
      if (!template) return;
      var sections = [];
      if (template.pathParams && Object.keys(template.pathParams).length) sections.push('Path params');
      if (template.query && Object.keys(template.query).length) sections.push('Query');
      if (template.headers && Object.keys(template.headers).length) sections.push('Headers');
      if (template.body !== undefined && template.body !== null) sections.push('Body');

      var detailSections = [];
      if (template.pathParams && Object.keys(template.pathParams).length) {
        detailSections.push('<div class="selection-preview-section"><div class="selection-preview-label">Path Params</div><pre class="code-panel history-code-block">' + renderCodeBlockHtml(pretty(template.pathParams), 'json') + '</pre></div>');
      }
      if (template.query && Object.keys(template.query).length) {
        detailSections.push('<div class="selection-preview-section"><div class="selection-preview-label">Query</div><pre class="code-panel history-code-block">' + renderCodeBlockHtml(pretty(template.query), 'json') + '</pre></div>');
      }
      if (template.headers && Object.keys(template.headers).length) {
        detailSections.push('<div class="selection-preview-section"><div class="selection-preview-label">Headers</div><pre class="code-panel history-code-block">' + renderCodeBlockHtml(pretty(template.headers), 'json') + '</pre></div>');
      }
      if (template.body !== undefined && template.body !== null) {
        detailSections.push('<div class="selection-preview-section"><div class="selection-preview-label">Body</div><pre class="code-panel history-code-block">' + renderCodeBlockHtml(pretty(template.body), 'json') + '</pre></div>');
      }

      openSelectionPreviewModal(
        'Scenario Applied',
        'This saved scenario has been applied to the generated request for the selected endpoint.',
        '<div class="selection-preview-summary">A scenario can preload only the request pieces that matter for a specific backend test case.</div>' +
        '<div class="selection-preview-section">' +
          '<div class="selection-preview-label">Scenario Name</div>' +
          '<div class="selection-preview-value font-mono">' + escapeHtml(template.name) + '</div>' +
        '</div>' +
        '<div class="selection-preview-section">' +
          '<div class="selection-preview-label">Endpoint</div>' +
          '<div class="selection-preview-value font-mono">' + escapeHtml(routeSummary(template.routeId)) + '</div>' +
        '</div>' +
        '<div class="selection-preview-section">' +
          '<div class="selection-preview-label">Saved Sections</div>' +
          '<div class="selection-preview-chips">' + (sections.length
            ? sections.map(function(section) { return '<span class="selection-preview-chip">' + escapeHtml(section) + '</span>'; }).join('')
            : '<span class="text-xs muted">No saved request sections.</span>') + '</div>' +
        '</div>' +
        detailSections.join('') +
        '<div class="selection-preview-section">' +
          '<div class="selection-preview-label">Updated</div>' +
          '<div class="selection-preview-value font-mono">' + escapeHtml(formatHistoryTimestamp(template.updatedAt)) + '</div>' +
        '</div>'
      );
    }

    async function saveScenarioFromModal() {
      if (!state.selectedRoute) return;
      var routeId = state.selectedRoute.id;
      var name = (scenarioModalName.value || '').trim();
      if (!name) {
        name = nextAutoName('Scenario', state.templates
          .filter(function(item) { return item.routeId === state.selectedRoute.id; })
          .map(function(item) { return item.name; }));
      }

      state.requestValidationAttempted = true;
      var validation = updateRequestValidationUI(true);
      if (!validation.valid) {
        showToast(validation.issues[0], 'error', 2400);
        return;
      }

      var payload = validation.payload;
      payload.name = name;
      if (!scenarioIncludePath.checked) delete payload.pathParams;
      if (!scenarioIncludeQuery.checked) delete payload.query;
      if (!scenarioIncludeHeaders.checked) delete payload.headers;
      if (!scenarioIncludeBody.checked) delete payload.body;

      var result = await fetchJson('/api/templates', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (result && result.template && result.template.id) {
        state.selectedTemplateByRoute[routeId] = result.template.id;
      }
      closeModal(scenarioModal);
      templateNameInput.value = name;
      showToast('Scenario saved.', 'success', 1800);
      await loadAll();
      if (result && result.template && result.template.id) {
        previewScenarioSelection(result.template.id);
      }
    }

    function renderProfiles() {
      profileSelect.innerHTML = '';
      var none = document.createElement('option');
      none.value = '';
      none.textContent = 'No profile';
      profileSelect.appendChild(none);
      for (var i = 0; i < state.profiles.length; i += 1) {
        var profile = state.profiles[i];
        var opt = document.createElement('option');
        opt.value = profile.id;
        opt.textContent = profile.name + ' (' + profile.baseUrl + ')';
        profileSelect.appendChild(opt);
      }
      if (state.activeProfileId) {
        profileSelect.value = state.activeProfileId;
      }
      renderSelectDropdown(profileSelect, 'No profile');
    }

    function renderSuites() {
      suiteSelect.innerHTML = '';
      var none = document.createElement('option');
      none.value = '';
      none.textContent = 'Select suite';
      suiteSelect.appendChild(none);
      for (var i = 0; i < state.suites.length; i += 1) {
        var suite = state.suites[i];
        var opt = document.createElement('option');
        opt.value = suite.id;
        opt.textContent = suite.name;
        suiteSelect.appendChild(opt);
      }
      renderSelectDropdown(suiteSelect, 'Select suite');
    }

    function renderWorkflows() {
      workflowSelect.innerHTML = '';
      canvasWorkflowSelect.innerHTML = '';
      var none = document.createElement('option');
      none.value = '';
      none.textContent = 'Select workflow';
      workflowSelect.appendChild(none);
      var noneCanvas = document.createElement('option');
      noneCanvas.value = '';
      noneCanvas.textContent = 'Select workflow';
      canvasWorkflowSelect.appendChild(noneCanvas);
      for (var i = 0; i < state.workflows.length; i += 1) {
        var workflow = state.workflows[i];
        var opt = document.createElement('option');
        opt.value = workflow.id;
        opt.textContent = workflow.name;
        workflowSelect.appendChild(opt);
        var optCanvas = document.createElement('option');
        optCanvas.value = workflow.id;
        optCanvas.textContent = workflow.name;
        canvasWorkflowSelect.appendChild(optCanvas);
      }
      renderSelectDropdown(workflowSelect, 'Select workflow');
      renderSelectDropdown(canvasWorkflowSelect, 'Select workflow');
    }

    function createWorkflowStepId() {
      return 'step_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
    }

    function createWorkflowStep(routeId) {
      return {
        id: createWorkflowStepId(),
        name: routeSummary(routeId),
        routeId: routeId,
        request: {},
        mappings: {},
        assertions: []
      };
    }

    function routeSummary(routeId) {
      var route = state.routes.find(function(item) { return item.id === routeId; });
      if (!route) return routeId || 'Unknown route';
      return route.method + ' ' + route.path;
    }

    function normalizeWorkflowStep(step, index) {
      return {
        id: typeof step.id === 'string' && step.id ? step.id : createWorkflowStepId(),
        name: typeof step.name === 'string' && step.name.trim() ? step.name.trim() : 'Step ' + (index + 1),
        routeId: typeof step.routeId === 'string' ? step.routeId : '',
        request: step.request && typeof step.request === 'object' ? step.request : {},
        mappings: step.mappings && typeof step.mappings === 'object' ? step.mappings : {},
        assertions: Array.isArray(step.assertions) ? step.assertions : []
      };
    }

    function defaultWorkflowDraft() {
      return {
        name: 'New workflow',
        continueOnFailure: false,
        steps: []
      };
    }

    function ensureWorkflowDraft() {
      if (!state.workflowDraft) {
        state.workflowDraft = defaultWorkflowDraft();
      }
    }

    function syncWorkflowJsonFromDraft() {
      ensureWorkflowDraft();
      workflowJson.value = pretty({
        name: state.workflowDraft.name,
        continueOnFailure: Boolean(state.workflowDraft.continueOnFailure),
        steps: state.workflowDraft.steps
      });
    }

    function routeOptionsMarkup(selectedRouteId) {
      var options = '<option value="">Select endpoint</option>';
      for (var i = 0; i < state.routes.length; i += 1) {
        var route = state.routes[i];
        var selected = route.id === selectedRouteId ? ' selected' : '';
        options += '<option value="' + escapeHtml(route.id) + '"' + selected + '>' +
          escapeHtml(route.method + ' ' + route.path) +
          '</option>';
      }
      return options;
    }

    function renderWorkflowRoutePicker() {
      workflowRoutePicker.innerHTML = routeOptionsMarkup(state.selectedRouteId || '');
      renderSelectDropdown(workflowRoutePicker, 'Select endpoint');
    }

    function renderCanvasRouteLibrary() {
      if (!canvasRouteLibrary) return;
      if (!state.routes.length) {
        canvasRouteLibrary.innerHTML = '<div class="rounded-2xl border px-4 py-3 text-xs muted" style="border-color:var(--border);background:var(--card);">No endpoints available.</div>';
        return;
      }

      canvasRouteLibrary.innerHTML = state.routes.map(function(route) {
        return '<div class="flow-route-card" draggable="true" data-canvas-route-id="' + escapeHtml(route.id) + '">' +
          '<div class="flex items-center gap-2">' +
            '<span class="method-chip ' + routeMethodClass(route.method) + '">' + escapeHtml(route.method) + '</span>' +
            '<span class="text-[11px] uppercase tracking-[0.14em] muted">' + escapeHtml(route.framework) + '</span>' +
          '</div>' +
          '<div class="font-mono text-xs">' + escapeHtml(route.path) + '</div>' +
        '</div>';
      }).join('');
    }

    function renderWorkflowDiagram() {
      ensureWorkflowDraft();
      workflowNameInput.value = state.workflowDraft.name || '';
      workflowContinueEl.checked = Boolean(state.workflowDraft.continueOnFailure);
      canvasWorkflowNameInput.value = state.workflowDraft.name || '';
      canvasWorkflowContinueEl.checked = Boolean(state.workflowDraft.continueOnFailure);

      if (!state.workflowDraft.steps.length) {
        workflowDiagramEl.innerHTML = '<div class="rounded-2xl border px-4 py-3 text-xs muted" style="border-color:var(--border);background:var(--card);">No steps yet. Add endpoint steps to build your flow.</div>';
        syncWorkflowJsonFromDraft();
        renderCanvasStepList();
        renderWorkflowCanvasNodes();
        return;
      }

      var html = '';
      for (var i = 0; i < state.workflowDraft.steps.length; i += 1) {
        var step = state.workflowDraft.steps[i];
        html += '<div class="rounded-2xl border p-3 space-y-2" style="border-color:var(--border);background:var(--card);">' +
          '<div class="flex items-center justify-between gap-2">' +
            '<div class="text-[11px] font-semibold uppercase tracking-[0.16em] muted">Step ' + (i + 1) + '</div>' +
            '<div class="flex items-center gap-1">' +
              '<button data-step-action="up" data-step-index="' + i + '" class="btn btn-ghost btn-xs rounded-xl normal-case">Up</button>' +
              '<button data-step-action="down" data-step-index="' + i + '" class="btn btn-ghost btn-xs rounded-xl normal-case">Down</button>' +
              '<button data-step-action="remove" data-step-index="' + i + '" class="btn btn-outline btn-xs rounded-xl normal-case">Delete</button>' +
            '</div>' +
          '</div>' +
          '<input data-step-field="name" data-step-index="' + i + '" value="' + escapeHtml(step.name || routeSummary(step.routeId)) + '" class="input input-bordered input-sm w-full rounded-2xl text-xs" />' +
          '<select data-step-field="routeId" data-step-index="' + i + '" class="select select-bordered select-sm w-full rounded-2xl text-xs">' + routeOptionsMarkup(step.routeId) + '</select>' +
          '<div class="text-[10px] muted">Advanced request/mappings/assertions can be edited in JSON below.</div>' +
        '</div>';
        if (i < state.workflowDraft.steps.length - 1) {
          html += '<div class="text-center text-xs muted">next</div>';
        }
      }

      workflowDiagramEl.innerHTML = html;
      syncWorkflowJsonFromDraft();
      renderCanvasStepList();
      renderWorkflowCanvasNodes();
    }

    function setWorkflowDraftFromObject(workflow, keepId) {
      var input = workflow && typeof workflow === 'object' ? workflow : defaultWorkflowDraft();
      state.workflowDraft = {
        id: keepId ? input.id : undefined,
        name: typeof input.name === 'string' && input.name.trim() ? input.name.trim() : 'New workflow',
        continueOnFailure: Boolean(input.continueOnFailure),
        steps: Array.isArray(input.steps)
          ? input.steps.map(function(step, index) { return normalizeWorkflowStep(step, index); })
          : []
      };
      renderWorkflowDiagram();
    }

    function addWorkflowStep(routeId, insertIndex) {
      ensureWorkflowDraft();
      var normalizedRouteId = routeId || state.selectedRouteId;
      if (!normalizedRouteId) {
        showToast('Select an endpoint to add.', 'info', 1800);
        return;
      }
      var normalizedInsertIndex = Number.isFinite(insertIndex)
        ? Math.max(0, Math.min(insertIndex, state.workflowDraft.steps.length))
        : state.workflowDraft.steps.length;
      state.workflowDraft.steps.splice(normalizedInsertIndex, 0, createWorkflowStep(normalizedRouteId));
      renderWorkflowDiagram();
    }

    function getWorkflowDragRouteId(event) {
      var routeId = '';
      if (event && event.dataTransfer) {
        routeId = event.dataTransfer.getData('text/plain') || event.dataTransfer.getData('application/x-routescout-route') || '';
      }
      return routeId || state.workflowCanvasDragRouteId || '';
    }

    function clearWorkflowDropTargets() {
      if (!workflowCanvasArea) return;
      workflowCanvasArea.querySelectorAll('.flow-drop-target.drag-over').forEach(function(node) {
        node.classList.remove('drag-over');
      });
    }

    function handleWorkflowStepAction(action, index) {
      ensureWorkflowDraft();
      if (index < 0 || index >= state.workflowDraft.steps.length) {
        return;
      }

      if (action === 'remove') {
        state.workflowDraft.steps.splice(index, 1);
      } else if (action === 'up' && index > 0) {
        var tmpUp = state.workflowDraft.steps[index - 1];
        state.workflowDraft.steps[index - 1] = state.workflowDraft.steps[index];
        state.workflowDraft.steps[index] = tmpUp;
      } else if (action === 'down' && index < state.workflowDraft.steps.length - 1) {
        var tmpDown = state.workflowDraft.steps[index + 1];
        state.workflowDraft.steps[index + 1] = state.workflowDraft.steps[index];
        state.workflowDraft.steps[index] = tmpDown;
      }

      renderWorkflowDiagram();
    }

    function ensureStepPosition(step, index) {
      if (!step.position || typeof step.position.x !== 'number' || typeof step.position.y !== 'number') {
        step.position = {
          x: 40 + (index % 4) * 260,
          y: 30 + Math.floor(index / 4) * 140
        };
      }
    }

    function renderCanvasStepList() {
      ensureWorkflowDraft();
      if (!state.workflowDraft.steps.length) {
        canvasStepList.innerHTML = '<div class="rounded-2xl border px-4 py-3 text-xs muted" style="border-color:var(--border);background:var(--panel);">No steps added.</div>';
        return;
      }

      var html = '';
      for (var i = 0; i < state.workflowDraft.steps.length; i += 1) {
        var step = state.workflowDraft.steps[i];
        html += '<div class="flow-order-item text-xs">' +
          '<div class="mb-1 flex items-center justify-between gap-2">' +
            '<div class="font-semibold">Step ' + (i + 1) + '</div>' +
            '<button data-canvas-step-action="remove" data-canvas-step-index="' + i + '" class="btn btn-ghost btn-xs rounded-xl normal-case">Remove</button>' +
          '</div>' +
          '<div class="font-semibold">' + escapeHtml(step.name || routeSummary(step.routeId)) + '</div>' +
          '<div class="mt-1 muted">' + escapeHtml(routeSummary(step.routeId)) + '</div>' +
        '</div>';
      }
      canvasStepList.innerHTML = html;
    }

    function startCanvasNodeDrag(event, stepIndex) {
      if (!Number.isFinite(stepIndex)) {
        return;
      }
      ensureWorkflowDraft();
      var step = state.workflowDraft.steps[stepIndex];
      if (!step) {
        return;
      }
      ensureStepPosition(step, stepIndex);

      var startX = event.clientX;
      var startY = event.clientY;
      var originX = step.position.x;
      var originY = step.position.y;
      var nodeEl = workflowCanvasArea.querySelector('[data-canvas-node-index="' + stepIndex + '"]');
      if (nodeEl) {
        nodeEl.classList.add('dragging');
      }

      function onMove(moveEvent) {
        var dx = moveEvent.clientX - startX;
        var dy = moveEvent.clientY - startY;
        step.position.x = Math.max(0, originX + dx);
        step.position.y = Math.max(0, originY + dy);
        if (nodeEl) {
          nodeEl.style.left = step.position.x + 'px';
          nodeEl.style.top = step.position.y + 'px';
        }
        updateWorkflowCanvasEdges();
      }

      function onUp() {
        if (nodeEl) {
          nodeEl.classList.remove('dragging');
        }
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        renderWorkflowCanvasNodes();
        syncWorkflowJsonFromDraft();
      }

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    }

    function getCanvasStepConstants() {
      return { width: 220, height: 76 };
    }

    function computeCanvasContentSize() {
      ensureWorkflowDraft();
      var constants = getCanvasStepConstants();
      var maxX = workflowCanvasArea.clientWidth || 800;
      var maxY = workflowCanvasArea.clientHeight || 500;
      for (var i = 0; i < state.workflowDraft.steps.length; i += 1) {
        var step = state.workflowDraft.steps[i];
        ensureStepPosition(step, i);
        maxX = Math.max(maxX, step.position.x + constants.width + 120);
        maxY = Math.max(maxY, step.position.y + constants.height + 120);
      }
      return { width: Math.ceil(maxX), height: Math.ceil(maxY) };
    }

    function edgePathFromSteps(currentStep, nextStep) {
      var constants = getCanvasStepConstants();
      var fromX = currentStep.position.x + constants.width;
      var fromY = currentStep.position.y + constants.height / 2;
      var toX = nextStep.position.x;
      var toY = nextStep.position.y + constants.height / 2;
      var middleX = (fromX + toX) / 2;
      return 'M ' + fromX + ' ' + fromY + ' C ' + middleX + ' ' + fromY + ', ' + middleX + ' ' + toY + ', ' + toX + ' ' + toY;
    }

    function updateWorkflowCanvasEdges() {
      ensureWorkflowDraft();
      for (var i = 0; i < state.workflowDraft.steps.length - 1; i += 1) {
        var currentStep = state.workflowDraft.steps[i];
        var nextStep = state.workflowDraft.steps[i + 1];
        var edgeEl = workflowCanvasArea.querySelector('[data-canvas-edge-index="' + i + '"]');
        if (!edgeEl) continue;
        edgeEl.setAttribute('d', edgePathFromSteps(currentStep, nextStep));
      }
    }

    function renderWorkflowCanvasNodes() {
      ensureWorkflowDraft();
      if (!state.workflowDraft.steps.length) {
        workflowCanvasArea.innerHTML =
          '<div class="flow-empty">' +
            '<div>' +
              '<div class="text-sm font-semibold">No API calls in this flow yet</div>' +
              '<div class="mt-1 text-xs muted">Drag an endpoint card from the library and drop it here to place the first API call.</div>' +
              '<div class="mt-4 grid justify-items-center gap-2">' +
                '<div data-canvas-drop-index="0" class="flow-arrow-btn flow-drop-target" title="Drop an endpoint here to start the flow">&rarr;</div>' +
                '<span class="flow-arrow-label">Drop first call</span>' +
              '</div>' +
            '</div>' +
          '</div>';
        return;
      }

      var html = '<div class="flow-chain">';
      for (var i = 0; i < state.workflowDraft.steps.length; i += 1) {
        var step = state.workflowDraft.steps[i];
        html += '<div class="flow-node">' +
          '<div class="flow-node-header">' +
            '<div>' +
              '<div class="flow-step-label">Step ' + (i + 1) + '</div>' +
              '<div class="flow-node-title">' + escapeHtml(step.name || routeSummary(step.routeId)) + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="flow-node-route font-mono">' + escapeHtml(routeSummary(step.routeId)) + '</div>' +
          '<div class="flow-node-actions">' +
            '<span class="method-chip ' + routeMethodClass((state.routes.find(function(item) { return item.id === step.routeId; }) || {}).method) + '">' + escapeHtml(((state.routes.find(function(item) { return item.id === step.routeId; }) || {}).method || 'CALL')) + '</span>' +
          '</div>' +
        '</div>';

        html += '<div class="flow-connector">' +
          '<div class="flow-arrow-line"></div>' +
          '<div data-canvas-drop-index="' + (i + 1) + '" class="flow-arrow-btn flow-drop-target" title="Drop an endpoint here to place the next call">&rarr;</div>' +
          '<span class="flow-arrow-label">' + (i === state.workflowDraft.steps.length - 1 ? 'Drop next call' : 'Drop to insert') + '</span>' +
        '</div>';
      }
      html += '</div>';
      workflowCanvasArea.innerHTML = html;
    }

    function openWorkflowCanvas() {
      workflowCanvasView.classList.remove('hidden');
      workflowCanvasView.classList.add('flex');
      canvasWorkflowSelect.value = workflowSelect.value || '';
      renderWorkflowRoutePicker();
      renderCanvasRouteLibrary();
      renderWorkflowDiagram();
    }

    function closeWorkflowCanvas() {
      workflowCanvasView.classList.remove('flex');
      workflowCanvasView.classList.add('hidden');
    }

    function schemaTypeLabel(schema) {
      if (!schema) return 'unknown';
      if (Array.isArray(schema.type) && schema.type.length > 0) return schema.type.join(' | ');
      return schema.type || 'unknown';
    }

    function confidenceTextClass(level) {
      var normalized = String(level || 'low').toLowerCase();
      if (normalized === 'high') return 'confidence-text-high';
      if (normalized === 'medium') return 'confidence-text-medium';
      return 'confidence-text-low';
    }

    function formatConstraint(field) {
      var parts = [];
      if (field.required) parts.push('required');
      if (field.format) parts.push('format:' + field.format);
      if (typeof field.exclusiveMinimum === 'number') parts.push('>' + field.exclusiveMinimum);
      else if (typeof field.minimum === 'number') parts.push('>=' + field.minimum);
      if (typeof field.exclusiveMaximum === 'number') parts.push('<' + field.exclusiveMaximum);
      else if (typeof field.maximum === 'number') parts.push('<=' + field.maximum);
      if (typeof field.minLength === 'number') parts.push('minLen:' + field.minLength);
      if (typeof field.maxLength === 'number') parts.push('maxLen:' + field.maxLength);
      if (field.enum && field.enum.length) parts.push('enum');
      return parts.length ? parts.join(' | ') : 'inferred';
    }

    function sourceRefLabel(route) {
      if (!route || !route.sourceRef) return 'Endpoint source';
      var file = String(route.sourceRef.file || '');
      var shortFile = file.split(/[/\\\\]/).pop() || file || 'source';
      return shortFile + ':' + String(route.sourceRef.line || 1);
    }

    function expectationSourcePreview(route) {
      if (!route || !route.sourceSnippet) return '';
      return '<span class="expectation-source-preview" role="tooltip">' +
        '<span class="expectation-source-label">Source ' + escapeHtml(sourceRefLabel(route)) + '</span>' +
        '<code class="expectation-source-code">' + escapeHtml(route.sourceSnippet) + '</code>' +
      '</span>';
    }

    function withExpectationSource(innerHtml, route) {
      var preview = expectationSourcePreview(route);
      if (!preview) return innerHtml;
      return '<span class="expectation-source-wrap" tabindex="0">' + innerHtml + preview + '</span>';
    }

    function renderExpectations(route) {
      var fields = route.inferredFields && route.inferredFields.length
        ? route.inferredFields
        : [];

      if (fields.length === 0) {
        fields = []
          .concat((route.pathParams || []).map(function(name) { return { name: name, location: 'path', type: 'string', confidence: 'medium', source: 'heuristic' }; }))
          .concat((route.queryParams || []).map(function(name) { return { name: name, location: 'query', type: 'string', confidence: 'medium', source: 'heuristic' }; }))
          .concat((route.headers || []).map(function(name) { return { name: name, location: 'header', type: 'string', confidence: 'medium', source: 'heuristic' }; }));
      }

      var grouped = { path: [], query: [], header: [], body: [] };
      for (var i = 0; i < fields.length; i += 1) {
        var field = fields[i];
        var bucket = field.location || 'body';
        if (!grouped[bucket]) grouped[bucket] = [];
        grouped[bucket].push(field);
      }

      function fieldRows(items) {
        return items.map(function(field) {
          var fieldChip = withExpectationSource(
            '<span class="confidence-chip font-mono text-[13px] font-semibold ' + confidenceTextClass(field.confidence) + '">' + escapeHtml(field.name) + '</span>',
            route
          );
          return '<div class="flex items-center justify-between gap-2 px-1 py-1">' +
            '<div>' + fieldChip +
            '<span class="ml-2 text-xs muted">' + escapeHtml(field.type || 'unknown') + '</span></div>' +
            '<span class="text-[11px] muted">' + escapeHtml(formatConstraint(field)) + '</span>' +
          '</div>';
        }).join('');
      }

      var auth = route.authRequirements || [];
      var cards = [];

      if (auth.length) {
        var authHtml = auth.map(function(item) {
          var text = item.kind + (item.headerName ? ' (' + item.headerName + ')' : '') + (item.note ? ' - ' + item.note : '');
          return '<div class="px-1 py-1">' + withExpectationSource('<span class="confidence-chip text-sm font-semibold ' + confidenceTextClass(item.confidence) + '">' + escapeHtml(text) + '</span>', route) + '</div>';
        }).join('');
        cards.push('<div class="subsection-card p-3"><div class="mb-2 text-xs uppercase tracking-[0.16em] muted">Auth</div><div class="space-y-1">' + authHtml + '</div></div>');
      }

      if (grouped.path.length) {
        cards.push('<div class="subsection-card p-3"><div class="mb-2 text-xs uppercase tracking-[0.16em] muted">Path Params</div><div class="space-y-1">' + fieldRows(grouped.path) + '</div></div>');
      }

      if (grouped.query.length) {
        cards.push('<div class="subsection-card p-3"><div class="mb-2 text-xs uppercase tracking-[0.16em] muted">Query Params</div><div class="space-y-1">' + fieldRows(grouped.query) + '</div></div>');
      }

      if (grouped.header.length) {
        cards.push('<div class="subsection-card p-3"><div class="mb-2 text-xs uppercase tracking-[0.16em] muted">Headers</div><div class="space-y-1">' + fieldRows(grouped.header) + '</div></div>');
      }

      if (grouped.body.length) {
        cards.push('<div class="subsection-card p-3 md:col-span-2"><div class="mb-2 text-xs uppercase tracking-[0.16em] muted">Body</div><div class="space-y-1">' + fieldRows(grouped.body) + '</div></div>');
      }

      expectationsEl.innerHTML = cards.length
        ? cards.join('')
        : '<div class="text-sm muted">No expectations inferred for this endpoint yet.</div>';
    }

    function selectRoute(route) {
      state.selectedRoute = route;
      state.selectedRouteId = route.id;
      sourceInfo.textContent = route.method + ' ' + route.path + ' (' + route.sourceRef.file + ':' + route.sourceRef.line + ')';
      renderExpectations(route);

      renderTemplates();
      resetRequestInputsFromRoute(route);
      if (workflowRoutePicker) {
        workflowRoutePicker.value = route.id;
        renderSelectDropdown(workflowRoutePicker, 'Select endpoint');
      }

      for (var i = 0; i < routeList.children.length; i += 1) {
        var btn = routeList.children[i];
        btn.className = routeButtonClass(btn.dataset.routeId === route.id);
      }

      renderSelectedRouteResponse();
      renderSelectedRouteDiff();
    }

    function syncResponseTabs() {
      document.querySelectorAll('.response-tab').forEach(function(btn) {
        btn.classList.toggle('tab-active', btn.dataset.tab === state.responseTab);
      });
      syncResponseCopyButton();
    }

    function syncResponseCopyButton() {
      if (!copyResponseOutputBtn) return;
      var label = state.responseTab === 'headers'
        ? 'response headers'
        : state.responseTab === 'raw'
          ? 'raw response'
          : 'response body';
      copyResponseOutputBtn.title = 'Copy ' + label;
      copyResponseOutputBtn.setAttribute('aria-label', 'Copy ' + label);
    }

    function renderResponse(result) {
      state.latestResponse = result;
      syncResponseTabs();
      var bodyText = '';
      var mode = 'text';
      if (state.responseTab === 'headers') {
        bodyText = pretty(result.responseHeaders || {});
        mode = 'json';
      } else if (state.responseTab === 'raw') {
        bodyText = pretty(result);
        mode = 'json';
      } else {
        bodyText = result.bodyJson !== undefined ? pretty(result.bodyJson) : String(result.bodyText || '');
        mode = result.bodyJson !== undefined ? 'json' : 'text';
      }
      renderCodePanel(outputEl, bodyText || 'No content', mode);
    }

    function currentRouteId() {
      return state.selectedRoute ? state.selectedRoute.id : '';
    }

    function selectedRouteResponse() {
      var routeId = currentRouteId();
      return routeId ? (state.lastResponseByRoute[routeId] || null) : null;
    }

    function renderEmptyResponse() {
      state.latestResponse = null;
      syncResponseTabs();
      renderCodePanel(outputEl, 'No response yet.', 'text');
    }

    async function copyCurrentResponseOutput() {
      var response = selectedRouteResponse();
      if (!response) {
        showToast('No response available to copy yet.', 'info', 1800);
        return;
      }
      var text = '';
      var label = 'response body';
      if (state.responseTab === 'headers') {
        text = pretty(response.responseHeaders || {});
        label = 'response headers';
      } else if (state.responseTab === 'raw') {
        text = pretty(response);
        label = 'raw response';
      } else {
        text = response.bodyJson !== undefined ? pretty(response.bodyJson) : String(response.bodyText || '');
      }
      await navigator.clipboard.writeText(text || 'No content');
      showToast('Copied ' + label, 'success', 1600);
    }

    function renderSelectedRouteResponse() {
      var response = selectedRouteResponse();
      if (!response) {
        renderEmptyResponse();
        return;
      }
      renderResponse(response);
    }

    function renderDiff(previous, next) {
      var diffText = '';
      if (!previous) {
        diffText = 'No prior response for this endpoint.';
        diffOutputEl.textContent = diffText;
        state.lastDiffByRoute[currentRouteId()] = diffText;
        return;
      }
      var prevText = previous.bodyJson !== undefined ? pretty(previous.bodyJson) : String(previous.bodyText || '');
      var nextText = next.bodyJson !== undefined ? pretty(next.bodyJson) : String(next.bodyText || '');
      if (prevText === nextText) {
        diffText = 'No body changes detected.';
        diffOutputEl.textContent = diffText;
        state.lastDiffByRoute[currentRouteId()] = diffText;
        return;
      }
      diffText = '--- previous\\n' + prevText + '\\n\\n+++ latest\\n' + nextText;
      diffOutputEl.textContent = diffText;
      state.lastDiffByRoute[currentRouteId()] = diffText;
    }

    function renderSelectedRouteDiff() {
      var routeId = currentRouteId();
      var diffText = routeId ? state.lastDiffByRoute[routeId] : '';
      diffOutputEl.textContent = diffText || 'No diff yet.';
    }

    function historyFilterValue(result) {
      if (result.ok) {
        return 'success';
      }
      if (typeof result.status === 'number') {
        return 'status:' + result.status;
      }
      return 'status:error';
    }

    function historyFilterLabel(value) {
      if (value === 'all') return 'All history';
      if (value === 'success') return 'Success';
      if (value === 'status:error') return 'Request errors';
      if (value.indexOf('status:') === 0) return 'HTTP ' + value.slice('status:'.length);
      return value;
    }

    function formatHistoryTimestamp(isoValue) {
      if (!isoValue) return 'Unknown time';
      var date = new Date(isoValue);
      if (Number.isNaN(date.getTime())) return String(isoValue);
      return date.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    }

    function historyItemKey(item) {
      return [
        item.routeId || '',
        item.occurredAt || '',
        item.method || '',
        typeof item.status === 'number' ? String(item.status) : '',
        typeof item.latencyMs === 'number' ? String(item.latencyMs) : '',
        item.url || ''
      ].join('|');
    }

    function historyRequestBodyText(item) {
      if (!item || item.requestBody === undefined || item.requestBody === null) return '';
      return typeof item.requestBody === 'string' ? item.requestBody : pretty(item.requestBody);
    }

    function renderHistoryDetails(item) {
      var metaItems = [
        { label: 'Time', value: formatHistoryTimestamp(item.occurredAt) },
        { label: 'Status', value: typeof item.status === 'number' ? 'HTTP ' + item.status : (item.ok ? 'Success' : 'Request error') },
        { label: 'Latency', value: String(item.latencyMs) + 'ms' },
        { label: 'URL', value: item.url || 'Unknown URL' }
      ];
      var metaHtml = metaItems.map(function(entry) {
        return '<div class="history-meta-item">' +
          '<div class="history-meta-label">' + escapeHtml(entry.label) + '</div>' +
          '<div class="history-meta-value font-mono">' + escapeHtml(entry.value) + '</div>' +
        '</div>';
      }).join('');

      var sections = [];
      if (item.error) {
        sections.push(
          '<div class="history-detail-section">' +
            '<div class="history-detail-title">Error</div>' +
            '<pre class="code-panel history-code-block status-err">' + renderCodeBlockHtml(item.error, 'text') + '</pre>' +
          '</div>'
        );
      }

      if (item.responseHeaders && Object.keys(item.responseHeaders).length) {
        sections.push(
          '<div class="history-detail-section">' +
            '<div class="history-detail-heading">' +
              '<div class="history-detail-title">Response Headers</div>' +
              '<button type="button" class="history-copy-btn" data-history-copy-headers="' + escapeHtml(historyItemKey(item)) + '" aria-label="Copy response headers" title="Copy response headers">⧉</button>' +
            '</div>' +
            '<pre class="code-panel history-code-block">' + renderCodeBlockHtml(pretty(item.responseHeaders), 'json') + '</pre>' +
          '</div>'
        );
      }

      var requestBodyText = historyRequestBodyText(item);
      if (requestBodyText) {
        sections.push(
          '<div class="history-detail-section">' +
            '<div class="history-detail-heading">' +
              '<div class="history-detail-title">Request Body</div>' +
              '<button type="button" class="history-copy-btn" data-history-copy-body="' + escapeHtml(historyItemKey(item)) + '" aria-label="Copy request body" title="Copy request body">⧉</button>' +
            '</div>' +
            '<pre class="code-panel history-code-block">' + renderCodeBlockHtml(requestBodyText, item.requestBody !== undefined && typeof item.requestBody !== 'string' ? 'json' : 'text') + '</pre>' +
          '</div>'
        );
      }

      if (item.bodyJson !== undefined || item.bodyText) {
        var bodyText = item.bodyJson !== undefined ? pretty(item.bodyJson) : String(item.bodyText || '');
        sections.push(
          '<div class="history-detail-section">' +
            '<div class="history-detail-heading">' +
              '<div class="history-detail-title">Response Body</div>' +
              '<button type="button" class="history-copy-btn" data-history-copy-response="' + escapeHtml(historyItemKey(item)) + '" aria-label="Copy response body" title="Copy response body">⧉</button>' +
            '</div>' +
            '<pre class="code-panel history-code-block">' + renderCodeBlockHtml(bodyText || 'No content', item.bodyJson !== undefined ? 'json' : 'text') + '</pre>' +
          '</div>'
        );
      }

      if (!sections.length) {
        sections.push('<div class="text-[11px] muted">No additional response details were saved for this run.</div>');
      }

      return '<div class="history-details">' +
        '<div class="history-meta-grid">' + metaHtml + '</div>' +
        sections.join('') +
      '</div>';
    }

    async function copyHistoryRequestBody(itemKey) {
      var item = state.historyItems.find(function(entry) { return historyItemKey(entry) === itemKey; });
      if (!item) {
        showToast('History entry not found.', 'error', 1800);
        return;
      }
      var requestBodyText = historyRequestBodyText(item);
      if (!requestBodyText) {
        showToast('No request body saved for this run.', 'info', 1800);
        return;
      }
      await navigator.clipboard.writeText(requestBodyText);
      showToast('Copied request body', 'success', 1600);
    }

    async function copyHistoryResponseHeaders(itemKey) {
      var item = state.historyItems.find(function(entry) { return historyItemKey(entry) === itemKey; });
      if (!item) {
        showToast('History entry not found.', 'error', 1800);
        return;
      }
      if (!item.responseHeaders || !Object.keys(item.responseHeaders).length) {
        showToast('No response headers saved for this run.', 'info', 1800);
        return;
      }
      await navigator.clipboard.writeText(pretty(item.responseHeaders));
      showToast('Copied response headers', 'success', 1600);
    }

    async function copyHistoryResponseBody(itemKey) {
      var item = state.historyItems.find(function(entry) { return historyItemKey(entry) === itemKey; });
      if (!item) {
        showToast('History entry not found.', 'error', 1800);
        return;
      }
      if (item.bodyJson === undefined && !item.bodyText) {
        showToast('No response body saved for this run.', 'info', 1800);
        return;
      }
      var bodyText = item.bodyJson !== undefined ? pretty(item.bodyJson) : String(item.bodyText || '');
      await navigator.clipboard.writeText(bodyText || 'No content');
      showToast('Copied response body', 'success', 1600);
    }

    function syncHistoryViewport() {
      if (!historyOutputEl) return;
      historyOutputEl.style.maxHeight = 'none';
    }

    function revealSelectedHistoryCard() {
      if (!historyOutputEl || !state.selectedHistoryKey) return;
      var cards = historyOutputEl.querySelectorAll('[data-history-key]');
      for (var i = 0; i < cards.length; i += 1) {
        var card = cards[i];
        if ((card.getAttribute('data-history-key') || '') !== state.selectedHistoryKey) continue;
        requestAnimationFrame(function() {
          card.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        });
        break;
      }
    }

    function renderHistoryFilterOptions(items) {
      if (!historyCodeFilterEl) return;
      var previousValue = historyCodeFilterEl.value || 'all';
      var optionValues = ['all', 'success'];
      var seen = { all: true, success: true };

      for (var i = 0; i < items.length; i += 1) {
        var item = items[i];
        if (item.ok) continue;
        var value = historyFilterValue(item);
        if (!seen[value]) {
          seen[value] = true;
          optionValues.push(value);
        }
      }

      historyCodeFilterEl.innerHTML = optionValues.map(function(value) {
        return '<option value="' + escapeHtml(value) + '">' + escapeHtml(historyFilterLabel(value)) + '</option>';
      }).join('');

      historyCodeFilterEl.value = seen[previousValue] ? previousValue : 'all';
      renderSelectDropdown(historyCodeFilterEl, 'All history');
    }

    function renderHistory(items) {
      if (!historyOutputEl) return;
      var activeFilter = historyCodeFilterEl ? historyCodeFilterEl.value : 'all';
      var filtered = items.filter(function(item) {
        if (activeFilter === 'all') return true;
        return historyFilterValue(item) === activeFilter;
      });

      if (state.selectedHistoryKey && !filtered.some(function(item) { return historyItemKey(item) === state.selectedHistoryKey; })) {
        state.selectedHistoryKey = null;
      }

      if (!filtered.length) {
        historyOutputEl.innerHTML = '<div class="text-sm muted">No history matches this filter.</div>';
        syncHistoryViewport();
        return;
      }

      historyOutputEl.innerHTML = filtered.map(function(item) {
        var isOk = Boolean(item.ok);
        var statusText = isOk
          ? (typeof item.status === 'number' ? 'HTTP ' + item.status : 'Success')
          : (typeof item.status === 'number' ? 'HTTP ' + item.status : 'Request error');
        var routeText = routeSummary(item.routeId);
        var itemKey = historyItemKey(item);
        var isOpen = state.selectedHistoryKey === itemKey;
        var isNew = state.pendingHistoryAnimationKey === itemKey;
        return '<div class="history-card ' + (isOk ? 'history-success' : 'history-failure') + (isOpen ? ' history-open' : '') + (isNew ? ' history-new' : '') + '" data-history-key="' + escapeHtml(itemKey) + '" role="button" tabindex="0" aria-expanded="' + (isOpen ? 'true' : 'false') + '">' +
          '<div class="flex items-start justify-between gap-3">' +
            '<div class="min-w-0">' +
              '<div class="flex items-center gap-2">' +
                '<span class="method-chip ' + routeMethodClass(item.method) + '">' + escapeHtml(item.method || 'CALL') + '</span>' +
                '<span class="history-badge ' + (isOk ? 'history-success' : 'history-failure') + '">' + escapeHtml(statusText) + '</span>' +
              '</div>' +
              '<div class="mt-2 font-mono text-[11px]">' + escapeHtml(routeText) + '</div>' +
            '</div>' +
            '<div class="text-right text-[11px] muted"><div>' + escapeHtml(formatHistoryTimestamp(item.occurredAt)) + '</div><div class="mt-1 text-[10px]">' + (isOpen ? 'Hide details' : 'View details') + '</div></div>' +
          '</div>' +
          '<div class="flex flex-wrap items-center gap-2 text-[11px] muted">' +
            '<span>Latency ' + escapeHtml(String(item.latencyMs)) + 'ms</span>' +
            '<span>URL ' + escapeHtml(item.url || 'Unknown URL') + '</span>' +
          '</div>' +
          (!isOk && item.error
            ? '<div class="text-[11px] status-err">' + escapeHtml(item.error) + '</div>'
            : '') +
          (isOpen ? renderHistoryDetails(item) : '') +
        '</div>';
      }).join('');

      syncHistoryViewport();
      revealSelectedHistoryCard();
      if (state.pendingHistoryAnimationKey) {
        var animatedKey = state.pendingHistoryAnimationKey;
        setTimeout(function() {
          if (!historyOutputEl) return;
          var animatedCard = null;
          var cards = historyOutputEl.querySelectorAll('[data-history-key]');
          for (var i = 0; i < cards.length; i += 1) {
            if ((cards[i].getAttribute('data-history-key') || '') === animatedKey) {
              animatedCard = cards[i];
              break;
            }
          }
          if (animatedCard) animatedCard.classList.remove('history-new');
          if (state.pendingHistoryAnimationKey === animatedKey) {
            state.pendingHistoryAnimationKey = null;
          }
        }, 320);
      }
    }

    async function loadHistory() {
      if (state.historyLoading && state.historyLoadPromise) {
        return state.historyLoadPromise;
      }
      state.historyLoading = true;
      setHistoryRefreshing(true);
      state.historyLoadPromise = (async function() {
        var previousTopKey = state.historyItems.length ? historyItemKey(state.historyItems[0]) : '';
        var payload = await fetchJson('/api/history');
        var historyItems = Array.isArray(payload.history) ? payload.history : [];
        var nextTopKey = historyItems.length ? historyItemKey(historyItems[0]) : '';
        state.pendingHistoryAnimationKey = nextTopKey && nextTopKey !== previousTopKey ? nextTopKey : null;
        state.historyItems = historyItems;
        if (state.selectedHistoryKey && !historyItems.some(function(item) { return historyItemKey(item) === state.selectedHistoryKey; })) {
          state.selectedHistoryKey = null;
        }
        renderHistoryFilterOptions(historyItems);
        renderHistory(historyItems);
      })();
      try {
        await state.historyLoadPromise;
      } finally {
        state.historyLoading = false;
        state.historyLoadPromise = null;
        setHistoryRefreshing(false);
      }
    }

    async function loadAll() {
      var selectedWorkflowIdBefore = workflowSelect.value;
      var selectedRouteIdBefore = state.selectedRouteId;
      var payloads = await Promise.all([
        fetchJson('/api/routes'),
        fetchJson('/api/presets'),
        fetchJson('/api/templates'),
        fetchJson('/api/profiles'),
        fetchJson('/api/suites'),
        fetchJson('/api/workflows')
      ]);
      var routesPayload = payloads[0];
      state.routes = routesPayload.routes || [];
      state.activeProfileId = routesPayload.activeProfileId || '';
      state.presets = payloads[1].presets || [];
      state.templates = payloads[2].templates || [];
      state.profiles = payloads[3].profiles || [];
      if (!state.activeProfileId && payloads[3].activeProfileId) {
        state.activeProfileId = payloads[3].activeProfileId;
      }
      state.suites = payloads[4].suites || [];
      state.workflows = payloads[5].workflows || [];
      baseUrlInput.value = routesPayload.baseUrl || '';

      renderRoutes();
      renderPresets();
      if (selectedRouteIdBefore) {
        var refreshedSelectedRoute = state.routes.find(function(route) { return route.id === selectedRouteIdBefore; });
        if (refreshedSelectedRoute) {
          selectRoute(refreshedSelectedRoute);
        }
      }
      renderProfiles();
      renderSuites();
      renderWorkflows();
      renderWorkflowRoutePicker();
      renderCanvasRouteLibrary();
      renderRequestSummary(state.selectedRoute);

      if (selectedWorkflowIdBefore) {
        workflowSelect.value = selectedWorkflowIdBefore;
        renderSelectDropdown(workflowSelect, 'Select workflow');
      }

      if (!state.workflowDraft) {
        var selectedWorkflow = state.workflows.find(function(item) { return item.id === workflowSelect.value; });
        if (selectedWorkflow) {
          setWorkflowDraftFromObject(selectedWorkflow, true);
        } else {
          setWorkflowDraftFromObject(defaultWorkflowDraft(), false);
        }
      } else {
        renderWorkflowDiagram();
      }

      await loadHistory();
    }

    async function runRequest() {
      if (!state.selectedRoute) {
        setStatus('Select a route first.', 'err');
        showToast('Select an endpoint first.', 'info', 1800);
        return;
      }
      try {
        setStatus('Sending request...');
        state.requestValidationAttempted = true;
        var validation = updateRequestValidationUI(true);
        if (!validation.valid) {
          setStatus(validation.issues[0], 'err');
          showToast(validation.issues[0], 'error', 2400);
          return;
        }
        var payload = validation.payload;
        var response = await fetchJson('/api/request', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload)
        });

        var prev = state.lastResponseByRoute[state.selectedRoute.id];
        state.lastResponseByRoute[state.selectedRoute.id] = response;
        renderResponse(response);
        renderDiff(prev, response);
        await loadHistory();

        if (response.ok) {
          setStatus('HTTP ' + response.status + ' in ' + response.latencyMs + 'ms', 'ok');
          showToast('Request successful (' + response.status + ')', 'success', 2200);
        } else {
          setStatus(response.error || 'Request failed', 'err');
          showToast(response.error || 'Request failed', 'error', 3000);
        }
      } catch (error) {
        setStatus(error.message || String(error), 'err');
        outputEl.textContent = String(error.stack || error);
        showToast(error.message || String(error), 'error', 3000);
      }
    }

    async function saveTemplate() {
      if (!state.selectedRoute) {
        showToast('Select an endpoint first.', 'info', 1800);
        return;
      }
      var name = (templateNameInput.value || '').trim();
      if (!name) {
        showToast('Scenario name is required.', 'error', 2200);
        return;
      }
      state.requestValidationAttempted = true;
      var validation = updateRequestValidationUI(true);
      if (!validation.valid) {
        showToast(validation.issues[0], 'error', 2400);
        return;
      }
      var payload = validation.payload;
      payload.name = name;
      await fetchJson('/api/templates', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      });
      showToast('Scenario saved.', 'success', 1800);
      await loadAll();
    }

    function applyTemplateById(templateId) {
      if (!templateId) {
        resetRequestInputsFromRoute(state.selectedRoute);
        return;
      }
      var template = state.templates.find(function(item) { return item.id === templateId; });
      if (!template) return;
      templateNameInput.value = template.name;
      applyCurrentSelectionsToRequestInputs(state.selectedRoute);
    }

    function quoteShell(value) {
      return "'" + String(value).replaceAll("'", "'\\\\''") + "'";
    }

    async function copyAsCurl() {
      if (!state.selectedRoute) return;
      state.requestValidationAttempted = true;
      var validation = updateRequestValidationUI(true);
      if (!validation.valid) {
        throw new Error(validation.issues[0]);
      }
      var payload = validation.payload;
      var routePath = state.selectedRoute.path;
      var pathObj = payload.pathParams || {};
      for (var key in pathObj) {
        routePath = routePath.replace(':' + key, encodeURIComponent(pathObj[key]));
      }
      var url = String(payload.baseUrl || baseUrlInput.value || '').replace(/\\/$/, '') + routePath;
      var queryObj = payload.query || {};
      var qs = new URLSearchParams(queryObj).toString();
      if (qs) url += '?' + qs;
      var lines = ['curl -X ' + state.selectedRoute.method + ' ' + quoteShell(url)];
      var headerObj = payload.headers || {};
      if (payload.presetName) {
        var preset = state.presets.find(function(item) { return item.name === payload.presetName; });
        if (preset) {
          headerObj = Object.assign({}, preset.headers || {}, headerObj);
        }
      }
      for (var h in headerObj) {
        lines.push('  -H ' + quoteShell(h + ': ' + headerObj[h]));
      }
      if (payload.body !== undefined && payload.body !== null && !['GET', 'HEAD', 'OPTIONS'].includes(state.selectedRoute.method)) {
        lines.push('  --data-raw ' + quoteShell(JSON.stringify(payload.body)));
      }
      await navigator.clipboard.writeText(lines.join(' \\\\\\n'));
      showToast('Copied as cURL', 'success', 1600);
    }

    async function copyAsFetch() {
      if (!state.selectedRoute) return;
      state.requestValidationAttempted = true;
      var validation = updateRequestValidationUI(true);
      if (!validation.valid) {
        throw new Error(validation.issues[0]);
      }
      var payload = validation.payload;
      var headerObj = payload.headers || {};
      if (payload.presetName) {
        var preset = state.presets.find(function(item) { return item.name === payload.presetName; });
        if (preset) headerObj = Object.assign({}, preset.headers || {}, headerObj);
      }
      var code =
        'fetch("<url>", {\\n' +
        '  method: "' + state.selectedRoute.method + '",\\n' +
        '  headers: ' + pretty(headerObj) + ',\\n' +
        '  body: ' + (payload.body === undefined ? 'undefined' : JSON.stringify(JSON.stringify(payload.body))) + '\\n' +
        '}).then(r => r.text()).then(console.log);';
      await navigator.clipboard.writeText(code);
      showToast('Copied as fetch', 'success', 1600);
    }

    async function saveProfile() {
      var name = (profileNameInput.value || '').trim();
      var baseUrl = (baseUrlInput.value || '').trim();
      if (!name || !baseUrl) {
        showToast('Profile name and base URL are required.', 'error', 2200);
        return;
      }
      await fetchJson('/api/profiles', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: name, baseUrl: baseUrl, defaultPresetName: presetSelect.value || undefined, setActive: true })
      });
      showToast('Profile saved.', 'success', 1800);
      await loadAll();
    }

    async function setActiveProfile() {
      var profileId = profileSelect.value;
      if (!profileId) {
        showToast('Choose a profile first.', 'info', 1600);
        return;
      }
      await fetchJson('/api/profiles/active', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: profileId })
      });
      showToast('Active profile updated.', 'success', 1600);
      await loadAll();
    }

    async function clearActiveProfile() {
      await fetchJson('/api/profiles/active', { method: 'DELETE' });
      showToast('Active profile cleared.', 'success', 1600);
      await loadAll();
    }

    function readSuiteFromEditor() {
      var parsed = JSON.parse(suiteJson.value || '{}');
      if (!parsed.name || !Array.isArray(parsed.steps)) {
        throw new Error('Suite JSON needs { "name": string, "steps": [] }.');
      }
      return parsed;
    }

    function readWorkflowFromEditor() {
      var parsed = JSON.parse(workflowJson.value || '{}');
      if (!parsed.name || !Array.isArray(parsed.steps)) {
        throw new Error('Workflow JSON needs { "name": string, "steps": [] }.');
      }
      return parsed;
    }

    function workflowPayloadFromDraft() {
      ensureWorkflowDraft();
      return {
        name: state.workflowDraft.name || 'New workflow',
        continueOnFailure: Boolean(state.workflowDraft.continueOnFailure),
        steps: state.workflowDraft.steps
      };
    }

    async function saveSuite() {
      var suite = readSuiteFromEditor();
      var selectedId = suiteSelect.value;
      if (selectedId) suite.id = selectedId;
      await fetchJson('/api/suites', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(suite)
      });
      showToast('Suite saved.', 'success', 1800);
      await loadAll();
    }

    async function runSuite() {
      var id = suiteSelect.value;
      if (!id) throw new Error('Select a suite to run.');
      setStatus('Running suite...', 'idle');
      var run = await fetchJson('/api/suites/' + encodeURIComponent(id) + '/run', { method: 'POST' });
      state.responseTab = 'raw';
      renderResponse({ bodyJson: run, responseHeaders: {}, bodyText: '', routeId: id, method: 'POST', ok: run.ok, latencyMs: 0, occurredAt: run.completedAt });
      diffOutputEl.textContent = 'Suite run completed.';
      setStatus(run.ok ? 'Suite passed' : 'Suite failed', run.ok ? 'ok' : 'err');
      await loadHistory();
    }

    async function saveWorkflow() {
      var workflow = workflowPayloadFromDraft();
      var selectedId = workflowSelect.value;
      if (selectedId) workflow.id = selectedId;
      await fetchJson('/api/workflows', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(workflow)
      });
      showToast('Workflow saved.', 'success', 1800);
      await loadAll();
    }

    async function runWorkflow() {
      var id = workflowSelect.value;
      if (!id) throw new Error('Select a workflow to run.');
      setStatus('Running workflow...', 'idle');
      var run = await fetchJson('/api/workflows/' + encodeURIComponent(id) + '/run', { method: 'POST' });
      state.responseTab = 'raw';
      renderResponse({ bodyJson: run, responseHeaders: {}, bodyText: '', routeId: id, method: 'POST', ok: run.ok, latencyMs: 0, occurredAt: run.completedAt });
      diffOutputEl.textContent = 'Workflow run completed.';
      setStatus(run.ok ? 'Workflow passed' : 'Workflow failed', run.ok ? 'ok' : 'err');
      await loadHistory();
    }

    async function exportCollections() {
      var payload = await fetchJson('/api/collections/export', { method: 'POST' });
      var blob = new Blob([pretty(payload)], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'route-scout-collections.json';
      a.click();
      URL.revokeObjectURL(url);
      showToast('Collections exported.', 'success', 1800);
    }

    async function importCollections(file) {
      var text = await file.text();
      var payload = JSON.parse(text);
      await fetchJson('/api/collections/import', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      });
      showToast('Collections imported.', 'success', 2000);
      await loadAll();
    }

    routeSearchEl.addEventListener('input', function(event) {
      state.routeFilter = event.target.value || '';
      renderRoutes();
    });
    themeToggleEl.addEventListener('click', function() {
      var nextTheme = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
      showToast(nextTheme === 'dark' ? 'Dark mode enabled.' : 'Light mode enabled.', 'success', 1500);
    });
    openValuesReferenceBtn.addEventListener('click', function() {
      renderValuesReference();
      openModal(valuesReferenceModal);
    });
    if (valuesReferenceContentEl) {
      valuesReferenceContentEl.addEventListener('change', function(event) {
        var target = event.target;
        if (!(target instanceof HTMLInputElement)) return;
        var defaultId = target.getAttribute('data-default-id');
        if (!defaultId) return;
        state.defaultValueOverrides[defaultId] = target.value;
        saveDefaultValueOverrides();
        renderValuesReference();
        if (state.selectedRoute) {
          applyCurrentSelectionsToRequestInputs(state.selectedRoute);
        }
        var item = findDefaultValueItem(defaultId);
        showToast((item ? item.label : 'Default value') + ' updated.', 'success', 1600);
      });
    }
    handleLeft.addEventListener('pointerdown', function(event) { startResize(event); });
    window.addEventListener('resize', applyGridTemplate);

    document.getElementById('run-btn').addEventListener('click', runRequest);
    openPresetModalBtn.addEventListener('click', function() { openPresetModal(); });
    openScenarioModalBtn.addEventListener('click', function() { openScenarioModal(); });
    baseUrlInput.addEventListener('change', function() {
      showToast((baseUrlInput.value || '').trim() ? 'Base URL updated.' : 'Base URL cleared.', 'success', 1500);
    });
    presetSelect.addEventListener('change', function() {
      if (state.selectedRoute) {
        state.selectedPresetByRoute[state.selectedRoute.id] = presetSelect.value || '';
      }
      updateDropdownLabel(presetSelect, 'No header preset', {
        detailsEl: presetDropdown,
        triggerEl: presetDropdownTrigger,
        menuEl: presetDropdownMenu
      });
      renderSelectDropdown(presetSelect, 'No header preset', {
        detailsEl: presetDropdown,
        triggerEl: presetDropdownTrigger,
        menuEl: presetDropdownMenu
      });
      applyCurrentSelectionsToRequestInputs(state.selectedRoute);
      showToast(presetSelect.value ? 'Header preset applied.' : 'Header preset cleared.', 'success', 1500);
      if (state.selectionPreviewSource === 'preset-select' && presetSelect.value) {
        previewPresetSelection(presetSelect.value);
      }
      state.selectionPreviewSource = null;
    });
    templateSelect.addEventListener('change', function(event) {
      if (state.selectedRoute) {
        state.selectedTemplateByRoute[state.selectedRoute.id] = event.target.value || '';
      }
      updateDropdownLabel(templateSelect, 'No saved scenario', {
        detailsEl: templateDropdown,
        triggerEl: templateDropdownTrigger,
        menuEl: templateDropdownMenu
      });
      renderSelectDropdown(templateSelect, 'No saved scenario', {
        detailsEl: templateDropdown,
        triggerEl: templateDropdownTrigger,
        menuEl: templateDropdownMenu
      });
      applyTemplateById(event.target.value);
      showToast(event.target.value ? 'Scenario applied.' : 'Scenario cleared.', 'success', 1500);
      if (state.selectionPreviewSource === 'template-select' && event.target.value) {
        previewScenarioSelection(event.target.value);
      }
      state.selectionPreviewSource = null;
    });
    bodyEl.addEventListener('change', function() {
      syncBodyEditor();
      state.requestValidationAttempted = false;
      updateRequestValidationUI(false);
      showToast('Body payload updated.', 'success', 1500);
    });
    bodyEl.addEventListener('input', function() {
      syncBodyEditor();
      state.requestValidationAttempted = false;
      updateRequestValidationUI(false);
    });
    bodyEl.addEventListener('scroll', syncBodyEditor);
    presetModalFields.addEventListener('input', function() {
      state.presetValidationAttempted = false;
      updatePresetModalValidationUI(false);
    });
    presetModalFields.addEventListener('change', function() {
      state.presetValidationAttempted = false;
      updatePresetModalValidationUI(false);
    });
    presetModalExtraHeaders.addEventListener('change', function() {
      syncPresetExtraHeadersEditor();
      state.presetValidationAttempted = false;
      updatePresetModalValidationUI(false);
    });
    presetModalExtraHeaders.addEventListener('input', function() {
      syncPresetExtraHeadersEditor();
      state.presetValidationAttempted = false;
      updatePresetModalValidationUI(false);
    });
    presetModalExtraHeaders.addEventListener('scroll', syncPresetExtraHeadersEditor);
    overrideOptionPathEl.addEventListener('change', function() {
      if (overrideOptionPathEl.checked) setOverrideTarget('path');
    });
    overrideOptionQueryEl.addEventListener('change', function() {
      if (overrideOptionQueryEl.checked) setOverrideTarget('query');
    });
    overrideOptionHeadersEl.addEventListener('change', function() {
      if (overrideOptionHeadersEl.checked) setOverrideTarget('headers');
    });
    pathParamsEl.addEventListener('change', function() {
      state.requestValidationAttempted = false;
      syncPathParamsEditor();
      updateRequestValidationUI(false);
      showToast('Path params updated.', 'success', 1500);
    });
    pathParamsEl.addEventListener('input', function() {
      state.requestValidationAttempted = false;
      syncPathParamsEditor();
      updateRequestValidationUI(false);
    });
    pathParamsEl.addEventListener('scroll', syncPathParamsEditor);
    queryEl.addEventListener('change', function() {
      state.requestValidationAttempted = false;
      syncQueryEditor();
      updateRequestValidationUI(false);
      showToast('Query overrides updated.', 'success', 1500);
    });
    queryEl.addEventListener('input', function() {
      state.requestValidationAttempted = false;
      syncQueryEditor();
      updateRequestValidationUI(false);
    });
    queryEl.addEventListener('scroll', syncQueryEditor);
    headersEl.addEventListener('change', function() {
      state.requestValidationAttempted = false;
      syncHeadersEditor();
      updateRequestValidationUI(false);
      showToast('Header overrides updated.', 'success', 1500);
    });
    headersEl.addEventListener('input', function() {
      state.requestValidationAttempted = false;
      syncHeadersEditor();
      updateRequestValidationUI(false);
    });
    headersEl.addEventListener('scroll', syncHeadersEditor);
    document.getElementById('reset-generated-btn').addEventListener('click', function() {
      resetRequestInputsFromRoute(state.selectedRoute);
      showToast('Reset to scan defaults.', 'success', 1600);
    });
    document.getElementById('close-preset-modal-btn').addEventListener('click', function() { closeModal(presetModal); });
    document.getElementById('cancel-preset-modal-btn').addEventListener('click', function() { closeModal(presetModal); });
    document.getElementById('save-preset-modal-btn').addEventListener('click', function() { savePresetFromModal().catch(function(err) { showToast(err.message || String(err), 'error', 2500); }); });
    document.getElementById('close-scenario-modal-btn').addEventListener('click', function() { closeModal(scenarioModal); });
    document.getElementById('cancel-scenario-modal-btn').addEventListener('click', function() { closeModal(scenarioModal); });
    document.getElementById('save-scenario-modal-btn').addEventListener('click', function() { saveScenarioFromModal().catch(function(err) { showToast(err.message || String(err), 'error', 2500); }); });
    document.getElementById('close-selection-preview-btn').addEventListener('click', function() { closeModal(selectionPreviewModal); });
    document.getElementById('dismiss-selection-preview-btn').addEventListener('click', function() { closeModal(selectionPreviewModal); });
    document.getElementById('close-values-reference-btn').addEventListener('click', function() { closeModal(valuesReferenceModal); });
    document.getElementById('dismiss-values-reference-btn').addEventListener('click', function() { closeModal(valuesReferenceModal); });
    presetModal.addEventListener('click', function(event) { if (event.target === presetModal) closeModal(presetModal); });
    scenarioModal.addEventListener('click', function(event) { if (event.target === scenarioModal) closeModal(scenarioModal); });
    document.getElementById('copy-curl-btn').addEventListener('click', function() { copyAsCurl().catch(function(err) { showToast(err.message || String(err), 'error', 2500); }); });
    document.getElementById('copy-fetch-btn').addEventListener('click', function() { copyAsFetch().catch(function(err) { showToast(err.message || String(err), 'error', 2500); }); });
    document.getElementById('save-profile-btn').addEventListener('click', function() { saveProfile().catch(function(err) { showToast(err.message || String(err), 'error', 2500); }); });
    document.getElementById('set-profile-btn').addEventListener('click', function() { setActiveProfile().catch(function(err) { showToast(err.message || String(err), 'error', 2500); }); });
    document.getElementById('clear-profile-btn').addEventListener('click', function() { clearActiveProfile().catch(function(err) { showToast(err.message || String(err), 'error', 2500); }); });

    document.getElementById('save-suite-btn').addEventListener('click', function() { saveSuite().catch(function(err) { showToast(err.message || String(err), 'error', 2500); }); });
    document.getElementById('run-suite-btn').addEventListener('click', function() { runSuite().catch(function(err) { showToast(err.message || String(err), 'error', 2500); }); });
    suiteSelect.addEventListener('change', function(event) {
      var selected = state.suites.find(function(item) { return item.id === event.target.value; });
      suiteJson.value = selected ? pretty(selected) : '';
    });

    document.getElementById('save-workflow-btn').addEventListener('click', function() { saveWorkflow().catch(function(err) { showToast(err.message || String(err), 'error', 2500); }); });
    document.getElementById('run-workflow-btn').addEventListener('click', function() { runWorkflow().catch(function(err) { showToast(err.message || String(err), 'error', 2500); }); });
    workflowSelect.addEventListener('change', function(event) {
      canvasWorkflowSelect.value = event.target.value || '';
      renderSelectDropdown(canvasWorkflowSelect, 'Select workflow');
      var selected = state.workflows.find(function(item) { return item.id === event.target.value; });
      if (selected) {
        setWorkflowDraftFromObject(selected, true);
      } else {
        setWorkflowDraftFromObject(defaultWorkflowDraft(), false);
      }
    });
    workflowNameInput.addEventListener('input', function(event) {
      ensureWorkflowDraft();
      state.workflowDraft.name = event.target.value || 'New workflow';
      canvasWorkflowNameInput.value = state.workflowDraft.name;
      syncWorkflowJsonFromDraft();
    });
    workflowContinueEl.addEventListener('change', function(event) {
      ensureWorkflowDraft();
      state.workflowDraft.continueOnFailure = Boolean(event.target.checked);
      canvasWorkflowContinueEl.checked = state.workflowDraft.continueOnFailure;
      syncWorkflowJsonFromDraft();
    });
    document.getElementById('workflow-add-step-btn').addEventListener('click', function() {
      addWorkflowStep(workflowRoutePicker.value || state.selectedRouteId);
    });
    document.getElementById('workflow-clear-steps-btn').addEventListener('click', function() {
      ensureWorkflowDraft();
      state.workflowDraft.steps = [];
      renderWorkflowDiagram();
    });
    document.getElementById('workflow-apply-json-btn').addEventListener('click', function() {
      try {
        var parsed = readWorkflowFromEditor();
        setWorkflowDraftFromObject(parsed, false);
        showToast('Applied workflow JSON.', 'success', 1600);
      } catch (err) {
        showToast(err.message || String(err), 'error', 2400);
      }
    });
    workflowDiagramEl.addEventListener('click', function(event) {
      var target = event.target;
      if (!(target instanceof HTMLElement)) return;
      var action = target.getAttribute('data-step-action');
      var indexText = target.getAttribute('data-step-index');
      if (!action || indexText === null) return;
      var index = Number(indexText);
      if (!Number.isFinite(index)) return;
      handleWorkflowStepAction(action, index);
    });
    workflowDiagramEl.addEventListener('change', function(event) {
      var target = event.target;
      if (!(target instanceof HTMLElement)) return;
      var field = target.getAttribute('data-step-field');
      var indexText = target.getAttribute('data-step-index');
      if (!field || indexText === null) return;
      var index = Number(indexText);
      if (!Number.isFinite(index)) return;
      ensureWorkflowDraft();
      var step = state.workflowDraft.steps[index];
      if (!step) return;

      if (field === 'name' && target instanceof HTMLInputElement) {
        step.name = target.value || routeSummary(step.routeId);
      } else if (field === 'routeId' && target instanceof HTMLSelectElement) {
        step.routeId = target.value;
        if (!step.name || /^Step\s+\d+$/i.test(step.name)) {
          step.name = routeSummary(step.routeId);
        }
      }
      syncWorkflowJsonFromDraft();
    });
    openWorkflowCanvasBtn.addEventListener('click', function() {
      openWorkflowCanvas();
    });
    closeWorkflowCanvasBtn.addEventListener('click', function() {
      closeWorkflowCanvas();
    });
    canvasSaveWorkflowBtn.addEventListener('click', function() {
      saveWorkflow().catch(function(err) { showToast(err.message || String(err), 'error', 2500); });
    });
    canvasRunWorkflowBtn.addEventListener('click', function() {
      runWorkflow().catch(function(err) { showToast(err.message || String(err), 'error', 2500); });
    });
    canvasExportBtn.addEventListener('click', function() {
      exportCollections().catch(function(err) { showToast(err.message || String(err), 'error', 2500); });
    });
    canvasImportFile.addEventListener('change', function(event) {
      var file = event.target.files && event.target.files[0];
      if (!file) return;
      importCollections(file).catch(function(err) { showToast(err.message || String(err), 'error', 2500); });
      event.target.value = '';
    });
    canvasWorkflowSelect.addEventListener('change', function(event) {
      workflowSelect.value = event.target.value || '';
      renderSelectDropdown(workflowSelect, 'Select workflow');
      workflowSelect.dispatchEvent(new Event('change'));
    });
    profileSelect.addEventListener('change', function() {
      renderSelectDropdown(profileSelect, 'No profile');
    });
    suiteSelect.addEventListener('change', function() {
      renderSelectDropdown(suiteSelect, 'Select suite');
    });
    historyCodeFilterEl.addEventListener('change', function() {
      renderSelectDropdown(historyCodeFilterEl, 'All history');
    });
    document.addEventListener('click', function(event) {
      closeOpenDropdownsExcept(event.target);
    });
    canvasWorkflowNameInput.addEventListener('input', function(event) {
      ensureWorkflowDraft();
      state.workflowDraft.name = event.target.value || 'New workflow';
      workflowNameInput.value = state.workflowDraft.name;
      syncWorkflowJsonFromDraft();
    });
    canvasWorkflowContinueEl.addEventListener('change', function(event) {
      ensureWorkflowDraft();
      state.workflowDraft.continueOnFailure = Boolean(event.target.checked);
      workflowContinueEl.checked = state.workflowDraft.continueOnFailure;
      syncWorkflowJsonFromDraft();
    });
    canvasClearStepsBtn.addEventListener('click', function() {
      ensureWorkflowDraft();
      state.workflowDraft.steps = [];
      renderWorkflowDiagram();
    });
    canvasStepList.addEventListener('click', function(event) {
      var target = event.target;
      if (!(target instanceof HTMLElement)) return;
      var action = target.getAttribute('data-canvas-step-action');
      var indexText = target.getAttribute('data-canvas-step-index');
      if (!action || indexText === null) return;
      var index = Number(indexText);
      if (!Number.isFinite(index)) return;
      handleWorkflowStepAction(action, index);
    });
    canvasRouteLibrary.addEventListener('dragstart', function(event) {
      var target = event.target;
      if (!(target instanceof HTMLElement)) return;
      var card = target.closest('[data-canvas-route-id]');
      if (!(card instanceof HTMLElement)) return;
      var routeId = card.getAttribute('data-canvas-route-id') || '';
      if (!routeId) return;
      state.workflowCanvasDragRouteId = routeId;
      card.classList.add('dragging');
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'copy';
        event.dataTransfer.setData('text/plain', routeId);
        event.dataTransfer.setData('application/x-routescout-route', routeId);
      }
    });
    canvasRouteLibrary.addEventListener('dragend', function(event) {
      var target = event.target;
      if (target instanceof HTMLElement) {
        target.classList.remove('dragging');
      }
      state.workflowCanvasDragRouteId = null;
      clearWorkflowDropTargets();
    });
    workflowCanvasArea.addEventListener('dragover', function(event) {
      var routeId = getWorkflowDragRouteId(event);
      if (!routeId) return;
      event.preventDefault();
      var target = event.target;
      if (!(target instanceof HTMLElement)) return;
      clearWorkflowDropTargets();
      var dropTarget = target.closest('[data-canvas-drop-index]');
      if (dropTarget instanceof HTMLElement) {
        dropTarget.classList.add('drag-over');
      }
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'copy';
      }
    });
    workflowCanvasArea.addEventListener('dragleave', function(event) {
      var target = event.target;
      if (!(target instanceof HTMLElement)) return;
      var dropTarget = target.closest('[data-canvas-drop-index]');
      if (dropTarget instanceof HTMLElement && !dropTarget.contains(event.relatedTarget)) {
        dropTarget.classList.remove('drag-over');
      }
    });
    workflowCanvasArea.addEventListener('drop', function(event) {
      var routeId = getWorkflowDragRouteId(event);
      if (!routeId) return;
      event.preventDefault();
      var target = event.target;
      var insertIndex = state.workflowDraft && Array.isArray(state.workflowDraft.steps)
        ? state.workflowDraft.steps.length
        : 0;
      if (target instanceof HTMLElement) {
        var dropTarget = target.closest('[data-canvas-drop-index]');
        if (dropTarget instanceof HTMLElement) {
          var dropIndexText = dropTarget.getAttribute('data-canvas-drop-index');
          var parsedIndex = Number(dropIndexText);
          if (Number.isFinite(parsedIndex)) {
            insertIndex = parsedIndex;
          }
        }
      }
      clearWorkflowDropTargets();
      addWorkflowStep(routeId, insertIndex);
      state.workflowCanvasDragRouteId = null;
    });

    document.getElementById('export-btn').addEventListener('click', function() { exportCollections().catch(function(err) { showToast(err.message || String(err), 'error', 2500); }); });
    document.getElementById('import-file').addEventListener('change', function(event) {
      var file = event.target.files && event.target.files[0];
      if (!file) return;
      importCollections(file).catch(function(err) { showToast(err.message || String(err), 'error', 2500); });
      event.target.value = '';
    });

    document.getElementById('history-refresh-btn').addEventListener('click', function() {
      loadHistory().catch(function(err) { showToast(err.message || String(err), 'error', 2500); });
    });
    historyCodeFilterEl.addEventListener('change', function() {
      renderHistory(state.historyItems);
    });
    historyOutputEl.addEventListener('click', function(event) {
      var copyBodyBtn = event.target.closest('[data-history-copy-body]');
      if (copyBodyBtn) {
        event.preventDefault();
        event.stopPropagation();
        copyHistoryRequestBody(copyBodyBtn.getAttribute('data-history-copy-body') || '').catch(function(err) {
          showToast(err.message || String(err), 'error', 2500);
        });
        return;
      }
      var copyHeadersBtn = event.target.closest('[data-history-copy-headers]');
      if (copyHeadersBtn) {
        event.preventDefault();
        event.stopPropagation();
        copyHistoryResponseHeaders(copyHeadersBtn.getAttribute('data-history-copy-headers') || '').catch(function(err) {
          showToast(err.message || String(err), 'error', 2500);
        });
        return;
      }
      var copyResponseBtn = event.target.closest('[data-history-copy-response]');
      if (copyResponseBtn) {
        event.preventDefault();
        event.stopPropagation();
        copyHistoryResponseBody(copyResponseBtn.getAttribute('data-history-copy-response') || '').catch(function(err) {
          showToast(err.message || String(err), 'error', 2500);
        });
        return;
      }
      var card = event.target.closest('[data-history-key]');
      if (!card) return;
      var nextKey = card.getAttribute('data-history-key') || '';
      state.selectedHistoryKey = state.selectedHistoryKey === nextKey ? null : nextKey;
      renderHistory(state.historyItems);
    });
    historyOutputEl.addEventListener('keydown', function(event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      if (event.target.closest('[data-history-copy-body]') || event.target.closest('[data-history-copy-headers]') || event.target.closest('[data-history-copy-response]')) return;
      var card = event.target.closest('[data-history-key]');
      if (!card) return;
      event.preventDefault();
      var nextKey = card.getAttribute('data-history-key') || '';
      state.selectedHistoryKey = state.selectedHistoryKey === nextKey ? null : nextKey;
      renderHistory(state.historyItems);
    });

    document.getElementById('reload-btn').addEventListener('click', async function() {
      showToast('Refreshing endpoints...', 'info', 1400);
      setReloading(true);
      try {
        await fetchJson('/api/reload', { method: 'POST' });
        await loadAll();
        setStatus('Routes reloaded.', 'ok');
        showToast('Endpoints reloaded', 'success', 1800);
      } catch (err) {
        setStatus(err.message || String(err), 'err');
        showToast(err.message || String(err), 'error', 2600);
      } finally {
        setReloading(false);
      }
    });

    document.querySelectorAll('.response-tab').forEach(function(btn) {
      btn.addEventListener('click', function() {
        state.responseTab = btn.dataset.tab;
        syncResponseTabs();
        renderSelectedRouteResponse();
      });
    });
    if (copyResponseOutputBtn) {
      copyResponseOutputBtn.addEventListener('click', function() {
        copyCurrentResponseOutput().catch(function(err) {
          showToast(err.message || String(err), 'error', 2500);
        });
      });
    }

    initTheme();
    initHelpHints();
    syncPathParamsEditor();
    syncQueryEditor();
    syncHeadersEditor();
    syncBodyEditor();
    syncPresetExtraHeadersEditor();
    setOverrideTarget('');
    renderValuesReference();
    updateRequestValidationUI(false);
    updatePresetModalValidationUI(false);
    syncResponseTabs();
    initColumnSizes();
    loadAll().catch(function(err) {
      setStatus(err.message || String(err), 'err');
      outputEl.textContent = String(err.stack || err);
      showToast(err.message || String(err), 'error', 3200);
    });
  </script>
</body>
</html>`;
