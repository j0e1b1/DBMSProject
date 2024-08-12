var createError = require('http-errors');
var express = require('express');
var path = require('path');
//Logger that was used for debugging, commented later
// var logger = require('morgan');
var mysql = require('mysql2');
var cors = require('cors');
var port = 3001;

// Connection Info
var con = mysql.createConnection({
  host: 'localhost',
  user: 'rick',
  password: '123456',
  database: 'HMS',
  multipleStatements: true
});

// Connecting To Database
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to MySQL");
});

// Variables to keep state info about who is logged in
var email_in_use = "";
var password_in_use = "";
var who = "";

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Signup, Login, Password Reset Related Queries

// Checks if patient exists in database
app.get('/checkIfPatientExists', (req, res) => {
  let params = req.query;
  let email = params.email;
  let statement = `SELECT * FROM Patient WHERE email = ?`;
  console.log(statement);
  con.query(statement, [email], function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      });
    }
  });
});

// Creates User Account
app.get('/makeAccount', (req, res) => {
  let query = req.query;
  let name = query.name + " " + query.lastname;
  let email = query.email;
  let password = query.password;
  let address = query.address;
  let gender = query.gender;
  let medications = query.medications || "none";
  let conditions = query.conditions || "none";
  let surgeries = query.surgeries || "none";

  let sql_statement = `INSERT INTO Patient (email, password, name, address, gender) VALUES (?, ?, ?, ?, ?)`;
  console.log(sql_statement);
  con.query(sql_statement, [email, password, name, address, gender], function (error, results, fields) {
    if (error) throw error;
    else {
      email_in_use = email;
      password_in_use = password;
      who = "pat";
      res.json({ data: results });
    }
  });

  sql_statement = 'SELECT id FROM MedicalHistory ORDER BY id DESC LIMIT 1;';
  console.log(sql_statement);
  con.query(sql_statement, function (error, results, fields) {
    if (error) throw error;
    else {
      let generated_id = results[0].id + 1;
      sql_statement = `INSERT INTO MedicalHistory (id, date, conditions, surgeries, medication) VALUES (?, curdate(), ?, ?, ?)`;
      console.log(sql_statement);
      con.query(sql_statement, [generated_id, conditions, surgeries, medications], function (error, results, fields) {
        if (error) throw error;
        else {
          sql_statement = `INSERT INTO PatientsFillHistory (patient, history) VALUES (?, ?)`;
          console.log(sql_statement);
          con.query(sql_statement, [email, generated_id], function (error, results, fields) {
            if (error) throw error;
          });
        }
      });
    }
  });
});

// Checks If Doctor Exists
app.get('/checkIfDocExists', (req, res) => {
  let params = req.query;
  let email = params.email;
  let statement = `SELECT * FROM Doctor WHERE email = ?`;
  console.log(statement);
  con.query(statement, [email], function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      });
    }
  });
});

// Makes Doctor Account
app.get('/makeDocAccount', (req, res) => {
  let params = req.query;
  let name = params.name + " " + params.lastname;
  let email = params.email;
  let password = params.password;
  let gender = params.gender;
  let schedule = params.schedule;
  let sql_statement = `INSERT INTO Doctor (email, gender, password, name) VALUES (?, ?, ?, ?)`;
  console.log(sql_statement);
  con.query(sql_statement, [email, gender, password, name], function (error, results, fields) {
    if (error) throw error;
    else {
      sql_statement = `INSERT INTO DocsHaveSchedules (sched, doctor) VALUES (?, ?)`;
      console.log(sql_statement);
      con.query(sql_statement, [schedule, email], function (error) {
        if (error) throw error;
      });
      email_in_use = email;
      password_in_use = password;
      who = 'doc';
      return res.json({ data: results });
    }
  });
});

