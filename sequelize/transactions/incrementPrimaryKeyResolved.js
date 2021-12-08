const {getSequelize} = require('../sequelize');

//Shows how we can fix the issue by forcing a read lock on the table when we increment the current max key. This is probably a bad idea to actually use in production code

/*
-- Example SQL

drop table transaction_test;

CREATE TABLE transaction_test
    (
        id        INT NOT NULL,
        name varchar(20) NOT NULL
    );

select * from transaction_test;

insert into transaction_test (id, name) VALUES (1, 'test');

delete from transaction_test;
 */

const runQuery = async (i) => {
  const sequelize = await getSequelize('mssql');

  const query = `
     INSERT transaction_test (id, name)
     SELECT MAX(id) + 1, 'blah' FROM transaction_test WITH (UPDLOCK);
  `;

  const replacements = {value: `name-${i}`};

  return sequelize.query(query, {
    replacements,
  });
};

const run = async () => {
  const size = 100;
  const promises = new Array(size).fill(null).map((_, i) => runQuery(i));
  return Promise.all(promises);
};

(async () => {
  try {
    const res = await run();
    console.log('res', res);
  } catch (err) {
    console.log(err);
  }
})();
