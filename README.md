oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g wplizard-cli
$ wplizard-cli COMMAND
running command...
$ wplizard-cli (--version)
wplizard-cli/0.0.0 win32-x64 node-v20.11.1
$ wplizard-cli --help [COMMAND]
USAGE
  $ wplizard-cli COMMAND
...
```
<!-- usagestop -->
```sh-session
$ npm install -g oclif-hello-world
$ oex COMMAND
running command...
$ oex (--version)
oclif-hello-world/0.0.0 darwin-x64 node-v16.13.1
$ oex --help [COMMAND]
USAGE
  $ oex COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`wplizard-cli hello PERSON`](#wplizard-cli-hello-person)
* [`wplizard-cli hello world`](#wplizard-cli-hello-world)
* [`wplizard-cli help [COMMAND]`](#wplizard-cli-help-command)
* [`wplizard-cli plugins`](#wplizard-cli-plugins)
* [`wplizard-cli plugins add PLUGIN`](#wplizard-cli-plugins-add-plugin)
* [`wplizard-cli plugins:inspect PLUGIN...`](#wplizard-cli-pluginsinspect-plugin)
* [`wplizard-cli plugins install PLUGIN`](#wplizard-cli-plugins-install-plugin)
* [`wplizard-cli plugins link PATH`](#wplizard-cli-plugins-link-path)
* [`wplizard-cli plugins remove [PLUGIN]`](#wplizard-cli-plugins-remove-plugin)
* [`wplizard-cli plugins reset`](#wplizard-cli-plugins-reset)
* [`wplizard-cli plugins uninstall [PLUGIN]`](#wplizard-cli-plugins-uninstall-plugin)
* [`wplizard-cli plugins unlink [PLUGIN]`](#wplizard-cli-plugins-unlink-plugin)
* [`wplizard-cli plugins update`](#wplizard-cli-plugins-update)

## `wplizard-cli hello PERSON`

Say hello

```
USAGE
  $ wplizard-cli hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/WPLizard/wplizard-cli/blob/v0.0.0/src/commands/hello/index.ts)_

## `wplizard-cli hello world`

Say hello world

```
USAGE
  $ wplizard-cli hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ wplizard-cli hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/WPLizard/wplizard-cli/blob/v0.0.0/src/commands/hello/world.ts)_

## `wplizard-cli help [COMMAND]`

Display help for wplizard-cli.

```
USAGE
  $ wplizard-cli help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for wplizard-cli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.0.21/src/commands/help.ts)_

## `wplizard-cli plugins`

List installed plugins.

```
USAGE
  $ wplizard-cli plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ wplizard-cli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.15/src/commands/plugins/index.ts)_

## `wplizard-cli plugins add PLUGIN`

Installs a plugin into wplizard-cli.

```
USAGE
  $ wplizard-cli plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into wplizard-cli.

  Uses bundled npm executable to install plugins into C:\Users\poeti\AppData\Local\wplizard-cli

  Installation of a user-installed plugin will override a core plugin.

  Use the WPLIZARD_CLI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the WPLIZARD_CLI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ wplizard-cli plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ wplizard-cli plugins add myplugin

  Install a plugin from a github url.

    $ wplizard-cli plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ wplizard-cli plugins add someuser/someplugin
```

## `wplizard-cli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ wplizard-cli plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ wplizard-cli plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.15/src/commands/plugins/inspect.ts)_

## `wplizard-cli plugins install PLUGIN`

Installs a plugin into wplizard-cli.

```
USAGE
  $ wplizard-cli plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into wplizard-cli.

  Uses bundled npm executable to install plugins into C:\Users\poeti\AppData\Local\wplizard-cli

  Installation of a user-installed plugin will override a core plugin.

  Use the WPLIZARD_CLI_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the WPLIZARD_CLI_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ wplizard-cli plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ wplizard-cli plugins install myplugin

  Install a plugin from a github url.

    $ wplizard-cli plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ wplizard-cli plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.15/src/commands/plugins/install.ts)_

## `wplizard-cli plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ wplizard-cli plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin
  with a 'hello' command will override the user-installed or core plugin implementation. This is useful
  for development work.


EXAMPLES
  $ wplizard-cli plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.15/src/commands/plugins/link.ts)_

## `wplizard-cli plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ wplizard-cli plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ wplizard-cli plugins unlink
  $ wplizard-cli plugins remove

EXAMPLES
  $ wplizard-cli plugins remove myplugin
```

## `wplizard-cli plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ wplizard-cli plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.15/src/commands/plugins/reset.ts)_

## `wplizard-cli plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ wplizard-cli plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ wplizard-cli plugins unlink
  $ wplizard-cli plugins remove

EXAMPLES
  $ wplizard-cli plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.15/src/commands/plugins/uninstall.ts)_

## `wplizard-cli plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ wplizard-cli plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ wplizard-cli plugins unlink
  $ wplizard-cli plugins remove

EXAMPLES
  $ wplizard-cli plugins unlink myplugin
```

## `wplizard-cli plugins update`

Update installed plugins.

```
USAGE
  $ wplizard-cli plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.15/src/commands/plugins/update.ts)_
<!-- commandsstop -->
* [`oex hello PERSON`](#oex-hello-person)
* [`oex hello world`](#oex-hello-world)
* [`oex help [COMMAND]`](#oex-help-command)
* [`oex plugins`](#oex-plugins)
* [`oex plugins:inspect PLUGIN...`](#oex-pluginsinspect-plugin)
* [`oex plugins:install PLUGIN...`](#oex-pluginsinstall-plugin)
* [`oex plugins:link PLUGIN`](#oex-pluginslink-plugin)
* [`oex plugins:uninstall PLUGIN...`](#oex-pluginsuninstall-plugin)
* [`oex plugins update`](#oex-plugins-update)

## `oex hello PERSON`

Say hello

```
USAGE
  $ oex hello [PERSON] -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/oclif/hello-world/blob/v0.0.0/dist/commands/hello/index.ts)_

## `oex hello world`

Say hello world

```
USAGE
  $ oex hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ oex hello world
  hello world! (./src/commands/hello/world.ts)
```

## `oex help [COMMAND]`

Display help for oex.

```
USAGE
  $ oex help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for oex.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.10/src/commands/help.ts)_

## `oex plugins`

List installed plugins.

```
USAGE
  $ oex plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ oex plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/index.ts)_

## `oex plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ oex plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ oex plugins:inspect myplugin
```

## `oex plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ oex plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ oex plugins add

EXAMPLES
  $ oex plugins:install myplugin 

  $ oex plugins:install https://github.com/someuser/someplugin

  $ oex plugins:install someuser/someplugin
```

## `oex plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ oex plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ oex plugins:link myplugin
```

## `oex plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ oex plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ oex plugins unlink
  $ oex plugins remove
```

## `oex plugins update`

Update installed plugins.

```
USAGE
  $ oex plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
