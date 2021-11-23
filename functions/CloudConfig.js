const devMode = process.env.FUNCTIONS_EMULATOR === 'true';

// local mongodb url
const localDb = "mongodb://localhost:27017/";    

// mongodb hosted on the cloud
// don't currently have one -- might change later
const cloudDb = null;                            

const mongodb = {
  uri: devMode ? localDb : cloudDb,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
};

module.exports = { devMode, mongodb };