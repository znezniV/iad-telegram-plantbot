// load node module
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const moment = require('moment');

// assign token
const token = process.env.TELEGRAM_BOT_TOKEN;

// add plants
let plantData = JSON.parse(fs.readFileSync('plants_config.json', 'utf8'));

// watching variables
let interval;
const watchFreq = moment.duration({ 'seconds': 10 });

// set emojis
const emoji_Success = emjoiCodeToString('2705');
const emoji_Danger = emjoiCodeToString('274C');
const emoji_Water = emjoiCodeToString('1F4A6');

// create new bot
const bot = new TelegramBot(token, { polling: true });

// any message
bot.on('message', (msg) => {

    let plants = plantData.features;

    // check match with plant name and update water state
    plants.forEach(plant => {
        if (msg.text.toString() === plant.name) {

            waterPlant(plant);
            bot.sendMessage(msg.chat.id, msg.from.first_name + " watered " + plant.name + ".")
        }
    });
});

// start message
bot.onText(/\/start/, (msg) => {

    let plants = plantData.features;

    // init keyboard
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

    // set interval of checking plants
    interval = setInterval(chatId => {

        plantState(chatId);

    }, watchFreq, msg.chat.id);

    // send keyboard shortcuts
    bot.sendMessage(msg.chat.id, "Hi plant lover " + msg.from.first_name, keyboard);

});

// stop running checking plants constantly
bot.onText(/\/stop/, (msg) => {

    clearInterval(interval);
});

// request status of all plants
bot.onText(/\/status/, (msg) => {

    let plants = plantData.features;
    let status = "";

    // generate text for status request
    plants.forEach(value => {

        let diff = moment(value.lastWatered).fromNow();

        status += "*" + value.name + "*: " + (value.fine ? emoji_Success : emoji_Danger) + " Watered " + diff + "\n";

    });

    bot.sendMessage(msg.chat.id, "*Status check:* \n" + status, { parse_mode: "markdown" });

});

function updateWaterDate(plant, time) {
    plant.lastWatered = time;
}

function waterPlant(plant) {
    updateWaterDate(plant, moment.now());

    updatePlantFile(plantData);

    plant.fine = true;
}

// check state of plants
function plantState(chatId) {

    let plants = plantData.features;

    plants.forEach(plant => {

        // check if reminder is needed and generate message
        let freq = moment.duration({ 'days': plant.daysWaterFreq });
        let now = moment().now();

        let timeNotWatered = plant.lastWatered - now;

        if (timeNotWatered >= freq && plant.fine) {
            plant.fine = false;
            updatePlantFile(plantData);
            bot.sendMessage(chatId, plant.name + " needs water.", { parse_mode: "markdown" });
        }
    });
}

function emjoiCodeToString(emoji) {
    return (String.fromCharCode(parseInt(emoji, 16)));
}

function updatePlantFile(data) {
    let newFile = JSON.stringify(data);
    fs.writeFile('./plants_config.json', newFile, 'utf8', function (err) {

        if (err) {
            return console.log(err);
        }

        console.log(moment().format() + " The file was saved!");
    });
}