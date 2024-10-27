const { SlashCommandBuilder } = require('@discordjs/builders');
const { ChannelType } = require('discord-api-types/v10');
const { MessageActionRow, MessageSelectMenu, Permissions, Client, Intents } = require("discord.js")
const { AudioPlayer, createAudioResource, StreamType, entersState, VoiceConnectionStatus, joinVoiceChannel} = require('@discordjs/voice')

const server = require("../models/server")
const ISO6391 = require('iso-639-1')

const discordTTS = require('discord-tts')

let voiceConnection
let audioPlayer = new AudioPlayer()
module.exports = {
	data: new SlashCommandBuilder()
		.setName('talk')
		.setDescription('Talk to Eromin')
		.addStringOption(option => 
			option
			.setName('text')
			.setDescription('What would you like to tell me?')
			.setRequired(true)
			),
};