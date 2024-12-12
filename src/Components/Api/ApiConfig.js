const apiURL = process.env.REACT_APP_API_URL;

const ApiConfig = {
    niftyAll:  apiURL +  '/api/nifty/fetchniftyalldata',
    nifty500: apiURL + "/api/nifty/fetchnifty500data",
    niftyBank: apiURL + "/api/nifty/fetchniftybankdata",
    niftySecurity: apiURL + "/api/nifty/fetchsecuritiesdata",
    nifty50: apiURL +  "/api/nifty/fetchnifty50data"
} 

export default ApiConfig