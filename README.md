# Serenity/JS Workshop

Hello and welcome to Serenity/JS Workshop where you'll learn how to follow the Screenplay Pattern and implement high-quality, full-stack acceptance tests.

## Prerequisites

Before the workshop, please make sure you have the following tools installed on your computer:
- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/) - you'll need version 12, the latest [Long-Term Support (LTS)](https://nodejs.org/en/about/releases/) release
- [Java Runtime Environment](https://adoptopenjdk.net/) version 8 or newer
- [Chrome web browser](https://www.google.co.uk/chrome/) 
- [Visual Studio Code](https://code.visualstudio.com/), with following plugins:
    - [Code runner](https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner)
    - [NPM](https://marketplace.visualstudio.com/items?itemName=eg2.vscode-npm-script)
    - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
    - [IntelliCode](https://marketplace.visualstudio.com/items?itemName=VisualStudioExptTeam.vscodeintellicode)
    - [Mocha Test Explorer](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-mocha-test-adapter)
    - [Run Protractor](https://marketplace.visualstudio.com/items?itemName=gabduss.run-protractor)
    - optional: [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
    - optional: [IntelliJ IDEA Keybindings](https://marketplace.visualstudio.com/items?itemName=k--kato.intellij-idea-keybindings)

Once you've installed the above, please make sure they're working as expected by running the following commands in your terminal:

```console
git --version

# expected output:
git version 2.21.0 (Apple Git-122)
```

```console
node --version

# expected output:
v12.14.1
```

```console
npm --version

# expected output:
6.13.4
```

```console
java -version

# expected output:
java version "1.8.0_181"
Java(TM) SE Runtime Environment (build 1.8.0_181-b13)
Java HotSpot(TM) 64-Bit Server VM (build 25.181-b13, mixed mode)
```

## Project setup

To set up the project, please clone this repository to the location of your choice using your computer terminal: 

```console
git clone https://github.com/serenity-js/workshop.git
```
[Learn more about cloning](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository) and [git](https://try.github.io/).

Next, switch to the directory where you've cloned the project and download its runtime dependencies using [Node Package Manager (NPM)](https://nodejs.org/en/knowledge/getting-started/npm/what-is-npm/):
```console
cd workshop
npm install
```
[Learn more about `npm install`](https://docs.npmjs.com/cli/install).

When the installation is finished, the project will verify your environment and if everything is fine, you should see the below message after `npm install` completes:

```console

    Looks like you're ready to go! Congrats :-)

```

## Running tests

Before running the tests, start the demo app by executing the following command using your computer terminal:

```console
npm start
```

Next, in a **second** terminal, execute all tests for all the exercises:

```console
npm test
```

## Using Visual Studio Code

Visual Studio Code keyboard shortcuts: 
- [Windows](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf)
- [Mac](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-macos.pdf)
- [Linux](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-linux.pdf)

## License

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a>

<span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">Serenity/JS Workshop</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="https://janmolak.com/about-the-author-e45e048661c" property="cc:attributionName" rel="cc:attributionURL">Jan Molak</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.

For commercial use, please contact the [author](https://janmolak.com/about-the-author-e45e048661c).
