import { containAtLeastOneItemThat, containItemsWhereEachItem, Ensure, Expectation } from '@serenity-js/assertions';
import { Log, Task } from '@serenity-js/core';
import { GetRequest, LastResponse, Send } from '@serenity-js/rest';
import { Todo } from './model';

export const VerifyRecordedItems = {
    haveAtLeastOneThat: (expectation: Expectation<Todo, any>) =>
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
