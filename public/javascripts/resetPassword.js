const send = document.getElementById('button')
const input = document.getElementById('input')

button.addEventListener('click', () => {
    const span = document.createElement('span')
    span.innerHTML = "Message sent"
    input.appendChild(span);
})