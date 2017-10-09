import { NemTransactionGrabUiPage } from './app.po';

describe('nem-transaction-grab-ui App', () => {
  let page: NemTransactionGrabUiPage;

  beforeEach(() => {
    page = new NemTransactionGrabUiPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
