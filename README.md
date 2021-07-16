# Rest API for Ryde users

## Prerequisites

-   node (v12.18.3)
-   psql (v13.1)

## Install packages

-   run `npm i` to install necessary packages

## Setup environmental variables

-   run `cp .env.example .env` in the root directory
    or use another similar method to copy/rename the file to a .env file

## Setup local postgresql database

-   run `npm run db-initial-setup` for initial setup
-   run `npm run db-access-cli` if you wish to access the database through the command line
-   run `npm run db-rollback` if you wish to do a reset on the database

## Start the server

-   run `npm run dev` in the root directory. This will automatically load the environmental variables from .env

## API Documentation

| Endpoint                                   | Method   | Body                                                                                                                                                                               | Description                                                                                                        |
| ------------------------------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `/api/user`                                | `GET`    | -                                                                                                                                                                                  | Returns all users                                                                                                  |
| `/api/user`                                | `POST`   | JSON object with these attributes:<br/>`*name [STRING]`<br />`dob [STRING]`<br />`address [STRING]`<br />`latitude [NUMBER]`<br />`longitude [NUMBER]`<br />`description [STRING]` | Creates a new user<br />returns a json object with<br />`user_id` of the new user                                  |
| `/api/user/<*id>`                          | `GET`    | -                                                                                                                                                                                  | Returns user object with corresponding id                                                                          |
| `/api/user/<*id>`                          | `PATCH`  | JSON object with these attributes:<br/>`name [STRING]`<br />`dob [STRING]`<br />`address [STRING]`<br />`latitude [NUMBER]`<br />`longitude [NUMBER]`<br />`description [STRING]`  | Updates user with corresponding id<br />returns "success" or "user not found"                                      |
| `/api/user/<*id>`                          | `DELETE` | -                                                                                                                                                                                  | Deletes user with corresponding id                                                                                 |
| `/api/user/nearby/<*name>/<search-radius>` | `GET`    | -                                                                                                                                                                                  | Returns a list of users who are<br/>within search radius of the corresponding user<br/>(search radius is optional) |

\*required
