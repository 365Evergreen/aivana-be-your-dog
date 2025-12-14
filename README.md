# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

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

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Authentication & Microsoft Graph

This app includes a simple MSAL + Microsoft Graph integration scaffold located in `src/services`.

- Configure your Azure AD app and update `src/msalConfig.js` with your `clientId`, `authority`, and `redirectUri`.
- The singleton MSAL instance is in `src/services/msalInstance.js` and the lightweight helpers are in `src/services/auth.js` (`login`, `logout`, `acquireToken`).
- Graph helpers that acquire tokens automatically are in `src/services/graph.js` (for example, `getGraphClientForScopes`, `fetchEmails`, `fetchEvents`).

Ensure your Azure AD app has the required delegated scopes consented (for example `Sites.ReadWrite.All` for SharePoint and `Files.Read` for OneDrive access).

## Dataverse & SharePoint stubs

- `src/services/dataverse.js` contains basic CRUD helpers that use the configured Dataverse `orgUrl` and `scope` from `src/utils/apiConfig.js`.
- `src/services/sharepoint.js` contains SharePoint helpers that call Microsoft Graph for list and drive operations; it uses `GRAPH.defaultScopes` from `src/utils/apiConfig.js`.

Notes:
- These service helpers are scaffolds — validate scopes and consent in your tenant before using in production.
- For local development you can use the Azure AD app registration with `http://localhost:3000` as a redirect URI.

## Lazy-loading

Large pages are lazy-loaded with `React.lazy` and `React.Suspense` to reduce the initial bundle size. See `src/App.js` for currently lazy-loaded pages.

## Running the built app locally

To serve the production build locally for a quick smoke test:
```bash
npx serve -s build -l 5000
# then open http://localhost:5000
```

If you prefer the development server use:
```bash
pnpm start
```

If you modify MSAL configuration or add new scopes, rebuild the app before deploying.
