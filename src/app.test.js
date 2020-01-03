/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
import { fixture, expect } from '@open-wc/testing';

import './app.js';

describe('App component', () => {
  let element;

  beforeEach(async () => {
    element = await fixture('<my-schedules-app></my-schedules-app>');
  });

  [
    'app-header',
    'app-footer',
    'main',
    // Warning: the next ones will change, as the implementation progresses
    // TODO: remove this comment once void
    'app-schedules',
  ].forEach(innerElementTag => {
    it(`should render a <${innerElementTag}> in the shadow dom of the app element`, () => {
      expect(element.shadowRoot.querySelector(innerElementTag)).to.exist;
    });
  });
});
