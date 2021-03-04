import type { ContextInfo } from "../contexts"
import type { SetupInfo } from "../setups"

export type ExampleInfo = {
  name: string,
  description?: string,
  context: ContextInfo,
  setups: SetupInfo[],
}
