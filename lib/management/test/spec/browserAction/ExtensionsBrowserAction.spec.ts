import { expect } from 'chai'
import * as browser from 'sinon-chrome/extensions'

import { Container } from '@exteranto/ioc'
import { Browser } from '@exteranto/support'

import { BrowserAction } from '../../../src'
import { TabIdUnknownException } from '@exteranto/exceptions'

export const extensionsTests = () => {
  describe('Extensions', () => {
    let browserAction

    before(() => {
      Container.bindParam('browser', Browser.EXTENSIONS)

      browserAction = Container.resolve(BrowserAction)
    })

    it('Sets a badge text.', async () => {
      browser.browserAction.setBadgeText.resolves(undefined)

      await expect(browserAction.setText('test', 1)).to.eventually.be.fulfilled
    })

    it('Rejects when trying to set a badge text of an unknown tab.', async () => {
      browser.browserAction.setBadgeText.rejects(TabIdUnknownException)

      await expect(browserAction.setText('test', 123123)).to.eventually.be.rejectedWith(TabIdUnknownException)
    })

    it('Gets a badge text.', async () => {
      browser.browserAction.getBadgeText.resolves('test')

      await expect(browserAction.getText(1)).to.eventually.equal('test')
    })

    it('Rejects when trying to get a badge text of an unknown tab.', async () => {
      browser.browserAction.getBadgeText.rejects(TabIdUnknownException)

      await expect(browserAction.getText('test', 123123)).to.eventually.be.rejectedWith(TabIdUnknownException)
    })

    it('Sets a badge background color.', async () => {
      browser.browserAction.setBadgeBackgroundColor.resolves(undefined)

      await expect(browserAction.setColor('#000', 1)).to.eventually.be.fulfilled
    })

    it('Rejects when trying to set a badge background color of an unknown tab.', async () => {
      browser.browserAction.setBadgeBackgroundColor.rejects(TabIdUnknownException)

      await expect(browserAction.setColor('#000', 123123)).to.eventually.be.rejectedWith(TabIdUnknownException)
    })

    it('Gets a badge background color.', async () => {
      browser.browserAction.getBadgeBackgroundColor.resolves('#000')

      await expect(browserAction.getColor(1)).to.eventually.equal('#000')
    })

    it('Rejects when trying to get a badge background color of an unknown tab.', async () => {
      browser.browserAction.getBadgeBackgroundColor.rejects(TabIdUnknownException)

      await expect(browserAction.getColor('#000', 123123)).to.eventually.be.rejectedWith(TabIdUnknownException)
    })

    it('Sets the extension title.', async () => {
      browser.browserAction.setTitle.resolves(undefined)
      await expect(browserAction.setTitle('test', 1)).to.eventually.be.fulfilled
      await expect(browser.browserAction.setTitle.calledOnce).to.be.true
    })

    it('Rejects when trying to set a title text in an unknown tab.', async () => {
      browser.browserAction.setTitle.throws(TabIdUnknownException)
      await expect(browserAction.setTitle('test', 123123)).to.eventually.be.rejectedWith(TabIdUnknownException)
      await expect(browser.browserAction.setTitle.calledOnce).to.be.true
    })

    it('Retruns the extension title.', async () => {
      browser.browserAction.getTitle.resolves('title')
      await expect(browserAction.getTitle(1)).to.eventually.equal('title')
      await expect(browser.browserAction.getTitle.calledOnce).to.be.true
    })

    it('Rejects when trying to get a title text in an unknown tab.', async () => {
      browser.browserAction.getTitle.rejects(TabIdUnknownException)
      await expect(browserAction.getTitle(123123)).to.eventually.be.rejectedWith(TabIdUnknownException)
      await expect(browser.browserAction.getTitle.calledOnce).to.be.true
    })

    it('Sets the extension icon.', async () => {
      browser.browserAction.setIcon.resolves(undefined)
      await expect(browserAction.setIcon('test.png', 1)).to.eventually.be.fulfilled
      await expect(browser.browserAction.setIcon.calledOnce).to.be.true
    })

    it('Sets the extension icon as an object.', async () => {
      browser.browserAction.setIcon.resolves(undefined)
      await expect(browserAction.setIcon({ 16: 'test.png' }, 1)).to.eventually.be.fulfilled
      await expect(browser.browserAction.setIcon.calledOnce).to.be.true
    })

    it('Rejects when trying to set a icon text in an unknown tab.', async () => {
      browser.browserAction.setIcon.rejects(TabIdUnknownException)
      await expect(browserAction.setIcon('test.png', 123123)).to.eventually.be.rejectedWith(TabIdUnknownException)
      await expect(browser.browserAction.setIcon.calledOnce).to.be.true
    })
  })
}
