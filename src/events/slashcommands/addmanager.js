const { SlashCommandBuilder,EmbedBuilder,Embed, MessageFlags, PermissionFlagsBits} = require('discord.js');
const path = require("node:path");
const fs = require("node:fs");
let parentPath = String(__dirname).slice(0,String(__dirname).lastIndexOf("src")+3)
let levelPath = path.join(parentPath,"/leveldatafold")
let cooldownPath = path.join(parentPath,"/cooldowndatafold")
module.exports = {
	data: new SlashCommandBuilder()
		.setName("managers")
		.setDescription("Add people to manage the server properties of a bot. Admin-only.")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addRoleOption(option => option.setName("addrole").setDescription("Add role that can manage the bot."))
		.addRoleOption(option => option.setName("removerole").setDescription("Remove role that can manage the bot."))
		.addUserOption(option => option.setName("adduser").setDescription("Add user that can manage the bot."))
		.addUserOption(option => option.setName("removeuser").setDescription("Remove user that can manage the bot.")),
	async execute(interaction) { 
		let cooldownPathHere = path.join(cooldownPath,String(interaction.guildId)+".txt")
		let cooldownObj = JSON.parse(await fs.readFileSync(cooldownPathHere))
		let roleIn = interaction.options.getRole("addrole")
		let roleOut = interaction.options.getRole("removerole")
		let userIn = interaction.options.getUser("adduser")
		let userOut = interaction.options.getUser("removeuser")
		let toSend = "";
		let sendChanges = false;
		interaction.deferReply({flags:MessageFlags.Ephemeral}).then(() => {
			if(roleOut != undefined) {
				let inde = cooldownObj.managerRoles.lastIndexOf(roleOut.id);
				if(inde > -1) {
					cooldownObj.managerRoles.splice(inde,1)
					toSend += `"${roleOut.name}" removed from manager status.\n`
					sendChanges = true;
				}
			}
			if(userOut != undefined) {
				let inde = cooldownObj.managers.lastIndexOf(userOut.id);
				if(inde > -1) {
					cooldownObj.managers.splice(inde,1)
					toSend += `"${userOut.username}" removed from manager status.\n`
					sendChanges = true;
				}
			}
			if(roleIn != undefined) {
				cooldownObj.managerRoles.push(roleIn.id)
				toSend += `"${roleIn.name}" added as manager.\n`
				sendChanges = true;

			}
			if(userIn != undefined) {
				cooldownObj.managers.push(userIn.id)
				toSend += `"${userIn.username}" added as manager.\n`
				sendChanges = true;
			}
			let changeEmbed;
			if(sendChanges) changeEmbed = new EmbedBuilder().setTitle("Changes").setDescription(toSend)
			toSend = "Users\n"
			for(let i = 0; i < cooldownObj.managers.length; i++) {
				toSend += "<@" + cooldownObj.managers[i] + ">\n"
			}
			toSend += "\nRoles\n"
			for(let i = 0; i < cooldownObj.managerRoles.length; i++) {
				toSend += "<@&" + cooldownObj.managerRoles[i] + ">\n"
			}
			let updatedEmbed = new EmbedBuilder().setTitle("Managers").setDescription(toSend)
			let sendThese = [updatedEmbed]
			if(sendChanges) sendThese.push(changeEmbed);
			interaction.editReply({content:"Done! Here is the updated list.",embeds:sendThese,flags:MessageFlags.Ephemeral})
			fs.writeFileSync(cooldownPathHere,JSON.stringify(cooldownObj,null,"\t"))
		});
	}
}
