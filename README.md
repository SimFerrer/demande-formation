# Skeleton (Last updated 26/11/2024)

The goal of this project is to provide a "skeleton" for building Angular applications that integrate Firebase authentication. This project serves as a starting point for developing other Angular applications that require a secure authentication system, without having to rebuild this functionality each time.

## Features

The main features of the application are the following ones :

- Create an account and connect to the application
- Export and delete data

## Evolution perspectives

Another objective of the project is to provide a technical and functional stack that can be improved by implementing other types of games without having to start from scratch.

The architecture and project structure tries to separate transversal functionalities (such as authentication and profil management) 

Some adapatations could still be needed in order to add new games and a new scope to the application but the amount of work should be reasonable as we kept these concerns in mind.

## Links

- Gitlab : 
- Github (used to retrieve codebase when not on Apside network) : 
- Nextcloud (Kanban): 
- Firebase project: 
- Firestore : 
- To install the firebase CLI for deployment : https://firebase.google.com/docs/cli?hl=fr#install_the_firebase_cli

## How to clone

- Ask to be added to this project (see Ludovic Barre)
- Go to the [repoUrl]
- Export the ssl certificate of the page [(more info)](https://medium.com/@menakajain/export-download-ssl-certificate-from-server-site-url-bcfc41ea46a2)
- Open git bash and type the following commands :

```bash
git config --global http.sslCAinfo "path\to\gitlab\exported\certificate\_apsidigit.lan.crt"
git config --system http.sslCAinfo "path\to\gitlab\exported\certificate\_apsidigit.lan.crt"
git config --global http.sslVerify false
```

- Clone the repo with via HTTP

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
