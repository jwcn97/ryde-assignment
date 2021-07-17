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
-   run `npm run db-seed` if you wish to load dummy users and test the 'find nearby users' feature

## Start the server

-   run `npm run dev` in the root directory. This will automatically load the environmental variables from .env

## Run unit tests

-   run `npm run test` in the root directory to run unit tests

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

## Logging Strategy

-   the logger module is located in src/logger. It ensures that all the logs are formatted as shown below (timestamp, level, label, message)

```
2021-07-16T16:57:53.998Z [info]: [api]: GET /api/user/asdf
2021-07-16T16:57:54.221Z [error]: [dbquery]: select * from get_user_by_id(asdf)
2021-07-16T16:57:57.900Z [info]: [api]: GET /api/user/1
2021-07-16T16:58:02.086Z [info]: [api]: GET /api/user
```

## Followers vs Following feature

another table called 'user_relations' will be setup where it uses user ids to keeps track of the relationship between users, e.g.:

| id  | user_id | requester_id | status   |
| --- | ------- | ------------ | -------- |
| 1   | 1       | 2            | Pending  |
| 2   | 2       | 3            | Accepted |

-   the API endpoints to get the followers of a user will be `/api/user/<id>/followers` where the db will return the records where `user_id = <id>`
-   the API endpoints to get the users that a user is following will be `/api/user/<id>/following` where the db will return the records where `requester_id = <id>`

## Authentication
