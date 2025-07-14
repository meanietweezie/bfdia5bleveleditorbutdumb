const { SlashCommandBuilder,EmbedBuilder,Embed} = require('discord.js');
const path = require("node:path");
const fs = require("node:fs");
let parentPath = String(__dirname).slice(0,String(__dirname).lastIndexOf("src")+3)
let levelPath = path.join(parentPath,"/leveldatafold")
let cooldownPath = path.join(parentPath,"/cooldowndatafold")
module.exports = {
	data: new SlashCommandBuilder()
		.setName("level-add-tilerect")
		.setDescription("Adds an array of tiles to the board.")
		.addSubcommand(subcommand => subcommand
			.setName("new")
			.setDescription("Adds an array of tiles to the board.")
			.addIntegerOption(option => option.setName("xpos").setDescription("Column to start rect in").setMinValue(1).setRequired(true))
			.addIntegerOption(option => option.setName("ypos").setDescription("Row to start rect in").setMinValue(1).setRequired(true))
			.addIntegerOption(option => option.setName("length").setDescription("Length of rectangle").setMinValue(1).setMaxValue(5).setRequired(true))
			.addIntegerOption(option => option.setName("height").setDescription("Height of rectangle").setMinValue(1).setMaxValue(5).setRequired(true))
			.addStringOption(option => option.setName("tile").setDescription("Emoji representing the tile. /help for key.").setMinLength(1).setRequired(true))
		).addSubcommand(subcommand => subcommand
			.setName("copy")
			.setDescription("Copies an existing array of tiles to the board.")
			.addIntegerOption(option => option.setName("xpos").setDescription("Column to start rect in").setMinValue(1).setRequired(true))
			.addIntegerOption(option => option.setName("ypos").setDescription("Row to start rect in").setMinValue(1).setRequired(true))
			.addIntegerOption(option => option.setName("prevxpos").setDescription("X position of the top-left block in the array you want to copy.").setMinValue(1).setRequired(true))
			.addIntegerOption(option => option.setName("prevypos").setDescription("Y position of the top-left block in the array you want to copy.").setMinValue(1).setRequired(true))
			.addIntegerOption(option => option.setName("length").setDescription("Length of rectangle").setMinValue(1).setMaxValue(5).setRequired(true))
			.addIntegerOption(option => option.setName("height").setDescription("Height of rectangle").setMinValue(1).setMaxValue(5).setRequired(true))
			
		)
		,
	async execute(interaction) {               
	}
}