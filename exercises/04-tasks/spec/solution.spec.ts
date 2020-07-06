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
import { and, containAtLeastOneItemThat, Ensure, equals, property, containItemsWhereEachItem, Expectation } from '@serenity-js/assertions';

describe('04 Mocha (solution)', () => {

    class Actors implements Cast {
        prepare(actor: Actor): Actor {
            return actor.whoCan(
                CallAnApi.at('http://localhost:3000'),
            );
        }
    }

    // Tasks:
    
    const ClearTheDatabase = () =>                                          // a simple task with no parameters
        Task.where(`#actor clears the database`,
            Send.a(DeleteRequest.to('/api/todos')),
            Ensure.that(LastResponse.status(), equals(200)),
        )

    const AddAnItemCalled = (name: string) =>                               // a Task with a single parameter
        Task.where(`#actor adds an item called ${ name }`,
            Send.a(PostRequest.to('/api/todos').with({ title: name })),
            Log.the(LastResponse.body()),
            Ensure.that(LastResponse.status(), equals(200)),
        )

    const MarkAllAsCompleted = () =>
        Task.where(`#actor marks all items as completed`,
            Send.a(PatchRequest.to('/api/todos').with({ completed: true })),
            Ensure.that(LastResponse.status(), equals(200)),
        )

    const MarkAllAsActive = () =>
        Task.where(`#actor marks all items as completed`,
            Send.a(PatchRequest.to('/api/todos').with({ completed: false })),
            Ensure.that(LastResponse.status(), equals(200)),
        )       

    const VerifyRecordedTodos = {                                           // a more advanced object:
                                                                            // it groups two Tasks, 
        haveAtLeastOneThat: (expectation: Expectation<Todo, any>) =>        // each parameterized with an Expectation
            Task.where(`#actor verifies that recorded todos ${ expectation }`,
            
                Send.a(GetRequest.to('/api/todos')),
                Log.the(LastResponse.body()),

                Ensure.that(
                    LastResponse.body<Todo[]>(),
                    containAtLeastOneItemThat(expectation)
                ),
            ),

        haveAllItemsThat: (expectation: Expectation<Todo, any>) =>
            Task.where(`#actor verifies that recorded todos ${ expectation }`,
            
                Send.a(GetRequest.to('/api/todos')),
                Log.the(LastResponse.body()),

                Ensure.that(
                    LastResponse.body<Todo[]>(),
                    containItemsWhereEachItem(expectation)
                ),
            )
    }

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
                    ClearTheDatabase(),
                )
            )

            it('allows for todos to be created', () =>

                actorCalled('Alice')
                    .attemptsTo(

                        AddAnItemCalled('Learn Serenity/JS'),
                        
                        VerifyRecordedTodos.haveAtLeastOneThat(and(
                            property('title', equals('Learn Serenity/JS')),
                            property('completed', equals(false)),
                        )),
                    )
            )


            it('allows for all todos to be marked as complete', () =>

                actorCalled('Alice')
                    .attemptsTo(
                        AddAnItemCalled('Learn Serenity/JS'),
                        AddAnItemCalled('Learn Screenplay Pattern'),
                        
                        MarkAllAsCompleted(),

                        VerifyRecordedTodos.haveAllItemsThat(
                            property('completed', equals(true)),
                        ),
                    )
            )   
            
            it('allows for all todos to be toggled', () =>

                actorCalled('Alice')
                    .attemptsTo(
                        AddAnItemCalled('Learn Serenity/JS'),
                        AddAnItemCalled('Learn Screenplay Pattern'),

                        MarkAllAsCompleted(),
                        MarkAllAsActive(),

                        VerifyRecordedTodos.haveAllItemsThat(
                            property('completed', equals(false)),
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
