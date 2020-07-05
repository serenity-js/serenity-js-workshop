import { actorCalled, configure, Log } from '@serenity-js/core';
import { ConsoleReporter } from '@serenity-js/console-reporter';
import { CallAnApi, GetRequest, LastResponse, Send } from '@serenity-js/rest';
import { Ensure, equals } from '@serenity-js/assertions';

configure({
    crew: [
        ConsoleReporter.withDefaultColourSupport()
    ]
})

actorCalled('Alice')                                    // Actor
    .whoCan(                                            
        CallAnApi.at('http://localhost:3000')           // Abilities
    )
    .attemptsTo(
        Send.a(GetRequest.to('/api/health')),           // Interactions
        Log.the(LastResponse.status()),                 // Questions
        Log.the(LastResponse.body())
    )
    .catch(error => console.error(error))               // ... it's all just standard Promises
