// Idea: redirect to google oauth and have the redirect_uri be for a route on assignhub.app. 
// the session param in the google oauth url should be set to the socket id
// Then, authenticate the user with the specified socket id

window.socket = io.connect('http://localhost:3000', {
  path: '/sockets',
  withCredentials: true,
})

socket.on('connect', () => {
  console.log('connected!!', socket.id)
})
socket.on('disconnect', () => {
  console.log('disconnected!!')
})

socket.on('connect_error', (err) => {
  console.log('error', err)
});

console.log('wat')

