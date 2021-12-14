/*
    I was asked about chunking where you would only have one spot in code to easily perform the chunk but that spot would only know about one item at a time
    I don't think this would be a good pattern but if you didn't want to refactor complicated code and still needed to chunk this is how i would do it
 */

const getIsWorkerActiveByID = (chunkSize) => {
  return new Array(chunkSize).fill(null).reduce((acc, _, i) => {
    const workerID = i;
    acc[workerID] = false;

    return acc;
  }, {});
};

const getCallbackPromiseByChunkSize = (callbackFunction, chunkSize) => {
  if (typeof callbackFunction !== 'function') {
    throw new Error(
      `callbackFunction Must Be A Function, Received [${JSON.stringify(
        callbackFunction
      )}]`
    );
  }

  if (!Number.isInteger(chunkSize)) {
    throw new Error(
      `chunkSize Must Be An Integer, Received [${JSON.stringify(chunkSize)}]`
    );
  }

  let isWorkerActiveByID = getIsWorkerActiveByID(chunkSize);
  let workQueue = [];

  const startWorker = (workerID) => {
    isWorkerActiveByID[workerID] = true;
    runWorker(workerID);
  };

  const stopWorker = (workerID) => {
    isWorkerActiveByID[workerID] = false;
  };

  //Ensure that a worker is running. If all worker is running that is fine as they would continue to work until the queue is empty
  const startWorkers = () => {
    for (const [workerID, isActive] of Object.entries(isWorkerActiveByID)) {
      if (!isActive) {
        startWorker(workerID);

        //we set 1 worker as available
        return;
      }
    }
  };

  //Runs the worker until no more work exists in the queue
  const runWorker = async (workerID) => {
    const entry = workQueue.pop();
    if (!entry) {
      stopWorker(workerID);

      return;
    }

    const {data, promise} = entry;

    try {
      //Logs for example. Remove when implementing this code
      // console.log(
      //   `Worker [${workerID}] Running Against [${JSON.stringify(data)}]`
      // );
      const response = await callbackFunction(data);
      promise.resolve(response);
    } catch (err) {
      promise.reject(err);
    }

    return runWorker(workerID);
  };

  const getCallbackPromise = (data) => {
    const promise = new Promise((resolve, reject) => {
      workQueue.push({
        data,
        promise: {
          resolve,
          reject,
        },
      });
    });

    startWorkers();
    return promise;
  };

  return {
    getCallbackPromise,
  };
};

module.exports = {
  getCallbackPromiseByChunkSize,
};
