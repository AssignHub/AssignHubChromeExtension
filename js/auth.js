/* Constants */
const signInBtn = document.getElementById('sign-in-btn')
const signOutBtn = document.getElementById('sign-out-btn')
const profilePic = document.getElementById('profile-pic')
const profileName = document.getElementById('profile-name')
const profileEmail = document.getElementById('profile-email')
const authSection = document.getElementById('auth-section')
const noAuthSection = document.getElementById('no-auth-section')

/* Function Definitions */
function getOAuthUrl() {
  /* Generates the oauth url and returns it */
  const clientId = encodeURIComponent('844813140506-upjq868ckcms47783pmelqtgqs2s1ft4.apps.googleusercontent.com')
  const redirectUri = encodeURIComponent(chrome.identity.getRedirectURL())
  const responseType = encodeURIComponent('token')
  const scope = encodeURIComponent('openid profile email')
  const prompt = encodeURIComponent('select_account')
  const state = encodeURIComponent(window.socket?.id)

  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&prompt=${prompt}&state=${state}`
}

function updateSignInState() {
  return get('/auth/profile')
    .then((data) => {
      // We are authenticated
      window.userData = data
      const { pic, firstName, lastName, email } = data

      // Update HTML to show user data
      profilePic.src = pic
      profileName.innerHTML = `${firstName} ${lastName}`
      profileEmail.innerHTML = email

      showAuthSection(true)
    })
    .catch(() => {
      // Not authenticated, show sign in button
      showAuthSection(false)
    })
}

function showAuthSection(show) {
  /* Shows/hides the auth and no auth sections (call this based on auth state) */
  authSection.style.display = show ? 'block' : 'none'
  noAuthSection.style.display = show ? 'none' : 'block'
}

/* Event Listeners */
signInBtn.addEventListener('click', () => {
  const w = 400, h = 500

  // Create a popup window with a tab at the oauth url
  chrome.windows.create({
    width: w,
    height: h,
    left: window.screenLeft - w,
    top: window.screenTop,
    type: 'popup',
  }, (popupWindow) => {

    chrome.tabs.create({
      url: getOAuthUrl(),
      windowId: popupWindow.id,
    }, (tab) => {
      window.authTabId = tab.id
    })
  })
})

signOutBtn.addEventListener('click', () => {
  post('/auth/sign-out')
    .then(() => {
      showAuthSection(false)
    })
    .catch(console.error)
})

chrome.tabs.onUpdated.addListener(function authHook(tabId, changeInfo, tab) {
  // If auth window has an access token prop, get the URL, sign in, and close window
  if (
    tabId === window.authTabId && 
    changeInfo.url && 
    changeInfo.url.indexOf(chrome.identity.getRedirectURL()) >= 0 &&
    changeInfo.url.indexOf('access_token=') >= 0
  ) {
    // Sign in to the server
    const hashData = changeInfo.url.substring(changeInfo.url.indexOf('#')+1)
    get(`/auth/sign-in-chrome-ext?${hashData}`).then(() => {
      updateSignInState()
    }).catch(console.error)

    chrome.tabs.remove(tabId)
  }
})

/* Onload */
updateSignInState()