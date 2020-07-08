import { Target } from '@serenity-js/protractor';
import { by } from 'protractor';

export class TodoListItem {
    static label = Target.the(`label`)
        .located(by.css('label'));

    static toggleButton = Target.the(`toggle button`)
        .located(by.css('input.toggle'));

    static destroyButton = Target.the(`destroy button`)
        .located(by.css('button.destroy'));
}
