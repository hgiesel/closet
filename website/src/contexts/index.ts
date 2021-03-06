export type ContextData = Record<string, unknown>

export interface Context {
  label: string
  value: string
  data: Record<string, unknown>
}

export interface ContextInfo {
  defaultValue: string
  values: Context[]
}
