# EECS 605 Module 7

## Overview
We will be creating and deploying a React app to Heroku that can do handwritten-digit recognition via the handwritten-digit API that we created in Module 6.

## Objectives
1. Refactor a React app template to utilize the handwritten-digit API.
2. Deploy the React app to Heroku.

## Step 1: React app preparation
0. Create a public GitHub repository dedicated storing the React app components. (If you do not have a GitHub account, create one https://docs.github.com/en/get-started/signing-up-for-github/signing-up-for-a-new-github-account)
1. Copy and paste everything in the "components" directory into the GitHub repository's root level. Make sure to copy and paste `.gitignore` file also - you can do this by:
   - If MacOS: `cmd` -> `shift` -> `.` will reveal the hidden files, including the `.gitignore` file.
   - If Windows: https://stackoverflow.com/questions/42173328/why-doesnt-gitignore-txt-file-show-its-name-in-windows10
2. Open up `./src/App.js` file and replace `<api-url>` with your API from Module 6.
3. Push the changes to the GitHub repository.

## Step 2: Heroku preparation and deploy the React app
1. Create a new Heroku app from the console `https://dashboard.heroku.com/apps`.
2. Choose "GitHub" as the deployment method and connect your GitHub account.
3. Find and connect the GitHub repository to Heroku by following the steps.
4. Once the repository is connected, deploy it by selecting "Deploy Branch".

## Customizing
* Main resource: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file
* You can start customizing your website from `src/App.js`, specifically at the bottom of the code where you will see the website components such as `<div className="Input">` or `<input type="file" onChange={handleChange} />`.
* "Choose File" button is being created by `<input type="file" onChange={handleChange} />`.
* "Submit" button is being created by `<button type="submit" disabled={buttonDisable}>{buttonText}</button>`.
* The image processing and upload is handled by `<form onSubmit={handleSubmit}> ... </form>`.
* Output is being handled by `<p>{outputFileData}</p>`, where `outputFileData` is a global variable that is being updated by `handleSubmit()` function when the output is returned from the API.

## Notes
* Unlike the Jupyter notebook deployed on Heroku, we can have multiple people interact with the website all at the same time. This is possible because:
  1. API created with Lambda and Gateway API automatically scales up as multiple POST requests are made.
  2. The website data and UI are fetched and rendered to each of the users locally - html, css, and JavaScript code is downloaded to each of the users' browsers and rendered locally.
