### Get all films

URL: /api/films

HTTP Method: GET

Description: Retrieve all the films.

Request body: None

Response: 200 OK (success) or 500 Internal Server Error (failure). In case of success, returns an array of questions in JSON format (see below); otherwise, an error message.

Response body:

[
  {
    "id": 1,
    "text": "Pulp fiction",
    "isFavorite": 1,
    "rating": 5,
    "watchDate": "2026-02-26",
    "userId": 1
  },
  ...
]

### Get all favorite films

URL: /api/films/<isFavorite>

HTTP Method: GET

Description: Retrieve the films that is favorite films <isFavorite>.

Request body: None

Response: 200 OK (success), 404 Not Found (failure, wrong id) or 500 Internal Server Error (failure). In case of success, returns a question in JSON format (see below); otherwise, an error message.

Response body:

[
  {
    "id": 1,
    "text": "Pulp fiction",
    "rating": 5,
    "watchDate": "2026-02-26",
    "userId": 1
  },
  ...
]

### Get all films before the date

URL: /api/films/<date>

HTTP Method: GET.

Description: Get all the films watched before the date <date>.

Request body: None

Response: 200 OK (success), 404 Not Found (wrong id), or 500 Internal Server Error (generic error).

Response body:

[
  {
    "id": 1,
    "text": "Pulp fiction",
    "rating": 5,
    "watchDate": "2026-02-26",
    "userId": 1
  },
  ...
]

### Add a new film

URL: /api/films

HTTP Method: POST.

Description: Add a new film.

Request body:

{
    "id": 7,
    "text": "Chiedimi se sono felice",
    "rating": 5,
    "watchDate": "2026-03-13",
    "userId": 1
}
Response: 201 Created (succes, with the created id), 404 Not Found (wrong id), or 503 Service Unavailable (generic error). If the request body is not valid, 422 Unprocessable Entity (validation error).

Response body: None


### Get film by title

URL: /api/films/<title>

HTTP Method: GET

Description: Update the film that have this part in the title <title>.

Request body: None
Response: 200 OK (success), 404 Not Found (failure, if id doesn't exist) or 500 Internal Server Error (failure). If the request body isn't valid, 422 Unprocessable Entity (validation error).

Response body: 
{
    "id": 1,
    "text": "Pulp fiction",
    "rating": 5,
    "watchDate": "2026-02-26",
    "userId": 1
  }


### Delete films

URL: /api/films/<id>

HTTP Method: DELETE

Description: Delete the film identified by <id>.

Request body: None 

Response: 204 No content (success) or 500 Internal Server Error (failure). If the request body isn't valid, 404 Not Found.

Response body: None


### __Login__

URL: `/api/sessions`

HTTP Method: POST

Description: Create a new session (i.e., perform the login).

Request body: A JSON object with username and password.
```
{
  "username": "luigi.derussis@polito.it",
  "password": "password"
}
```

Response: `201 Created` (success) or `401 Unauthorized` (failure, not authenticated).

Response body: A JSON object representing the authenticated user.
```
{
  "id": 1,
  "username": "luigi.derussis@polito.it",
  "name": "Luigi De Russis"
}
```

### __Check if still logged in__

URL: `/api/sessions/current`

HTTP Method: GET

Description: Check if the user is still logged in.

Response: `200 OK` (success) or `401 Unauthorized` (failure, not authenticated).

Response body: A JSON object representing the authenticated user.
```
{
  "id": 1,
  "username": "luigi.derussis@polito.it",
  "name": "Luigi De Russis"
}
```

### __Logout__

URL: `/api/sessions/current`

HTTP Method: DELETE

Description: Delete the session for the current user (i.e., perform the logout).

Response: `200 OK` (success).