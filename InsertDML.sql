INSERT INTO Patient(email,password,name,address,gender)
VALUES
('ramesh@gmail.com','hrishikesh13','Ramesh','Tamil Nadu', 'male'),
('suresh@gmail.com','hrishikesh13','Suresh','Karnataka', 'male'),
('rakesh@gmail.com','hrishikesh13','Rakesh','Gujarat', 'male'),
('alex736@gmail.com','abc1234567','alex s','kerala', 'male'),
('noah123@gmail.com','1234567def','noah','Mumbai', 'male'),
('paul333@gmail.com','creed14798','paul v','kerala', 'male')
;

INSERT INTO MedicalHistory(id,date,conditions,surgeries,medication)
VALUES
(1,'19-01-14','Pain in abdomen','Heart Surgery','Crocin'),
(2,'19-01-14','Frequent Indigestion','none','none'),
(3,'19-01-14','Body Pain','none','Iodex')
;

INSERT INTO Doctor(email, gender, password, name,feeperappointment)
VALUES
('dominic777@gmail.com', 'male', 'fekedf13', 'Mathew Dominic',2000),
('dominic888@gmail.com', 'male', 'flintoff13', 'Mathew Dominic',2000),
('adam111@gmail.com', 'male', 'abcdefghi12', 'adam kahnwald',2000),
('dan321@gmail.com', 'male', 'abcdefghi12', 'dan alex',1500),
('akhil666@gmail.com', 'male', 'afg178921', 'akhil s',3500),
('kyle111@gmail.com', 'male', '12345678cs', 'kyle walker',3000),
('rick1@gmail.com', 'male', 'abcdefgh12', 'rick falor',4000)
;

INSERT INTO Appointment(id,date,starttime,endtime,status)
VALUES
(1, '2019-01-15', '09:00', '10:00', 'Done'),
(2, '2019-01-16', '10:00', '11:00', 'Done'),
(3, '2019-01-18', '14:00', '15:00', 'Done'),
(4, '2024-08-16', '01:00', '2:00', 'NotDone'),
(6, '2024-08-07', '15:21', '16:21', 'NotDone'),
(7, '2024-08-07', '18:18', '19:18', 'NotDone')
;

INSERT INTO PatientsAttendAppointments(patient,appt,concerns,symptoms)
VALUES
('ramesh@gmail.com',1, 'none', 'itchy throat'),
('suresh@gmail.com',2, 'infection', 'fever'),
('rakesh@gmail.com',3, 'nausea', 'fever')
;

INSERT INTO Schedule(id,starttime,endtime,breaktime,day)
VALUES
(001,'09:00','17:00','12:00','Tuesday'),
(001,'09:00','17:00','12:00','Friday'),
(001,'09:00','17:00','12:00','Saturday'),
(001,'09:00','17:00','12:00','Sunday'),
(002,'09:00','17:00','12:00','Wednesday'),
(002,'09:00','17:00','12:00','Friday')
;

INSERT INTO PatientsFillHistory(patient,history)
VALUES
('ramesh@gmail.com', 1),
('suresh@gmail.com', 2),
('rakesh@gmail.com', 3)
;

INSERT INTO Diagnose(appt,doctor,diagnosis,prescription)
VALUES
(1,'dominic777@gmail.com', 'Bloating', 'Ibuprofen as needed'),
(2,'dominic888@gmail.com', 'Muscle soreness', 'Stretch morning/night'),
(3,'dominic888@gmail.com', 'Vitamin Deficiency', 'Good Diet')
;

INSERT INTO DocsHaveSchedules(sched,doctor)
VALUES
(001,'dominic777@gmail.com'),
(002,'dominic888@gmail.com')
;

INSERT INTO DoctorViewsHistory(history,doctor)
VALUES
(1,'dominic777@gmail.com'),
(2,'dominic888@gmail.com'),
(3,'dominic888@gmail.com')
;

INSERT INTO labtest (id,name,Date,result,appointment_id)
VALUES
(1,'blood test','2019-01-20','rbc:normal wbc:normal',3),
(2,'ct scan','2019-01-21','normal',4),
(3,'xray','2019-01-21','shoulder bone fracture',6)
;

INSERT INTO insurance(Policy_number,provider,coverage_amount,patient_email)
VALUES
(202,'New India Assurance',700000,'rakesh@gmail.com'),
(203,'LIC',800000,'suresh@gmail.com'),
(204,'bajaj',800000,'ramesh@gmail.com')
;

INSERT INTO bill(id,amount,date,status,patient_email,appointment_id,policy_no)
VALUES
(200,2000,'2019-01-18','completed','suresh@gmail.com',3,203),
(202,3000,'2024-08-16','completed','rakesh@gmail.com',4,202),
(204,3500,'2024-08-07','not done','rakesh@gmail.com',6,202)
;

