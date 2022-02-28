# Prompt:

> For this exercise, please create an HTTP server that stores, modifies, and returns users as described below. Ephemeral storage is fine, i.e., no state needs to persist across runs of the server. You should use Typescript but any other libraries are at your discretion.
>
> Users have a unique id, a username (string), a views count (number), and an array of other users they follow.
>
> The server should have the following endpoints:
> Return all users (without followed users)
> Return a single user by id (with followed users)
> An endpoint that accepts a user id and a JSON body. The body has a property ‘action’ that specifies how the server should act. The action ‘view’ increments that user’s view count. The action ‘follow’ adds another user (specified by an id in the body) to that user’s followed users. The action ‘unfollow’ removes another user from those followed users.

# To start HTTP Server:

    npm run start:http
