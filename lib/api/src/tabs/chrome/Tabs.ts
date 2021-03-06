import { Tab } from './Tab'
import { register } from './events'
import { Tabs as AbstractTabs } from '../Tabs'
import { TabInterface } from '../TabInterface'
import { TabIdUnknownException } from '@internal/tabs/exceptions'
import { Dispatcher, RegistersNativeEvents } from '@exteranto/core'

export class Tabs extends AbstractTabs implements RegistersNativeEvents {

  /**
   * {@inheritdoc}
   */
  protected filter (query: any = {}) : Promise<TabInterface[]> {
    return new Promise(resolve => chrome.tabs.query(query, (tabs) => {
      resolve(tabs.map(tab => new Tab(tab)))
    }))
  }

  /**
   * {@inheritdoc}
   */
  public open (url: string, active: boolean = false) : Promise<TabInterface> {
    return new Promise((resolve) => {
      chrome.tabs.create({ url, active }, tab => resolve(new Tab(tab)))
    })
  }

  /**
   * {@inheritdoc}
   */
  public get (id: number) : Promise<TabInterface> {
    return new Promise((resolve, reject) => {
      chrome.tabs.get(id, (tab) => {
        chrome.runtime.lastError
          ? reject(new TabIdUnknownException())
          : resolve(new Tab(tab))
      })
    })
  }

  /**
   * {@inheritdoc}
   */
  public registerEvents (dispatcher: Dispatcher) : void {
    register(dispatcher)
  }

}
