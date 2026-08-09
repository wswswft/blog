type GraphScope = "local" | "global"

type GraphConfig = {
  depth?: number
  linkDistance?: number
  repelForce?: number
  centerForce?: number
  fontSize?: number
  removeTags?: string[]
  showTags?: boolean
  focusOnHover?: boolean
  enableRadial?: boolean
  [key: string]: unknown
}

type StoredGraphSettings = Partial<Record<GraphScope, GraphConfig>>

type RangeSetting = {
  key: keyof GraphConfig
  label: string
  min: number
  max: number
  step: number
  format: (value: number) => string
}

const storageKey = "wswswft-graph-settings-v1"
const rangeSettings: RangeSetting[] = [
  {
    key: "depth",
    label: "关系深度",
    min: -1,
    max: 4,
    step: 1,
    format: (value) => (value === -1 ? "全部" : `${value} 层`),
  },
  {
    key: "linkDistance",
    label: "连线距离",
    min: 16,
    max: 80,
    step: 2,
    format: (value) => `${value}px`,
  },
  {
    key: "repelForce",
    label: "节点斥力",
    min: 0.1,
    max: 1.5,
    step: 0.1,
    format: formatDecimal,
  },
  {
    key: "centerForce",
    label: "中心引力",
    min: 0.05,
    max: 0.8,
    step: 0.05,
    format: formatDecimal,
  },
  {
    key: "fontSize",
    label: "标签字号",
    min: 0.4,
    max: 1.2,
    step: 0.05,
    format: (value) => `${formatDecimal(value)}×`,
  },
]

const toggleSettings = [
  { key: "showTags", label: "显示标签节点" },
  { key: "focusOnHover", label: "悬停聚焦相邻节点" },
  { key: "enableRadial", label: "启用环形布局" },
] as const

const allowedKeys = new Set<string>([
  ...rangeSettings.map(({ key }) => String(key)),
  ...toggleSettings.map(({ key }) => key),
  "removeTags",
])

let redrawTimer: number | undefined
let graphSettingsId = 0

function formatDecimal(value: number): string {
  return value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "")
}

function parseConfig(raw: string | undefined): GraphConfig {
  if (!raw) return {}

  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === "object" ? parsed : {}
  } catch {
    return {}
  }
}

function readStoredSettings(): StoredGraphSettings {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) ?? "{}")
    return parsed && typeof parsed === "object" ? parsed : {}
  } catch {
    return {}
  }
}

function writeStoredSettings(settings: StoredGraphSettings): void {
  try {
    if (Object.keys(settings).length === 0) {
      localStorage.removeItem(storageKey)
    } else {
      localStorage.setItem(storageKey, JSON.stringify(settings))
    }
  } catch {
    // Browsers may block storage in private or restricted contexts.
  }
}

function getContainer(graph: Element, scope: GraphScope): HTMLElement | null {
  const selector = scope === "local" ? ".graph-container" : ".global-graph-container"
  return graph.querySelector<HTMLElement>(selector)
}

function getConfig(graph: Element, scope: GraphScope): GraphConfig {
  return parseConfig(getContainer(graph, scope)?.dataset.cfg)
}

function sanitizeSettings(settings: GraphConfig | undefined): GraphConfig {
  if (!settings) return {}

  const sanitized: GraphConfig = {}
  for (const [key, value] of Object.entries(settings)) {
    if (!allowedKeys.has(key)) continue

    if (key === "removeTags" && Array.isArray(value)) {
      sanitized.removeTags = value.filter((tag): tag is string => typeof tag === "string")
    } else if (typeof value === "number" || typeof value === "boolean") {
      sanitized[key] = value
    }
  }

  return sanitized
}

function setScopeConfig(scope: GraphScope, config: GraphConfig): void {
  const selector = scope === "local" ? ".graph-container" : ".global-graph-container"
  document.querySelectorAll<HTMLElement>(selector).forEach((container) => {
    container.dataset.cfg = JSON.stringify(config)
  })
}

function persistScope(scope: GraphScope, config: GraphConfig): void {
  const stored = readStoredSettings()
  const nextSettings: GraphConfig = {}

  for (const key of allowedKeys) {
    if (config[key] !== undefined) nextSettings[key] = config[key]
  }

  stored[scope] = nextSettings
  writeStoredSettings(stored)
}

function applyStoredSettings(graph: Element): boolean {
  const stored = readStoredSettings()
  let changed = false

  for (const scope of ["local", "global"] as const) {
    const container = getContainer(graph, scope)
    if (!container) continue

    if (!container.dataset.graphSettingsDefault) {
      container.dataset.graphSettingsDefault = container.dataset.cfg ?? "{}"
    }

    const current = parseConfig(container.dataset.cfg)
    const saved = sanitizeSettings(stored[scope])
    if (Object.keys(saved).length === 0) continue

    const next = { ...current, ...saved }
    const serialized = JSON.stringify(next)
    if (serialized !== container.dataset.cfg) {
      container.dataset.cfg = serialized
      changed = true
    }
  }

  return changed
}

