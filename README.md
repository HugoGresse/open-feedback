# Open Feedback

**Open Feedback** is an opened SaaS platform destined to organisers to gather feedback from users. It connect to hoverboard-v2 Firestore to retrieve all sessions & speakers & let any user give feedback on them and store everything on Open Feedback Firestore.

> Demo: https://open-feedback-42.firebaseapp.com/eaJnyMXD3oNfhrrnBYDT

## Features

_Open Feedback is still in beta_

-   Generate unique & public read url for an event
-   List all sessions from hoverboad-v2 Firestore database
-   User give feedback (not a rate) on any session anonymously (it use Firebase anonymous login)
-   Feedback list is customizable by event
-   Display users feedback

## TODO list

-   free text input on vote
-   better design
-   maybe finish [HMR for redux](https://medium.com/@brianhan/hot-reloading-cra-without-eject-b54af352c642)

> This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

> No test has been written for this project.

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
