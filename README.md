TaskFlow – Task Management Web Application

TaskFlow is a single-user, browser-based task management web application developed using HTML, CSS, and JavaScript. The application is designed to help users organize daily tasks, manage deadlines and priorities, track task progress, and view task statistics.

All task data is stored locally in the browser using LocalStorage, so the system does not require a backend server or database.

Features

Add new tasks

Edit existing tasks

Delete tasks

Set task priority:

Low

Medium

High

Assign due dates

Update task status:

To Do

In Progress

Done

Search tasks by task title

Filter tasks by status

Sort tasks by date and priority

View dashboard statistics:

Total tasks

Completed tasks

Overdue tasks

Store and retrieve task data using LocalStorage

Offline functionality

Responsive and user-friendly interface

Confirmation dialogs before deleting tasks or clearing all tasks

Technologies Used

HTML – Structure

CSS – Styling and layout

JavaScript – Functionality

LocalStorage – Data storage

System Architecture

TaskFlow follows a fully client-side architecture:

User Interface Layer
        |
    HTML + CSS
        |
   Logic Layer
        |
    JavaScript
        |
  Storage Layer
        |
   LocalStorage

There is:

No login system

No database

No backend server

All operations are performed inside the browser, and task data is stored locally in JSON format.

Project Objectives

The objectives of the project are:

Design a responsive and user-friendly interface.

Implement task creation, editing, and deletion.

Allow users to set task priority and due dates.

Implement task status tracking.

Provide search, filtering, and sorting features.

Display dashboard statistics.

Store and retrieve data using LocalStorage.

Requirements

Hardware

Computer or laptop

Minimum 4 GB RAM

Modern web browser

Software

Windows or Linux

Visual Studio Code or Notepad++

Google Chrome, Mozilla Firefox, or Microsoft Edge

Running the Application

TaskFlow is a browser-based application.

Download or clone the project files.

Open the project folder.

Open the main HTML file in a modern web browser.

Start creating and managing tasks.

Because the system is fully client-side, no backend server or database setup is required.

Data Storage

Task data is stored in the browser using LocalStorage.

This allows the application to:

Keep data after a page refresh

Work without a backend server

Work offline

Data Loss Risk

Because the application uses LocalStorage, task data may be lost if:

The user clears browser data

The browser is reset

The application is used on a different device

A future improvement may include export/import functionality to help reduce this risk.

Development Methodology

The project follows the Software Development Life Cycle (SDLC):

Requirement Analysis

System Design

Implementation

Testing

Deployment

Documentation

Testing

The project includes functional testing and debugging to validate application features.

Cross-browser testing should be performed using:

Google Chrome

Mozilla Firefox

Microsoft Edge

Limitations

Single-user system

No login system

No backend server

No database

Data is stored only in the browser through LocalStorage

Clearing browser data can remove stored tasks

Data does not automatically transfer between devices

Expected Outcome

The expected outcome is a fully functional task management web application that:

Runs in modern browsers

Works offline

Stores task data in LocalStorage

Provides organized task management features

Author

Mohamed Ihshas
Higher National Diploma in Information Technology
Sri Lanka Institute of Advanced Technological Education (SLIATE)
Advanced Technological Institute – Trincomalee

Project Title

TaskFlow – Task Management Web Application
