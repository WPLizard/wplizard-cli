export type BackboneSetupStep = {
    action: (options: { lazy: boolean }) => Promise<void>;
    description: string;
    id: string;
    name: string;
    optional: boolean;
    rollback: (options: { lazy: boolean }) => Promise<void>;
}