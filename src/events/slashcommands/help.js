const { SlashCommandBuilder,EmbedBuilder,Embed,MessageFlags,ButtonBuilder,ButtonStyle,ActionRowBuilder} = require('discord.js');
const path = require("node:path");
const fs = require("node:fs");
let parentPath = String(__dirname).slice(0,String(__dirname).lastIndexOf("src")+3)
let levelPath = path.join(parentPath,"/leveldatafold")
let strig = fs.readFileSync(path.join(parentPath,"help.txt"),"utf-8")
let strig2 = String(strig).split("heyyeahcutthestringherelol")
module.exports = {
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("Provides context on the bot and each command."),
	async execute(interaction) {
		let helpEmbed1 = new EmbedBuilder().setTitle("Commands").setDescription(strig2[0])
		let helpEmbed2 = new EmbedBuilder().setTitle("Commands, Cont").setDescription(strig2[1])
		let goButton = new ButtonBuilder().setLabel("Go To 5b Emoji Sheet").setURL("https://docs.google.com/spreadsheets/d/1afmWG-Z2rpXmfCtxHULGIc9ZESr83ZOKayvcVjNon6A/edit?gid=0#gid=0").setStyle(ButtonStyle.Link)
		let buttRow = new ActionRowBuilder().addComponents(goButton)
        await interaction.reply({content:"Hello! this is a Discord 5b level making bot that uses emojis to place tiles.",embeds:[helpEmbed1,helpEmbed2],flags:MessageFlags.Ephemeral,components:[buttRow]})             
	}
}