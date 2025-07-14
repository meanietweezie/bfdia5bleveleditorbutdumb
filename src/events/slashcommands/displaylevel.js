const { SlashCommandBuilder } = require('discord.js');
const path = require("node:path");
const fs = require("node:fs");
let parentPath = String(__dirname).slice(0,String(__dirname).lastIndexOf("src")+3)
let levelPath = path.join(parentPath,"/leveldatafold")
let cooldownPath = path.join(parentPath,"/cooldowndatafold")
module.exports = {
	data: new SlashCommandBuilder()
		.setName("level-viewandcopy")
		.setDescription("Displays the current level. Also allows to copy the 5b string!!")
		.addBooleanOption(option => option.setName("tiles").setDescription("Display with tiles.").setRequired(true))
		.addBooleanOption(option => option.setName("chars").setDescription("Display with characters.").setRequired(true))
		.addIntegerOption(option => option.setName("tilex").setDescription("What should be the x coodinate of the top left tile?").setMinValue(1))
		.addIntegerOption(option => option.setName("tiley").setDescription("What should be the y coodinate of the top left tile?").setMinValue(1)),
	async execute(interaction) {
	}
}