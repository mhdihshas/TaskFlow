# TaskFlow

TaskFlow is a simple and responsive task management web application built as a first-year project. It allows users to register, log in, create and manage tasks, switch between light and dark mode, and keep task data saved in the browser.

## Features

- User registration and login
- Logout functionality
- Create, edit, and delete tasks
- Task priority and status management
- Light and dark mode
- Theme preference saved in the browser
- Responsive design for desktop and mobile
- User-specific task storage
- Browser-based local storage
- Ready for deployment on Vercel

## Technologies Used

- HTML5
- CSS3
- JavaScript
- LocalStorage
- Web Crypto API

## Project Structure

```text
Task Flow/
├── index.html
├── register.html
├── task.html
├── style.css
├── app.js
├── auth.js
├── vercel.json
└── README.md
```

> File names may vary slightly depending on the final project version.

## How to Run Locally

1. Download or clone the project.
2. Open the project folder.
3. Open `index.html` in a web browser.

For a better development experience, you can also use the **Live Server** extension in Visual Studio Code.

## How to Use

1. Open the application.
2. Create a new account from the Register page.
3. Log in using the registered account.
4. Add your tasks.
5. Update the task status or priority when needed.
6. Use the light/dark mode button to change the theme.
7. Click **Logout** from the top-right area when you want to sign out.

## Demo Task

**Task:** Complete Portfolio Website  
**Description:** Finish the portfolio website, add project screenshots, GitHub links, and deploy it on Vercel.  
**Category:** Development  
**Priority:** High  
**Status:** In Progress

## Deploying to Vercel

TaskFlow is a static web project, so it can be deployed easily on Vercel.

### Method 1: Deploy with GitHub

1. Create a GitHub repository.
2. Push the TaskFlow project to the repository.
3. Sign in to Vercel.
4. Select **Add New Project**.
5. Import the GitHub repository.
6. Keep the framework preset as **Other** if Vercel does not detect one.
7. Deploy the project.

### Method 2: Deploy with Vercel CLI

Install the Vercel CLI:

```bash
npm install -g vercel
```

From the project folder, run:

```bash
vercel
```

For a production deployment:

```bash
vercel --prod
```

## Important Note About Authentication

The current login and registration system is designed for demonstration and academic use.

User accounts and tasks are stored in the browser using `localStorage`. This means:

- Data is stored only on the current browser/device.
- Accounts are not shared between different devices.
- Clearing browser storage will remove locally stored accounts and tasks.
- This is not a replacement for production-grade server-side authentication.

For a real production application, the project can later be upgraded with services such as Supabase, Firebase, or a custom backend and database.

## Future Improvements

Possible future upgrades include:

- Cloud database integration
- Real server-side authentication
- Password reset
- Email verification
- Task search and filtering
- Task reminders
- Drag-and-drop task management
- User profile settings
- Cloud synchronization across devices

## Purpose

This project was created as a first-year academic web development project to demonstrate basic frontend development, authentication flow, task management, responsive design, browser storage, and deployment.

## Author

**Mohamed Ihshas**

HNDIT Student

## License

This project is intended for educational and portfolio use.
