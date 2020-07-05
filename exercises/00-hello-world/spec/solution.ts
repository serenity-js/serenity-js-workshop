// Docs:
//
// - @serenity-js/core:
//   - actorCalled     - https://serenity-js.org/modules/core/function/index.html#static-function-actorCalled
//   - Log             - https://serenity-js.org/modules/core/class/src/screenplay/interactions/Log.ts~Log.html
//   - configure       - https://serenity-js.org/modules/core/function/index.html#static-function-configure
//
// - @serenity-js/console-reporter
//   - ConsoleReporter - https://serenity-js.org/modules/console-reporter/
//
// or Ctrl/Cmd+click on the imported class or function:

import { actorCalled, Log, configure, Question } from '@serenity-js/core';
import { ConsoleReporter } from '@serenity-js/console-reporter';

// ----------------------------------------------------------------------------
// Some example values that can be logged:

function delayedBy<T>(delayInMillis: number, value: T): Promise<T> {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(value), delayInMillis);
    })
}

const Name = (value: string) =>
    Question.about(`my name`, actor => `${ value }`)

// ----------------------------------------------------------------------------
// Configure Serenity/JS:

configure({
    crew: [
        ConsoleReporter.withDefaultColourSupport(),
    ]
});

// ----------------------------------------------------------------------------
// Write your screenplay:

actorCalled('Alice').attemptsTo(
    Log.the('Static values', 'Hello World!', 42),
    Log.the('Promise', delayedBy(50, 'Hello Promised World!')),
    Log.the('Serenity/JS "Questions"', Name('Jan')),
    Log.the('Native objects', new Date()),
    Log.the('Arrays', [ 1, 2, 3 ]),
    Log.the('JS Objects', { framework: 'Serenity/JS' }),
    // and others!
)
