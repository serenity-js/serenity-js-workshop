import 'mocha';
import { engage } from '@serenity-js/core';
import { protractor } from 'protractor';

import { Actors } from './screenplay';

describe('07 UI testing (exercise)', function() {

    this.timeout(30000);

    before(() => engage(new Actors(protractor.browser.baseUrl)));

});
