// TODO: use the same web auth stuff because we don't want to sign in the currently signed in user, but they should use their school account

console.log(window.origin)


// Initialize google sign in
/*google.accounts.id.initialize({
  client_id: '844813140506-7f1iq6cng76vra5tbqdqp4u8uqa0i5hr.apps.googleusercontent.com',
  callback: handleCredentialResponse
})

// Create the google sign in button
google.accounts.id.renderButton(
  document.getElementById('sign-in-btn'),
  {
    type: 'standard',
    theme: 'filled_blue',
    size: 'large',
    text: 'continue_with',
    shape: 'pill',
  }
)
*/
function handleCredentialResponse({ credential }) {
  console.log('CREDENTIAL: ', credential)
}

function getOAuthUrl() {
  const clientId = encodeURIComponent('844813140506-upjq868ckcms47783pmelqtgqs2s1ft4.apps.googleusercontent.com')
  const redirectUri = encodeURIComponent('https://fkflihjhmgagogpjoanmmjkjakbopabg.chromiumapp.org')
  const responseType = encodeURIComponent('token')
  const scope = encodeURIComponent('openid profile email')
  const prompt = encodeURIComponent('select_account')

  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&prompt=${prompt}`
}


document.getElementById('sign-in').addEventListener('click', () => {
  console.log(getOAuthUrl())
  window.open(getOAuthUrl())
  /*chrome.identity.launchWebAuthFlow({
    url: getOAuthUrl(),
    interactive: true,
  }, (redirectUrl) => {
    console.log(redirectUrl)
  })*/
})

//https://developers.google.com/identity/protocols/oauth2/openid-connect#obtaininguserprofileinformation