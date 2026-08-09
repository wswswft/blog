import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import GraphSettings from "./quartz/components/GraphSettings"
import { componentRegistry } from "./quartz/components/registry"

componentRegistry.register("local-graph-settings", GraphSettings, "local")

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
