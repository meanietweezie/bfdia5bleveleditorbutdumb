const { SlashCommandBuilder,EmbedBuilder,Embed} = require('discord.js');
const path = require("node:path");
const fs = require("node:fs");
let parentPath = String(__dirname).slice(0,String(__dirname).lastIndexOf("src")+3)
let levelPath = path.join(parentPath,"/leveldatafold")
let cooldownPath = path.join(parentPath,"/cooldowndatafold")
module.exports = {
	data: new SlashCommandBuilder()
		.setName("level-set-name")
		.setDescription("Sets name of current level.")
		.addStringOption(option => option.setName("name").setDescription("New name of level.").setMinLength(1).setMaxLength(64).setRequired(true)),
	async execute(interaction) {               
	}
}