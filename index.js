const fs = require('fs');
const mysql = require('mysql');
const express = require('express');
const service = express();
service.use(express);
const port = 5001;
service.listen(port, () => {
  console.log(`We're live on port ${port}!`);
});

const json = fs.readFileSync('unforget-service/credentials.json', 'utf8');
const credentials = JSON.parse(json);

const connection = mysql.createConnection(credentials);
connection.connect(error => {
  if (error) {
    console.error(error);
    process.exit(1);
  }
});

// turn database info to plaintext
function rowToMemory(row) {
    return {
      id: row.id,
      year: row.year,
      month: row.month,
      day: row.day,
      name: row.name,
      age: row.age,
      photo: row.photo,
    };
  }

// issue queries.
const selectQuery = 'SELECT * FROM birthday';
connection.query(selectQuery, (error, rows) => {
  if (error) {
    console.error(error);
  } else {
    console.log(rows);
  }
});

//getting someones birthday by name
service.get('/birthday/:name', (request, response) => {
    const parameters = [
      parseInt(request.params.name),
    ];
  
    const query = 'SELECT * FROM birthday WHERE name = ? AND is_deleted = 0 ORDER BY year DESC';
    connection.query(query, parameters, (error, rows) => {
      if (error) {
        response.status(500);
        response.json({
          ok: false,
          results: error.message,
        });
      } else {
        const birthday = rows.map(rowToMemory);
        response.json({
          ok: true,
          results: rows.map(rowToMemory),
        });
      }
    });
});

// getting from someones age
service.get('/birthday/:year/:month/:day', (request, response) => {
    const parameters = [
        parseInt(request.params.year),
        parseInt(request.params.month),
        parseInt(request.params.day),
    ];
  
    const query = 'SELECT * FROM birthday WHERE year = ? AND month = ? AND day = ? AND is_deleted = 0 ORDER BY year DESC';
    connection.query(query, parameters, (error, rows) => {
      if (error) {
        response.status(500);
        response.json({
          ok: false,
          results: error.message,
        });
      } else {
        const birthday = rows.map(rowToMemory);
        response.json({
          ok: true,
          results: rows.map(rowToMemory),
        });
      }
    });
});

// getting someone by age
service.get('/birthday/:age', (request, response) => {
    const parameters = [
        parseInt(request.params.age),
    ];
  
    const query = 'SELECT * FROM birthday WHERE age = ? AND is_deleted = 0 ORDER BY year DESC';
    connection.query(query, parameters, (error, rows) => {
      if (error) {
        response.status(500);
        response.json({
          ok: false,
          results: error.message,
        });
      } else {
        const birthday = rows.map(rowToMemory);
        response.json({
          ok: true,
          results: rows.map(rowToMemory),
        });
      }
    });
});

//addig a new birthday
service.post('/birthday', (request, response) => {
    if (request.body.hasOwnProperty('year') &&
        request.body.hasOwnProperty('month') &&
        request.body.hasOwnProperty('day') &&
        request.body.hasOwnProperty('year')) {
  
      const parameters = [
        request.body.year,
        request.body.month,
        request.body.day,
        request.body.name,
        request.body.age,
        request.body.photo,
      ];
  
      const query = 'INSERT INTO birthday(year, month, day, name, age, photo) VALUES (?, ?, ?, ?, ?, ?)';
      connection.query(query, parameters, (error, result) => {
        if (error) {
          response.status(500);
          response.json({
            ok: false,
            results: error.message,
          });
        } else {
          response.json({
            ok: true,
            results: result.insertId,
          });
        }
      });
  
    } else {
      response.status(400);
      response.json({
        ok: false,
        results: 'Incomplete memory.',
      });
    }
  });

// updating a birth day that already exists
service.patch('/birthday/:id', (request, response) => {
    const parameters = [
      request.body.year,
      request.body.month,
      request.body.day,
      request.body.name,
      request.body.age,
      request.body.photo,
      parseInt(request.params.id),
    ];
  
    const query = 'UPDATE birthday SET year = ?, month = ?, day = ?, name = ?, age = ?, photo = ? WHERE id = ?';
    connection.query(query, parameters, (error, result) => {
      if (error) {
        response.status(404);
        response.json({
          ok: false,
          results: error.message,
        });
      } else {
        response.json({
          ok: true,
        });
      }
    });
  });

//deleting birthday by id
service.delete('/birthday/:id', (request, response) => {
    const parameters = [parseInt(request.params.id)];
  
    const query = 'UPDATE birthday SET is_deleted = 1 WHERE id = ?';
    connection.query(query, parameters, (error, result) => {
      if (error) {
        response.status(404);
        response.json({
          ok: false,
          results: error.message,
        });
      } else {
        response.json({
          ok: true,
        });
      }
    });
  });

connection.end();