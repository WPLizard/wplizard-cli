export type SuggestibleDirectory = {
    description: string;
    directories?: SuggestibleDirectory[];
    name: string;
    required: boolean;
}

export type TransformedSuggestibleDirectory = Record<number, (TransformedSuggestibleDirectory | number)[]>;