const serverURL = 'http://localhost:3000'

function get(route) {
  return fetchMethod('GET', route)
}

function post(route, body={}) {
  return fetchMethod('POST', route, body)
}

function patch(route, body={}) {
  return fetchMethod('PATCH', route, body)
}

function _delete(route, body={}) {
  return fetchMethod('DELETE', route, body)
}

function fetchMethod(method, route, body={}) {
  /* Calls the given route with the give method and body */
  const params = {
    method,
    credentials: 'include',
  }

  if (method !== 'GET') {
    // Add params specific to POST/PATCH/DELETE
    params.headers = {
      'Content-Type': 'application/json'
    }
    params.body = JSON.stringify(body)
  }

  return fetch(serverURL + route, params).then(async res => {
    // Parse data if it is json, otherwise just return an empty object
    const text = await res.text()
    try {
      return JSON.parse(text)
    } catch (err) {
      return {}
    }
  }).then(data => {
    // Throw an error if one occurred
    if (data.error)
      throw data.error
    
    return data
  })
}