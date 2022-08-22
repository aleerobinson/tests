const {getSequelize} = require('../sequelize/sequelize');

const testId = 123;

const workingQuery = `
INSERT INTO lock_test
    (workflow_id)
select we.work_id from work_example we
    LEFT JOIN lock_test lt ON lt.workflow_id = we.work_id
where name = 'blah' AND lt.id IS NULL;
`;

// Replace query here
const query = workingQuery;

const runWorkingQuery = async (sequelize) => {
  const query = `
    UPDATE work_example
    SET is_claimed = 1
    OUTPUT inserted.work_id as workId
    WHERE name = 'blah'
      AND is_claimed = 0
  `;

  const [[result]] = await sequelize.query(query, {replacements: {id: testId}});

  if (result) {
    console.log(result);
    const {workId} = result;

    const query = `INSERT INTO lock_test (workflow_id) VALUES (:id)`;

    return sequelize.query(query, {replacements: {id: workId}});
  }
};

const runProblemQuery = async (sequelize) => {
  const query = `
    INSERT INTO lock_test
      (workflow_id)
    SELECT we.work_id from work_example we
      LEFT JOIN lock_test lt ON lt.workflow_id = we.work_id
    WHERE name = 'blah' AND lt.id IS NULL;
`;

  return sequelize.query(query, {replacements: {id: testId}});
};

//update test to run here
const testToRun = runProblemQuery;

const getMsDiffToNextMinute = () => {
  const d = new Date();
  const s = d.getSeconds();
  const ms = d.getMilliseconds();

  const sDiff = 60 - s;
  const msDiff = 1000 - ms;

  const sDiffInMs = sDiff * 1000;
  const totalDiff = sDiffInMs + msDiff;

  return totalDiff;
};

const runAtTopOfMinute = async (sequelize) => {
  const ms = getMsDiffToNextMinute();

  return new Promise((resolve) => {
    setTimeout(async () => {
      const res = await testToRun(sequelize);
      console.log(res);
      resolve({success: true});
    }, ms);

    console.log(`Set Timeout For [${ms}] ms`);
  });
};

const run = async () => {
  const sequelize = await getSequelize('mssql');
  runAtTopOfMinute(sequelize);
};

run();
