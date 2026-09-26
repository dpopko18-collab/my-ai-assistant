const API_URL = "http://localhost:8000";

let conversationId = crypto.randomUUID();

const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");
const messages = document.getElementById("messages");
const sendButton = document.getElementById("sendButton");
const newChatButton = document.getElementById("newChatButton");
const status = document.getElementById("status");


function addMessage(text, type) {

    const message = document.createElement("div");

    message.className = `message ${type}`;

    const bubble = document.createElement("div");

    bubble.className = "bubble";

    bubble.textContent = text;

    message.appendChild(bubble);

    messages.appendChild(message);

    messages.scrollTop = messages.scrollHeight;
}


function showTyping() {

    const typing = document.createElement("div");

    typing.id = "typing";

    typing.className = "message ai";

    typing.innerHTML = `
        <div class="bubble typing">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;

    messages.appendChild(typing);

    messages.scrollTop = messages.scrollHeight;
}


function removeTyping() {

    const typing =
        document.getElementById("typing");

    if (typing) {
        typing.remove();
    }
}


function setLoading(loading) {

    sendButton.disabled = loading;

    input.disabled = loading;

    sendButton.textContent =
        loading ? "..." : "Send";
}


async function sendMessage(message) {

    setLoading(true);

    showTyping();

    try {

        const response = await fetch(
            `${API_URL}/chat`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    message: message,
                    conversation_id:
                        conversationId
                })
            }
        );


        if (!response.ok) {

            throw new Error(
                "Server returned an error."
            );

        }


        const data =
            await response.json();


        removeTyping();


        if (data.response) {

            addMessage(
                data.response,
                "ai"
            );

        } else {

            addMessage(
                "I didn't receive a response from the AI.",
                "ai"
            );

        }


    } catch (error) {

        removeTyping();

        console.error(error);

        addMessage(
            "I couldn't connect to the AI server. Make sure the backend is running.",
            "ai"
        );

    }


    setLoading(false);

    input.focus();
}


form.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        const message =
            input.value.trim();

        if (!message) {
            return;
        }


        addMessage(
            message,
            "user"
        );


        input.value = "";


        await sendMessage(message);

    }
);


input.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            form.requestSubmit();

        }

    }
);


newChatButton.addEventListener(
    "click",
    function() {

        conversationId =
            crypto.randomUUID();

        messages.innerHTML = "";

        addMessage(
            "New conversation started. What would you like to work on?",
            "ai"
        );

    }
);


input.addEventListener(
    "input",
    function() {

        input.style.height = "auto";

        input.style.height =
            `${input.scrollHeight}px`;

    }
);
