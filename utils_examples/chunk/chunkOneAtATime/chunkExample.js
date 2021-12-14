const {getCallbackPromiseByChunkSize} = require('./chunk');
const {apiAwait} = require('../../../utils/mockApi');
const {getRandomNumberOfSize} = require('../../../utils/random');

/*
 In the middle of a large function that validates phone numbers we needed to start chunking the requests we made to a vendor. Mocked up a twilio phone validation function
 */

const twilioVerify = async (number) => {
  const firstThree = number.substring(0, 3);

  await apiAwait(20);

  //I don't care about the validation but this should result in about half the phone numbers being valid
  if (parseInt(firstThree) < 500) {
    //Adding a delay on valid phone numbers to prove that one long request does not block others from running
    await apiAwait(2000);
    return true;
  }

  return false;
};

const validatePhone = async (number) => {
  if (!number) {
    return false;
  }
  const isValid = await twilioVerify(number);

  return isValid;
};

const chunkSize = 100;
const {getCallbackPromise} = getCallbackPromiseByChunkSize(
  validatePhone,
  chunkSize
);

const validateLead = async ({cellPhone}) => {
  if (!cellPhone) {
    return false;
  }

  return getCallbackPromise(cellPhone);
};

//Generating a number of leads with random cellphones to simulate calls to the validateLead function.
const numberOfLeads = 1_000_000;
const maxCellPhoneNumber = 999_999_9999;
const arrayOfSize = new Array(numberOfLeads).fill(null);
const run = async () => {
  const leads = arrayOfSize.map(() => {
    return {
      cellPhone: getRandomNumberOfSize(maxCellPhoneNumber).toString(),
    };
  });

  console.log('Number Of Leads', leads.length);
  console.time('run');
  const promises = leads.map(async (lead) => validateLead(lead));
  const res = await Promise.all(promises);
  console.timeEnd('run');

  console.log(res);
};

run();
