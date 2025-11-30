# Task Management API 🚀

This project is a robust Task Management API built with Node.js, Express, and Sequelize, designed to streamline task management workflows. It provides a comprehensive set of endpoints for user authentication, task creation, project management, and team collaboration. The API supports features like JWT authentication, refresh tokens, password resets, and GitHub OAuth, ensuring secure and persistent user sessions. It also includes functionalities for managing projects, tasks, subtasks, groups, workspaces, and user profiles, making it a versatile solution for various task management needs.

## 🚀 Key Features

- **User Authentication**: Secure user registration, login, and logout functionalities with JWT and refresh tokens.
- **Password Management**: Features for forgot password, reset password, and update profile.
- **GitHub OAuth**: Seamless integration with GitHub for user authentication.
- **Task Management**: Create, read, update, and delete tasks with detailed attributes.
- **Project Management**: Organize tasks into projects and manage project members.
- **Group Management**: Create and manage user groups for collaborative task management.
- **Workspace Management**: Organize projects and groups within workspaces.
- **Subtask Management**: Break down tasks into smaller, manageable subtasks.
- **User Roles and Permissions**: Define user roles (Admin, User) and manage permissions accordingly.
- **Email Notifications**: Send password reset and invitation emails using HTML templates.
- **Avatar Management**: Upload and manage user avatars.
- **Performance Tracking**: Track user and team performance metrics.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken), bcryptjs
- **Environment Variables**: dotenv
- **Middleware**: cors
- **Email**: Nodemailer
- **GitHub OAuth**: Passport (implicitly through custom logic)
- **Utilities**: path
- **Email Templates**: HTML and CSS
- **Cloud Storage**: Cloudinary (for avatar storage)

## 📦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL
- npm or yarn

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  Install dependencies:

    ```bash
    npm install # or yarn install
    ```

3.  Configure environment variables:

    - Create `.env` files for different environments (e.g., `.env.Development.local`, `.env.Production`).
    - Define the following environment variables:

    ```
    PORT=3000
    DB_HOST=localhost
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_NAME=your_db_name
    DB_PORT=3306
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRES_IN=1h
    NODEMAILER_USER=your_nodemailer_user
    NODEMAILER_PASSWORD=your_nodemailer_password
    GITHUB_CLIENT_ID=your_github_client_id
    GITHUB_CLIENT_SECRET=your_github_client_secret
    FRONTEND_URL=http://localhost:5173
    MOBILE_SCHEME=yourapp
    GITHUB_REDIRECT_URI=http://localhost:3000/api/auth/github/callback
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```

4.  Database setup:

    - Create a MySQL database with the name specified in `DB_NAME`.
    - Run the database migrations to create the necessary tables:

    ```bash
    # Assuming you have sequelize-cli installed globally
    npx sequelize-cli db:migrate
    ```

### Running Locally

1.  Start the server:

    ```bash
    npm run dev # or yarn dev
    ```

2.  The server will start listening on the port specified in the `.env` file (default: 3000).

## 📂 Project Structure

```
├── server.js               # Main entry point for the Node.js application
├── src
│   ├── config
│   │   ├── db.js           # Sequelize configuration for database connection
│   │   └── env.js          # Loads environment variables from .env files
│   ├── controllers
│   │   ├── auth.controller.js    # Authentication logic
│   │   └── project.controller.js # Project management logic
│   ├── middleware
│   │   └── auth.middleware.js    # JWT authentication middleware
│   ├── models
│   │   ├── auth.model.js     # User model definition
│   │   ├── project.model.js  # Project model definition
│   │   └── token.model.js    # Refresh token model definition
│   ├── routes
│   │   ├── auth.routes.js    # Authentication routes
│   │   ├── index.js          # Main router for the API
│   │   └── project.routes.js # Project routes
│   ├── services
│   │   ├── authservices.js   # Authentication services
│   │   └── projectservices.js# Project services
│   └── ultis
│       ├── invitation_email_template.js # Invitation email template
│       └── reset_password_email_template.js # Reset password email template
├── package.json            # Project dependencies and scripts
├── README.md               # Project documentation
```

## 📸 Screenshots

(Add screenshots of your application here to showcase its features and UI)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Push your changes to your fork.
5.  Submit a pull request to the main repository.

## 📝 License

This project is licensed under the [MIT License](LICENSE).

## 📬 Contact

[Your Name] - [Your Email]

## 💖 Thanks Message

Thank you for checking out this project! We hope it helps you build amazing task management applications.

