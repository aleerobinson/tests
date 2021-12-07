const Sequelize = require('sequelize');
const {getSequelize} = require('../sequelize');

//Shows that adding a transaction to the select max does not actually stop duplicate ids from being created

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

const transaction_test = {
    options: {
        timestamps: false,
        tableName: 'transaction_test'
    },
    definition: {
        ['id']: {
            allowNull: true,
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: false,
        },
        ['name']: {
            allowNull: true,
            type: Sequelize.STRING(20),
        },
    },
};

const models = {
    transaction_test,
}

const runQuery = async () => {
    const sequelize = await getSequelize('mssql', models);

    return sequelize.transaction(async (transaction) => {
        const max = await sequelize.models.transaction_test.max('id', {transaction, lock: transaction.LOCK});
        const newMax = max + 1;
        const newName = `New-${newMax}`;
        return sequelize.models.transaction_test.create({id: newMax, name: newName}, {transaction, lock: transaction.LOCK});
    })
};

const run = async () => {
    const size = 100;
    const promises = new Array(size).fill(null).map(() => runQuery());
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