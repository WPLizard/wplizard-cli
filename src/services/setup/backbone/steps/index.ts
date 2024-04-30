import { BackboneSetupStep } from "../../types.js";

const steps: BackboneSetupStep[] = [
    {
        async action() {
            console.log('Creating plugin directory structure...');
        },
        description: 'Create the plugin\'s directory structure.',
        id: 'create-plugin-structure',
        name: 'Create Plugin Structure',
        optional: false,
        async rollback() {
            console.log('Rolling back create plugin structure...');
        },
    },
    {
        async action() {
            console.log('Adding dependencies...');
        },
        description: 'Add dependencies.',
        id: 'add-dependencies',
        name: 'Add Dependencies',
        optional: true,
        async rollback() {
            console.log('Rolling back add dependencies...');
        },
    },
    {
        async action() {
            console.log('Setting up admin menu pages...');
        },
        description: 'Setup admin menu pages.',
        id: 'setup-admin-menu-pages',
        name: 'Setup Admin Menu Pages',
        optional: true,
        async rollback() {
            console.log('Rolling back setup admin menu pages...');
        },
    },
    {
        async action() {
            console.log('Installing starter files...');
        },
        description: 'Install the plugin\'s starter files.',
        id: 'install-starter-files',
        name: 'Install Starter Files',
        optional: false,
        async rollback() {
            console.log('Rolling back install starter files...');
        },
    },
    {
        async action() {
            console.log('Generating documentation...');
        },
        description: 'Generate documentation based on data from steps 1-4.',
        id: 'generate-documentation',
        name: 'Generate Documentation',
        optional: true,
        async rollback() {
            console.log('Rolling back generate documentation...');
        },
    },
    {
        async action() {
            console.log('Generating wplizard.config.json file...');
        },
        description: 'Generate wplizard.config.json file.',
        id: 'generate-config',
        name: 'Generate Config',
        optional: false,
        async rollback() {
            console.log('Rolling back generate config...');
        },
    },
    {
        async action() {
            console.log('Using the generated wplizard.config.json file to setup the plugin...');
        },
        description: 'Use the generated wplizard.config.json file, which contains the data from steps 1-5, to setup the plugin.',
        id: 'setup-plugin',
        name: 'Setup Plugin',
        optional: false,
        async rollback() {
            console.log('Rolling back setup plugin...');
        },
    },
];

export default steps;