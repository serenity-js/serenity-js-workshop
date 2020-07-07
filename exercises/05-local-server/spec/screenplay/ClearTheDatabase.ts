import { Task } from '@serenity-js/core';
import { DeleteRequest, LastResponse, Send } from '@serenity-js/rest';
import { Ensure, equals } from '@serenity-js/assertions';

export const ClearTheDatabase = () =>
    Task.where(`#actor clears the database`,
        Send.a(DeleteRequest.to('/api/todos')),
        Ensure.that(LastResponse.status(), equals(200)),
    )
