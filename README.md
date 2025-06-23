<div align="center">

  <img src="/public/assets/Logo.png" alt="logo" width="200" height="auto" />
  <h1>Maintenance Web Tool</h1>
  
  <p>
    Web Technologies project by Focsa Ionut-Madalin & Dutescu Daniela. 
  </p>
  
  
<!-- Badges -->
<p>
  <a href="https://github.com/MadalinTheGrey/MaT_TitireziiZburatori">
    <img src="https://img.shields.io/badge/last_update-grey" alt="last update" />
  </a>
  <a href="https://github.com/MadalinTheGrey/MaT_TitireziiZburatori/network/members">
    <img src="https://img.shields.io/badge/forks-green" alt="forks" />
  </a>
  <a href="https://github.com/MadalinTheGrey/MaT_TitireziiZburatori/stargazers">
    <img src="https://img.shields.io/badge/stars-yellow" alt="stars" />
  </a>
  <a href="https://github.com/MadalinTheGrey/MaT_TitireziiZburatori/issues/">
    <img src="https://img.shields.io/badge/issues-red" alt="open issues" />
  </a>
</p>
   
<h4>
    <a href="https://github.com/MadalinTheGrey/MaT_TitireziiZburatori/">View Demo</a>
  <span> · </span>
    <a href="https://github.com/MadalinTheGrey/MaT_TitireziiZburatori">Documentation</a>
  <span> · </span>
    <a href="https://github.com/MadalinTheGrey/MaT_TitireziiZburatori/issues/">Report Bug</a>
  <span> · </span>
    <a href="https://github.com/MadalinTheGrey/MaT_TitireziiZburatori/issues/">Request Feature</a>
  </h4>
</div>

<br />

<!-- Table of Contents -->

# :notebook_with_decorative_cover: Table of Contents

- [About the Project](#star2-about-the-project)
  - [Screenshots](#camera-screenshots)
  - [Tech Stack](#space_invader-tech-stack)
  - [Features](#dart-features)
  - [Color Reference](#art-color-reference)
  - [Environment Variables](#key-environment-variables)
- [Getting Started](#toolbox-getting-started)
  - [Prerequisites](#bangbang-prerequisites)
  - [Installation](#gear-installation)
  - [Running Tests](#test_tube-running-tests)
  - [Run Locally](#running-run-locally)
  - [Deployment](#triangular_flag_on_post-deployment)
- [Usage](#eyes-usage)
- [Roadmap](#compass-roadmap)
- [FAQ](#grey_question-faq)
- [License](#warning-license)
- [Contact](#handshake-contact)
- [Acknowledgements](#gem-acknowledgements)

<!-- About the Project -->

## :star2: About the Project

To be added: C4 diagrams and detailed design (database schema and details, frontend & backend description).

### Backend

**Database**

Made using postgresql because of its full ACID compliance and great performance for frequent write operations. The database contains tables for users, roles, appointments, supplies and orders leading to a grand total of 8 tables.

The app contains a database initialization script that creates the mentioned tables, inserts some default data and adds some basic constraints.

**Login and authorization**:

Login is performed using JSON web tokens. After the user enters their login data, and login is performed successfully, a token is generated, containing the user's id, email and roles, and sent back in a json.

When a user tries to access a protected route they must provide a header named "authorization" which contains the string "Bearer " followed by the token received during login.

Even if a user is logged in they will not be able to access certain routes if they lack the necessary role to do so. The client role is provided by default while the admin role is only obtainable when an admin deems it necessary.

**Appointments**

Endpoints for managing appointments are provided, allowing users to create and view their own appointments. Admins can view every appointment and leave a review deciding whether to approve or reject the appointment. All requests require the user to be authenticated via JWT. The API validates received input, ensures role based access and handles files related to appointments.

POST

```
/api/appointments
```

Add info about an appointment to the database.

- required role: client
- body: json, all fields are required

```
{
    "appointment_date" :"2007-02-27 15:21:00",
    "title": "some title",
    "description": "some description"
}
```

- params: n/a
- returns: json with "id" field containing the id of the created appointment on success.

POST

```
/api/appointments/:id/files
```

Allows the upload of files related to an appointment.

- required role: client
- body: multipart/form data containing appointment files
- params: ":id" is the id of the appointment the files belong to
- example:

Send files belonging to the appointment with id 4

```
/api/appointments/4/files
```

- returns: json with "message" and "files" field, the latter containing an array with the paths to the added files.

GET

```
/api/appointments/:id
```

Fetch info about a certain appointment. If called by a client that does not own the appointment it returns an error.

- required role: client
- body: n/a
- params: ":id" is the id of the appointment to be returned
- returns: json

```
{
    "appointment": {
        "id": 4,
        "appointment_date": "2007-02-27T13:21:00.000Z",
        "user_id": 17,
        "title": "some title",
        "description": "some description",
        "is_approved": "PENDING",
        "admin_review": null
    },
    "filePaths": [
        "file path"
    ]
}
```

GET

```
/api/appointments
```

OR with query parameters

```
/api/appointments?is_approved=rejected
```

Returns all appointments or the ones that fit the query params. Clients will only get appointments that they own, ignoring query parameters.

- required role: client
- query params: "is_approved" is the current state of the appointment. Can be: pending, rejected, approved.
- body: n/a
- returns: json with appointments field containing an array of appointments

```
{
    "appointments": [
        {
            "id": 4,
            "appointment_date": "2007-02-27T13:21:00.000Z",
            "user_id": 17,
            "title": "some title",
            "description": "some description",
            "is_approved": "PENDING",
            "admin_review": null,
            "files": [
                "file path"
            ]
        }
	]
   }
```

PATCH

```
/api/appointments/:id
```

Allows admins to review appointments.

- required role: admin
- body: json, all fields required
  - "is_approved": pending, approved, rejected
  - "admin_review": explanation for the decision
- params: ":id" the id of the appointment that is being reviewed

**Note for routes**:

All routes return a status code and:

- on success: a json with the "message" field usually confirming the action took place successfully.
- on error: a json with the "error" and eventually "details" fields.

If the return field is missing from the details for a route this is all the route returns.

Error codes:
401 - Unauthorized: The token provided is invalid
403 - Forbidden: You lack the necessary role for accessing the route

POST

```
/api/register
```

- For registering users.

- body: json

```
{
    "username": "user1",
    "password": "userPassword",
    "email": "user@email.com"
}
```

- params: n/a

- returns: json with "id" field containing the id of the registered user.

POST

```
/api/login
```

- For user log in

- body: json as shown below

- params: n/a

```
{
    "email": "user@email.com",
    "password": "userPassword"
}
```

- returns: json with the "message" and "jwt" fields, the latter containing the token the user needs to access protected routes.

POST

```
/api/supplies
```

- body: json

```
{
    "name" :"supply name",
    "description": "supply description",
    "in_stock": 20
}
```

- params: n/a
- returns: json with "id" field containing the id of the added supply

PATCH

```
/api/supplies/:id
```

- Updates stock for supply with given id
- body: json with field "in_stock" containing the new number of items in stock
- params: ":id" is the id of the supply which will be updated

GET

```
/api/supplies
```

- body: n/a
- query params: "name" and "in_stock". The endpoint will search for supplies with the given name where in_stock is equal or lower than the given value.
- example:

```
/api/supplies?name=pry%20bar&in_stock=20
```

- returns: json

```
{
    "supplies": [
        {
            "id": 1,
            "name": "supply name",
            "description": "supply description",
            "in_stock": 20
        }
    ]
}
```

POST

```
/api/supplies/import
```

- body: multipart/form-data containing either a json or a csv file with supplies that respect the form of a supply mentioned at the other POST route
- params: n/a
- returns: json with "message" and "count" fields, the latter containing the number of supplies added.

GET

```
/api/supplies/export
```

- body: n/a
- params: n/a
- returns: downloadable json containing all supplies

POST

```
/api/orders
```

- body: json

```
{
    "supply_id": 1,
    "provider": "some provider",
    "description": "some description"
}
```

- params: n/a
- returns: json with "id" field containing the id of the created order

GET

```
/api/orders
```

- body: n/a
- params: n/a
- Returns all orders in json

```
{
    "orders": [
        {
            "id": 1,
            "supply_id": 1,
            "supply_name": "supply name",
            "provider": "some provider",
            "description": "some description"
        }
    ]
}
```

DELETE

```
/api/orders/:id
```

- body: n/a
- params: ":id" - id of the order to be deleted
- Deletes order with given id

POST

```
/api/roles
```

- Adds a role to a user using their ids
- body: json with user_id and role_id to help identify which role should be assigned to which user
- params: n/a

<!-- Screenshots -->

### :camera: Screenshots

<div align="center">
  <img src="https://placehold.co/600x400?text=Your+Screenshot+here" alt="screenshot" />
</div>

<!-- TechStack -->

### :space_invader: Tech Stack

<details>
  <summary>Client</summary>
  <ul>
    <li><a href="https://html.spec.whatwg.org/multipage/">HTML</a></li>
    <li><a href="https://www.w3.org/Style/CSS/">CSS</a></li>
  </ul>
</details>

<details>
  <summary>Server</summary>
  <ul>
    <li><a href="https://nodejs.org/en">Node.js</a></li>
    <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">JavaScript</a></li>
  </ul>
</details>

<details>
<summary>Database</summary>
  <ul>
    <li><a href="https://www.postgresql.org/">PostgreSQL</a></li>
  </ul>
</details>

<!-- Features -->

### :dart: Features

The user is required to make an account before using the features mentioned here.

- The client can fill out a form with desired date and hour for his appointment. The form will also include details about the problem. The client can attach images/videos if he thinks it is necessary.
- The client can view his appointments and their status in his account page
- The administrator can accept or reject an appointment. On reject he will provide an explanation for the rejection and on approval the administrator will provide necessary details.
- The app helps keep track of available supplies as well as orders towards providers.

<!-- Env Variables -->

### :key: Environment Variables

To run this project, you will need to add the following environment variables to your .env file:

- DB_USER=yourname
- DB_HOST=localhost
- DB_NAME=db_name
- DB_PASSWORD=yourpassword
- DB_PORT=5432
- PORT=8021
- JWT_SECRET="supersecretkey"
- ADMIN_PASS=passwordforthedefaultadmin

<!-- Getting Started -->

## :toolbox: Getting Started

<!-- Prerequisites -->

### :bangbang: Prerequisites

- Node.js
- PostgreSQL

<!-- Installation -->

### :gear: Installation

- Install all prerequisites
- Clone the repo
- Open terminal in the cloned repo folder
- Run npm install
- Setup your .env file (make sure all variables are added and modified to fit your own postgres settings, minimally: yourname, db_name and yourpassword)

<!-- Running Tests -->

### :test_tube: Running Tests

<!-- Run Locally -->

### :running: Run Locally

<!-- Deployment -->

### :triangular_flag_on_post: Deployment

<!-- Usage -->

## :eyes: Usage

Online system for managing appointments for a bicycles, motorcycles & scooters service.

<!-- Roadmap -->

## :compass: Roadmap

- [ ] Write a comprehensive readme detailing the project (in progress)
- [ ] Define project architecture (C4 diagrams) (in progress)
- [x] Decide on a design for the website
- [x] Implement design using HTML & CSS
- [x] Complete database schema
- [x] Implement database
- [x] Setup backend
- [x] Login/register
- [x] Add appointments endpoint
- [x] Upload appointment files endpoint
- [x] GET endpoints for appointments
- [x] Supplies endpoints
- [x] Orders endpoints
- [x] Admin grant role endpoint

<!-- FAQ -->

## :grey_question: FAQ

<!-- License -->

## :warning: License

License Link: https://github.com/MadalinTheGrey/MaT_TitireziiZburatori/blob/main/LICENSE

<!-- Contact -->

## :handshake: Contact

Project Link: [https://github.com/MadalinTheGrey/MaT_TitireziiZburatori](https://github.com/MadalinTheGrey/MaT_TitireziiZburatori)

<!-- Acknowledgments -->

## :gem: Acknowledgements

- [Shields.io](https://shields.io/)
- [Awesome README](https://github.com/matiassingers/awesome-readme)
- [Emoji Cheat Sheet](https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md#travel--places)
- [Readme Template](https://github.com/othneildrew/Best-README-Template)
- [Awesome README Template](https://github.com/Louis3797/awesome-readme-template)
- [Unicons](https://iconscout.com/unicons)
- [Unsplash](https://unsplash.com/)
