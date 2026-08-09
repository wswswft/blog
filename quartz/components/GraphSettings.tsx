import { QuartzComponent, QuartzComponentConstructor } from "./types"
import style from "./styles/graphSettings.scss"
// @ts-ignore
import script from "./scripts/graphSettings.inline"

export default (() => {
  const GraphSettings: QuartzComponent = () => null

  GraphSettings.displayName = "GraphSettings"
  GraphSettings.css = style
  GraphSettings.afterDOMLoaded = script

  return GraphSettings
}) satisfies QuartzComponentConstructor
