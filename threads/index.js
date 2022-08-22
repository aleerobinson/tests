const {exec} = require('node:child_process');
const {getSequelize} = require('../sequelize/sequelize');

const createChild = (file) => {
  return exec(`node ${file}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Exec error: ${error}`);
      return;
    }
    console.log(`${stdout}`);
    console.error(`Error: ${stderr}`);
  });
};

const addTestTables = async () => {
  const sequelize = await getSequelize('mssql');

  const query = `
  IF NOT EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'lock_test')
    BEGIN
        CREATE TABLE lock_test
        (
            id          BIGINT IDENTITY PRIMARY KEY,
            workflow_id BIGINT,
        );
    END

IF NOT EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'work_example')
    BEGIN
        CREATE TABLE work_example
        (
            id          BIGINT IDENTITY PRIMARY KEY,
            work_id       BIGINT,
            name    varchar(10),
            is_claimed BIT DEFAULT 0,
        );

        INSERT INTO work_example (work_id, name) values (123, 'blah');
    END

    UPDATE work_example set is_claimed = 0
    DELETE FROM lock_test;
  `;

  return sequelize.query(query);
};

const threadCount = 10;

const arrayOfSize = new Array(threadCount).fill(null);

const run = async () => {
  await addTestTables();

  arrayOfSize.forEach(() => {
    return createChild('threads/save.js');
  });
};

run();
