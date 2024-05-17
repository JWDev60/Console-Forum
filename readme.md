
# Console Forum

This is a console-based login system built with Node.js, SQLite, and bcrypt. It includes functionalities for user signup, login, and posting to a forum. There are two user tiers: Basic and Pro. Admins have additional capabilities.

## Features

- **User Signup and Login**
- **User Descriptions**
- **Text Sharing Forum**
  - Basic users can view the forum
  - Pro users can view and post to the forum
  - Posts show the username and an `[ADMIN]` tag if posted by an admin
- **Admin Capabilities**
  - View notes
  - Reset user passwords
  - Edit notes

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/JWDev60/Console-Forum
   cd console-forum
   ```

2. **Install the dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npm run setup
   ```

## Usage

Start the application:
```bash
npm start
```

### Main Menu

- **1: Log In**
- **2: Sign Up**
- **000: Exit**

### User Menu

**For Basic and Pro Users:**

- **1: View Forum**
- **000: Log Out**

**For Pro Users:**

- **2: Post to Forum**

**For Admin Users:**

- **3: View Notes**
- **4: Reset User Password**
- **5: Edit Notes**

## Project Structure

```
console-forum/
├── index.js           # Main application logic
├── setup.js           # Setup script to initialize the database
├── db.js              # Database connection handling
├── schema.sql         # SQL schema definition
├── package.json       # Project dependencies and scripts
├── README.md          # Project documentation
```

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.