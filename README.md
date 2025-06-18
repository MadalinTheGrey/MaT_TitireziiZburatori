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

Route documentation:
All routes return a status code and:

- on success: a json with the "message" field usually confirming the action took place successfully.
- on error: a json with the "error" and eventually "details" fields.
  If the return field is missing for a route this is all the route returns.

POST

```
/api/appointments
```

body: json (example below)

```
{
    "appointment_date" :"2007-02-27 15:21:00",
    "title": "some title",
    "description": "some description"
}
```

returns: json with "id" field containing the id of the created appointment on success.

POST
`/api/appointments/:id/files`
body: multipart/form data containing appointment files
params: ":id" is the id of the appointment the files belong to
example:
`/api/appointments/4/files`
Send files belonging to the appointment with id 4
returns: json with "message" and "files" field, the latter containing an array with the paths to the added files.

GET
`/api/appointments/:id`
body: n/a
params: ":id" is the id of the appointment to be returned
returns: json as shown below

````{
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
}```

GET
```/api/appointments```
or
```/api/appointments?is_approved=rejected```
query params: "is_approved" is the current state of the appointment. Can be: pending, rejected, approved.
body: n/a
returns:
- for clients: all of the appointments belonging to the logged user ignoring filters in the route.
- for admin: all of the appointments fitting the given filters. If there are no filters then all appointments will be returned.
json maintains the same structure for both:
```{
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
````

POST
`/api/register`
For registering users.
body: json as shown below
params: n/a

````{
    "username": "user1",
    "password": "userPassword",
    "email": "user@email.com"
}```
returns: json with "id" field containing the id of the registered user.

POST
```/api/login```
For user log in
body: json as shown below
params: n/a
```{
    "email": "user@email.com",
    "password": "userPassword"
}```
returns: json with the "message" and "jwt" fields, the latter containing the token the user needs to access protected routes, which is to be sent in a header called "authorization" with the value: "Bearer jwtValue".

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

- The user is required to make an account before using the features mentioned here.
- The client can fill out a form with desired date and hour for his appointment. The form will also include details about the problem. The client can attach images/videos if he thinks it is necessary.
- The administrator can accept or reject an appointment. On reject he will provide an explanation for the rejection and on approval the administrator will provide necessary details.
- The app keeps track of available supplies as well as orders towards providers.

<!-- Env Variables -->

### :key: Environment Variables

To run this project, you will need to add the following environment variables to your .env file:

- DB_USER=yourname
- DB_HOST=localhost
- DB_NAME=db_name
- DB_PASSWORD=yourpassword
- DB_PORT=5432
- PORT=8021

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
- [ ] Implement design using HTML & CSS (in progress)
- [x] Complete database schema
- [x] Implement database
- [x] Setup backend
- [x] Login/register
- [x] Add appointments endpoint
- [x] Upload appointment files endpoint
- [x] GET endpoints for appointments

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
````
