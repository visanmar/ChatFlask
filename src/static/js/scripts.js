const nicknameText = document.getElementById('nickname')
if (nicknameText) {
    /* chat */
    document.getElementById('myMessage').focus()

    let socket = io()

    cookies = getCookies()

    nickname = cookies['nickname']
    color = cookies['color']

    nicknameText.textContent = nickname

    document.getElementById('myMessage').addEventListener('keydown', evt => {
        if (evt.key == 'Enter' && !evt.shiftKey) {
            evt.preventDefault()
            if (evt.target.value.length > 0) {
                document.getElementById('send').click()
                evt.target.value = ''
            }
        }
    })

    document.getElementById('send').addEventListener('click', () => {
        const mensaje = document.getElementById('myMessage').value.trim()//.replace('\n', '<br>')
        socket.send( `${nickname}\r${color}\r`+ mensaje.replace(/\n/g, '<br>') )
    })

    socket.on('message', mensaje => {
        [sender, col, msg] = mensaje.split('\r')
        mensajeChat = document.createElement('li')
        if (sender == nickname)
            mensajeChat.classList.add('current-user')

        senderChat = document.createElement('div')
        senderChat.classList.add('sender')
        senderChat.style.color = col
        senderChat.textContent = sender.replace('"', '')
        mensajeChat.append(senderChat)

        msgChat = document.createElement('div')
        msgChat.classList.add('message')
        msgChat.innerHTML = msg
        mensajeChat.append(msgChat)

        chatMessages = document.getElementById('messages')
        chatMessages.append(mensajeChat)

        mensajeChat.scrollIntoView();
    })
}
else {
    /* root */
    document.getElementsByName('nickname')[0].select()
}


function getCookies() {
    cookies = {}
    document.cookie.split(';').forEach(cookie => {
        cookie = cookie.trim()
        const [name, value] = cookie.split('=')
        cookies[name] = value
    })
    return cookies
}