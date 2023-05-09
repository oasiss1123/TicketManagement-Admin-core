const axios = require("axios");

exports.GET = (URL) =>
  new Promise((resolve, reject) => {
    axios
      .get(URL)
      .then((json) => resolve(json))
      .catch((err) => reject(err));
  });

exports.GET = (URL, headers) =>
  new Promise((resolve, reject) => {
    axios
      .get(URL, headers)
      .then((json) => resolve(json))
      .catch((err) => reject(err));
  });

exports.POST = (URL, body) =>
  new Promise((resolve, reject) => {
    axios
      .post(URL, body)
      .then((json) => resolve(json))
      .catch((err) => reject(err));
  });

exports.POST = (URL, body, headers) =>
  new Promise((resolve, reject) => {
    axios
      .post(URL, body, headers)
      .then((json) => resolve(json))
      .catch((err) => reject(err));
  });

/*######################  ######################*/
