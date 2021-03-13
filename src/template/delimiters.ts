export interface Delimiters {
    open: string;
    sep: string;
    close: string;
}

export const defaultDelimiters = {
    open: "[[",
    sep: "::",
    close: "]]",
};
