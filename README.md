# Birthday Reminder System 🎂

A simple, beautifully designed automated birthday reminder web application. It collects users' names, emails, and dates of birth via a modern web interface and runs a daily automated background job to send a celebratory email to users whose birthday is today!

## Features

- **Modern Web UI**: A stunning, glassmorphism-inspired interface to collect birthday information.
- **Robust Database**: Uses SQLite via the **Sequelize** ORM to seamlessly store and query user data.
- **Input Validation**: Strict request payload validation using **Joi** to ensure data integrity.
- **Automated Emails**: Integrated with **Nodemailer** and **node-cron** to automatically check for birthdays every day at 7:00 AM and dispatch unique email templates.
- **Dynamic Rendering**: Frontend is served utilizing the **EJS** view engine.

## Technologies Used

- Node.js & Express.js
- SQLite3 & Sequelize (ORM)
- Nodemailer
- Node-Cron
- EJS (Embedded JavaScript Templates)
- Joi (Data Validation)

## Setup Instructions

1. **Clone the repository** (if you haven't already).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env` file in the root directory of the project and provide your Gmail credentials. You will need to generate an [App Password](https://myaccount.google.com/apppasswords) for your Google account:
   ```env
   PORT=3000
   SMTP_USER=your_gmail_address@gmail.com
   SMTP_PASS=your_16_character_app_password
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   *(Alternatively, run `node app.js`)*

5. **Access the App**:
   Navigate to **http://localhost:3000** in your browser to view the form.

## How it Works

- When a user submits the form, their data is securely validated and saved to the `database.sqlite` file.
- The cron job is configured to run at `0 7 * * *` (7:00 AM daily). When triggered, it queries the Sequelize `User` model for any user whose `dob` matches the current month and day.
- A personalized, HTML-styled email is then dispatched to every celebrant via your configured SMTP credentials!

Enjoy building and celebrating! 🎉
