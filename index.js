// Require the necessary discord.js classes
const { Client, Intents, Collection, MessageEmbed, VoiceState } = require('discord.js');
const {AudioPlayer, AudioPlayerStatus, createAudioPlayer, createAudioResource, StreamType, entersState, VoiceConnectionStatus, joinVoiceChannel, getVoiceConnection, VoiceConnection} = require("@discordjs/voice");
const discordTTS = require("discord-tts");
const { token, mongo_uri } = require('./config.json');
const { join } = require('node:path');
const fs = require("node:fs");
const { translate } = require('free-translate')
//CHATBOT DATA
const Chatbot = require('discord-chatbot')
const chatbot = new Chatbot({name: "Eromin", gender: "Female"})
const request = require('request')
const mongoose = require("mongoose")
// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
const server = require("./models/server");
const { info } = require('node:console');
const { createReadStream } = require('node:fs');
const { errorMonitor } = require('node:events');
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}
client.isReady = true

let audioPlayer = new AudioPlayer()

// When the client is ready, run this code (only once)
client.once('ready', () => {
	mongoose.connect(mongo_uri,
		{
		  useNewUrlParser: true,
		  useUnifiedTopology: true
		}
	  ).then((mong) => {
		console.log(`Connected to mongoose!`)
	  })
	client.user.setActivity(`/help - slash cmds here!!`)
	console.log('Ready!');
});



client.on('interactionCreate', async interaction => {
	if (interaction.isSelectMenu()){
		if (interaction.values == 'chatbot'){
			const chatembed = new MessageEmbed()
			.setColor('#facdf5')
			.setTitle('💬 Welcome to the Chatbot Help Sector!')
			.setDescription('**Here, ALL the Artificial Intelligence Chatbot commands are situated!**\n \n**/talk <text>** -------> This is basically - *talk* <text> and text here means whatever you want me to process! You must be in a joinable VC to execute this!\n**/disconnect** -------> Make the bot disconnect from the VC to stop talking.\n**/setlanguage** -------> Use a country code as an argument to change the LANGUAGE of your chat bot! Run this command without arguments to learn more!\n**/setaccent** -------> Same thing as setlanguage, BUT this changes the accent of the bot! \n**/setchannel** -------> Set a channel to talk in your server.')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp()
			.setFooter(`Bot developed by mikeyy#3692.`)
			interaction.reply({content: "Here is your chatbot help embed!", embeds: [chatembed], ephemeral: true})
		} else if (interaction.values == "anime"){
			const animeEmbed = new MessageEmbed()
			.setColor('#facdf5')
			.setTitle('Welcome to the Anime Help Sector!')
			.setDescription('**UNDER MAINTENANCE FOR SLASH CMDS!! We are sorry!**')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp()
			.setFooter(`Bot developed by mikeyy#3692.`)
			interaction.reply({content: "Here is your anime help embed!", embeds: [animeEmbed], ephemeral: true})
		} else if (interaction.values == "utility"){
			const utilembed = new MessageEmbed()
			.setColor('#facdf5')
			.setTitle('🛠 Welcome to the Utility Help Sector!')
			.setDescription('**UNDER MAINTENANCE FOR SLASH CMDS!! We are sorry!**')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp()
			.setFooter(`Bot developed by mikeyy#3692.`)
			interaction.reply({content: "Here is your utility help embed!", embeds: [utilembed], ephemeral: true})
		}
	}
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;
	if (interaction.commandName == "talk"){
		await interaction.deferReply()
		const userInput = interaction.options.getString('text').toLowerCase()
		console.log(userInput)
		server.findOne({ Server: interaction.guild.id }, async(e, information) => {
			if (information){
				if (interaction.channel.id == information.Channel){
					console.log('Valid channel was talked in.')
					const request = require('request')
					const axios = require('axios')
					const discordTTS = require('discord-tts')
					const swearjar = require('swearjar-extended2')
					const { translate } = require('free-translate')
					if (!interaction.member.voice.channel) return interaction.reply("You must be in a voice channel to chat!")
					if (client.isReady == false) return interaction.reply(`Slow down!! Let me speak first!\nThe cooldown for non premium servers is 5 seconds!\nYour server status: **NOT PREMIUM**\n \nIf that was a legit command you ran, **some rare text are only not converted by me!**`)
					const tips = [
						"To get more cookies, just talk to me and I reward you :-)",
						"You can join our community server by doing s!server in order to participate in giveaways and drops!",
						"Try not to sadden me too much, I give less cookies the less kind you are :((",
						"Did you know you could change languages and accents? [s!help]",
						"Use the japanese language and accent for a higher multiplier!",
						"Check `s!premium` to achieve a premium sub without any cash!",
						"Support Eromin at `s!vote` if you're having fun :pleading_face:",
						"1 + 1 = 3",
						"Change character images through `s!changeimg!`",
						"Battle and upgrade your characters! `s!battleinfo`"
					]
					let tip = tips[Math.floor(Math.random() * tips.length)];
					//if (swearjar.profane(msg.content) === true) return msg.reply("Please do not use that language! :pleading_face:")
					const input = information.Accent || 'en'
					const output = information.Language || 'en'
					if (client.isReady == true && interaction.member.voice.channel){
						
						//msg.channel.send(`The command successfully works.\nCurrent Accent: ${input}\nCurrent Language: ${output}\nReceived Message: ${msg}`)
						//set bot to unready if all checks have passed.
						chatbot.chat(userInput).then(async(response) => {
							let finalResponse;
							const link = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${output}&dt=t&ie=UTF-8&oe=UTF-8&q=${encodeURI(response)}`
							request.get(link, async(error, reply, body) => {
								try{
									let audioPlayer = new AudioPlayer()
									let translation = await JSON.parse(body)
									finalResponse = translation[0][0][0]
									const stream = discordTTS.getVoiceStream(finalResponse, { lang: input })
									const audioResource = createAudioResource(stream, {inputType: StreamType.Arbitrary, inlineVolume: true})
									const voiceConnection = getVoiceConnection(interaction.guildId)
									if(!voiceConnection) return interaction.editReply(`${finalResponse}\nTo enter a voice channel, use /join inside a VC!`)
									//voiceConnection = await entersState(voiceConnection, VoiceConnectionStatus.Connecting, 5_000);
									if (voiceConnection.status === VoiceConnectionStatus.Connected){
										voiceConnection.subscribe(audioPlayer)
										audioPlayer.play(audioResource)
										await interaction.editReply(finalResponse)
									} else {
										await interaction.editReply(`${finalResponse}\nTo enter a voice channel, use /join inside a VC!`)
									}
								} catch(err) {
									console.log(err)
								}
							})
						})
					}
				} else {
					await interaction.editReply(`Please use <#${information.Channel}> for talking to me!`)
				}
			}
		})
	}
	else {
		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

// Login to Discord with your client's token
client.login(token);