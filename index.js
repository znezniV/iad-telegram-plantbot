// load node module
const TelegramBot = require('node-telegram-bot-api');

// load token
const loadedToken = require('./token');

// assign token
const token = loadedToken.telegramToken;

// create new bot
const bot = new TelegramBot(token, { polling: true });

// test
bot.on('message', (msg) => {

    var hi = "hi";
    if (msg.text.toString().toLowerCase().indexOf(hi) === 0) {
        bot.sendMessage(msg.chat.id, "Hello dear user");
    }

    var bye = "bye";
    if (msg.text.toString().toLowerCase().includes(bye)) {
        bot.sendMessage(msg.chat.id, "Hope to see you around again , Bye");
    }

});

bot.onText(/\/start/, (msg) => {

    bot.sendMessage(msg.chat.id, "Hi plant lover " + msg.from.first_name, {
        "reply_markup": {
            "keyboard": [["Sample text", "Second sample"], ["Keyboard"], ["I'm robot"]]
        }
    });

});