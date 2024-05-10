import { SuggestibleDirectory } from "./types.js";

const SuggestibleDirectories: SuggestibleDirectory[] = [
    {
        description: 'This directory serves as the backbone for all admin-related functionalities within your WordPress plugin project. It encapsulates the logic and resources necessary to manage the administration interface efficiently.',
        directories: [
            {
                description: 'Responsible for orchestrating database operations exclusively within the admin area, including migrations, seeding, and data factory management.',
                directories: [
                    {
                        description: 'Contains scripts to execute and manage changes to the database schema, ensuring smooth transitions between different versions of your plugin.',
                        name: 'Migrations',
                        required: true,
                    },
                    {
                        description: 'Stores data seeding scripts to populate the database with initial or test data required for plugin functionality.',
                        name: 'Seeds',
                        required: false,
                    },
                ],
                name: 'Databases',
                required: false,
            },
            {
                description: 'Houses a collection of utility classes and functions tailored specifically for administrative tasks, enhancing productivity and maintainability.',
                directories: [
                    {
                        description: 'Provides a repository for abstract classes utilized solely within the admin area, abstracting common functionalities to promote code reuse and consistency.',
                        name: 'Abstracts',
                        required: false,
                    },
                    {
                        description: 'Contains interface definitions employed exclusively within the admin context, facilitating contract-based development and interoperability.',
                        name: 'Interfaces',
                        required: false,
                    },
                    {
                        description: 'Stores reusable traits catering to administrative functionalities, encapsulating shared behaviors to streamline development.',
                        name: 'Traits',
                        required: false,
                    },
                    {
                        description: 'Manages hooks and event listeners exclusive to the admin area, allowing for customization and extension of WordPress functionalities.',
                        name: 'Hooks',
                        required: false,
                    },
                    {
                        description: 'Centralizes management of plugin settings specific to the admin interface, ensuring a cohesive and user-friendly configuration experience.',
                        name: 'Settings',
                        required: false,
                    },
                    {
                        description: 'Houses constant values and configurations pertinent to the admin area, promoting consistency and ease of maintenance.',
                        name: 'Constants',
                        required: false,
                    },
                ],
                name: 'Helpers',
                required: false,
            },
            {
                description: 'Acts as a repository for admin-facing assets such as CSS stylesheets, JavaScript files, and images, enhancing the visual appeal and functionality of the admin interface.',
                directories: [
                    {
                        description: 'Contains CSS files responsible for styling elements within the admin interface, ensuring a visually cohesive and aesthetically pleasing user experience.',
                        name: 'Stylesheets',
                        required: false,
                    },
                    {
                        description: 'Stores JavaScript files utilized to add interactivity and dynamic behavior to admin pages, enhancing usability and functionality.',
                        name: 'Scripts',
                        required: false,
                    },
                    {
                        description: 'Houses image assets utilized for visual elements within the admin interface, enriching the user experience with engaging visuals.',
                        name: 'Visuals',
                        required: false,
                    },
                ],
                name: 'Assets',
                required: true,
            },
            {
                description: 'Manages the presentation layer of the admin interface, housing templates and view files responsible for rendering various admin pages and components.',
                name: 'Views',
                required: true,
            },
            {
                description: 'Houses the core functionalities specific to the admin area, encompassing essential classes and components vital for administering the plugin effectively.',
                name: 'Core',
                required: false,
            },
        ],
        name: 'Admin',
        required: true,
    },
    {
        description: 'This directory contains files and classes intended for the public-facing portion of your WordPress plugin project, facilitating seamless interaction with end users.',
        name: 'Public',
        required: false,
    },
    {
        description: 'This directory houses the core functionalities essential for managing both the admin and public-facing aspects of your WordPress plugin project, serving as the foundation upon which the entire plugin is built.',
        name: 'Core',
        required: true,
    },
    {
        description: 'This directory acts as a repository for classes and files shared between the admin and public-facing portions of the plugin, facilitating code reuse and maintaining consistency across different contexts.',
        directories: [
            {
                description: 'This directory serves as a centralized repository for global assets, including CSS stylesheets, JavaScript files, and images, shared between both admin and public-facing areas of the plugin.',
                directories: [
                    {
                        description: 'Stores CSS files utilized globally across the plugin, ensuring consistent styling and presentation throughout.',
                        name: 'Stylesheets',
                        required: false,
                    },
                    {
                        description: 'Houses JavaScript files employed globally within the plugin, enhancing functionality and interactivity across different contexts.',
                        name: 'Scripts',
                        required: false,
                    },
                    {
                        description: 'Contains image assets utilized across various components of the plugin, enriching the user experience with visually appealing graphics.',
                        name: 'Visuals',
                        required: false,
                    },
                ],
                name: 'Assets',
                required: true,
            },
            {
                description: 'Stores traits shared between the admin and public-facing areas, encapsulating common behaviors to promote code reuse and maintainability.',
                name: 'Traits',
                required: false,
            },
            {
                description: 'Contains interface definitions utilized across both admin and public contexts, facilitating consistent communication and interoperability.',
                name: 'Interfaces',
                required: false,
            },
            {
                description: 'Houses abstract classes providing shared functionality between admin and public areas, abstracting common functionalities to promote reuse and maintainability.',
                name: 'Abstracts',
                required: false,
            },
            {
                description: 'Centralizes management of global plugin settings accessible from both admin and public areas, ensuring a unified configuration experience.',
                name: 'Settings',
                required: false,
            },
            {
                description: 'Stores global constants and configurations utilized throughout the plugin, promoting consistency and ease of maintenance.',
                name: 'Constants',
                required: false,
            },
            {
                description: 'Manages global hooks and event listeners employed across both admin and public areas, allowing for customization and extension of plugin functionalities.',
                name: 'Hooks',
                required: false,
            },
            {
                description: 'Contains utility functions and helper classes utilized globally within the plugin, enhancing productivity and facilitating common tasks across different contexts.',
                name: 'Utilities',
                required: false,
            },
        ],
        name: 'Common',
        required: false,
    }
]

export default SuggestibleDirectories;