<p align="center">
    <img src="./public/logo.png" alt="" width="300"/>  
</p>

# ferdi-debug
Webapp to help debug Ferdi issues.

The Ferdi debugger uses Ferdi's debug information to display a Ferdi-like webinterface in the browser. This webinterface allows us to check your configuration without having to crawl through raw JSON code.

<img alt="Ferdi homescreen" src="./screenshots/0.png">
<img alt="Ferdi settings" src="./screenshots/1.png">

## Setup
1. Clone this repository
2. Install the [AdonisJS CLI](https://adonisjs.com/)
3. Copy `.env.example` to `.env` and edit the [configuration](#configuration) to your needs
4. Run `npm install` to install local dependencies
5. Run the database migrations with
    ```js
    adonis migration:run
    ```
6. Start the server with
    ```js
    adonis serve --dev
    ```

## License
ferdi-debug is licensed under the MIT License
