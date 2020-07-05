import { actorCalled, configure, Log } from '@serenity-js/core';
import { ConsoleReporter } from '@serenity-js/console-reporter';
import { CallAnApi, GetRequest, LastResponse, Send } from '@serenity-js/rest';
import { Ensure, equals, isGreaterThan, property } from '@serenity-js/assertions';

configure({
    crew: [
        ConsoleReporter.forMonochromaticTerminals()
    ]
})

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
        Ensure.that(LastResponse.body(), property('uptime', isGreaterThan(0))),
        // Exercise 2
        Ensure.that(LastResponse.body(), property('uptime', equals(0))),
    )
    .catch(error => console.error(error))
