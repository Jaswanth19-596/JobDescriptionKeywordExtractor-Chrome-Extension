# Job Keywords Tracker

Job Keywords Tracker is a Chrome extension that helps you extract and track technical keywords from job descriptions. By analyzing the frequency of keywords for different job roles, you can tailor your resume and cover letter to better match the requirements of the jobs you are applying for.

## Features

- Extract technical keywords from job descriptions using the Gemini API.
- Track keyword frequencies for different job roles.
- Add and manage a list of job roles.
- Edit and delete keywords to maintain a clean and accurate list.
- Securely stores your Gemini API key.

## How to Use

1.  **Select a Job Role**: Choose a job role from the dropdown menu in the extension popup. If the role you are looking for is not in the list, you can add it.
2.  **Add a New Role**: Click the "+ Add New Role" button, enter the title of the new role, and click "Save Role".
3.  **Paste Job Description**: Copy a job description and paste it into the "Job Description" text area.
4.  **Analyze Keywords**: Click the "Analyze Keywords" button. The extension will send the job description to the Gemini API to extract technical keywords and their frequencies.
5.  **View Keywords**: The extracted keywords will be displayed in a list, sorted by frequency. You can see how many times each keyword has appeared in the job descriptions you have analyzed for the selected role.
6.  **Manage Keywords**: You can edit the name and count of each keyword or delete it from the list.

## Installation

To install the extension, follow these steps:

1.  Clone or download this repository to your local machine.
2.  Open Google Chrome and navigate to `chrome://extensions`.
3.  Enable "Developer mode" in the top right corner.
4.  Click "Load unpacked" and select the directory where you cloned or downloaded this repository.

The Job Keywords Tracker extension should now be visible in your extensions list and accessible from the Chrome toolbar.

## Configuration

Before you can use the extension, you need to configure your Gemini API key:

1.  Right-click on the extension icon in the Chrome toolbar and select "Options".
2.  Enter your Gemini API key in the provided field. You can obtain a free API key from Google AI Studio.
3.  Click "Save". The key is stored securely using `chrome.storage.sync`.

## Privacy

Your Gemini API key and the keywords you track are stored locally on your machine using Chrome's storage APIs. The job descriptions you analyze are sent to the Gemini API for processing, but they are not stored by the extension.

## For Developers

This extension is built with HTML, CSS, and JavaScript. It uses the `fetch` API to communicate with the Gemini API. The `manifest.json` file is configured for Manifest V3.
