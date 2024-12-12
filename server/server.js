const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
const port = 5001;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "crud"
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

db.on('error', (err) => {
  console.error('Database error:', err);
});

app.get('/tasks', (req, res) => {
  const sql = "SELECT * FROM task";
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      return res.status(500).json({ message: 'Unexpected error: ' + err });
    }
    return res.json(result);
  });
});

app.get('/get_task/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM task WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error fetching task:', err);
      return res.status(500).json({ message: 'Unexpected error: ' + err });
    }
    return res.json(result[0]);
  });
});

app.post('/edit_user', (req, res) => {
  const { id, Title, Description } = req.body;
  const sql = 'UPDATE task SET Title = ?, Description = ? WHERE id = ?';
  const values = [Title, Description, id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating task:', err);
      return res.status(500).json({ message: 'Unexpected error: ' + err });
    }
    return res.json({ success: 'Task updated successfully' });
  });
});

app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM task WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting task:', err);
      return res.status(500).json({ message: 'Unexpected error: ' + err });
    }
    return res.json({ success: 'Task deleted successfully' });
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
