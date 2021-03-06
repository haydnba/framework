import { Extension as AbstractExtension } from '../Extension'

export class Extension extends AbstractExtension {

  /**
   * {@inheritdoc}
   */
  public getUrl (path: string = '') : string {
    return chrome.runtime.getURL(path)
  }

}
