# Job Keywords Tracker [![Built with React](https://img.shields.io/badge/built%20with-React-61DAFB.svg?style=for-the-badge&logo=react)](https://reactjs.org/)

a
Job Keywords Tracker is a Chrome extension that helps you analyze job descriptions and identify the most frequent technical keywords for different job roles. Keep track of the skills that are in demand and tailor your resume and interview preparation accordingly.

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [How to Use](#how-to-use)
- [Installation](#installation)
- [Technology Stack](#technology-stack)
- [Contributing](#contributing)
- [License](#license)
- [Disclaimer](#disclaimer)

## Features

- **Analyze Job Descriptions:** Paste any job description into the extension and get a list of technical keywords and their frequencies.
- **Role-Based Tracking:** Organize your keyword analysis by job roles (e.g., Software Engineer, Data Analyst, Product Manager).
- **Add Custom Roles:** Flexibility to add new job roles that are relevant to your career path.
- **Edit and Delete Keywords:** Curate your keyword list by editing or removing entries.
- **Secure API Key Storage:** Your Gemini API key is stored securely using Chrome's storage.

## Screenshots

### Extension Popup

![Extension in Action](https://placehold.co/600x400/gif)

### Options Page

![Options Page](https://placehold.co/600x400/png)

## How to Use

1.  **Set Your API Key:**

    - Click on the extension icon and go to the "Options" page.
    - Enter your Gemini API key. You can get a free API key from [Google AI Studio](https://aistudio.google.com/) and refer to the [Gemini API documentation](https://ai.google.dev/docs) for more information.
    - Click "Save".

2.  **Analyze a Job Description:**

    - Open the extension popup.
    - Select a job role from the dropdown or add a new one.
    - Paste the job description into the text area.
    - Click "Analyze Keywords".

3.  **View and Manage Keywords:**
    - The extracted keywords will appear below the "Analyze Keywords" button.
    - You can see the frequency of each keyword.
    - You can edit or delete keywords as needed.

## Installation

Since this extension is not yet published on the Chrome Web Store, you can install it locally by following these steps:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/job-keywords-tracker.git
    ```

2.  **Install dependencies:**

    ```bash
    cd job-keywords-tracker
    npm install
    ```

3.  **Build the extension:**

    ```bash
    npm run build
    ```

4.  **Load the extension in Chrome:**
    - Open Chrome and go to `chrome://extensions/`.
    - Enable "Developer mode".
    - Click "Load unpacked".
    - Select the `build` directory that was created in the previous step.

## Technology Stack

- **Frontend:** React
- **Language Model:** Google Gemini Pro
- **State Management:** React Hooks
- **Routing:** React Router
- **Styling:** CSS
- **Chrome Extension APIs:** `chrome.storage`

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have any ideas for improvement.

## License

This project is licensed under the MIT License.

## Disclaimer

This is a personal project and is not an official Google product.
