'use strict';
const request = require('request')
const moment = require('moment')

/**
 * Environment variables
 */
const API_KEY = process.env.API_KEY

/**
 * Return array of hosted devices
 */
const getDevices = () => {
  return new Promise((resolve, reject) => {
    const url = `https://qwikswitch.com/api/v1/state/${API_KEY}/`
    console.log(url)

    request(url, (err, response, body) => {
      if (err) return reject(err)

      const parsed = JSON.parse(body)
      delete parsed.success

      return resolve(Object.keys(parsed))
    })
  })
}

/**
 * Return device history to determine the device name.
 * TODO this is an API limitation currently, name is not returned under default
 * devices lookup call
 */
const getDeviceHistory = (devices) => {
  const date = moment().format('YYMMDD');

  return new Promise((resolve, reject) => {
    const url = `https://qwikswitch.com/api/v1/history/${API_KEY}/?devices=${devices.join(',')}&date=${date}`
    console.log(url)

    request(url, (err, response, body) => {
      if (err) return reject(err)
      const parsed = JSON.parse(body)

      const lookup = {}

      // Index devices by name instead of ID
      for (var key in parsed) {
        lookup[parsed[key].name.toLowerCase()] = key
      }

      return resolve(lookup)
    })
  })
}

/**
 * Determine device by name
 */
const getDeviceIdByName = (name) => {
  name = name.toLowerCase()

  return getDevices()
    .then(devices => getDeviceHistory(devices))
    .then(devices => {
      if (devices.hasOwnProperty(name)) {
        return devices[name]
      }

      throw new Error('Device not recognized')
    })
}

const toggle = (device, state) => {
  const level = state === 'on' ? 100 : 0

  return new Promise((resolve, reject) => {
     request(`https://qwikswitch.com/api/v1/control/${API_KEY}/?device=${device}&setlevel=${level}`, (err, response, body) => {
      if (err) return reject(err)
      return resolve(true)
    })
  })
}

const resp = (message) => {
  return {
    "speech": message,
    "displayText": message,
    "data": {},
    "contextOut": [],
    "source": "example.com", // TODO real domain
    "followupEvent": {}
  }
}

const lambdaResp = (body, statusCode = 200) => {
  return {
    statusCode: statusCode,
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(body)
  }
}

/**
 * Extract google home parameters
 */
const extract = (event) => {
  const body = JSON.parse(event.body)
  console.log(body)
  return Promise.resolve(body.result.parameters)
}

module.exports.hello = (event, context, callback) => {
  return extract(event)
    .then(parameters => {
      return getDeviceIdByName(parameters.device)
        .then(deviceId => toggle(deviceId, parameters.state))
        .then(() => {
          callback(null, lambdaResp(resp('Done')));
        })
    })
    .catch(err => {
      console.error(err)
      return callback(null, lambdaResp(resp('I do not know how to do this')))
    })
};
