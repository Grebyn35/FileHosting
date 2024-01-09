// Function to get query parameters from the URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Retrieve the botId from the query parameters
const botId = getQueryParam('id');



// MESSAGE INPUT
const textarea = document.querySelector('.chatbox-message-input')
const chatboxForm = document.querySelector('.chatbox-message-form')

textarea.addEventListener('input', function () {
    let line = textarea.value.split('\n').length

    if(textarea.rows < 6 || line < 6) {
        textarea.rows = line
    }

    if(textarea.rows > 1) {
        chatboxForm.style.alignItems = 'flex-end'
    } else {
        chatboxForm.style.alignItems = 'center'
    }
})



// TOGGLE CHATBOX
const chatboxToggle = document.querySelector('.chatbox-toggle')
const chatboxMessage = document.querySelector('.chatbox-message-wrapper')

chatboxToggle.addEventListener('click', function () {
    chatboxMessage.classList.toggle('show')
})


// CHATBOX MESSAGE
const chatboxMessageWrapper = document.querySelector('.chatbox-message-content')
const chatboxNoMessage = document.querySelector('.chatbox-message-no-message')

chatboxForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const userMessage = textarea.value.trim();

    if(isValid(userMessage)) {
        writeMessage();
        retrieveReply(userMessage); // Pass the user's message to the function
    }
});



function addZero(num) {
    return num < 10 ? '0'+num : num
}

function writeMessage() {
    const today = new Date()
    let message = `
		<div class="chatbox-message-item sent">
			<span class="chatbox-message-item-text">
				${textarea.value.trim().replace(/\n/g, '<br>\n')}
			</span>
			<span class="chatbox-message-item-time">${addZero(today.getHours())}:${addZero(today.getMinutes())}</span>
		</div>
	`
    chatboxMessageWrapper.insertAdjacentHTML('beforeend', message)
    chatboxForm.style.alignItems = 'center'
    textarea.rows = 1
    textarea.focus()
    textarea.value = ''
    chatboxNoMessage.style.display = 'none'
    scrollBottom()
}

function retrieveReply(userMessage) {
    // Define the API endpoint
    const apiEndpoint = 'https://localhost:8081/submit-message';
    // Set the user ID and message as parameters
    const params = new URLSearchParams({ id: botId, message: userMessage });

    // Make the POST request using fetch
    fetch(apiEndpoint, {
        method: 'POST',
        body: params,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then(response => response.text()) // Assuming the response is plain text
        .then(reply => {
            // Handle the reply here, by calling a function to display the bot's message
            displayBotReply(reply);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function displayBotReply(botMessage) {
    const today = new Date();
    let message = `
		<div class="chatbox-message-item received">
			<span class="chatbox-message-item-text">
				${botMessage}
			</span>
			<span class="chatbox-message-item-time">${addZero(today.getHours())}:${addZero(today.getMinutes())}</span>
		</div>
	`;
    chatboxMessageWrapper.insertAdjacentHTML('beforeend', message);
    scrollBottom();
}

function scrollBottom() {
    chatboxMessageWrapper.scrollTo(0, chatboxMessageWrapper.scrollHeight)
}

function isValid(value) {
    let text = value.replace(/\n/g, '')
    text = text.replace(/\s/g, '')

    return text.length > 0
}
