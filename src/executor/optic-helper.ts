export enum OpticType {
    Setter = 'setter',
    Fold = 'fold',
    Traversal = 'traversal',
    Affine = 'affine',
    Getter = 'getter',
    Lens = 'lens',
    Prism = 'prism',
    Iso = 'iso',
}

export const opticSupremum = (type1: OpticType, type2: OpticType): OpticType | null => {
    switch (type1) {
        case OpticType.Setter:
            switch (type2) {
                case OpticType.Fold:
                case OpticType.Getter:
                    return null
                default:
                    return type1
            }

        case OpticType.Fold:
            switch (type2) {
                case OpticType.Setter:
                    return null
                default:
                    return type1
            }

        case OpticType.Traversal:
            switch (type2) {
                case OpticType.Setter:
                case OpticType.Fold:
                    return type2
                case OpticType.Getter:
                    return OpticType.Setter
                default:
                    return type1
            }

        case OpticType.Affine:
            switch (type2) {
                case OpticType.Setter:
                case OpticType.Fold:
                case OpticType.Traversal:
                    return type2
                case OpticType.Getter:
                    return OpticType.Setter
                default:
                    return type1
            }

        case OpticType.Getter:
            switch (type2) {
                case OpticType.Setter:
                    return null
                case OpticType.Fold:
                case OpticType.Traversal:
                case OpticType.Affine:
                case OpticType.Prism:
                    return OpticType.Fold
                default:
                    return type1
            }

        case OpticType.Lens:
            switch (type2) {
                case OpticType.Fold:
                case OpticType.Traversal:
                case OpticType.Affine:
                case OpticType.Setter:
                    return type2
                case OpticType.Prism:
                    return OpticType.Affine
                default:
                    return type1
            }

        case OpticType.Prism:
            switch (type2) {
                case OpticType.Fold:
                case OpticType.Traversal:
                case OpticType.Affine:
                case OpticType.Setter:
                    return type2
                case OpticType.Lens:
                    return OpticType.Affine
                default:
                    return type1
            }

        case OpticType.Iso:
            return type2
    }
}

export const opticLE = (type1: OpticType, type2: OpticType): boolean => {
    return opticSupremum(type1, type2) === type1
}
