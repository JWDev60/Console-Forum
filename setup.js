const fs = require('fs');
const db = require('./db');

const schema = fs.readFileSync('schema.sql', 'utf-8');

db.serialize(() => {
    db.exec(schema, (err) => {
        if (err) {
            console.error('Error creating tables:', err);
        } else {
            console.log('Database setup complete.');
        }
    });
});