import { changelog } from '@gitmoji-changelog/core';
import { main } from './index'

console.error = jest.fn()

describe('cli', () => {
  it('should throw an error if not a git project', () => {
    changelog.mockImplementationOnce(() => {
      throw new Error()
    })

    main()

    expect(console.error).toHaveBeenCalledWith('Cannot find a git repository in current path.')
  })
})

jest.mock('@gitmoji-changelog/core')
