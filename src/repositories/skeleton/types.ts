export type SuggestibleFolder = {
    description: string;
    folders?: SuggestibleFolder[];
    name: string;
    recommended: boolean;
}

export type TransformedSuggestibleFolder = Record<number, (TransformedSuggestibleFolder | number)[]>;

export type SkeletonPieceOptions = {
    lazy?: boolean;
    optional: boolean;
    root?: string;
}