// Checks if patient is logged in
app.get('/checklogin', (req, res) => {
  let params = req.query;
  let email = params.email;
  let password = params.password;
  let sql_statement = `SELECT * FROM Patient WHERE email = ? AND password = ?`;
  console.log(sql_statement);
  con.query(sql_statement, [email, password], function (error, results, fields) {
    if (error) {
      console.log("error");
      return res.status(500).json({ failed: 'error occurred' });
    } else {
      if (results.length === 0) {
        return res.json({ data: results });
      } else {
        email_in_use = email;
        password_in_use = password;
        who = "pat";
        return res.json({ data: results });
      }
    }
  });
});
// Checks if doctor is logged in
app.get('/checkDoclogin', (req, res) => {
  const params = req.query;
  const email = params.email;
  const password = params.password;
  const sql_statement = `SELECT * FROM Doctor WHERE email="${email}" AND password="${password}"`;
  console.log(sql_statement);
  con.query(sql_statement, (error, results) => {
    if (error) {
      console.log("error");
      return res.status(500).json({ failed: 'error occurred' });
    } else {
      if (results.length === 0) {
      } else {
        email_in_use = results[0].email;
        password_in_use = results[0].password;
        who = "doc";
        console.log(email_in_use);
        console.log(password_in_use);
      }
      res.json({ data: results });
    }
  });
});

// Resets Patient Password
app.post('/resetPasswordPatient', (req, res) => {
  const something = req.query;
  const email = something.email;
  const oldPassword = something.oldPassword;
  const newPassword = something.newPassword;
  const statement = `UPDATE Patient SET password = "${newPassword}" WHERE email = "${email}" AND password = "${oldPassword}";`;
  console.log(statement);
  con.query(statement, (error, results) => {
    if (error) throw error;
    else {
      res.json({ data: results });
    }
  });
});

// Resets Doctor Password
app.post('/resetPasswordDoctor', (req, res) => {
  const something = req.query;
  const email = something.email;
  const oldPassword = something.oldPassword;
  const newPassword = something.newPassword;
  const statement = `UPDATE Doctor SET password = "${newPassword}" WHERE email = "${email}" AND password = "${oldPassword}";`;
  console.log(statement);
  con.query(statement, (error, results) => {
    if (error) throw error;
    else {
      res.json({ data: results });
    }
  });
});

// Returns Who is Logged in
app.get('/userInSession', (req, res) => {
  res.json({ email: `${email_in_use}`, who: `${who}` });
});

// Logs the person out
app.get('/endSession', (req, res) => {
  console.log("Ending session");
  email_in_use = "";
  password_in_use = "";
  res.sendStatus(200);
});

// Appointment Related

// Checks If a similar appointment exists to avoid a clash
app.get('/checkIfApptExists', (req, res) => {
  let cond1, cond2, cond3 = "";
  const params = req.query;
  const email = params.email;
  const doc_email = params.docEmail;
  const startTime = params.startTime;
  const date = params.date;
  const ndate = new Date(date).toLocaleDateString().substring(0, 10);
  const sql_date = `STR_TO_DATE('${ndate}', '%d/%m/%Y')`;
  const sql_start = `CONVERT('${startTime}', TIME)`;
  let statement = `SELECT * FROM PatientsAttendAppointments, Appointment  
                   WHERE patient = "${email}" AND
                   appt = id AND
                   date = ${sql_date} AND
                   starttime = ${sql_start}`;
  console.log(statement);
  con.query(statement, (error, results) => {
    if (error) throw error;
    else {
      cond1 = results;
      statement = `SELECT * FROM Diagnose d INNER JOIN Appointment a 
                   ON d.appt=a.id WHERE doctor="${doc_email}" AND date=${sql_date} AND status="NotDone" 
                   AND ${sql_start} >= starttime AND ${sql_start} < endtime`;
      console.log(statement);
      con.query(statement, (error, results) => {
        if (error) throw error;
        else {
          cond2 = results;
          statement = `SELECT doctor, starttime, endtime, breaktime, day FROM DocsHaveSchedules 
                       INNER JOIN Schedule ON DocsHaveSchedules.sched=Schedule.id
                       WHERE doctor="${doc_email}" AND 
                       day=DAYNAME(${sql_date}) AND 
                       (DATE_ADD(${sql_start},INTERVAL +1 HOUR) <= breaktime OR ${sql_start} >= DATE_ADD(breaktime,INTERVAL +1 HOUR));`;
          console.log(statement);
          con.query(statement, (error, results) => {
            if (error) throw error;
            else {
              if (results.length) {
                results = [];
              } else {
                results = [1];
              }
              res.json({ data: cond1.concat(cond2, results) });
            }
          });
        }
      });
    }
  });
});



