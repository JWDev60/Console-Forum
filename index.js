const readlineSync = require('readline-sync');
const bcrypt = require('bcrypt');
const db = require('./db');

function hashPassword(password) {
    return bcrypt.hashSync(password, 10);
}

function checkPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
}

function mainMenu() {
    console.log("1: Log In");
    console.log("2: Sign Up");
    console.log("000: Exit");
    const choice = readlineSync.question('Choose an option: ');
    return choice;
}

function userMenu(user) {
    console.log("1: View Forum");
    if (user.tier === 'pro' || user.is_admin) {
        console.log("2: Post to Forum");
    }
    if (user.is_admin) {
        console.log("3: View Notes");
        console.log("4: Reset User Password");
        console.log("5: Edit Notes");
    }
    console.log("000: Log Out");
    const choice = readlineSync.question('Choose an option: ');
    return choice;
}

function logIn() {
    const username = readlineSync.question('Username: ');
    const password = readlineSync.question('Password: ', { hideEchoBack: true });

    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err) throw err;
        if (user && checkPassword(password, user.password)) {
            if (user.reset_password) {
                console.log('You need to reset your password.');
                const newPassword = readlineSync.question('New Password: ', { hideEchoBack: true });
                db.run('UPDATE users SET password = ?, reset_password = 0 WHERE id = ?', [hashPassword(newPassword), user.id], (err) => {
                    if (err) throw err;
                    console.log('Password reset successfully.');
                });
            }
            userSession(user);
        } else {
            console.log('Invalid credentials.');
        }
    });
}

function signUp() {
    const username = readlineSync.question('Choose a username: ');
    const password = readlineSync.question('Choose a password: ', { hideEchoBack: true });
    const description = readlineSync.question('Enter a description: ');
    const tier = readlineSync.question('Choose a tier (basic/pro): ', { limit: ['basic', 'pro'] });
    const hashedPassword = hashPassword(password);

    db.run('INSERT INTO users (username, password, description, tier) VALUES (?, ?, ?, ?)', [username, hashedPassword, description, tier], (err) => {
        if (err) {
            console.error('Error signing up:', err.message);
        } else {
            console.log('Sign up successful.');
        }
    });
}

function userSession(user) {
    while (true) {
        const choice = userMenu(user);
        if (choice === '1') {
            db.all('SELECT f.message, u.username, u.is_admin FROM forum f JOIN users u ON f.user_id = u.id', [], (err, messages) => {
                if (err) throw err;
                messages.forEach((msg) => {
                    const adminTag = msg.is_admin ? ' --[ADMIN]--' : '';
                    console.log(`${msg.username}${adminTag}: ${msg.message}`);
                });
            });
        } else if ((user.tier === 'pro' || user.is_admin) && choice === '2') {
            const message = readlineSync.question('Enter message (max 128 characters): ');
            db.run('INSERT INTO forum (user_id, message) VALUES (?, ?)', [user.id, message], (err) => {
                if (err) throw err;
                console.log('Message posted to forum.');
            });
        } else if (user.is_admin && choice === '3') {
            db.all('SELECT n.id, n.note, u.username FROM notes n JOIN users u ON n.user_id = u.id', [], (err, notes) => {
                if (err) throw err;
                notes.forEach((note) => console.log(`ID: ${note.id}, User: ${note.username}, Note: ${note.note}`));
            });
        } else if (user.is_admin && choice === '4') {
            const username = readlineSync.question('Enter username to reset password: ');
            db.run('UPDATE users SET reset_password = 1 WHERE username = ?', [username], (err) => {
                if (err) throw err;
                console.log('User password reset.');
            });
        } else if (user.is_admin && choice === '5') {
            db.all('SELECT n.id, n.note, u.username FROM notes n JOIN users u ON n.user_id = u.id', [], (err, notes) => {
                if (err) throw err;
                notes.forEach((note) => console.log(`ID: ${note.id}, User: ${note.username}, Note: ${note.note}`));
                const noteId = readlineSync.question('Enter note ID to edit: ');
                const newNote = readlineSync.question('Enter new note: ');
                db.run('UPDATE notes SET note = ? WHERE id = ?', [newNote, noteId], (err) => {
                    if (err) throw err;
                    console.log('Note updated.');
                });
            });
        } else if (choice === '000') {
            console.log('Logged out.');
            break;
        } else {
            console.log('Invalid choice.');
        }
    }
}

function main() {
    while (true) {
        const choice = mainMenu();
        if (choice === '1') {
            logIn();
        } else if (choice === '2') {
            signUp();
        } else if (choice === '000') {
            console.log('Goodbye!');
            break;
        } else {
            console.log('Invalid choice.');
        }
    }
}

main();