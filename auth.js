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


document.getElementById('sign-in').addEventListener('click', () => {
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

chrome.tabs.onUpdated.addListener(function authHook(tabId, changeInfo, tab) {
  // If auth window has an access token prop, get the URL, close window and remove listener 
  if (
    tabId === window.authTabId && 
    changeInfo.url && 
    changeInfo.url.indexOf(chrome.identity.getRedirectURL()) >= 0 &&
    changeInfo.url.indexOf('access_token=') >= 0
  ) {
    console.log(changeInfo.url)
    chrome.tabs.remove(tabId)
  }
})