/**
 * Docs:
 *
 * - @serenity-js/protractor
 *   - Documentation            - https://serenity-js.org/modules/protractor/
 *
 *   - Clear                    - https://serenity-js.org/modules/protractor/class/src/screenplay/interactions/Clear.ts~Clear.html
 *   - Click                    - https://serenity-js.org/modules/protractor/class/src/screenplay/interactions/Click.ts~Click.html
 *   - Enter                    - https://serenity-js.org/modules/protractor/class/src/screenplay/interactions/Enter.ts~Enter.html
 *   - Hover                    - https://serenity-js.org/modules/protractor/class/src/screenplay/interactions/Hover.ts~Hover.html
 *   - Target                   - https://serenity-js.org/modules/protractor/class/src/screenplay/questions/targets/Target.ts~Target.html
 *   - Text                     - https://serenity-js.org/modules/protractor/class/src/screenplay/questions/text/Text.ts~Text.html
 *
 *   - Wait                     - https://serenity-js.org/modules/protractor/class/src/screenplay/interactions/Wait.ts~Wait.html
 *   - expectations             - https://serenity-js.org/modules/protractor/identifiers.html#expectations
 *
 * - @serenity-js/serenity-bdd
 *   - Documentation            - https://serenity-js.org/modules/serenity-bdd/
 */

import 'mocha';

import { actorCalled, Duration, engage, Log, Task } from '@serenity-js/core';
import { Website, Navigate, Enter, Press, Target, Wait } from '@serenity-js/protractor';
import { by, protractor } from 'protractor';

import { Actors } from './screenplay';
import { LaunchPlaygroundApp } from './screenplay';

describe('07 UI testing (exercise)', function() {

    this.timeout(30000)

    before(() => engage(new Actors(protractor.browser.baseUrl)))

    describe('Serenity/JS Playground app', () => {

        beforeEach(() =>
            actorCalled('Alice').attemptsTo(
                Navigate.to('/'),
                // LaunchPlaygroundApp.onRandomPort(),
            ))

        it('works?', () =>
            actorCalled('Alice').attemptsTo(
                // Wait.for(Duration.ofSeconds(2)),
            ))
    })
})
