const { SlashCommandBuilder,EmbedBuilder,Embed} = require('discord.js');
const path = require("node:path");
const fs = require("node:fs");
let parentPath = String(__dirname).slice(0,String(__dirname).lastIndexOf("src")+3)
let levelPath = path.join(parentPath,"/leveldatafold")
let cooldownPath = path.join(parentPath,"/cooldowndatafold")
module.exports = {
	data: new SlashCommandBuilder()
		.setName("level-reset")
		.setDescription("Sets all tiles of current level to one, and optionally sets height and width.")
		.addStringOption(option => option.setName("tile").setDescription("Emoji representing the tile. /help for key.").setMinLength(1).setRequired(true))
        .addIntegerOption(option => option.setName("width").setDescription("New width of level. Leave blank to stay unchanged.").setMinValue(20))
        .addIntegerOption(option => option.setName("height").setDescription("New height of level. Leave blank to stay unchanged.").setMinValue(18)),
	async execute(interaction) {               
	}
}