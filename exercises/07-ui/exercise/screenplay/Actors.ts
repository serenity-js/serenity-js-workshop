import { Actor, Cast } from '@serenity-js/core';
import { ManageALocalServer } from '@serenity-js/local-server';
import { CallAnApi } from '@serenity-js/rest';
import { BrowseTheWeb } from '@serenity-js/protractor';
import { protractor } from 'protractor';
import { server } from '@serenity-js/playground';
import * as path from 'path';

export class Actors implements Cast {

    constructor(private readonly baseUrl: string) {
    }

    prepare(actor: Actor): Actor {
        
        return actor.whoCan(
            // Interact with RESTful APIs
            CallAnApi.at(this.baseUrl),

            // Interact with the Web interface
            BrowseTheWeb.using(protractor.browser),

            // Start/Stop the local test server
            ManageALocalServer.runningAHttpListener(server(
                path.join(__dirname, '../../target/todos.json')
            )),
        );
    }
}
