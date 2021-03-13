export type Setup = (closet: NodeModule, filterManager: any) => any;

export interface SetupInfo {
  name: string;
  title: string;
  setup: Setup;
}

export * as clozes from "./clozes";
