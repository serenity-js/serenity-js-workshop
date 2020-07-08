import { Ensure, equals } from '@serenity-js/assertions';
import { Task } from '@serenity-js/core';
import { Navigate, Website } from '@serenity-js/protractor';
import { RecordItem } from './RecordItem';
import { GetRequest, LastResponse, Send } from '@serenity-js/rest';
import { TodoList } from './ui';
import { NumberOfRecordedItems } from './NumberOfRecordedItems';
import { RecordedItems } from './RecordedItems';

export class Start {
    static withAnEmptyList = () =>
        Task.where(`#actor starts with an empty list`,
            Ensure.that(RecordedItems(), equals([])),
        );

    static withAListContaining = (...items: string[]) =>
        Task.where(`#actor starts with a list containing ${ items.length } items`,
            Start.withAnEmptyList(),
            ...items.map(RecordItem.called),
        );
}
