import { QuartzPluginData } from "../plugins/vfile"
import { FullSlug, joinSegments, pathToRoot, resolveRelative } from "../util/path"
import { Date, getDate } from "./Date"
import { QuartzComponent, QuartzComponentProps } from "./types"

function pageDate(page: QuartzPluginData): globalThis.Date | undefined {
  try {
    return getDate(page)
  } catch {
    return undefined
  }
}

function isPublishablePage(page: QuartzPluginData): boolean {
  const slug = page.slug ?? ""
  const tags = page.frontmatter?.tags ?? []
  return (
    slug !== "" &&
    slug !== "index" &&
    !slug.endsWith("/index") &&
    !slug.startsWith("meta/") &&
    !slug.startsWith("tags/") &&
    !tags.includes("moc") &&
    Boolean(page.frontmatter?.title)
  )
}

function sortedPublishedPages(allFiles: QuartzPluginData[]): QuartzPluginData[] {
  const candidates = allFiles.filter(isPublishablePage)
  const posts = candidates.filter((page) => page.slug?.startsWith("posts/"))
  const pages = posts.length > 0 ? posts : candidates

  return [...pages].sort((left, right) => {
    const leftTime = pageDate(left)?.getTime() ?? 0
    const rightTime = pageDate(right)?.getTime() ?? 0
    if (leftTime !== rightTime) return rightTime - leftTime
    return (left.frontmatter?.title ?? "").localeCompare(right.frontmatter?.title ?? "", "zh-CN")
  })
}

