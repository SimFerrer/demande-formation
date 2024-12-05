# Request Formation (Last updated 05/12/2024)

The goal of this project is to provide a platform for managing and tracking training requests, with the ability to add new requests. The application integrates Firebase authentication to ensure secure user access. Users can authenticate using Firebase, and their roles and permissions are managed to allow authorized access to specific functionalities. This project serves as a starting point for building Angular applications that require secure user authentication, along with the ability to handle training requests and manage them effectively.

## Features

The main features of the application are the following ones :

- Create an account and connect to the application
- Export and delete data
- Add and Update Training


## Links

- Github : 
- Firebase project: 
- Firestore : 
- To install the firebase CLI for deployment : https://firebase.google.com/docs/cli?hl=fr#install_the_firebase_cli

## Get started


### 1. Clone the Project

```bash
git clone https://github.com/SimFerrer/demande-formation.git
```

### 2. Install the Project Dependencies

The first step is to install all the necessary dependencies to run the application.

```bash
npm install
```


### 3. Create a Firebase Project

If you don't have a Firebase project yet, follow these steps to create one:

1. Go to the [the Firebase console](https://console.firebase.google.com/).
2. Click on **Add Project** and follow the steps to create your project.
3. Once your Firebase project is created, you need to enable Firestore and authentication options to allow your application to store data and manage users.


## 4. Configure Firebase Variables in Your Project

Now you need to integrate your Firebase project into the Angular application. Firebase will provide the necessary information for configuration.

1. Go to **Project Settings** (gear icon at the top left in the Firebase console).
2. Retrieve the configuration details for your web application.

Then, update `src/environments/environment.ts` with these details:

```typescript
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
  }
};
```
Replace the values with the specific information for your Firebase project.

## Architecture

This application uses **Angular 18.1** and uses **Firebase 10.13** as authentication, database & hosting platform. **Material 18** is used to provide basic graphical components.

Firebase modules used :
| Firestore | Realtime Database | Authentication | App Hosting |
|:-:|:-:|:-:|:-:|
| Application main database storing documents in collections | Store users presence that can be updated safely upon closing the application | Manage users accounts and authentication state| Application hosting and deploymen |

To make the integration of firebase in this project easier we also use **AngularFire 18** that provides built-in methods to interact with Firebase.

## File structure

- Core : application components and services that are not specific to any game (profile, header, footer) and that can be used from anywhere in the application (pop-up )
- Auth : components, models and services used to manage user authentication (signup, login...)
- Shared : custom validators and material module exporting all Material components
- Training : components, models and services used to manage training (list, create, reference data for modules and organisms)

## NgRx

The application uses **NgRx 18** to manage internal state.
This framework uses different mechanisms :

- Store : The store is responsible for state management and can be injected in components to dispatch actions or read data from the state
- State : The state defines the data that can be accessed through the store
- Actions : The actions are events dispatched by the components that can have parameters
- Effects : The effects are associated to specific actions and are executed each time the actions are dispatched
- Reducer : The reducer defines which fields of the state will be updated when each specific action is dispatched
- Selectors : The selectors are used to retrieve specific data from the state rather than the whole state

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Deployment

Run `ng build` to generate/update the build of the project. Then run `firebase deploy`. If you don't have the firebase CLI installed refers to [LINKS](README.md?plain=1#L14)

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
