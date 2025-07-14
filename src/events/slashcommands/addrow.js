const { SlashCommandBuilder,EmbedBuilder,Embed} = require('discord.js');
const path = require("node:path");
const fs = require("node:fs");
let parentPath = String(__dirname).slice(0,String(__dirname).lastIndexOf("src")+3)
let levelPath = path.join(parentPath,"/leveldatafold")
let cooldownPath = path.join(parentPath,"/cooldowndatafold")
module.exports = {
	data: new SlashCommandBuilder()
		.setName("level-add-roworcolumn")
		.setDescription("Copies contents of given row/column, then adds that copy into that position, pushing others forward.")
        .addStringOption(option => option.setName("whichone").setDescription("Row or column?").setRequired(true).addChoices({name:"row",value:"row"},{name:"column",value:"column"}))
        .addIntegerOption(option => option.setName("position").setDescription("Which position will the row/column be in?").setMinValue(1).setRequired(true)),
	async execute(interaction) {               
	
	}
}