import { id } from "./utils";

type StringFunction = (v: string, ...a: any[]) => string;
type StringPlusFunction = (v: string, i: number, ...a: any[]) => string;

export class Stylizer {
    protected readonly separator: string;
    protected readonly mapper: StringPlusFunction;
    protected readonly processor: StringFunction;

    protected constructor(
        separator: string,
        mapper: StringPlusFunction,
        processor: StringFunction,
    ) {
        this.separator = separator;
        this.mapper = mapper;
        this.processor = processor;
    }

    static make({
        separator = "",
        mapper = id as StringPlusFunction,
        processor = id as StringFunction,
    } = {}) {
        return new Stylizer(separator, mapper, processor);
    }

    toStylizer({
        separator = this.separator,
        mapper = this.mapper,
        processor = this.processor,
    } = {}): Stylizer {
        return new Stylizer(separator, mapper, processor);
    }

    stylize(input: string[], ...args: unknown[][]): string {
        return this.processor(
            input
                .flatMap((v: string, i: number, l: string[]) =>
                    this.mapper(v, i, ...args.map((arg) => arg[i]), l),
                )
                .join(this.separator),
        );
    }

    /* improved version of stylize */
    stylizeFull(
        input: string[],
        mapArgs: unknown[][] = [],
        processArgs: unknown[] = [],
    ): string {
        return this.processor(
            input
                .flatMap((v: string, i: number, l: string[]) =>
                    this.mapper(v, i, ...mapArgs.map((arg) => arg[i]), l),
                )
                .join(this.separator),
            ...processArgs,
        );
    }
}
