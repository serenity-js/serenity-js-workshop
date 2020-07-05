import { actorCalled, configure, Log } from '@serenity-js/core';
import { ConsoleReporter } from '@serenity-js/console-reporter';

configure({
    crew: [
        ConsoleReporter.forMonochromaticTerminals()
    ]
})

actorCalled('Alice').attemptsTo(
    Log.the('Hello world!', Promise.resolve('stuff'), new Date())
)

// TODO: exercise - what else can you log? check the docs
