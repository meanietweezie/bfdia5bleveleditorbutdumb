const { SlashCommandBuilder,EmbedBuilder,Embed, MessageFlags, PermissionFlagsBits} = require('discord.js');
const path = require("node:path");
const fs = require("node:fs");
let parentPath = String(__dirname).slice(0,String(__dirname).lastIndexOf("src")+3)
let levelPath = path.join(parentPath,"/leveldatafold")
let cooldownPath = path.join(parentPath,"/cooldowndatafold")
module.exports = {
	data: new SlashCommandBuilder()
		.setName("cooldowns-view")
		.setDescription("View the cooldowns for the bot"),
	async execute(interaction) { 
		interaction.deferReply({flags:MessageFlags.Ephemeral}).then(() => {
			let cooldownPathHere = path.join(cooldownPath,String(interaction.guildId)+".txt")
			let rah = fs.readFileSync(cooldownPathHere)
			let cooldownObj = JSON.parse(rah)
			let cooldowns = cooldownObj.cooldowns;
			let toSend;
			toSend = "## Single User Cooldowns \n"
			toSend += coolGet(cooldowns.tile,"Tile Placing")
			toSend += coolGet(cooldowns.rect,"Tile Array Placing")
			toSend += `${coolGet(cooldowns.rect+cooldowns.copyarr,"Tile Copy Placing").replaceAll("\n","")} total (cooldown is ${coolGet2(cooldowns.copyarr)} + tile array cooldown)\n`
			toSend += coolGet(cooldowns.character,"Character Editing")
			toSend += coolGet(cooldowns.dialogue,"Dialogue Editing")
			toSend += coolGet(cooldowns.row,"Row & Column Adding")
			toSend += "## Server-Wide Cooldowns \n"
			toSend += coolGet(cooldowns.name,"Name Changing")
			toSend += coolGet(cooldowns.background,"Background Changing")
			toSend += "Necessary Death Editing: none lol but who gaf"
			let coolEmbed = new EmbedBuilder().setTitle("Cooldowns").setDescription(toSend);
			interaction.editReply({embeds:[coolEmbed],flags:MessageFlags.Ephemeral})
		});
	}
}
function coolGet(nubmer, type) {
	let minutes = Math.floor(nubmer/60)
	let seconds = nubmer % 60;
	return type + ": " + minutes + " minutes and " + seconds + " seconds\n"
}
function coolGet2(nubmer) {
	let minutes = Math.floor(nubmer/60)
	let seconds = nubmer % 60;
	return minutes + " minutes and " + seconds + " seconds"
}