function scopeLabel(scope: GraphScope): string {
  return scope === "local" ? "局部图" : "全局图"
}

function settingsTemplate(id: number): string {
  const ranges = rangeSettings
    .map(
      ({ key, label, min, max, step }) => `
        <label class="graph-settings__range">
          <span class="graph-settings__range-heading">
            <span>${label}</span>
            <output data-graph-output="${String(key)}"></output>
          </span>
          <input
            type="range"
            min="${min}"
            max="${max}"
            step="${step}"
            data-graph-setting="${String(key)}"
            aria-label="${label}"
          />
        </label>`,
    )
    .join("")

  const toggles = toggleSettings
    .map(
      ({ key, label }) => `
        <label class="graph-settings__switch">
          <span>${label}</span>
          <input type="checkbox" data-graph-setting="${key}" />
          <span class="graph-settings__switch-track" aria-hidden="true"></span>
        </label>`,
    )
    .join("")

  return `
    <button
      class="graph-settings__toggle"
      type="button"
      aria-expanded="false"
      aria-controls="graph-settings-panel-${id}"
      aria-label="调整关系图谱"
      title="调整关系图谱"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M6 14v6" />
      </svg>
    </button>
    <div class="graph-settings__panel" id="graph-settings-panel-${id}" hidden>
      <div class="graph-settings__topbar">
        <div>
          <span class="graph-settings__eyebrow">布局调节</span>
          <strong>图谱设置</strong>
        </div>
        <button class="graph-settings__reset" type="button">恢复默认</button>
      </div>
      <div class="graph-settings__scopes" role="group" aria-label="图谱范围">
        <button type="button" data-graph-scope="local" aria-pressed="true">局部图</button>
        <button type="button" data-graph-scope="global" aria-pressed="false">全局图</button>
      </div>
      <div class="graph-settings__ranges">${ranges}</div>
      <div class="graph-settings__toggles">${toggles}</div>
      <label class="graph-settings__tags">
        <span>隐藏标签</span>
        <input
          type="text"
          data-graph-setting="removeTags"
          placeholder="例如：draft, private"
          autocomplete="off"
          spellcheck="false"
        />
      </label>
      <p class="graph-settings__hint">设置将自动保存到当前浏览器。</p>
    </div>`
}

function syncControls(root: HTMLElement): void {
  const graph = root.closest(".graph")
  if (!graph) return

  const scope = (root.dataset.graphScope ?? "local") as GraphScope
  const config = getConfig(graph, scope)

  root.querySelectorAll<HTMLButtonElement>("[data-graph-scope]").forEach((button) => {
    const active = button.dataset.graphScope === scope
    button.classList.toggle("is-active", active)
    button.setAttribute("aria-pressed", String(active))
  })

  root.querySelectorAll<HTMLInputElement>("[data-graph-setting]").forEach((input) => {
    const key = input.dataset.graphSetting as keyof GraphConfig
    const value = config[key]

    if (input.type === "checkbox") {
      input.checked = Boolean(value)
    } else if (key === "removeTags") {
      input.value = Array.isArray(value) ? value.join(", ") : ""
    } else if (typeof value === "number") {
      input.value = String(value)
    }
  })

  for (const setting of rangeSettings) {
    const value = config[setting.key]
    const output = root.querySelector<HTMLOutputElement>(
      `[data-graph-output="${String(setting.key)}"]`,
    )
    if (output && typeof value === "number") output.value = setting.format(value)
  }

  const reset = root.querySelector<HTMLButtonElement>(".graph-settings__reset")
  if (reset) reset.title = `恢复${scopeLabel(scope)}默认设置`
}

function syncAllControls(): void {
  document.querySelectorAll<HTMLElement>(".graph-settings").forEach(syncControls)
}

function setPanelOpen(root: HTMLElement, open: boolean): void {
  const toggle = root.querySelector<HTMLButtonElement>(".graph-settings__toggle")
  const panel = root.querySelector<HTMLElement>(".graph-settings__panel")
  if (!toggle || !panel) return

  root.classList.toggle("is-open", open)
  toggle.setAttribute("aria-expanded", String(open))
  panel.hidden = !open

  if (open) syncControls(root)
}

function redrawGraph(delay = 180): void {
  window.clearTimeout(redrawTimer)
  redrawTimer = window.setTimeout(() => {
    const savedTheme = document.documentElement.getAttribute("saved-theme")
    const theme = savedTheme === "dark" ? "dark" : "light"
    const event: CustomEventMap["themechange"] = new CustomEvent("themechange", {
      detail: { theme },
    })
    document.dispatchEvent(event)
  }, delay)
}

