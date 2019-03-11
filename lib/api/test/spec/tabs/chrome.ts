import { expect } from 'chai'
import * as sinon from 'sinon'
import { mock, instance, verify, deepEqual } from 'ts-mockito'

import {
  Tabs,
  TabInterface,
  TabCreatedEvent,
  TabRemovedEvent,
  TabUpdatedEvent,
  TabActivatedEvent,
} from '@internal/tabs'

import { Dispatcher } from '@exteranto/core'
import { Tab } from '@internal/tabs/chrome/Tab'
import { Tabs as ChromeTabs } from '@internal/tabs/chrome/Tabs'
import { TabIdUnknownException, NoActiveTabException } from '@internal/tabs/exceptions'

export default ({ chrome }) => {
  let tabs: Tabs
  let dispatcher: Dispatcher

  beforeEach(() => {
    dispatcher = mock(Dispatcher)
    tabs = new ChromeTabs
  })

  it('opens a new tab', async () => {
    chrome.tabs.create.yields({ id: 1, url: 'http://test.com' })
    chrome.tabs.get.yields({ url: 'http://test.com' })

    const tab = await tabs.open('http://test.com')

    expect(await tab.url()).to.equal('http://test.com')

    sinon.assert.calledOnce(chrome.tabs.get)
    sinon.assert.calledOnce(chrome.tabs.create)
  })

  it('returns the active tab', async () => {
    chrome.tabs.query.yields([{ id: 1 }])

    const active: Promise<TabInterface> = tabs.active()

    await expect(active).to.eventually.be.instanceOf(Tab)
    expect(active.then(tab => tab.id())).to.eventually.equal(1)
  })

  it('throws an exception if no active tab found', async () => {
    chrome.tabs.query.yields([])

    const active: Promise<TabInterface> = tabs.active()

    await expect(active).to.eventually.be.rejectedWith(NoActiveTabException)
  })

  it('closes a tab', async () => {
    chrome.tabs.remove.yields(undefined)

    await expect(new Tab({ id: 1 }).close())
      .to.eventually.be.fulfilled

    sinon.assert.calledOnce(chrome.tabs.remove)
  })

  it('reloads the tab', async () => {
    chrome.tabs.reload.yields(undefined)

    await expect(new Tab({ id: 1 }).reload().then(tab => (tab as any).tab.id))
      .to.eventually.equal(1)

    sinon.assert.calledOnce(chrome.tabs.reload)
  })

  it('duplicates the tab', async () => {
    chrome.tabs.duplicate.yields({ id: 2 })

    await expect(new Tab({ id: 1 }).duplicate().then(tab => (tab as any).tab.id))
      .to.eventually.equal(2)

    sinon.assert.calledOnce(chrome.tabs.duplicate)
  })

  it('activates a tab', async () => {
    chrome.tabs.update.yields(undefined)

    await expect(new Tab({ id: 1 }).activate())
      .to.eventually.be.instanceOf(Tab)

    sinon.assert.calledOnce(chrome.tabs.update)
  })

  it('pins a tab', async () => {
    chrome.tabs.update.yields(undefined)

    await expect(new Tab({ id: 1 }).pin())
      .to.eventually.be.instanceOf(Tab)

    sinon.assert.calledOnce(chrome.tabs.update)
  })

  it('unpins a tab', async () => {
    chrome.tabs.update.yields(undefined)

    await expect(new Tab({ id: 1 }).unpin())
      .to.eventually.be.instanceOf(Tab)

    sinon.assert.calledOnce(chrome.tabs.update)
  })

  it('gets a tab by id', async () => {
    chrome.tabs.get.yields({ id: 2 })

    await expect(tabs.get(2).then(t => t.id()))
      .to.eventually.equal(2)
  })

  it('throws an exception if tab does not exist', async () => {
    chrome.tabs.get.yields()
    chrome.runtime.lastError = { message: 'Tab ID does not exist' }

    await expect(tabs.get(2)).to.eventually.be.rejectedWith(TabIdUnknownException)
  })

  it('registers tab created event', () => {
    tabs.registerEvents(instance(dispatcher))

    chrome.tabs.onCreated.trigger({ id: 1 })

    verify(dispatcher.fire(deepEqual(new TabCreatedEvent(new Tab({ id: 1 })))))
      .once()
  })

  it('registers tab updated event', () => {
    tabs.registerEvents(instance(dispatcher))

    chrome.tabs.onUpdated.trigger(1, 2, { id: 2 })

    verify(dispatcher.fire(deepEqual(new TabUpdatedEvent(new Tab({ id: 2 })))))
      .once()
  })

  it('registers tab activated event', () => {
    tabs.registerEvents(instance(dispatcher))

    chrome.tabs.onActivated.trigger({ tabId: 3 })

    verify(dispatcher.fire(deepEqual(new TabActivatedEvent(3))))
      .once()
  })

  it('registers tab removed event', () => {
    tabs.registerEvents(instance(dispatcher))

    chrome.tabs.onRemoved.trigger(4)

    verify(dispatcher.fire(deepEqual(new TabRemovedEvent(4))))
      .once()
  })
}
