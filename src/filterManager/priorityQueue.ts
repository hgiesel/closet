export type Comparator<T> = (a: T, b: T) => boolean;

const top = 0;
const parent = (i: number): number => ((i + 1) >>> 1) - 1;
const left = (i: number): number => (i << 1) + 1;
const right = (i: number): number => (i + 1) << 1;

export class PriorityQueue<T> {
    private readonly _heap: T[];
    private readonly _comparator: Comparator<T>;

    constructor(comparator: Comparator<T>) {
        this._heap = [];
        this._comparator = comparator;
    }

    private greater(i: number, j: number): boolean {
        return this._comparator(this._heap[i], this._heap[j]);
    }

    private swap(i: number, j: number): void {
        [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
    }

    private siftUp(): void {
        let node = this.size() - 1;
        while (node > top && this.greater(node, parent(node))) {
            this.swap(node, parent(node));
            node = parent(node);
        }
    }

    private siftDown(): void {
        let node = top;
        while (
            (left(node) < this.size() && this.greater(left(node), node)) ||
            (right(node) < this.size() && this.greater(right(node), node))
        ) {
            const maxChild =
                right(node) < this.size() &&
                this.greater(right(node), left(node))
                    ? right(node)
                    : left(node);

            this.swap(node, maxChild);
            node = maxChild;
        }
    }

    size(): number {
        return this._heap.length;
    }

    isEmpty(): boolean {
        return this.size() === 0;
    }

    peek(): T {
        return this._heap[top];
    }

    push(...values: T[]): number {
        values.forEach((value) => {
            this._heap.push(value);
            this.siftUp();
        });

        return this.size();
    }

    pop(): T {
        const poppedValue = this.peek();
        const bottom = this.size() - 1;

        if (bottom > top) {
            this.swap(top, bottom);
        }

        this._heap.pop();
        this.siftDown();

        return poppedValue;
    }

    *generate(): Generator<T, null, void> {
        let nextItem = this.pop();

        while (nextItem /* falsy! */) {
            yield nextItem;
            nextItem = this.pop();
        }

        return null;
    }
}
