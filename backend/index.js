const express = require('express'); //framework para crear servidor web
const mysql = require('mysql2'); //libreria para conectarse y trabajar con la base de datos MySQL
const cors = require('cors'); // Midleware para permitir solicitudes desde un origen diferente (en este caso desde el frontend react)

const app = express();
const PORT = 3001;

app.use(cors());  //Permite solitiudes CORS (CROSS ORIGIN RESOURCE SHARING)
app.use(express.json());// PERMITE MANEJAR DATOS JSON EN LAS SOLICITUDES

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'UuDdLlRr17.',
  database: 'todo_db'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

app.get('/todos', (req, res) => {
  db.query('SELECT * FROM todos', (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

app.post('/todos', (req, res) => {
  const { task } = req.body;
  db.query('INSERT INTO todos (task) VALUES (?)', [task], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ id: results.insertId, task, completed: false });
  });
});

app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { task, completed } = req.body;
  db.query('UPDATE todos SET task = ?, completed = ? WHERE id = ?', [task, completed, id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ id, task, completed });
  });
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM todos WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ id });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

