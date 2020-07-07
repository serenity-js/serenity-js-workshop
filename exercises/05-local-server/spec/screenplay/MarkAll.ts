import { Task } from '@serenity-js/core';
import { LastResponse, PatchRequest, Send } from '@serenity-js/rest';
import { Ensure, equals } from '@serenity-js/assertions';

export const MarkAll = {
    asCompleted: () =>
        Task.where(`#actor marks all items as completed`,
            Send.a(PatchRequest.to('/api/todos').with({ completed: true })),
            Ensure.that(LastResponse.status(), equals(200)),
        ),

    asActive: () =>
        Task.where(`#actor marks all items as completed`,
            Send.a(PatchRequest.to('/api/todos').with({ completed: false })),
            Ensure.that(LastResponse.status(), equals(200)),
        )
}
