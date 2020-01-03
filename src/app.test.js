/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
import { html, fixture, expect } from '@open-wc/testing';

import './app.js';

describe('App component', () => {
    it('should exist', async () => {
        const el = (await fixture('<my-schedules-app></my-schedules-app>'));
        expect(el).to.exist;
    });
});
