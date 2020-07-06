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

describe('03 Mocha (solution)', () => {

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
                        // Add an item called 'Learn Serenity/JS'
                        Send.a(PostRequest.to('/api/todos').with({ title: 'Learn Serenity/JS' })),
                        Log.the(LastResponse.body()),
                        Ensure.that(LastResponse.status(), equals(200)),

                        // Add an item called 'Learn Screenplay Pattern'
                        Send.a(PostRequest.to('/api/todos').with({ title: 'Learn Screenplay Pattern' })),
                        Log.the(LastResponse.body()),
                        Ensure.that(LastResponse.status(), equals(200)),

                        // Mark all items as complete
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

                        // Mark all items as complete
                        Send.a(PatchRequest.to('/api/todos').with({ completed: true })),
                        Ensure.that(LastResponse.status(), equals(200)),

                        // Mark all items as active
                        Send.a(PatchRequest.to('/api/todos').with({ completed: false })),
                        Ensure.that(LastResponse.status(), equals(200)),

                        // Verify that all items are marked as active (not complete)
                        Send.a(GetRequest.to('/api/todos')),
                        Log.the(LastResponse.body()),
                        Ensure.that(
                            LastResponse.body<Todo[]>(),
                            containItemsWhereEachItem(property('completed', equals(false)))
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
