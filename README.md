Guvi-login-backend
This is a Node.js-based API for user authentication, including signup, login, forgot password, reset password, and verification of reset codes. The API is built using Express.js and runs on port 5000.
Table of Contents

Features
Technologies
Installation
API Endpoints
Environment Variables
Usage
Contributing
License

Features

User registration with email and password
User login with JWT-based authentication
Forgot password functionality with reset code
Password reset with verification
Secure API endpoints

Technologies

Node.js
Express.js
MongoDB (assumed, please confirm your database)
JWT for authentication
Other dependencies (e.g., bcrypt for password hashing, nodemailer for emails, etc.)

Installation

Clone the repository:git clone https://github.com/vinothinikrishnan24/Guvi-login-backend.git


Navigate to the project directory:cd Guvi-login-backend


Install dependencies:npm install


Set up environment variables (see Environment Variables).
Start the server:npm start

The server will run on http://localhost:5000.

API Endpoints



Method
Endpoint
Description



POST
/register
Register a new user


POST
/login
Authenticate a user and return a JWT


POST
/forgot-password
Request a password reset code


POST
/verify-reset-code
Verify the reset code


POST
/reset-password
Reset the user's password


Endpoint Details

POST /register

Description: Registers a new user with email and password.
Request Body:{
  "email": "user@example.com",
  "password": "yourpassword"
}


Response: 
201: User created successfully
400: Invalid input or user already exists




POST /login

Description: Authenticates a user and returns a JWT.
Request Body:{
  "email": "user@example.com",
  "password": "yourpassword"
}


Response:
200: Returns JWT token
401: Invalid credentials




POST /forgot-password

Description: Sends a password reset code to the user's email.
Request Body:{
  "email": "user@example.com"
}


Response:
200: Reset code sent
404: User not found




POST /verify-reset-code

Description: Verifies the reset code sent to the user.
Request Body:{
  "email": "user@example.com",
  "code": "123456"
}


Response:
200: Code verified
400: Invalid or expired code




POST /reset-password

Description: Resets the user's password.
Request Body:{
  "email": "user@example.com",
  "newPassword": "newpassword"
}


Response:
200: Password reset successfully
400: Invalid request





Environment Variables
Create a .env file in the root directory with the following variables:
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
EMAIL_SERVICE=<your-email-service>
EMAIL_USER=<your-email-username>
EMAIL_PASS=<your-email-password>

Usage

Ensure MongoDB (or your chosen database) is running.
Start the server with npm start.
Use tools like Postman or cURL to test the API endpoints.
Example request using cURL:curl -X POST http://localhost:5000/register -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"yourpassword"}'



Contributing

Fork the repository: https://github.com/vinothinikrishnan24/Guvi-login-backend.
Create a new branch (git checkout -b feature-branch).
Commit your changes (git commit -m 'Add some feature').
Push to the branch (git push origin feature-branch).
Open a pull request.

License
This project is licensed under the MIT License.
