export type SuggestibleDirectory = {
    description: string;
    directories?: SuggestibleDirectory[];
    name: string;
    recommended: boolean;
}

export type TransformedSuggestibleDirectory = Record<number, (TransformedSuggestibleDirectory | number)[]>;