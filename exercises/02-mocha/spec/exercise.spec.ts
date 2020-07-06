/**
 * Docs:
 *  
 * - @serenity-js/mocha
 *   - Documentation   - https://serenity-js.org/modules/mocha/
 * 
 * - @serenity-js/rest
 *   - Documentation   - https://serenity-js.org/modules/rest/
 * 
 * - Mocha
 *   - Documentation   - https://mochajs.org/
 *   - Configuration   - https://github.com/mochajs/mocha/blob/master/example/config/.mocharc.yml
 * 
 * - ES6
 *   - Arrow functions - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
 */

import 'mocha';

import { actorCalled, configure, Log, Interaction } from '@serenity-js/core';
import { ConsoleReporter } from '@serenity-js/console-reporter';
import { CallAnApi, GetRequest, LastResponse, Send } from '@serenity-js/rest';
import { Ensure, equals, isGreaterThan, property } from '@serenity-js/assertions';

describe('02 Mocha (exercise)', () => {

    describe('Todo List app API', () => {

        before(() => {
            configure({
                crew: [
                    ConsoleReporter.withDefaultColourSupport()
                ]
            })
        })
    
        describe('/api/health', () => {
    
            it('tells how long the app has been running for', () =>
    
                actorCalled('Alice')
                    .whoCan(
                        CallAnApi.at('http://localhost:3000')
                    )
                    .attemptsTo(
                        Send.a(GetRequest.to('/api/health')),

                        Ensure.that(LastResponse.status(), equals(200)),
                        Ensure.that(LastResponse.body<HealthCheckResponse>(), property('uptime', isGreaterThan(0))),
                    )
            )
        })
    
    })
})

interface HealthCheckResponse {
    uptime: number;
}
