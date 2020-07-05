import 'mocha';

import { actorCalled, configure, Log } from '@serenity-js/core';
import { ConsoleReporter } from '@serenity-js/console-reporter';
import { CallAnApi, GetRequest, LastResponse, Send } from '@serenity-js/rest';
import { Ensure, equals, isGreaterThan, property } from '@serenity-js/assertions';

describe('Todo List app', () => {

    before(() => {
        configure({
            crew: [
                ConsoleReporter.forMonochromaticTerminals()
            ]
        })
    })

    describe('/api/todos', () => {

        it('tells how long the app has been running for', () =>

            actorCalled('Alice')
                .whoCan(
                    CallAnApi.at('http://localhost:3000')
                )
                .attemptsTo(
                    Send.a(GetRequest.to('/api/health')),
                    // Demo step 1
                    Log.the(LastResponse.status(), LastResponse.body()),
                    // Demo step 2
                    Ensure.that(LastResponse.status(), equals(200)),
                    // Exercise 1
                    // Ensure.that(LastResponse.body(), property('uptime', isGreaterThan(0))),
                    // Exercise 2
                    // Ensure.that(LastResponse.body(), property('uptime', equals(0))),
                )
        );
    });

    before(() => {
        // start local server
    })

    after(() => {
        // stop local server
    })
});
