const { Client } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection, VoiceConnectionStatus } = require('@discordjs/voice')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('disconnect')
		.setDescription('Disconnect from the voice channel.'),
	async execute(interaction) {
		const voiceConnection = getVoiceConnection(interaction.guildId)
		console.log(voiceConnection._state.status)
        if (!voiceConnection) return interaction.reply('I am not in a voice channel!')
        voiceConnection.disconnect()
        interaction.reply('Successfully left your voice channel, I hope to seeing you soon!')
	},
};