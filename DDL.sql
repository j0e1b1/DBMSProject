-- Table `hms1`.`appointment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hms1`.`appointment` (
  `id` INT NOT NULL,
  `date` DATE NOT NULL,
  `starttime` TIME NOT NULL,
  `endtime` TIME NOT NULL,
  `status` VARCHAR(15) NOT NULL,
  PRIMARY KEY (`id`));

-- -----------------------------------------------------
-- Table `mydb`.`Lab Test`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hms1`.`LabTest` (
  `Id` INT NOT NULL,
  `name` VARCHAR(30) NULL,
  `Date` DATE NULL,
  `result` TEXT NULL,
  `appointment_id` INT NOT NULL,
  PRIMARY KEY (`Id`),
  INDEX `fk_Lab Test_appointment1_idx` (`appointment_id` ASC) ,
  CONSTRAINT `fk_Lab Test_appointment1`
    FOREIGN KEY (`appointment_id`)
    REFERENCES `hms1`.`appointment` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `hms1`.`patient`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hms1`.`patient` (
  `email` VARCHAR(50) NOT NULL,
  `password` VARCHAR(30) NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `address` VARCHAR(60) NOT NULL,
  `gender` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`email`));


-- -----------------------------------------------------
-- Table `hms1`.`Insurance`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hms1`.`Insurance` (
  `Policy_number` VARCHAR(20) NOT NULL,
  `provider` VARCHAR(30) NULL,
  `coverage_amount` DECIMAL NULL,
  `patient_email` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`Policy_number`),
  INDEX `fk_Insurance_patient1_idx` (`patient_email` ASC) ,
  CONSTRAINT `fk_Insurance_patient1`
    FOREIGN KEY (`patient_email`)
    REFERENCES `hms1`.`patient` (`email`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);


-- -----------------------------------------------------
-- Table `hms1`.`Bill`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hms1`.`Bill` (
  `id` INT NOT NULL,
  `amount` DECIMAL NULL,
  `date` DATE NULL,
  `status` VARCHAR(20) NULL,
  `patient_email` VARCHAR(50) NOT NULL,
  `appointment_id` INT NOT NULL,
  `Insurance_Policy_number` VARCHAR(20) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Bill_patient1_idx` (`patient_email` ASC) ,
  INDEX `fk_Bill_appointment1_idx` (`appointment_id` ASC) ,
  INDEX `fk_Bill_Insurance1_idx` (`Insurance_Policy_number` ASC) ,
  CONSTRAINT `fk_Bill_patient1`
    FOREIGN KEY (`patient_email`)
    REFERENCES `hms1`.`patient` (`email`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Bill_appointment1`
    FOREIGN KEY (`appointment_id`)
    REFERENCES `hms1`.`appointment` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Bill_Insurance1`
    FOREIGN KEY (`Insurance_Policy_number`)
    REFERENCES `hms1`.`Insurance` (`Policy_number`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE);



-- -----------------------------------------------------
-- Table `hms1`.`doctor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hms1`.`doctor` (
  `email` VARCHAR(50) NOT NULL,
  `gender` VARCHAR(20) NOT NULL,
  `password` VARCHAR(30) NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `feeperappointment` INT NOT NULL,
  PRIMARY KEY (`email`));


-- -----------------------------------------------------
-- Table `hms1`.`diagnose`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hms1`.`diagnose` (
  `appt` INT NOT NULL,
  `doctor` VARCHAR(50) NOT NULL,
  `diagnosis` VARCHAR(40) NOT NULL,
  `prescription` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`appt`, `doctor`),
  INDEX `doctor` (`doctor` ASC) ,
  CONSTRAINT `diagnose_ibfk_1`
    FOREIGN KEY (`appt`)
    REFERENCES `hms1`.`appointment` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `diagnose_ibfk_2`
    FOREIGN KEY (`doctor`)
    REFERENCES `hms1`.`doctor` (`email`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);



-- -----------------------------------------------------
-- Table `hms1`.`schedule`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hms1`.`schedule` (
  `id` INT NOT NULL,
  `starttime` TIME NOT NULL,
  `endtime` TIME NOT NULL,
  `breaktime` TIME NOT NULL,
  `day` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`, `starttime`, `endtime`, `breaktime`, `day`));


-- -----------------------------------------------------
-- Table `hms1`.`docshaveschedules`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hms1`.`docshaveschedules` (
  `sched` INT NOT NULL,
  `doctor` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`sched`, `doctor`),
  INDEX `doctor` (`doctor` ASC) ,
  CONSTRAINT `docshaveschedules_ibfk_1`
    FOREIGN KEY (`sched`)
    REFERENCES `hms1`.`schedule` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `docshaveschedules_ibfk_2`
    FOREIGN KEY (`doctor`)
    REFERENCES `hms1`.`doctor` (`email`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);



-- -----------------------------------------------------
-- Table `hms1`.`medicalhistory`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hms1`.`medicalhistory` (
  `id` INT NOT NULL,
  `date` DATE NOT NULL,
  `conditions` VARCHAR(100) NOT NULL,
  `surgeries` VARCHAR(100) NOT NULL,
  `medication` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`));


-- -----------------------------------------------------
-- Table `hms1`.`doctorviewshistory`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hms1`.`doctorviewshistory` (
  `history` INT NOT NULL,
  `doctor` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`history`, `doctor`),
  INDEX `doctor` (`doctor` ASC) ,
  CONSTRAINT `doctorviewshistory_ibfk_1`
    FOREIGN KEY (`doctor`)
    REFERENCES `hms1`.`doctor` (`email`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `doctorviewshistory_ibfk_2`
    FOREIGN KEY (`history`)
    REFERENCES `hms1`.`medicalhistory` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);


-- -----------------------------------------------------
-- Table `hms1`.`patientsattendappointments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hms1`.`patientsattendappointments` (
  `patient` VARCHAR(50) NOT NULL,
  `appt` INT NOT NULL,
  `concerns` VARCHAR(40) NOT NULL,
  `symptoms` VARCHAR(40) NOT NULL,
  PRIMARY KEY (`patient`, `appt`),
  
  CONSTRAINT `patientsattendappointments_ibfk_1`
    FOREIGN KEY (`patient`)
    REFERENCES `hms1`.`patient` (`email`)
    ON DELETE CASCADE,
  CONSTRAINT `patientsattendappointments_ibfk_2`
    FOREIGN KEY (`appt`)
    REFERENCES `hms1`.`appointment` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table `hms1`.`patientsfillhistory`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `hms1`.`patientsfillhistory` (
  `patient` VARCHAR(50) NOT NULL,
  `history` INT NOT NULL,
  PRIMARY KEY (`history`),
  INDEX `patient` (`patient` ASC) ,
  CONSTRAINT `patientsfillhistory_ibfk_1`
    FOREIGN KEY (`patient`)
    REFERENCES `hms1`.`patient` (`email`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `patientsfillhistory_ibfk_2`
    FOREIGN KEY (`history`)
    REFERENCES `hms1`.`medicalhistory` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);