const { SlashCommandBuilder,EmbedBuilder,Embed, MessageFlags, PermissionFlagsBits} = require('discord.js');
const path = require("node:path");
const fs = require("node:fs");
let parentPath = String(__dirname).slice(0,String(__dirname).lastIndexOf("src")+3)
let levelPath = path.join(parentPath,"/leveldatafold")
let cooldownPath = path.join(parentPath,"/cooldowndatafold")
module.exports = {
	data: new SlashCommandBuilder()
		.setName("cooldowns-edit")
		.setDescription("Change cooldowns in the server, all in minutes. Manager or admin only. Use decimals to add seconds.")
		.addNumberOption(option => option.setName("row").setDescription("Change the user cooldown for adding rows and columns.").setMinValue(1))
		.addNumberOption(option => option.setName("rect").setDescription("Change the user cooldown for adding an array of tiles.").setMinValue(1))
		.addNumberOption(option => option.setName("copyarr").setDescription("Change the user cooldown for copying an array of tiles.").setMinValue(1))
		.addNumberOption(option => option.setName("tile").setDescription("Change the user cooldown for adding a tile.").setMinValue(1))
		.addNumberOption(option => option.setName("character").setDescription("Change the user cooldown for editing a character.").setMinValue(1))
		.addNumberOption(option => option.setName("dialogue").setDescription("Change the user cooldown for editing dialogue.").setMinValue(1))
		.addNumberOption(option => option.setName("name").setDescription("Change the server cooldown for setting the name.").setMinValue(1))
		.addNumberOption(option => option.setName("background").setDescription("Change the server cooldown for setting the background.").setMinValue(1)),
	async execute(interaction) { 
		interaction.deferReply({flags:MessageFlags.Ephemeral}).then(() => {
			try{
				thisLevelPath = path.join(levelPath,interaction.guildId +".txt")
				thisCoolPath = path.join(cooldownPath,interaction.guildId +".txt")
				let bah = fs.readFileSync(thisLevelPath);
				let cah = fs.readFileSync(thisCoolPath)
				levelDataObj = JSON.parse(bah);
				cooldownObj = JSON.parse(cah);
			}finally{
				if(checkPerms(interaction.member,interaction)) {
					let ops = interaction.options._hoistedOptions;
					for(var i = 0; i < ops.length; i++) {
						cooldownObj.cooldowns[ops[i].name] = Math.floor(ops[i].value * 60)
					}
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
					interaction.editReply({content:"updated!"});
					interaction.channel.send({embeds:[coolEmbed],content:"<@" + interaction.user.id + "> has updated cooldowns!"})
					fs.writeFileSync(thisCoolPath,JSON.stringify(cooldownObj))
				}else{
					interaction.editReply({content:"You are not authorized to use this command.", flags:MessageFlags.Ephemeral})
				}
				
			}
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