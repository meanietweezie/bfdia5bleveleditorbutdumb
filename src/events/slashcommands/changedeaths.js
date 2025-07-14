const { SlashCommandBuilder,EmbedBuilder,Embed} = require('discord.js');
const path = require("node:path");
const fs = require("node:fs");
let parentPath = String(__dirname).slice(0,String(__dirname).lastIndexOf("src")+3)
let levelPath = path.join(parentPath,"/leveldatafold")
let cooldownPath = path.join(parentPath,"/cooldowndatafold")
module.exports = {
	data: new SlashCommandBuilder()
		.setName("level-set-deaths")
		.setDescription("Sets necessary deaths of current level.")
		.addIntegerOption(option => option.setName("deathcount").setDescription("Necessary deaths for level").setMinValue(1).setMaxValue(999999).setRequired(true)),
	async execute(interaction) {               
	}
}