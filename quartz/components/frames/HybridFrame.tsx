import { BlogHome, BlogSidebar, BlogWidgets } from "../BlogShell"
import LegalFooterConstructor from "../LegalFooter"
import { DefaultFrame } from "./DefaultFrame"
import { PageFrame, PageFrameProps } from "./types"

const LegalFooter = LegalFooterConstructor()

function isBlogSurface(slug: string): boolean {
  return (
    slug === "index" ||
    slug === "posts" ||
    slug.startsWith("posts/") ||
    slug === "tags/index" ||
    slug.startsWith("tags/")
  )
}

export const HybridFrame: PageFrame = {
  name: "hybrid",
  render(props: PageFrameProps) {
    const {
      componentData,
      header,
      beforeBody,
      pageBody: Content,
      afterBody,
      left,
      right,
      footer,
    } = props
    const slug = componentData.fileData.slug ?? ""

    if (!isBlogSurface(slug)) {
      return DefaultFrame.render(props)
    }

    const isHome = slug === "index"
    return (
      <div class="blog-layout">
        <div class="blog-layout__left">
          <BlogSidebar {...componentData}>
            {left.map((LeftComponent) => (
              <LeftComponent {...componentData} />
            ))}
          </BlogSidebar>
        </div>
        <main class="blog-layout__main">
          {header.length > 0 && (
            <header class="blog-layout__header">
              {header.map((HeaderComponent) => (
                <HeaderComponent {...componentData} />
              ))}
            </header>
          )}
          {isHome ? (
            <BlogHome {...componentData} children={[<Content {...componentData} />]} />
          ) : (
            <div class="blog-article">
              <div class="blog-article__header">
                {beforeBody.map((BodyComponent) => (
                  <BodyComponent {...componentData} />
                ))}
              </div>
              <Content {...componentData} />
              <div class="blog-article__after">
                {afterBody.map((BodyComponent) => (
                  <BodyComponent {...componentData} />
                ))}
              </div>
            </div>
          )}
        </main>
        <aside class="blog-layout__right">
          <BlogWidgets {...componentData} />
          <div class="blog-layout__quartz-widgets">
            {right.map((RightComponent) => (
              <RightComponent {...componentData} />
            ))}
          </div>
        </aside>
        <div class="blog-layout__footer">
          {footer.map((FooterComponent) => (
            <FooterComponent {...componentData} />
          ))}
          <LegalFooter {...componentData} />
        </div>
      </div>
    )
  },
}
