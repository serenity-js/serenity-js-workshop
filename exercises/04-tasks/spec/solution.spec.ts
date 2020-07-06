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

import { Actor, actorCalled, Answerable, Cast, configure, engage, Log, Task } from '@serenity-js/core';
import { ConsoleReporter } from '@serenity-js/console-reporter';
import { CallAnApi, DeleteRequest, GetRequest, LastResponse, PostRequest, Send, PatchRequest } from '@serenity-js/rest';
import { and, containAtLeastOneItemThat, Ensure, equals, property, containItemsWhereEachItem, Expectation } from '@serenity-js/assertions';

describe('04 Mocha (exercise)', () => {

    class Actors implements Cast {
        prepare(actor: Actor): Actor {
            return actor.whoCan(
                CallAnApi.at('http://localhost:3000'),
            );
        }
    }

    // Tasks:

    const ClearTheDatabase = () =>
        Task.where(`#actor clears the database`,
            Send.a(DeleteRequest.to('/api/todos')),
            Ensure.that(LastResponse.status(), equals(200)),
        )

    const AddAnItemCalled = (name: string) => 
        Task.where(`#actor adds an item called ${ name }`,
            Send.a(PostRequest.to('/api/todos').with({ title: name })),
            Log.the(LastResponse.body()),
            Ensure.that(LastResponse.status(), equals(200)),
        )

    const VerifyListContainsNewItemCalled = (name: string) =>
        Task.where(`#actor verifies that the list contains a new item called ${ name }`,
            Send.a(GetRequest.to('/api/todos')),
            Log.the(LastResponse.body()),
            Ensure.that(
                LastResponse.body<Todo[]>(),
                containAtLeastOneItemThat(and(
                    property('title', equals(name)),
                    property('completed', equals(false)),
                ))
            ),
        )

    const VerifyThat = (list: Answerable<Todo[]>) => ({
        containsNewItemCalled: (name: string) => 
            Task.where(`#actor verifies that the list contains a new item called ${ name }`,
                Ensure.that(
                    list,
                    containAtLeastOneItemThat(and(
                        property('title', equals(name)),
                        property('completed', equals(false)),
                    ))
                ),
            ),

        containsAnItemThat: (expectation: Expectation<Todo>) =>
            Task.where(`#actor verifies that the list contains an item that ${ expectation }`,
                Ensure.that(
                    list,
                    containAtLeastOneItemThat(expectation)
                ),
            )
    })

    const MarkAllItemsAsCompleted = () => 
        Task.where(`#actor marks all items as completed`,
            Send.a(PatchRequest.to('/api/todos').with({ completed: true })),
            Ensure.that(LastResponse.status(), equals(200)),
        )

    const MarkAllItemsAsActive = () => 
        Task.where(`#actor marks all items as active`,
            Send.a(PatchRequest.to('/api/todos').with({ completed: false })),
            Ensure.that(LastResponse.status(), equals(200)),
        )        

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
                        
                        // Approach 1:
                        // - Extract the entire assertion into a Task
                        
                        VerifyListContainsNewItemCalled('Learn Serenity/JS'),

                        // Alternatively, make the request first:
                        Send.a(GetRequest.to('/api/todos')),

                        // Approach 2:
                        // - Make the task configurable with the list of Todos and the name of an expected item
                        
                        VerifyThat(LastResponse.body<Todo[]>()).containsNewItemCalled('Learn Serenity/JS'),

                        // Approach 3:
                        // - Make the task configurable with both the list of todos and an expectation

                        VerifyThat(LastResponse.body<Todo[]>()).containsAnItemThat(and(
                            property('title', equals('Learn Serenity/JS')),
                            property('completed', equals(false)),
                        ))
                    )
            )


            it('allows for all todos to be toggled', () =>

                actorCalled('Alice')
                    .attemptsTo(
                        AddAnItemCalled('Learn Serenity/JS'),
                        AddAnItemCalled('Learn Screenplay Pattern'),

                        MarkAllItemsAsCompleted(),

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
