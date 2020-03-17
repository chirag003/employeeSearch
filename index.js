var mysql = require('mysql');
const readline = require('readline-sync');
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
var port = '3000'

app.listen(port, () => {
  console.log('\n\nServer started on port '+port);
});


let username = readline.question('Please enter your Database username \n') 
let password = readline.question('Please enter your Database password \n') 

const obj = {
  host: "localhost",
  user: username,  
  password: password 
}

var con = mysql.createConnection(obj);

let dbName = readline.question('Please enter your Database Name \n') 
let createDBQuery = `CREATE DATABASE ${dbName}`

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  con.query(createDBQuery, function (err, result) {
    if (err) throw err;
    console.log("Database created!");
  });
});

obj['database'] = dbName
obj['multipleStatements']= true
let tableName = readline.question('Please enter your Table Name \n')
let createTableQuery = `CREATE TABLE ${tableName}(EmpID int AUTO_INCREMENT, Name VARCHAR(255), Email VARCHAR(255), Salary int , PRIMARY KEY(EmpID))`

console.log(obj)


var db = mysql.createConnection(obj);
db.query(createTableQuery, (err, result) => {
  if (err) throw err;
  console.log('Table created!');
});

app.get('/employees', (req, res) => {
  db.query(`SELECT * FROM ${tableName}`, (err, rows, fields) => {
      if (!err)
          res.send(rows);
      else
          console.log(err);
  })
});

app.get('/createEmployees',(req,res)=>{
res.sendFile(__dirname+'/static/createEmployees.html')
});

app.post('/createEmployees',(req,res)=>{
console.log(req.body)
let emp = {
  "Name": req.body.Name,
  "Email": req.body.email,
  "Salary": req.body.salary
}
  var sql = `INSERT INTO ${tableName} SET ?`
  db.query(sql, emp, (err, rows, fields)=>{
    if(err) throw err;
      else{
        res.send('Added Successfully!');
      }
  })
});

app.get('/getEmployeeDetails',(req,res)=>{
res.sendFile(__dirname+'/static/searchEmployee.html')
})

app.post('/getEmployeeDetails',(req,res)=>{
let emp = req.body
if(emp.option == 'Less than'){
  var sql = `SELECT * FROM ${tableName} WHERE Salary <= ?`;
}
else if(emp.option == 'More than'){
  var sql = `SELECT * FROM ${tableName} WHERE Salary >= ?`;
}
db.query(sql, [emp.salary],(err,rows,fields)=>{
  if(err) throw err;
  else{
        res.send(rows);
      }
})
})

