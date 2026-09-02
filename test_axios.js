const axios = require('axios');
const FormData = require('form-data');

const instance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  }
});

const fd = new FormData();
fd.append('test', 'value');

// What headers does it send?
instance.post('http://httpbin.org/post', fd).then(res => console.log(res.data.headers)).catch(console.error);
