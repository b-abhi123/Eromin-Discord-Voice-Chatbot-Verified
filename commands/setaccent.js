const { SlashCommandBuilder } = require('@discordjs/builders');
const { ChannelType } = require('discord-api-types/v10');
const { MessageActionRow, MessageSelectMenu, Permissions, Client } = require("discord.js")
const server = require("../models/server")
const ISO6391 = require('iso-639-1')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('setaccent')
		.setDescription('Set the accent of Eromin.')
		.addStringOption(option => 
			option
			.setName('accent')
			.setDescription('Select an ISO-639-1 Language Code.')
			.setRequired(true)
			),
	async execute(interaction) {
		if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply('You need to have the ADMINISTRATOR permission to execute this command.')
		const accent = interaction.options.getString('accent').toLowerCase()
		const errormsg = `We process your requests through this language code.\nIf you have no idea about what language you want - go into this page! (https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)\nGet the desired code of your language through this.\nRecommened argument: **ja** (pretty cute <3)\n \nThis setting will ONLY change the ACCENT of the particular wordings.\nAlmost all of the languages are available! Just find the specific code that you desire.`
		if (accent.length > 2) return interaction.reply(`An ISO-639-1 code is of 2 letters only. If you are trying to set different types of english accents, such as en-us, that is not possible.\n${errormsg}`)
		const val = ISO6391.validate(accent)
		if (val == false) return interaction.reply(`That is not a valid code!\n${errormsg}`)
		server.findOne({ Server: interaction.guildId }, async(err, data) => {
			if (data){
				data.Accent = accent
				await server.findOneAndUpdate({ Server: interaction.guildId }, data)
				interaction.reply(`Your server accent is now: **${accent}**, i.e. ${ISO6391.getName(accent)}\nPlease set the accent to **en** in order to return to default.`)
			} else {
				new server({
					Server: interaction.guildId,
					Language: 'en',
					Accent: accent,
					Channel: '0000'
				}).save()
				interaction.reply(`Your server accent is now: **${accent}**, i.e. ${ISO6391.getName(accent)}\nPlease set the accent to **en** in order to return to default.`)
			}
		})
	},
};