//Returns Date/Time of Appointment
app.get('/getDateTimeOfAppt', (req, res) => {
  const { id } = req.query;
  const statement = `SELECT starttime AS start, 
                            endtime AS end, 
                            date AS theDate 
                     FROM Appointment 
                     WHERE id = ?`;
  console.log(statement);
  con.query(statement, [id], (error, results) => {
    if (error) throw error;
    else {
      console.log(JSON.stringify(results));
      return res.json({ data: results });
    }
  });
});

//Patient Info Related

//to get all doctor names
app.get('/docInfo', (req, res) => {
  const statement = 'SELECT * FROM Doctor';
  console.log(statement);
  con.query(statement, (error, results) => {
    if (error) throw error;
    else {
      return res.json({ data: results });
    }
  });
});

// Returns a particular patient's history
app.get('/OneHistory', (req, res) => {
  const { patientEmail: email } = req.query;
  const statement = `SELECT gender, name, email, address, conditions, surgeries, medication
                     FROM PatientsFillHistory, Patient, MedicalHistory
                     WHERE PatientsFillHistory.history = MedicalHistory.id
                     AND PatientsFillHistory.patient = Patient.email
                     AND Patient.email = ?`;
  console.log(statement);
  con.query(statement, [email], (error, results) => {
    if (error) throw error;
    else {
      return res.json({ data: results });
    }
  });
});

// To show all patients whose medical history can be accessed
app.get('/MedHistView', (req, res) => {
  const { name, variable } = req.query;  // 'variable' is not used in the query, if not needed, consider removing it
  const patientName = `%${name}%`;
  let statement = `SELECT name AS 'Name',
                   PatientsFillHistory.history AS 'ID',
                   email FROM Patient, PatientsFillHistory
                   WHERE Patient.email = PatientsFillHistory.patient
                   AND Patient.email IN (SELECT patient FROM PatientsAttendAppointments 
                   NATURAL JOIN Diagnose WHERE doctor = ?)`;

  const params = [email_in_use];

  if (name) {
    statement += " AND Patient.name LIKE ?";
    params.push(patientName);
  }

  console.log(statement);
  con.query(statement, params, (error, results) => {
    if (error) throw error;
    else {
      return res.json({ data: results });
    }
  });
});

//Returns Appointment Info To patient logged In
app.get('/patientViewAppt', (req, res) => {
  const { email } = req.query;
  const statement = `SELECT PatientsAttendAppointments.appt AS ID,
                            PatientsAttendAppointments.patient AS user, 
                            PatientsAttendAppointments.concerns AS theConcerns, 
                            PatientsAttendAppointments.symptoms AS theSymptoms, 
                            Appointment.date AS theDate,
                            Appointment.starttime AS theStart,
                            Appointment.endtime AS theEnd,
                            Appointment.status AS status
                     FROM PatientsAttendAppointments, Appointment
                     WHERE PatientsAttendAppointments.patient = ?
                     AND PatientsAttendAppointments.appt = Appointment.id`;
  console.log(statement);
  con.query(statement, [email], (error, results) => {
    if (error) throw error;
    else {
      return res.json({ data: results });
    }
  });
});

//Checks if history exists
app.get('/checkIfHistory', (req, res) => {
  const { email } = req.query;
  const statement = "SELECT patient FROM PatientsFillHistory WHERE patient = ?";
  console.log(statement);
  con.query(statement, [email], (error, results) => {
    if (error) throw error;
    else {
      return res.json({ data: results });
    }
  });
});

//Adds to PatientsAttendAppointment Table
app.get('/addToPatientSeeAppt', (req, res) => {
  const { email, id: appt_id, concerns, symptoms } = req.query;
  const sql_try = `INSERT INTO PatientsAttendAppointments (patient, appt, concerns, symptoms) 
                   VALUES (?, ?, ?, ?)`;
  console.log(sql_try);
  con.query(sql_try, [email, appt_id, concerns, symptoms], (error, results) => {
    if (error) throw error;
    else {
      return res.json({ data: results });
    }
  });
});


