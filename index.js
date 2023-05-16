const TelegramApi = require('node-telegram-bot-api')
const {numbOptions,againOptions} = require('./options')
const {TG_API_KEY,OAI_API_KEY} = require('./infofile')
const token  = '6178032159:AAEtM_2OzIjWZqs9OJrQiqcjjqYTXdWRc_E'
const iitoken = '12332534534cvbcbcv53453454'

const iimodel = "123"
const iiprompt = "123"
const iimax_tokens = 256

var iichaton = false

const startIi = async (chatId, content) => {
    const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${iitoken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gtp-4",
            messages: [{
                role: "user",
                content: content
            }]
        })
    })
    const data = await response.json()
    console.log(data)
    await bot.sendMessage(chatId, `Ответ - ERROR: ${data.error.code}`);
}

const bot = new TelegramApi(TG_API_KEY, {polling: true})

const chats = {}



const startGame = async(chatId) => {
    await bot.sendMessage(chatId, `Клавиатура`, numbOptions);
}
const start = () => {
    bot.setMyCommands([
        {command:'/start', description: 'Начальное приветствие'},
        {command:'/info', description: 'Информация о пользователе'},
        {command:'/on', description: 'Включить ИИ'},
        {command:'/off', description: 'Отключить ИИ'},
        {command:'/numboard', description: 'Клавиатура'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, `https://tlgrm.ru/_/stickers/348/e30/348e3088-126b-4939-b317-e9036499c515/1.webp`);
            return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот!`);
        }
        if (text === '/info') {
            await bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
            return bot.sendMessage(chatId, `Статус бота ${iichaton} `);
        }
        if (text === '/on') {
            iichaton = true
            return bot.sendMessage(chatId, `ИИ включён`);
        }
        if (text === '/off') {
            iichaton = false
            return bot.sendMessage(chatId, `ИИ откл`);
        }

        if (text === '/numboard') {
            return startGame(chatId);
        }


        if (iichaton == true) {
            await bot.sendMessage(chatId, `Инициализация запроса к ИИ`);
            await startIi(chatId, text)
            return bot.sendMessage(chatId, `- ИИ`);
          //  return bot.sendMessage(chatId, `- ${data.choices.text}`);
        }

        return bot.sendMessage(chatId, `Ты написал мне ${text}`)
    })

bot.on ('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if(data === '/again'){
        return startGame(chatId)
    }
    return bot.sendMessage(chatId, `Ты нажал цифру ${data}`, againOptions)
})

}

start()