function waitForInitialGraphThenRedraw(): void {
  window.setTimeout(() => {
    const containers = Array.from(document.querySelectorAll<HTMLElement>(".graph-container"))
    if (containers.length === 0) return

    if (containers.some((container) => container.querySelector("canvas"))) {
      redrawGraph(0)
      return
    }

    const observer = new MutationObserver(() => {
      if (containers.some((container) => container.querySelector("canvas"))) {
        observer.disconnect()
        redrawGraph(0)
      }
    })

    containers.forEach((container) => observer.observe(container, { childList: true }))
    window.setTimeout(() => observer.disconnect(), 8000)
  }, 0)
}

function initializeGraphSettings(): void {
  let storedSettingsApplied = false

  document.querySelectorAll<HTMLElement>(".graph").forEach((graph) => {
    storedSettingsApplied = applyStoredSettings(graph) || storedSettingsApplied

    if (graph.querySelector(":scope > .graph-settings")) return

    const root = document.createElement("section")
    root.className = "graph-settings"
    root.dataset.graphScope = "local"
    root.setAttribute("aria-label", "图谱设置")
    root.innerHTML = settingsTemplate(++graphSettingsId)

    const title = graph.querySelector(":scope > h3")
    if (title) title.insertAdjacentElement("afterend", root)
    else graph.prepend(root)

    syncControls(root)
  })

  if (storedSettingsApplied) waitForInitialGraphThenRedraw()
}

function handleClick(event: MouseEvent): void {
  const target = event.target
  if (!(target instanceof Element)) return

  const toggle = target.closest<HTMLButtonElement>(".graph-settings__toggle")
  if (toggle) {
    const root = toggle.closest<HTMLElement>(".graph-settings")
    if (!root) return

    const shouldOpen = toggle.getAttribute("aria-expanded") !== "true"
    document.querySelectorAll<HTMLElement>(".graph-settings.is-open").forEach((other) => {
      if (other !== root) setPanelOpen(other, false)
    })
    setPanelOpen(root, shouldOpen)
    return
  }

  const scopeButton = target.closest<HTMLButtonElement>("[data-graph-scope]")
  if (scopeButton) {
    const root = scopeButton.closest<HTMLElement>(".graph-settings")
    const scope = scopeButton.dataset.graphScope as GraphScope | undefined
    if (!root || !scope) return

    root.dataset.graphScope = scope
    syncControls(root)
    return
  }

  const resetButton = target.closest<HTMLButtonElement>(".graph-settings__reset")
  if (resetButton) {
    const root = resetButton.closest<HTMLElement>(".graph-settings")
    const graph = root?.closest(".graph")
    if (!root || !graph) return

    const scope = (root.dataset.graphScope ?? "local") as GraphScope
    const container = getContainer(graph, scope)
    const defaults = parseConfig(container?.dataset.graphSettingsDefault)
    setScopeConfig(scope, defaults)

    const stored = readStoredSettings()
    delete stored[scope]
    writeStoredSettings(stored)
    syncAllControls()
    redrawGraph(0)
    return
  }

  document.querySelectorAll<HTMLElement>(".graph-settings.is-open").forEach((root) => {
    if (!root.contains(target)) setPanelOpen(root, false)
  })
}

function updateSetting(input: HTMLInputElement, eventType: string): void {
  const root = input.closest<HTMLElement>(".graph-settings")
  const graph = root?.closest(".graph")
  const key = input.dataset.graphSetting as keyof GraphConfig | undefined
  if (!root || !graph || !key) return

  const scope = (root.dataset.graphScope ?? "local") as GraphScope
  const config = getConfig(graph, scope)

  if (input.type === "checkbox") {
    config[key] = input.checked
  } else if (key === "removeTags") {
    config.removeTags = input.value
      .split(/[,，]/)
      .map((tag) => tag.trim())
      .filter(Boolean)
  } else {
    const value = Number(input.value)
    if (!Number.isFinite(value)) return
    config[key] = value
  }

  const rawValue = input.value
  setScopeConfig(scope, config)
  persistScope(scope, config)
  if (key !== "removeTags" || eventType === "change") {
    syncAllControls()
  } else {
    input.value = rawValue
  }

  const delay = eventType === "change" ? 0 : key === "removeTags" ? 360 : 180
  redrawGraph(delay)
}

function handleSettingEvent(event: Event): void {
  const input = event.target
  if (!(input instanceof HTMLInputElement) || !input.dataset.graphSetting) return
  updateSetting(input, event.type)
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key !== "Escape") return
  document.querySelectorAll<HTMLElement>(".graph-settings.is-open").forEach((root) => {
    setPanelOpen(root, false)
  })
}

document.addEventListener("click", handleClick)
document.addEventListener("input", handleSettingEvent)
document.addEventListener("change", handleSettingEvent)
document.addEventListener("keydown", handleKeydown)
document.addEventListener("nav", initializeGraphSettings)
document.addEventListener("render", initializeGraphSettings)

if (document.readyState !== "loading") initializeGraphSettings()
