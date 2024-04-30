import {expect, test} from '@oclif/test'

describe('setup:init', () => {
  test
  .stdout()
  .command(['setup:init'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['setup:init', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
