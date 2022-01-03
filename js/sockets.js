// TODO: check if after auth the socket is associated with the correct user on the server (or if we need to disconnect then reconnect)

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

