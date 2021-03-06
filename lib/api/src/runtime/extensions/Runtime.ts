import { register } from './events'
import { Dispatcher } from '@exteranto/core'
import { Runtime as AbstractRuntime } from '../Runtime'
import { InvalidUrlFormatException } from '@internal/exceptions'

export class Runtime extends AbstractRuntime {

  /**
   * {@inheritdoc}
   */
  public async setUninstallUrl (url: string) : Promise<void> {
    return browser.runtime.setUninstallURL(url)
      .catch(e => Promise.reject(new InvalidUrlFormatException(e)))
  }

  /**
   * {@inheritdoc}
   */
  public registerEvents (dispatcher: Dispatcher) : void {
    register(dispatcher)
  }

}
