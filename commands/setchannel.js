const { SlashCommandBuilder } = require('@discordjs/builders');
const { ChannelType } = require('discord-api-types/v10');
const { MessageActionRow, MessageSelectMenu, Permissions, Client } = require("discord.js")
const server = require("../models/server")
module.exports = {
	data: new SlashCommandBuilder()
		.setName('setchannel')
		.setDescription('Set a chat channel.')
		.addChannelOption(option => 
			option
			.setName('destination')
			.setDescription('Select a chatchannel for talking in.')
			.setRequired(true)
			.addChannelTypes(ChannelType.GuildText)
			),
	async execute(interaction) {
		const channel = interaction.options.getChannel('destination');
		if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply('You need to have the ADMINISTRATOR permission to execute this command.')
		const chanid = channel.id
		server.findOne({ Server: interaction.guildId }, async(err, data) => {
			if (data){
				data.Channel = chanid
				await server.findOneAndUpdate({ Server: interaction.guildId }, data)
				interaction.reply(`Your server chat channel is now: <#${chanid}>`)
				interaction.member.guild.channels.cache.get(chanid).send(`This is the new chat channel. Please chat here instead!`)
			} else {
				new server({
					Server: interaction.guildId,
					Language: 'en',
					Accent: 'en',
					Channel: chanid
				}).save()
				interaction.member.guild.channels.cache.get(chanid).send(`This is the new chat channel. Please chat here instead!`)
				interaction.reply(`Your server chat channel is now <#${chanid}>`)
			}
		})
	},
};