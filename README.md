# EssayStack
A minimal web app to submit and display to-be-read essays by priority and status, continuously updated via Firebase.

## Usage
- Fill in the essay form (title, link, notes, priority) and submit  
- Essays are saved to Firebase and displayed by unread status and priority  

Note: For security reasons, write access to add essays has been disabled on the public website. To host this project on your own, clone the repo, use your own Firebase database, and update `firebaseConfig` in `app.js` as necessary.