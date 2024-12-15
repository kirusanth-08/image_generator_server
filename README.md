# Node.js User Authentication Template

This repository provides a template for a Node.js application with user authentication using JWT tokens. It follows best practices for security and code organization.

## Features

- User registration
- User login
- Password update
- Email update
- Phone number update
- Account deletion
- JWT-based authentication
- Rate limiting to prevent brute-force attacks
- Secure HTTP headers with Helmet
- Input validation and error handling

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (JSON Web Tokens)
- bcrypt for password hashing
- dotenv for environment variables
- Helmet for security
- HPP for HTTP parameter pollution prevention
- Morgan for logging
- Express-rate-limit for rate limiting

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/kirusanth-08/node-auth-template.git
   cd node-auth-template

2. Install dependencies:
    ```sh
    npm install

3. Create a .env file in the root directory and add the following environment variables:
    ```sh
    PORT=3000
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret

## API Endpoints

### User Registration

- **URL**: `/api/users/v1/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "phoneNumber": "1234567890",
    "password": "yourpassword"
  }
  
### User Login

- **URL**: `/api/users/v1/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }