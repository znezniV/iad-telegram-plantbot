// load node module
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const moment = require('moment');

// load token
const loadedToken = require('./token');

// assign token
const token = loadedToken.telegramToken;

// add plants
const plantData = JSON.parse(fs.readFileSync('plants_config.json', 'utf8'));

// watching variables
let isWatching = false;
const watchFreq = moment.duration({ 'minutes': 30 });

// set emojis
const emoji_Success = emjoiCodeToString('2705');
const emoji_Danger = emjoiCodeToString('274C');
const emoji_Water = emjoiCodeToString('1F4A6');

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

    let plants = plantData.features;

    let keyboard = {
        "reply_markup": {
            "keyboard": [
                ["/status"],
                ["/watered_all"]
            ]
        }
    }

    // add plants to keyboard
    plants.forEach(value => {

        keyboard.reply_markup.keyboard.push([value.name]);

    });

    bot.sendMessage(msg.chat.id, "Hi plant lover " + msg.from.first_name, keyboard);

});

bot.onText(/\/watch/, (msg) => {

    isWatching = true;

    // TODO: function that takes isWatching as parameter and recurse only if true 
});

bot.onText(/\/unwatch/, (msg) => {
    isWatching = false;
});

function emjoiCodeToString(emoji) {
    return (String.fromCharCode(parseInt(emoji, 16)));
}
