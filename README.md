# Spotify Clone

A modern web application clone of Spotify built with React, Node.js, and modern web technologies.
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Features

- User Authentication (Sign up, Login, OAuth)
- Music Streaming
- Playlist Management
- Search Functionality
- User Profiles
- Following/Followers System
- Modern UI with Animations
- Responsive Design

## Tech Stack

- Frontend: React + TypeScript
- Backend: Node.js + Express
- Database: MongoDB + PostgreSQL
- Authentication: OAuth 2.0 + JWT
- Styling: Tailwind CSS
- State Management: Redux Toolkit
- Audio Streaming: Web Audio API

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB
- PostgreSQL

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install-all
   ```
3. Set up environment variables:
   - Create `.env` files in both frontend and backend directories
   - See `.env.example` files for required variables

4. Start the development servers:
   ```bash
   npm start
   ```

## Project Structure

```
spotify-clone/
├── frontend/           # React frontend application
├── backend/           # Node.js backend server
├── package.json       # Root package.json
└── README.md         # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

ISC 