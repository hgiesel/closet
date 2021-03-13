import { SharedStore, storeTemplate } from "./storeTemplate";

export class ListStore extends SharedStore<string[]> {
    setList(storeKey: string, list: string[]): void {
        this.set(storeKey, list);
    }

    overwriteList(storeKey: string, newList: string[], fromIndex = 0): void {
        const list = this.getList(storeKey);

        for (let i = 0; i < newList.length; i++) {
            list[fromIndex + i] = newList[i];
        }

        this.setList(storeKey, list);
    }

    getList(storeKey: string): string[] {
        return this.get(storeKey, []);
    }
}

export const listStoreTemplate = storeTemplate(ListStore);
