const { Client } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Join your voice channel.'),
	async execute(interaction) {
		const voiceConnection = getVoiceConnection(interaction.guildId)
        if (voiceConnection) {
            voiceConnection.disconnect()
        }
        const newConnection = joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.guildId,
            adapterCreator: interaction.member.guild.voiceAdapterCreator
        })
        interaction.reply('Successfully joined the voice channel, lets have some fun :blush:')
	},
};