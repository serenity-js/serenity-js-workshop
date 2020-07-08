const
    { ArtifactArchiver, StreamReporter } = require('@serenity-js/core'),
    { ConsoleReporter } = require('@serenity-js/console-reporter'),
    { Photographer, TakePhotosOfFailures, TakePhotosOfInteractions } = require('@serenity-js/protractor'),
    { SerenityBDDReporter } = require('@serenity-js/serenity-bdd'),
    path = require('path'),
    isCI = require('is-ci');

/**
 * @type { import("protractor").Config }
 */
exports.config = {
    baseUrl: 'http://localhost:3000/',

    chromeDriver: require(`chromedriver/lib/chromedriver`).path,

    SELENIUM_PROMISE_MANAGER: false,

    directConnect: true,

    allScriptsTimeout: 11000,

    framework:      'custom',
    frameworkPath:  require.resolve('@serenity-js/protractor/adapter'),

    specs: [
        './**/*.e2e.ts'
    ],

    serenity: {
        runner: 'mocha',
        crew: [
            ConsoleReporter.withDefaultColourSupport(),

            // Takes screenshots automatically
            Photographer.whoWill(TakePhotosOfFailures),     
            // Photographer.whoWill(TakePhotosOfInteractions),

            // Generates HTML reports using Serenity BDD
            new SerenityBDDReporter(),

            // Archives (stores) any artifacts emitted by Photographer and SerenityBDDReporter
            // at a desired location
            ArtifactArchiver.storingArtifactsAt(path.join(__dirname, 'target/site/serenity')),
        ]
    },

    mochaOpts: {
        require: [
            'ts-node/register',
        ]
    },

    capabilities: {
        browserName: 'chrome',

        // see https://github.com/SeleniumHQ/selenium/wiki/DesiredCapabilities#loggingpreferences-json-object
        loggingPrefs: {
            browser: 'SEVERE' // "OFF", "SEVERE", "WARNING", "INFO", "CONFIG", "FINE", "FINER", "FINEST", "ALL".
        },

        chromeOptions: {
            args: [
                '--no-sandbox',
                '--disable-infobars',
                '--disable-dev-shm-usage',
                '--disable-extensions',
                '--log-level=3',
                '--disable-gpu',
                '--window-size=1920,1080',
                '--headless',
            ]
            //.concat(isCI ? ['--headless'] : [])    // run in headless mode on the CI server
        }
    }
};
