const header = document.querySelector("[data-header]")
const menu = document.querySelector("[data-menu]")
const menuToggle = document.querySelector("[data-menu-toggle]")

const closeMenu = () => {
  if (!menu || !menuToggle) return
  menu.classList.remove("is-open")
  menuToggle.setAttribute("aria-expanded", "false")
  menuToggle.setAttribute("aria-label", "打开菜单")
}

if (menu && menuToggle) {
  menuToggle.addEventListener("click", () => {
    const willOpen = !menu.classList.contains("is-open")
    menu.classList.toggle("is-open", willOpen)
    menuToggle.setAttribute("aria-expanded", String(willOpen))
    menuToggle.setAttribute("aria-label", willOpen ? "关闭菜单" : "打开菜单")
  })

  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu()
  })

  document.addEventListener("click", (event) => {
    if (!menu.classList.contains("is-open")) return
    if (menu.contains(event.target) || menuToggle.contains(event.target)) return
    closeMenu()
  })

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu()
  })

  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) closeMenu()
  })
}

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 18)
}

updateHeader()
window.addEventListener("scroll", updateHeader, { passive: true })

for (const year of document.querySelectorAll("[data-year]")) {
  year.textContent = String(new Date().getFullYear())
}

const reveals = [...document.querySelectorAll(".reveal")]

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add("is-visible")
        observer.unobserve(entry.target)
      }
    },
    { rootMargin: "0px 0px -8%", threshold: 0.08 },
  )

  for (const element of reveals) revealObserver.observe(element)
} else {
  for (const element of reveals) element.classList.add("is-visible")
}
