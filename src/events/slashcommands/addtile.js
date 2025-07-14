const { SlashCommandBuilder,EmbedBuilder,Embed} = require('discord.js');
const path = require("node:path");
const fs = require("node:fs");
let parentPath = String(__dirname).slice(0,String(__dirname).lastIndexOf("src")+3)
let levelPath = path.join(parentPath,"/leveldatafold")
let cooldownPath = path.join(parentPath,"/cooldowndatafold")
module.exports = {
	data: new SlashCommandBuilder()
		.setName("level-add-tile")
		.setDescription("Adds a new tile to the board.")
		.addIntegerOption(option => option.setName("xpos").setDescription("Column to place tile in").setMinValue(1).setRequired(true))
		.addIntegerOption(option => option.setName("ypos").setDescription("Row to place tile in").setMinValue(1).setRequired(true))
		.addStringOption(option => option.setName("tile").setDescription("Emoji representing the tile. /help for key.").setMinLength(1).setRequired(true)),
	async execute(interaction) {               
	}
}