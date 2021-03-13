export interface Circumfix {
    before: string;
    after: string;
}

export type WeakCircumfix = Partial<Circumfix> | string;

export const weakCircumfixToCircumfix = (ws: WeakCircumfix): Circumfix =>
    typeof ws === "string"
        ? {
              before: ws,
              after: ws,
          }
        : {
              before: ws.before ?? "",
              after: ws.after ?? "",
          };
