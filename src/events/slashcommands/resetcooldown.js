<<<<<<< HEAD
const { SlashCommandBuilder,EmbedBuilder,Embed, MessageFlags, PermissionFlagsBits} = require('discord.js');
const path = require("node:path");
const fs = require("node:fs");
let parentPath = String(__dirname).slice(0,String(__dirname).lastIndexOf("src")+3)
let levelPath = path.join(parentPath,"/leveldatafold")
let cooldownPath = path.join(parentPath,"/cooldowndatafold")
module.exports = {
	data: new SlashCommandBuilder()
		.setName("cooldowns-reset")
		.setDescription("Resets cooldowns based on specific options.")
		.addSubcommand(
            subcommand => subcommand.setName("all").setDescription("Resets the cooldown of all users")
        )
        .addSubcommand(
            subcommand => subcommand.setName("user")
            .setDescription("Resets the cooldown of one user")
            .addUserOption(option => option.setName("user")
            .setDescription("Which use do you want to reset the cooldown for?")
            .setRequired(true))
        )
        .addSubcommand(
            subcommand => subcommand.setName("server")
            .setDescription("Resets the cooldown of a server action.")
            .addStringOption(option => option.setName("action")
            .setDescription("Which action do you want to reset the cooldown for?").addChoices(
                {name: 'Name', value: 'name' },
                {name: 'Background', value: 'background' },
                {name: 'Both', value: 'both' }).setRequired(true))
        ),
	async execute(interaction) { 
		interaction.deferReply({flags:MessageFlags.Ephemeral}).then(() => {
            let bus = interaction.options.getSubcommand();
            let userr = interaction.options.getUser("user")
            let userr2 = interaction.options.getMember("user")
            let op = interaction.options.getString("action")
			try{
				thisLevelPath = path.join(levelPath,interaction.guildId +".txt")
				thisCoolPath = path.join(cooldownPath,interaction.guildId +".txt")
				let bah = fs.readFileSync(thisLevelPath);
				let cah = fs.readFileSync(thisCoolPath)
				levelDataObj = JSON.parse(bah);
				cooldownObj = JSON.parse(cah);
			}finally{
				if(checkPerms(interaction.member,interaction)) {
					if(bus == "all") {
                        cooldownObj.users = {};
                        interaction.editReply("all user cooldowns have been reset!")
                        interaction.channel.send("## All cooldowns have been reset!")
                    }else if (bus == "user") {
                        cooldownObj.users[userr.id] = 0;
                        interaction.editReply("cooldown reset!")
                        interaction.channel.send({content:`<@${userr.id}>All cooldowns have been reset!`,flags:MessageFlags.Ephemeral})
                        userr2.send("Your level editing cooldown has been reset in " + interaction.guild.name + ".")
                    }else{
                        if(op == 'both') {
                            cooldownObj.name = 0;
                            cooldownObj.background = 0;
                            interaction.channel.send({content:`<@${interaction.user.id}> has reset the name and background cooldowns!`,flags:MessageFlags.Ephemeral})
                        }else{
                            cooldownObj[op] = 0;
                            interaction.channel.send({content:`<@${interaction.user.id}> has reset the ${op} cooldown!`,flags:MessageFlags.Ephemeral})
                        }
                        interaction.editReply("cooldown reset!")
                    }
					fs.writeFileSync(thisCoolPath,JSON.stringify(cooldownObj,null,'\t'))
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
=======
const { SlashCommandBuilder,EmbedBuilder,Embed, MessageFlags, PermissionFlagsBits} = require('discord.js');
const path = require("node:path");
const fs = require("node:fs");
let parentPath = String(__dirname).slice(0,String(__dirname).lastIndexOf("src")+3)
let levelPath = path.join(parentPath,"/leveldatafold")
let cooldownPath = path.join(parentPath,"/cooldowndatafold")
module.exports = {
	data: new SlashCommandBuilder()
		.setName("cooldowns-reset")
		.setDescription("Resets cooldowns based on specific options.")
		.addSubcommand(
            subcommand => subcommand.setName("all").setDescription("Resets the cooldown of all users")
        )
        .addSubcommand(
            subcommand => subcommand.setName("user")
            .setDescription("Resets the cooldown of one user")
            .addUserOption(option => option.setName("user")
            .setDescription("Which use do you want to reset the cooldown for?")
            .setRequired(true))
        )
        .addSubcommand(
            subcommand => subcommand.setName("server")
            .setDescription("Resets the cooldown of a server action.")
            .addStringOption(option => option.setName("action")
            .setDescription("Which action do you want to reset the cooldown for?").addChoices(
                {name: 'Name', value: 'name' },
                {name: 'Background', value: 'background' },
                {name: 'Both', value: 'both' }).setRequired(true))
        ),
	async execute(interaction) { 
		interaction.deferReply({flags:MessageFlags.Ephemeral}).then(() => {
            let bus = interaction.options.getSubcommand();
            let userr = interaction.options.getUser("user")
            let userr2 = interaction.options.getMember("user")
            let op = interaction.options.getString("action")
			try{
				thisLevelPath = path.join(levelPath,interaction.guildId +".txt")
				thisCoolPath = path.join(cooldownPath,interaction.guildId +".txt")
				let bah = fs.readFileSync(thisLevelPath);
				let cah = fs.readFileSync(thisCoolPath)
				levelDataObj = JSON.parse(bah);
				cooldownObj = JSON.parse(cah);
			}finally{
				if(checkPerms(interaction.member,interaction)) {
					if(bus == "all") {
                        cooldownObj.users = {};
                        interaction.editReply("all user cooldowns have been reset!")
                        interaction.channel.send("## All cooldowns have been reset!")
                    }else if (bus == "user") {
                        cooldownObj.users[userr.id] = 0;
                        interaction.editReply("cooldown reset!")
                        interaction.channel.send({content:`<@${userr.id}>All cooldowns have been reset!`,flags:MessageFlags.Ephemeral})
                        userr2.send("Your level editing cooldown has been reset in " + interaction.guild.name + ".")
                    }else{
                        if(op == 'both') {
                            cooldownObj.name = 0;
                            cooldownObj.background = 0;
                            interaction.channel.send({content:`<@${interaction.user.id}> has reset the name and background cooldowns!`,flags:MessageFlags.Ephemeral})
                        }else{
                            cooldownObj[op] = 0;
                            interaction.channel.send({content:`<@${interaction.user.id}> has reset the ${op} cooldown!`,flags:MessageFlags.Ephemeral})
                        }
                        interaction.editReply("cooldown reset!")
                    }
					fs.writeFileSync(thisCoolPath,JSON.stringify(cooldownObj,null,'\t'))
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
>>>>>>> 60e3670af5bc3abc952ed03913a0429573373b4a
} 