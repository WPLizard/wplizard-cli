export type SuggestibleDirectory = {
    description: string;
    directories?: SuggestibleDirectory[];
    name: string;
    required: boolean;
}
