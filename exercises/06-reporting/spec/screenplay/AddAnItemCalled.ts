import { Log, Task } from '@serenity-js/core';
import { LastResponse, PostRequest, Send } from '@serenity-js/rest';
import { Ensure, equals } from '@serenity-js/assertions';

export const AddAnItemCalled = (name: string) =>
    Task.where(`#actor adds an item called ${ name }`,
        Send.a(PostRequest.to('/api/todos').with({ title: name })),
        Log.the(LastResponse.body()),
        Ensure.that(LastResponse.status(), equals(200)),
    )
