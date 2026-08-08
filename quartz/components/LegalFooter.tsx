import { joinSegments, pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

export default (() => {
  const LegalFooter: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
    const iconPath = joinSegments(pathToRoot(fileData.slug!), "static/gongan.png")

    return (
      <footer class="site-records" aria-label="网站备案信息">
        <a
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noopener noreferrer"
        >
          晋ICP备2026009835号-1
        </a>
        <span class="site-records__separator" aria-hidden="true">
          ·
        </span>
        <a
          class="site-records__police"
          href="https://beian.mps.gov.cn/#/query/webSearch?code=14010502990693"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={iconPath} alt="" width="16" height="17" />
          <span>晋公网安备14010502990693号</span>
        </a>
      </footer>
    )
  }

  return LegalFooter
}) satisfies QuartzComponentConstructor