// Schedules Appointment
app.get('/schedule', (req, res) => {
  const { time, date, id, endTime, concerns, symptoms, doc: doctor } = req.query;
  const ndate = new Date(date).toLocaleDateString().substring(0, 10);
  const sql_date = `STR_TO_DATE('${ndate}', '%d/%m/%Y')`;
  const sql_start = `CONVERT('${time}', TIME)`;
  const sql_end = `CONVERT('${endTime}', TIME)`;

  const sql_try = `INSERT INTO Appointment (id, date, starttime, endtime, status) 
                   VALUES (?, ${sql_date}, ${sql_start}, ${sql_end}, 'NotDone')`;
  console.log(sql_try);

  con.query(sql_try, [id], (error, results) => {
    if (error) throw error;
    else {
      const sql_try = `INSERT INTO Diagnose (appt, doctor, diagnosis, prescription) 
                       VALUES (?, ?, 'Not Yet Diagnosed', 'Not Yet Diagnosed')`;
      console.log(sql_try);
      con.query(sql_try, [id, doctor], (error, results) => {
        if (error) throw error;
        else {
          return res.json({ data: results });
        }
      });
    }
  });
});

// Generates ID for appointment
app.get('/genApptUID', (req, res) => {
  const statement = 'SELECT id FROM Appointment ORDER BY id DESC LIMIT 1';
  con.query(statement, (error, results) => {
    if (error) throw error;
    else {
      const generated_id = results[0].id + 1;
      return res.json({ id: `${generated_id}` });
    }
  });
});

// To fill diagnoses
app.get('/diagnose', (req, res) => {
  const { id, diagnosis, prescription } = req.query;
  const statement = `UPDATE Diagnose SET diagnosis=?, prescription=? WHERE appt=?`;
  console.log(statement);
  con.query(statement, [diagnosis, prescription, id], (error, results) => {
    if (error) throw error;
    else {
      const statement = `UPDATE Appointment SET status='Done' WHERE id=?`;
      console.log(statement);
      con.query(statement, [id], (error, results) => {
        if (error) throw error;
      });
    }
  });
});

// To show diagnoses
app.get('/showDiagnoses', (req, res) => {
  const { id } = req.query;
  const statement = `SELECT * FROM Diagnose WHERE appt=?`;
  console.log(statement);
  con.query(statement, [id], (error, results) => {
    if (error) throw error;
    else {
      return res.json({ data: results });
    }
  });
});

// To show appointments to doctor
app.get('/doctorViewAppt', (req, res) => {
  const { email } = req.query;
  const statement = `SELECT a.id, a.date, a.starttime, a.status, p.name, psa.concerns, psa.symptoms
                     FROM Appointment a
                     JOIN PatientsAttendAppointments psa ON a.id = psa.appt
                     JOIN Patient p ON psa.patient = p.email
                     WHERE a.id IN (SELECT appt FROM Diagnose WHERE doctor=?)`;
  console.log(statement);
  con.query(statement, [email_in_use], (error, results) => {
    if (error) throw error;
    else {
      return res.json({ data: results });
    }
  });
});

// To show diagnoses to patient
app.get('/showDiagnoses', (req, res) => {
  const { id } = req.query;
  const statement = `SELECT * FROM Diagnose WHERE appt=?`;
  console.log(statement);
  con.query(statement, [id], (error, results) => {
    if (error) throw error;
    else {
      return res.json({ data: results });
    }
  });
});

// To show all diagnosed appointments till now
app.get('/allDiagnoses', (req, res) => {
  const { patientEmail: email } = req.query;
  const statement = `SELECT date, doctor, concerns, symptoms, diagnosis, prescription 
                     FROM Appointment A
                     JOIN (SELECT * FROM PatientsAttendAppointments NATURAL JOIN Diagnose 
                           WHERE patient=?) AS B ON A.id = B.appt`;
  console.log(statement);
  con.query(statement, [email], (error, results) => {
    if (error) throw error;
    else {
      return res.json({ data: results });
    }
  });
});

// To delete appointment
app.get('/deleteAppt', (req, res) => {
  const { uid } = req.query;
  let statement = `SELECT status FROM Appointment WHERE id=?`;
  console.log(statement);
  con.query(statement, [uid], (error, results) => {
    if (error) throw error;
    else {
      const status = results[0].status;
      if (status === "NotDone") {
        statement = `DELETE FROM Appointment WHERE id=?`;
        console.log(statement);
        con.query(statement, [uid], (error, results) => {
          if (error) throw error;
        });
      } else {
        if (who === "pat") {
          statement = `DELETE FROM PatientsAttendAppointments WHERE appt=?`;
          console.log(statement);
          con.query(statement, [uid], (error, results) => {
            if (error) throw error;
          });
        }
      }
    }
  });
});

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

