/**
 * Docs:
 * 
 * - @serenity-js/rest          - https://serenity-js.org/modules/rest/
 * - @serenity-js/assertions    - https://serenity-js.org/modules/assertions/
 */

import 'mocha';

import { Actor, actorCalled, Cast, configure, engage, Log } from '@serenity-js/core';
import { ConsoleReporter } from '@serenity-js/console-reporter';
import { CallAnApi, DeleteRequest, GetRequest, LastResponse, PostRequest, Send, PatchRequest } from '@serenity-js/rest';
import { and, containAtLeastOneItemThat, Ensure, equals, property, containItemsWhereEachItem } from '@serenity-js/assertions';

describe('03 Mocha (exercise)', () => {

    class Actors implements Cast {
        prepare(actor: Actor): Actor {
            return actor.whoCan(
                CallAnApi.at('http://localhost:3000'),
            );
        }
    }

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

            it('allows for all todos to be marked as complete', () =>

                actorCalled('Alice')
                    .attemptsTo(
                        // implement me!
                        // - add an item called 'Learn Serenity/JS'
                        // - add an item called 'Learn Screenplay Pattern'
                        // - mark all items as complete
                        //   - PATCH '/api/todos' { completed: true }
                        // - ensure all items are marked as completed
                    )
            )

            it('allows for all todos to be toggled', () =>

                actorCalled('Alice')
                    .attemptsTo(
                        // implement me!
                        // - add an item called 'Learn Serenity/JS'
                        // - add an item called 'Learn Screenplay Pattern'
                        // - mark all items as complete
                        //   - PATCH '/api/todos' { completed: true }
                        // - mark all items as active
                        //   - PATCH '/api/todos' { completed: false }
                        // - ensure all items are marked as active (not complete)
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
