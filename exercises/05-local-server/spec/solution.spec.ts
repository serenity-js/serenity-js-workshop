/**
 * Docs:
 *
 * - @serenity-js/local-server
 *   - Documentation            - https://serenity-js.org/modules/local-server/
 *   - ManageALocalServer       - https://serenity-js.org/modules/local-server/class/src/screenplay/abilities/ManageALocalServer.ts~ManageALocalServer.html
 *   - StartLocalServer         - https://serenity-js.org/modules/local-server/class/src/screenplay/interactions/StartLocalServer.ts~StartLocalServer.html
 *   - StopLocalServer          - https://serenity-js.org/modules/local-server/class/src/screenplay/interactions/StopLocalServer.ts~StopLocalServer.html
 *
 *   - LocalServer.url()        - https://serenity-js.org/modules/local-server/class/src/screenplay/questions/LocalServer.ts~LocalServer.html#static-method-port
 *   - ChangeApiConfig.setUrl() - https://serenity-js.org/modules/rest/class/src/screenplay/interactions/ChangeApiConfig.ts~ChangeApiConfig.html
 *
 *   - LocalServer.port()        - https://serenity-js.org/modules/local-server/class/src/screenplay/questions/LocalServer.ts~LocalServer.html#static-method-port
 *   - ChangeApiConfig.setPort() - https://serenity-js.org/modules/rest/class/src/screenplay/interactions/ChangeApiConfig.ts~ChangeApiConfig.html
 */

import 'mocha';

import { Actor, actorCalled, Cast, configure, engage, Log } from '@serenity-js/core';
import { ConsoleReporter } from '@serenity-js/console-reporter';
import { CallAnApi, ChangeApiConfig } from '@serenity-js/rest';
import { and, equals, property } from '@serenity-js/assertions';
import { AddAnItemCalled, ClearTheDatabase, MarkAll, VerifyRecordedItems } from './screenplay';
import { LocalServer, ManageALocalServer, StartLocalServer, StopLocalServer } from '@serenity-js/local-server';
import path = require('path');

// this is the test server we used to start via `npm start`
import { server } from '@serenity-js/playground';

describe('05 Local Server (solution)', () => {

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
                    ConsoleReporter.withDefaultColourSupport()
                ]
            })
        })

        beforeEach(() => engage(new Actors(preferredPort)))

        describe('/api/todos', () => {

            beforeEach(() =>
                actorCalled('Alice').attemptsTo(
                    StartLocalServer.onRandomPortBetween(preferredPort, 65535),
                    Log.the(LocalServer.url()),
                    ChangeApiConfig.setPortTo(LocalServer.port()),
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
