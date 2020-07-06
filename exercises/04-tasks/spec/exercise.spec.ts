/**
 * Docs:
 * 
 * - @serenity-js/core
 *   - Task.where               - https://serenity-js.org/modules/core/class/src/screenplay/Task.ts~Task.html
 * 
 * - @serenity-js/assertions
 *   - Expectation              - https://serenity-js.org/modules/assertions/class/src/Expectation.ts~Expectation.html
 *   - expectations             - https://serenity-js.org/modules/assertions/identifiers.html#expectations
 */

import 'mocha';

import { Actor, actorCalled, Cast, configure, engage, Log, Task } from '@serenity-js/core';
import { ConsoleReporter } from '@serenity-js/console-reporter';
import { CallAnApi, DeleteRequest, GetRequest, LastResponse, PostRequest, Send, PatchRequest } from '@serenity-js/rest';
import { and, containAtLeastOneItemThat, Ensure, equals, property, containItemsWhereEachItem } from '@serenity-js/assertions';

describe('04 Mocha (exercise)', () => {

    class Actors implements Cast {
        prepare(actor: Actor): Actor {
            return actor.whoCan(
                CallAnApi.at('http://localhost:3000'),
            );
        }
    }

    // Tasks:
    // ...

    // Specs:

    describe('Todo List app API', () => {

        before(() => {
            configure({
                crew: [
                    ConsoleReporter.withDefaultColourSupport()
                ]
            })
        })

        beforeEach(() => engage(new Actors()))

        describe('/api/todos', () => {

            beforeEach(() =>
                actorCalled('Alice').attemptsTo(
                    // Clear the database
                    Send.a(DeleteRequest.to('/api/todos')),
                    Ensure.that(LastResponse.status(), equals(200)),
                )
            )

            it('allows for todos to be created', () =>

                actorCalled('Alice')
                    .attemptsTo(
                        // Add an item called 'Learn Serenity/JS'
                        Send.a(PostRequest.to('/api/todos').with({ title: 'Learn Serenity/JS' })),
                        Log.the(LastResponse.body()),
                        Ensure.that(LastResponse.status(), equals(200)),

                        // Verify that item called 'Learn Serenity/JS' has been added
                        Send.a(GetRequest.to('/api/todos')),
                        Log.the(LastResponse.body()),
                        Ensure.that(
                            LastResponse.body<Todo[]>(),
                            containAtLeastOneItemThat(and(
                                property('title', equals('Learn Serenity/JS')),
                                property('completed', equals(false)),
                            ))
                        ),
                    )
            )


            it('allows for all todos to be toggled', () =>

                actorCalled('Alice')
                    .attemptsTo(
                        // Add an item called 'Learn Serenity/JS'
                        Send.a(PostRequest.to('/api/todos').with({ title: 'Learn Serenity/JS' })),
                        Log.the(LastResponse.body()),
                        Ensure.that(LastResponse.status(), equals(200)),

                        // Add an item called 'Learn Screenplay Pattern'
                        Send.a(PostRequest.to('/api/todos').with({ title: 'Learn Screenplay Pattern' })),
                        Log.the(LastResponse.body()),
                        Ensure.that(LastResponse.status(), equals(200)),

                        // Toggle all items
                        Send.a(PatchRequest.to('/api/todos').with({ completed: true })),
                        Ensure.that(LastResponse.status(), equals(200)),

                        // Verify that all items are marked as complete
                        Send.a(GetRequest.to('/api/todos')),
                        Log.the(LastResponse.body()),
                        Ensure.that(
                            LastResponse.body<Todo[]>(),
                            containItemsWhereEachItem(property('completed', equals(true)))
                        ),
                    )
            )            
        })

    })
})

interface Todo {
    completed: boolean;
    id: string;
    title: string;
}
