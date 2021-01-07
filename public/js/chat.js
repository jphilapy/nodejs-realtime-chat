const socket = io()

// socket.on('countUpdated', (count) => {
//     console.log('the count has been updated.', count)
//     // alert(count)
// })

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('clicked')
//     socket.emit('increment')
// })

socket.on('message', (message) => {
    console.log(message)
    // alert(count)
})

document.querySelector('#send-message').addEventListener('click', () => {
    console.log('clicked')
    socket.emit('text', document.getElementById('text').value)
})