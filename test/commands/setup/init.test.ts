import {Config, expect, test} from '@oclif/test'

import Init from '../../../src/commands/setup/init.js'

class InitTest extends Init {
  public async parseFlags(argv: string[]) {
    return this.parse(Init, argv)
  }
}

describe('setup:init', () => {
  // test that the command exists
  test
    .stdout()
    .command(['setup:init'])
    .it('command exists', ctx => {
      expect(ctx.stdout).to.contain('setup wizard');
    })

  test
    .stdout()
    .command(['setup:init'])
    .it('All flags should be set to false by default', () => {
      const cmd = new InitTest([], new Config({
        name: 'wplizard-cli',
        root: process.cwd(),
      }))

      cmd.parseFlags([]).then(({ flags }) => {
        expect(flags.lazy).to.be.false
        expect(flags.skeleton).to.be.false
        expect(flags.runInstallers).to.be.false
      })
    })

  test
    .stdout()
    .command(['setup:init', '--lazy'])
    .it('Every flag should be set to true when passed', () => {
      const cmd = new InitTest([], new Config({
        name: 'wplizard-cli',
        root: process.cwd(),
      }))

      cmd.parseFlags(['--lazy']).then(({ flags }) => {
        expect(flags.lazy).to.be.true
        expect(flags.skeleton).to.be.false
        expect(flags.runInstallers).to.be.false
      })

      cmd.parseFlags(['--skeleton']).then(({ flags }) => {
        expect(flags.lazy).to.be.false
        expect(flags.skeleton).to.be.true
        expect(flags.runInstallers).to.be.false
      })

      cmd.parseFlags(['--run-installers']).then(({ flags }) => {
        expect(flags.lazy).to.be.false
        expect(flags.skeleton).to.be.false
        expect(flags.runInstallers).to.be.true
      })
    })
})
