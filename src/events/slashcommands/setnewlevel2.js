const { SlashCommandBuilder,EmbedBuilder,Embed,MessageFlags,ButtonBuilder,ActionRowBuilder,ButtonStyle} = require('discord.js');
const path = require("node:path");
const fs = require("node:fs");
let parentPath = String(__dirname).slice(0,String(__dirname).lastIndexOf("src")+3)
let levelPath = path.join(parentPath,"/leveldatafold")
let cooldownPath = path.join(parentPath,"/cooldowndatafold")
const stateNames = [null,null,"Deadly and moving.", "Moving.", "Deadly with gravity.", "Carryable.", null, "NPC.", "Rescuable.", "Playable."]
module.exports = {
	data: new SlashCommandBuilder()
		.setName("level-loadstring-regular")
		.setDescription("Allows to load in a new level from an 5b/HTML5b string.")
        .addAttachmentOption(option => option.setName("string").setDescription("The TXT of the level. Make sure it is formatted correctly.")),
	async execute(interaction) {
	}
}