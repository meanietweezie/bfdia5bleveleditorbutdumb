const { SlashCommandBuilder,EmbedBuilder,Embed, MessageFlags, PermissionFlagsBits} = require('discord.js');
const path = require("node:path");
const fs = require("node:fs");
let parentPath = String(__dirname).slice(0,String(__dirname).lastIndexOf("src")+3)
let levelPath = path.join(parentPath,"/leveldatafold")
let cooldownPath = path.join(parentPath,"/cooldowndatafold")
let medals = ["🥇", "🥈" ,"🥉"]
let messageAdditions = {
	row:"row(s) added",
	columns:"column(s) added",
	background:"background change(s)",
	rect:"tile array(s) added",
	tile:"tile(s) added",
	character:"character edit(s) made",
	actions:"total action(s) made",
	dialogue:"dialogue edit(s) made",
	name:"name change(s)"
}
module.exports = {
	data: new SlashCommandBuilder()
		.setName("stats-leaderboard")
		.setDescription("Sends a leaderboard of different user actions.")
		.addStringOption(option => option.setName("specificboard").setRequired(true).setDescription("What should the leaderboard be about?")
		.addChoices(
			{name: 'Total Rows Added ', value: 'Row' },
			{name: 'Total Columns Added ', value: 'Column' },
			{name: 'Total Background Changes', value: 'Background' },
			{name: 'Total Tile Arrays Added', value: 'Rect' },
			{name: 'Total Tiles Added', value: 'Tile' },
			{name: 'Total Character Edits', value: 'Character' },
			{name: 'Total Dialogue Edits', value: 'Dialogue' },
			{name: 'Total Name Changes', value: 'Name' },
			{name: 'All Actions', value: 'Actions' }
		)).addBooleanOption(option => option.setName("onlycommands").setRequired(true).setDescription("Should the leaderboard display only each time the command (true) was run or total changes (false)?")),
	async execute(interaction) {
		interaction.deferReply().then(() => {
			thisCoolPath = path.join(cooldownPath,interaction.guildId +".txt")
			let na = fs.readFileSync(thisCoolPath)
			let cooldownObj = JSON.parse(na)
			let inde = interaction.options.getString("specificboard").toLowerCase()
			let commandsOnly = interaction.options.getBoolean("onlycommands")
			if(commandsOnly && inde != "actions") inde += " Commands"
			let actualTitle = (inde.substring(0, 1).toUpperCase())+inde.substring(1)
			inde = inde.replaceAll(" ","")
			let valuesArray = [];
			for(var i in cooldownObj.statistics.userStatistics) {
				let pushThis = (cooldownObj.statistics.userStatistics[i][inde] == undefined) ? 0 : cooldownObj.statistics.userStatistics[i][inde]
				valuesArray.push({name:i,value:pushThis})
			}
			valuesArray.sort((a,b) => b.value - a.value)
			let toSend = "";
			let rightMessage = messageAdditions[interaction.options.getString("specificboard").toLowerCase()]
			if(commandsOnly) {
				rightMessage = rightMessage.substring(0,rightMessage.lastIndexOf("(s)"))
				rightMessage += " commands ran"
			}
			for(var i = 0; i < valuesArray.length; i++) {
				if(i < 3) toSend += medals[i]
				else toSend += (i+1)
				toSend += `. <@${valuesArray[i].name}> with ${valuesArray[i].value} ${rightMessage} \n`
			}
			if(toSend == "") toSend = "The leaderboard seems to be empty...do you want to be the first to join it?"
			let leaderEmbed = new EmbedBuilder().setTitle(actualTitle + " Leaderboard").setDescription(toSend);
			interaction.editReply({embeds:[leaderEmbed]}).then(setTimeout(() => interaction.deleteReply(), 40_000))
		});
	}
	
}
function checkPerms(member,interactionn) {
    perms = member.permissionsIn(interactionn.channel).has("0x0000000000000020")
    let roleOBJ = member.roles.valueOf();
    rolePerm = false;
    for(let i = 0; i < cooldownObj.managerRoles.length; i ++) {
        if(roleOBJ.get(cooldownObj.managerRoles[i]) != undefined) rolePerm = true;
    }
    let userPerm = cooldownObj.managers.includes(interactionn.user.id)
    return (perms || rolePerm || userPerm)
}