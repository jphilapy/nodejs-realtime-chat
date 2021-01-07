const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocation = document.querySelector('#send-location')

socket.on('message', (message) => {
    console.log(message)
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value;
    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }

        console.log('Message delivered!')
    })
})

$sendLocation.addEventListener('click', () => {

    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    // disable button till we get positive feedback
    $sendLocation.setAttribute('disabled', 'disabled')

    // change text to indicate status
    $sendLocation.textContent = 'Fetching location...'

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            'latitude': position.coords.latitude,
            'longitude': position.coords.longitude
        }, () => {
            console.log('Location shared!')

            // everything works good, enable the button again
            $sendLocation.removeAttribute('disabled')

            // return text to previous state
            $sendLocation.textContent = 'Send location'
        })
    })
})