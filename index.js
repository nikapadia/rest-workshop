const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('data.db');

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT NOT NULL, age INTEGER, email TEXT)');
});

// Node.js body parsing middleware to parse JSON payload.
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/users', (req, res) => {
    const limit = req.query.limit || -1;
    const offset = req.query.offset || 0;
    db.all('SELECT * FROM users LIMIT ? OFFSET ?', limit, offset, (err, rows) => {
        res.json(rows);
    });
});

app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM users WHERE id = ?', id, (err, row) => {
        if (!row) {
            res.status(404).send('User not found');
            return;
        }
        res.json(row);
    });
});

app.post('/users', (req, res) => {
    console.log(req.body);
    const { name, age, email } = req.body;
    
    if (!name) {
        res.status(400).send('Name is required to create a user');
        return;
    }

    db.run('INSERT INTO users (name, age, email) VALUES (?, ?, ?)', name, age, email, function(err) {
        res.json({ id: this.lastID });
    });
});

/* You probably shouldn't have something like this, I just have it to batch insert some fake data. 
You would probably want to modify your normal POST function to be able to handle an array of JSON objects instead of just one JSON object. */
app.post('/usersBatch', (req, res) => {
    const users = req.body;
    const values = users.map(user => [user.name, user.age, user.email]);

    db.run('BEGIN TRANSACTION');
    const stmt = db.prepare('INSERT INTO users (name, age, email) VALUES (?, ?, ?)');
    values.forEach(user => stmt.run(user));
    stmt.finalize();
    db.run('COMMIT', function(err) {
        res.json({ ids: users.map((user, i) => this.lastID - users.length + i + 1) });
    });
});

app.patch('/users/:id', (req, res) => {
    const id = req.params.id;
    const updates = req.body;

    const fieldsToUpdate = Object.entries(updates).map(([key, value]) => {
        return `${key} = ?`;
    });

    const values = Object.values(updates);
    values.push(id);

    if (!fieldsToUpdate.length) {
        res.status(400).send('No fields to update');
        return;
    }

    const sql = `UPDATE users SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;

    db.run(sql, values, (err) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json({ id });
    });
});

app.put('/users/:id', (req, res) => {
    const id = req.params.id;
    const { name, age, email } = req.body;

    if (!name) {
        res.status(400).send('Name is required to update a user');
        return;
    }
    const finalAge = age !== undefined ? age : null;
    const finalEmail = email !== undefined ? email : null;

    db.run('UPDATE users SET name = ?, age = ?, email = ? WHERE id = ?', name, finalAge, finalEmail, id, (err) => {
        if (this.changes === 0) {
            res.status(404).send('User not found');
            return;
        }
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json({ id });
    });
});

app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM users WHERE id = ?', id, (err) => {
        if (this.changes === 0) {
            res.status(404).send('User not found');
            return;
        }
        if (err) {
            res.status(500).send
            return;
        }
        res.json({ id });
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
