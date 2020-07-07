/**
 * Docs:
 *
 * - @serenity-js/serenity-bdd
 *   - Documentation            - https://serenity-js.org/modules/serenity-bdd/
 */

import 'mocha';

import { Actor, actorCalled, ArtifactArchiver, Cast, configure, engage } from '@serenity-js/core';
import { ConsoleReporter } from '@serenity-js/console-reporter';
import { CallAnApi } from '@serenity-js/rest';
import { and, equals, property } from '@serenity-js/assertions';
import { AddAnItemCalled, MarkAll, VerifyRecordedItems } from './screenplay';
import { ManageALocalServer, StartLocalServer, StopLocalServer } from '@serenity-js/local-server';
// this is the test server we used to start via `npm start`
import { server } from '@serenity-js/playground';
import { SerenityBDDReporter } from '@serenity-js/serenity-bdd';
import path = require('path');

describe('05 Local Server (exercise)', () => {

    class Actors implements Cast {
        constructor(private readonly port: number) {
        }

        prepare(actor: Actor): Actor {
            return actor.whoCan(
                CallAnApi.at(`http://localhost:${ this.port }`),
                ManageALocalServer.runningAHttpListener(
                    // the server is configured with a path to JSON DB
                    server(path.join(__dirname, '../target/todos.json'))
                )
            );
        }
    }

    // Specs:

    describe('Todo List app API', () => {

        const preferredPort = 5000;

        before(() => {
            configure({
                crew: [
                    ConsoleReporter.withDefaultColourSupport(),

                    // Serenity BDD Reporter generates JSON reports...
                    new SerenityBDDReporter(),
                    // ... and ArtifactArchiver saves them on disk
                    ArtifactArchiver.storingArtifactsAt(path.join(__dirname, '../target/site/serenity')),
                ]
            })
        })

        beforeEach(() => engage(new Actors(preferredPort)))

        describe('/api/todos', () => {

            beforeEach(() =>
                actorCalled('Alice').attemptsTo(
                    StartLocalServer.onPort(preferredPort),
                )
            )

            afterEach(() =>
                actorCalled('Alice').attemptsTo(
                    StopLocalServer.ifRunning(),
                )
            )

            it('allows for todos to be created', () =>

                actorCalled('Alice')
                    .attemptsTo(

                        AddAnItemCalled('Learn Serenity/JS'),

                        VerifyRecordedItems.haveAtLeastOneThat(and(
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

                        MarkAll.asCompleted(),

                        VerifyRecordedItems.haveAllItemsThat(
                            property('completed', equals(true)),
                        ),
                    )
            )

            it('allows for all todos to be toggled', () =>

                actorCalled('Alice')
                    .attemptsTo(
                        AddAnItemCalled('Learn Serenity/JS'),
                        AddAnItemCalled('Learn Screenplay Pattern'),

                        MarkAll.asCompleted(),
                        MarkAll.asActive(),

                        VerifyRecordedItems.haveAllItemsThat(
                            property('completed', equals(false)),
                        ),
                    )
            )
        })

    })
})
