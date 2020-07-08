import { Log, Task } from '@serenity-js/core';
import { LocalServer, StartLocalServer } from '@serenity-js/local-server';
import { ChangeApiConfig, DeleteRequest, GetRequest, LastResponse, Send } from '@serenity-js/rest';
import { Navigate, Website } from '@serenity-js/protractor';
import { Ensure, equals, Expectation, isGreaterThan, or, property } from '@serenity-js/assertions';

// A task visible outside of the module

export const LaunchPlaygroundApp = {
    onRandomPort: () =>
        Task.where(`#actor launches the Serenity/JS Playground App on random port`,
            StartLocalServer.onRandomPort(),
            ChangeApiConfig.setUrlTo(LocalServer.url()),
            VerifyApiIsRunning(),

            ClearTheDatabase(),

            Navigate.to(LocalServer.url()),
        ),

    onPort: (port: number) =>
        Task.where(`#actor launches the Serenity/JS Playground App on port ${ port }`,
            StartLocalServer.onPort(port),
            ChangeApiConfig.setUrlTo(LocalServer.url()),
            VerifyApiIsRunning(),

            ClearTheDatabase(),

            Navigate.to(LocalServer.url()),
        ),
}


// package-private supporting tasks

const VerifyApiIsRunning = () =>
    Task.where(`#actor verifies if the API is running`,
        Send.a(GetRequest.to('/api/health')),
        Ensure.that(LastResponse.status(), equals(200)),
        Ensure.that(LastResponse.body<{ uptime: number }>(), property('uptime', isEqualOrGreaterThan(0))),
    )

const ClearTheDatabase = () =>
    Task.where(`#actor clears the database`,
        Send.a(DeleteRequest.to('/api/todos')),
        Ensure.that(LastResponse.status(), equals(200)),
    )

// custom expectation

const isEqualOrGreaterThan = (value: number) =>
    Expectation.to<number>(`have value equal or greater than`).soThatActual(
        or(equals(value), isGreaterThan(value))
    )
