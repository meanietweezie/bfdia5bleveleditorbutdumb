const { SlashCommandBuilder,EmbedBuilder,Embed, MessageFlags, PermissionFlagsBits} = require('discord.js');
const path = require("node:path");
const fs = require("node:fs");
let parentPath = String(__dirname).slice(0,String(__dirname).lastIndexOf("src")+3)
let levelPath = path.join(parentPath,"/leveldatafold")
let cooldownPath = path.join(parentPath,"/cooldowndatafold")
let statisticTypes = ["name","actions","character","row","rect","dialogue","background","tile","column"]
module.exports = {
	data: new SlashCommandBuilder()
		.setName("stats-view")
		.setDescription("Pulls up server-wide statistics")
		.addUserOption(option => option.setName("user").setDescription("Gets statistics from a specific user in the server. Leave blank for server statistics."))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
	async execute(interaction) { 
		interaction.deferReply().then(() => {
			let cooldownPathHere = path.join(cooldownPath,String(interaction.guildId)+".txt")
			let rah = fs.readFileSync(cooldownPathHere)
			let cooldownObj = JSON.parse(rah)
			let userName = interaction.options.getMember("user") != undefined ? (interaction.options.getMember("user").nickname != "null") ? interaction.options.getMember("user").user.globalName : interaction.options.getMember("user").nickname : undefined
			if(userName == undefined && interaction.options.getMember("user") != undefined) userName = interaction.options.getMember("user").user.username;
			let statisticObj = (interaction.options.getUser("user") == undefined) ? cooldownObj.statistics : cooldownObj.statistics.userStatistics[String(interaction.options.getUser("user").id)]
			let toSend = "";
			if(statisticObj != null) {
				for(var i = 0; i<statisticTypes.length;i++) {
					if(statisticObj[statisticTypes[i]] == undefined) {
						statisticObj[statisticTypes[i]] = 0;
						statisticObj[statisticTypes[i]+"Commands"] = 0;
					}
				}
				toSend = "";
				toSend += `${statisticObj.actions} total actions\n`
				toSend += `${statisticObj.name} name changes \n`
				toSend += `${statisticObj.background} background changes \n`
				toSend += `${statisticObj.dialogue} dialogue edits across ${statisticObj.dialogueCommands} command runs\n`
				toSend += `${statisticObj.character} character edits across ${statisticObj.characterCommands} command runs\n`
				toSend += `${statisticObj.tile} tiles added across ${statisticObj.tileCommands} tile command runs and ${statisticObj.rectCommands} tile array command runs\n`
				toSend += `${statisticObj.row} rows added and ${statisticObj.column} columns added\n`
			}else{
				toSend = "dawg there's nothing here. do something. so boring. smh. i'm dissapointed tee bee aytch";
			}
			let titleThing = (interaction.options.getUser("user") == undefined) ? "Server" : userName + "'s"
			let statEmbed = new EmbedBuilder().setTitle(titleThing+" Info").setDescription(toSend)
			interaction.editReply({embeds:[statEmbed]}).then(setTimeout(() => interaction.deleteReply(), 30_000))
		});
	}
}