function coverPath(currentSlug: FullSlug, page: QuartzPluginData): string | undefined {
  const frontmatter = page.frontmatter as Record<string, unknown> | undefined
  const cover = frontmatter?.cover ?? frontmatter?.socialImage ?? frontmatter?.image
  if (typeof cover !== "string" || cover.trim() === "") return undefined
  if (/^https?:\/\//.test(cover)) return cover

  const cleanCover = cover.replace(/^\.\//, "").replace(/^\//, "")
  const pageSlug = page.slug ?? ""
  const pageDirectory = pageSlug.endsWith("/index")
    ? pageSlug.slice(0, -"/index".length)
    : pageSlug.split("/").slice(0, -1).join("/")
  const target = cover.startsWith("/") ? cleanCover : joinSegments(pageDirectory, cleanCover)
  return resolveRelative(currentSlug, target as FullSlug)
}

function primaryTag(page: QuartzPluginData): string {
  const tags = page.frontmatter?.tags ?? []
  return tags.find((tag) => !["concept", "project", "tool"].includes(tag)) ?? tags[0] ?? "note"
}

function pageDescription(page: QuartzPluginData): string {
  return (
    page.frontmatter?.description ??
    page.description ??
    "一篇来自个人知识库的技术笔记，记录理解、实践与后续思考。"
  )
}

export const BlogSidebar: QuartzComponent = ({ cfg, fileData, children }: QuartzComponentProps) => {
  const root = pathToRoot(fileData.slug!)
  const navItems = [
    ["首页", "index"],
    ["知识", "concepts/index"],
    ["项目", "projects/index"],
    ["工具", "tools/index"],
    ["标签", "tags/index"],
  ] as const

  return (
    <aside class="blog-profile">
      <a class="blog-profile__avatar" href={root} aria-label="返回首页">
        <img src={joinSegments(root, "static/icon.png")} alt="wswswft" width="96" height="96" />
      </a>
      <div class="blog-profile__identity">
        <p class="blog-profile__eyebrow">PERSONAL GARDEN</p>
        <h1>{cfg.pageTitle}</h1>
        <p>技术学习、工程实践与知识整理</p>
      </div>
      <nav class="blog-profile__nav" aria-label="主要导航">
        {navItems.map(([label, slug]) => (
          <a href={resolveRelative(fileData.slug!, slug as FullSlug)} class="internal">
            <span>{label}</span>
            <span aria-hidden="true">›</span>
          </a>
        ))}
      </nav>
      <a
        class="blog-profile__github"
        href="https://github.com/wswswft"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub
        <span aria-hidden="true">↗</span>
      </a>
      <div class="blog-profile__tools">{children}</div>
    </aside>
  )
}

export const BlogHome: QuartzComponent = (props: QuartzComponentProps) => {
  const { cfg, fileData, allFiles, children } = props
  const pages = sortedPublishedPages(allFiles).slice(0, 9)

  return (
    <>
      <section class="blog-hero">
        <div>
          <p class="blog-hero__eyebrow">ZERO TO TECH · DIGITAL GARDEN</p>
          <h2>
            在实践中构建知识，
            <br />
            也记录抵达答案之前的路。
          </h2>
          <p class="blog-hero__copy">
            这里收集 C++、CUDA、TensorRT
            与工程项目笔记。内容会持续生长，也会在新的理解中被重新连接。
          </p>
          <div class="blog-hero__actions">
            <a
              class="blog-button blog-button--primary internal"
              href={resolveRelative(fileData.slug!, "concepts/index" as FullSlug)}
            >
              浏览知识地图
            </a>
            <a
              class="blog-button internal"
              href={resolveRelative(fileData.slug!, "projects/index" as FullSlug)}
            >
              查看项目
            </a>
          </div>
        </div>
        <div class="blog-hero__mark" aria-hidden="true">
          <span>W</span>
        </div>
      </section>

      <section class="blog-feed" aria-labelledby="recent-notes-title">
        <div class="blog-section-heading">
          <div>
            <p>RECENT NOTES</p>
            <h2 id="recent-notes-title">最近更新</h2>
          </div>
          <span>{pages.length} 篇精选笔记</span>
        </div>
        <div class="blog-card-grid">
          {pages.map((page, index) => {
            const cover = coverPath(fileData.slug!, page)
            const tag = primaryTag(page)
            const date = pageDate(page)
            return (
              <article class={`blog-card ${index === 0 ? "blog-card--featured" : ""}`}>
                <a
                  class={`blog-card__cover ${cover ? "has-image" : ""}`}
                  href={resolveRelative(fileData.slug!, page.slug!)}
                  aria-label={`阅读 ${page.frontmatter?.title}`}
                  style={cover ? { backgroundImage: `url(${cover})` } : undefined}
                >
                  {!cover && (
                    <>
                      <span>{tag.slice(0, 2).toUpperCase()}</span>
                      <i aria-hidden="true" />
                    </>
                  )}
                </a>
                <div class="blog-card__body">
                  <div class="blog-card__meta">
                    <a
                      class="blog-card__tag internal"
                      href={resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)}
                    >
                      {tag}
                    </a>
                    {date && <Date date={date} locale={cfg.locale} />}
                  </div>
                  <h3>
                    <a class="internal" href={resolveRelative(fileData.slug!, page.slug!)}>
                      {page.frontmatter?.title}
                    </a>
                  </h3>
                  <p>{pageDescription(page)}</p>
                  <a
                    class="blog-card__more internal"
                    href={resolveRelative(fileData.slug!, page.slug!)}
                  >
                    阅读笔记 <span aria-hidden="true">→</span>
                  </a>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section class="blog-knowledge-entry">
        <div class="blog-section-heading">
          <div>
            <p>KNOWLEDGE MAP</p>
            <h2>知识库入口</h2>
          </div>
        </div>
        <div class="blog-knowledge-entry__content">{children}</div>
      </section>
    </>
  )
}

export const BlogWidgets: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
  const pages = sortedPublishedPages(allFiles)
  const tagCounts = new Map<string, number>()
  for (const page of allFiles) {
    for (const tag of page.frontmatter?.tags ?? []) {
      if (tag === "moc") continue
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)
    }
  }
  const tags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12)

  return (
    <div class="blog-widgets">
      <section class="blog-widget">
        <p class="blog-widget__label">知识分区</p>
        <div class="blog-widget__sections">
          <a class="internal" href={resolveRelative(fileData.slug!, "concepts/index" as FullSlug)}>
            <span>Concepts</span>
            <b>概念</b>
          </a>
          <a class="internal" href={resolveRelative(fileData.slug!, "projects/index" as FullSlug)}>
            <span>Projects</span>
            <b>项目</b>
          </a>
          <a class="internal" href={resolveRelative(fileData.slug!, "tools/index" as FullSlug)}>
            <span>Tools</span>
            <b>工具</b>
          </a>
        </div>
      </section>
      <section class="blog-widget">
        <p class="blog-widget__label">热门标签</p>
        <div class="blog-widget__tags">
          {tags.map(([tag, count]) => (
            <a class="internal" href={resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)}>
              {tag}
              <span>{count}</span>
            </a>
          ))}
        </div>
      </section>
      <section class="blog-widget">
        <p class="blog-widget__label">继续阅读</p>
        <ol class="blog-widget__recent">
          {pages.slice(0, 5).map((page) => (
            <li>
              <a class="internal" href={resolveRelative(fileData.slug!, page.slug!)}>
                {page.frontmatter?.title}
              </a>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
