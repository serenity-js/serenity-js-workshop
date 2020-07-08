import { Text } from '@serenity-js/protractor';
import { TodoList } from './ui';

export const NumberOfRecordedItems = () => Text.of(TodoList.itemCounter);
