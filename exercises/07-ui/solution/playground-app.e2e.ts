/**
 * Docs:
 *
 * - @serenity-js/protractor
 *   - Documentation            - https://serenity-js.org/modules/protractor/
 *
 *   - Clear                    - https://serenity-js.org/modules/protractor/class/src/screenplay/interactions/Clear.ts~Clear.html
 *   - Click                    - https://serenity-js.org/modules/protractor/class/src/screenplay/interactions/Click.ts~Click.html
 *   - Enter                    - https://serenity-js.org/modules/protractor/class/src/screenplay/interactions/Enter.ts~Enter.html
 *   - Hover                    - https://serenity-js.org/modules/protractor/class/src/screenplay/interactions/Hover.ts~Hover.html
 *   - Target                   - https://serenity-js.org/modules/protractor/class/src/screenplay/questions/targets/Target.ts~Target.html
 *   - Text                     - https://serenity-js.org/modules/protractor/class/src/screenplay/questions/text/Text.ts~Text.html
 *
 *   - Wait                     - https://serenity-js.org/modules/protractor/class/src/screenplay/interactions/Wait.ts~Wait.html
 *   - expectations             - https://serenity-js.org/modules/protractor/identifiers.html#expectations
 *
 * - @serenity-js/serenity-bdd
 *   - Documentation            - https://serenity-js.org/modules/serenity-bdd/
 */

import 'mocha';

import {
    contain,
    containAtLeastOneItemThat,
    Ensure,
    equals,
    not,
    property,
} from '@serenity-js/assertions';
import { actorCalled, engage, Log } from '@serenity-js/core';
import { LocalServer, StartLocalServer, StopLocalServer } from '@serenity-js/local-server';
import { Browser } from '@serenity-js/protractor';
import { logging, protractor } from 'protractor';

import {
    Actors,
    FilterItems, LaunchPlaygroundApp,
    RecordedItems,
    RecordItem,
    RemoveItem,
    RenameItem,
    Start,
    ToggleItem,
} from './screenplay';
import { GetRequest, LastResponse, Send } from '@serenity-js/rest';

describe('07 UI testing (solution)', function() {

    this.timeout(30000);

    before(() => engage(new Actors(protractor.browser.baseUrl)));

    describe('Serenity/JS Playground app', () => {

        beforeEach(() =>
            actorCalled('Alice').attemptsTo(
                LaunchPlaygroundApp.onRandomPort(),
            ))

        afterEach(() =>
            actorCalled('Alice').attemptsTo(
                StopLocalServer.ifRunning(),
            ))

        it('can record new items', () =>
            actorCalled('Alice').attemptsTo(
                Start.withAnEmptyList(),
                RecordItem.called('Walk a dog'),
                Ensure.that(RecordedItems(), contain('Walk a dog')),
            ))

        it('can remove the recorded items', () =>
            actorCalled('Alice').attemptsTo(
                Start.withAListContaining('Walk a dog'),
                RemoveItem.called('Walk a dog'),
                Ensure.that(RecordedItems(), property('length', equals(0))),
            ))

        it('can mark an item as completed', () =>
            actorCalled('Alice').attemptsTo(
                Start.withAListContaining('Buy a cake'),
                ToggleItem.called('Buy a cake'),
                FilterItems.toShow('Completed'),
                Ensure.that(RecordedItems(), contain('Buy a cake')),
            ))

        it('can edit an item', () =>
            actorCalled('Alice').attemptsTo(
                Start.withAListContaining('Buy a cake'),
                RenameItem.called('Buy a cake').to('Buy an apple'),
                Ensure.that(RecordedItems(), contain('Buy an apple')),
            ))

        it('can filter the list to show active items only', () =>
            actorCalled('Alice').attemptsTo(
                Start.withAListContaining(
                    'Play guitar',
                    'Read a book',
                    'Write some code',
                ),
                ToggleItem.called('Write some code'),
                FilterItems.toShow('Active'),
                Ensure.that(
                    RecordedItems(),
                    equals(['Play guitar', 'Read a book']),
                ),
            ))
    })

    afterEach(() =>
        actorCalled('Alice').attemptsTo(
            Ensure.that(Browser.log(), not(containAtLeastOneItemThat(property('level', equals(logging.Level.SEVERE)))))
        ))
})
