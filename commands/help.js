const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get some help.'),
		/*.addStringOption(option =>
			option.setName('input')
				.setDescription('The input to echo back')
				.setRequired(true)),*/
	async execute(interaction) {
		const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('select')
					.setPlaceholder('Select a help category...')
					.addOptions([
						{
							label: "💬 Chatbot",
							description: "Main Sector of the bot, deals with intellectual AI voice talking.",
							value: "chatbot"
						},
						{
							label: "☄️ Anime",
							description: "Collect characters, pokemon and much more!",
							value: "anime"
						},
						{
							label: "🛠 Utility",
							description: "Other commands that might not be much use to you.",
							value: "utility"
						}
					])
			)
		await interaction.reply({ content: "Here is your help menu! Select a category to continue.\nTo view a setup tutorial, select the CHATBOT option below.", components: [row]});
	},
};