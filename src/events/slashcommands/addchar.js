const { SlashCommandBuilder,EmbedBuilder,Embed,MessageFlags,ButtonBuilder,ActionRowBuilder,ButtonStyle} = require('discord.js');
const path = require("node:path");
const fs = require("node:fs");
let parentPath = String(__dirname).slice(0,String(__dirname).lastIndexOf("src")+3)
let levelPath = path.join(parentPath,"/leveldatafold")
let cooldownPath = path.join(parentPath,"/cooldowndatafold")
let cooldownObj;
const charNames = [
    "Ruby","Book","Ice Cube","Match","Pencil","Bubble","Lego Brick","Waffle","Tune","","","","","","","","","","","","","","","","","","","","","","","","","","","HPRC (Wide)","HPRC (Thin)","Crate","Metal Box","Small Gray Platform","Large Spike Ball","Package","Companion Cube","Rusty Apparatus","Purple Enemy","Saw Blade","Small Spike Ball","Metal Pillar","Large Gray Platform","Spinning Blue Spike Ball","Epic Acid Monster","Small Acid Covered Platform","Gold Platform","Green Block","Blue Block","Wall of Spikes"
]
const charEmojis = [
    "💎","📓","🧊","🧨","✏️","🫧","🏭","🧇","🎶","🔲","","","","","","","","","","","","","","","","","","","","","","","","","","⌨️","🖨️","💼","🧰","🕳️","🔆","📦","💟","🔱","👿","⚙️","🔅","🧂","➖","*️⃣","🤢","🤮","🚧","💵","💶","⚔️"
]
function checkEmoji(emojiString) {
    for(let i = 0; i < charEmojis.length; i++) {
        if(emojiString == charEmojis[i]) return i+1;
    }
    return false;
}
const emojiRegE = /\p{Extended_Pictographic}|\p{Regional_Indicator}|\p{RGI_Emoji}/v
const stateNames = [null,null,"Deadly and moving", "Moving", "Deadly with gravity", "Carryable", null, "Non-playable character", "Rescuable", "Playable"]
module.exports = {
	data: new SlashCommandBuilder()
		.setName("char-edit")
        .setDescription("stuff")
        .addSubcommand(
            subcommand => subcommand.setName("new").setDescription("Adds a new character.")
            .addStringOption(option => option.setName("emoji").setDescription("Emoji of the new character identity").setMinLength(1).setRequired(true))
            .addIntegerOption(option => option.setName("xpos").setDescription("The new x position of the character").setMinValue(1).setRequired(true))
            .addIntegerOption(option => option.setName("ypos").setDescription("The new y position of the character").setMinValue(1).setRequired(true))
            .addStringOption(option => option.setName("state").setDescription("The new state of the character").setRequired(true)
            .addChoices(
                {name: 'Deadly and Moving', value: '3' },
                {name: 'Regular Moving', value: '4' },
                {name: 'Deadly', value: '5' },
                {name: 'Carryable', value: '6' },
                {name: 'NPC', value: '8' },
                {name: 'Rescuable', value: '9' },
                {name: 'Playable', value: '10' }))
            .addIntegerOption(option => option.setName("speed").setDescription("The speed of the character.").setMinValue(1).setMaxValue(99).setRequired(true))
        )
        .addSubcommand(
            subcommand => subcommand.setName("existing").setDescription("Edits an existing character.")
            .addIntegerOption(option => option.setName("charnum").setDescription("Which level character do you want to change?").setMinValue(1).setRequired(true))
            .addStringOption(option => option.setName("emoji").setDescription("Emoji of the new character identity").setMinLength(1))
            .addIntegerOption(option => option.setName("xpos").setDescription("The new x position of the character").setMinValue(1))
            .addIntegerOption(option => option.setName("ypos").setDescription("The new y position of the character").setMinValue(1))
            .addStringOption(option => option.setName("state").setDescription("The new state of the character")
            .addChoices(
                {name: 'Deadly and Moving', value: '3' },
                {name: 'Regular Moving', value: '4' },
                {name: 'Deadly', value: '5' },
                {name: 'Carryable', value: '6' },
                {name: 'NPC', value: '8' },
                {name: 'Rescuable', value: '9' },
                {name: 'Playable', value: '10' }))
            .addIntegerOption(option => option.setName("speed").setDescription("The speed of the character.").setMinValue(1).setMaxValue(99))
        ),
	async execute(interaction) {
        let thisLevelPath;
        let thisCoolPath;
        let levelDataObj;
        let charnum = interaction.options.getInteger("charnum")
        let emoji = String(interaction.options.getString("emoji"))
        let xpos = interaction.options.getInteger("xpos")
        let ypos = interaction.options.getInteger("ypos")
        let state = interaction.options.getString("state")
        let speed = interaction.options.getInteger("speed")
        interaction.deferReply({flags:MessageFlags.Ephemeral}).then(() => {
            try{
                thisLevelPath = path.join(levelPath,interaction.guildId +".txt")
                thisCoolPath = path.join(cooldownPath,interaction.guildId +".txt")
                let bah = fs.readFileSync(thisLevelPath);
                let cah = fs.readFileSync(thisCoolPath)
                levelDataObj = JSON.parse(bah);
                cooldownObj = JSON.parse(cah);
            }finally{
                let timeLeft = (cooldownObj.users[interaction.user.id] != undefined) ? Math.floor(Date.now() / 1000) - cooldownObj.users[interaction.user.id] : 0;
                if(timeLeft < 0 && !checkPerms(interaction.member,interaction)) {
                    interaction.editReply({content:"Too soon! Wait `" + formSec(-timeLeft) + " until you can do another action.",flags:MessageFlags.Ephemeral})
                }else{
                    if(charnum == undefined && (emoji == undefined || xpos == undefined || ypos == undefined || state == undefined || (speed == undefined && (state == 3 || state == 4)))) {
                        interaction.editReply({content:"Operation invalid! For adding non-moving character, all properties except speed are required. For moving characters all properties are required.",flags:MessageFlags.Ephemeral})
                    }else{
                        let emojiIndex = emoji.search(emojiRegE)
                        let idthig = interaction.guildId;
                        if(emojiIndex == -1 && interaction.options.getString("emoji") != undefined) {
                            interaction.editReply("please send a string with an actual emoji in it")
                        }else{
                            let emojiStrig;
                            if(interaction.options.getString("emoji") != undefined) emojiStrig = emoji.match(emojiRegE).input;
                            let numberThing = (interaction.options.getString("emoji") == undefined) ? true : checkEmoji(emojiStrig)
                            if(numberThing) {
                                if(ypos > levelDataObj.levelData.length) {
                                    interaction.editReply("The y position is out of range!") 
                                }else if(xpos > levelDataObj.levelData[0].length) {
                                    interaction.editReply("The x position is out of range!")    
                                }else if(charnum == undefined && levelDataObj.charData.length >= 50) {
                                    interaction.editReply("No more than 50 characters are allowed!")    
                                }{
                                    let indexCheck = (charnum != undefined) ? charnum - 1: levelDataObj.charData.push(new Object())-1
                                    let changeAmt = 0;
                                    if(indexCheck > levelDataObj.charData.length) interaction.editReply({content:"This character doesn't exist! To add one, leave the 'charnum' value empty.",flags:MessageFlags.Ephemeral})
                                    else{
                                        let changed = ""
                                        if(charnum == undefined) {
                                            changed += `Character ${indexCheck+1} was added\n`
                                            levelDataObj.charData[indexCheck].movementData = [];
                                            changeAmt++
                                        }
                                        if(interaction.options.getString("emoji") != undefined && levelDataObj.charData[indexCheck].id != numberThing - 1) {
                                            levelDataObj.charData[indexCheck].id = numberThing - 1;
                                            changed += `Character ${indexCheck+1}'s identity is now ${charNames[numberThing - 1]}\n`
                                            changeAmt++
                                        }
                                        if(state != undefined && levelDataObj.charData[indexCheck].charstate != state) {
                                            levelDataObj.charData[indexCheck].charstate = state;
                                            changed += `Character ${indexCheck+1}'s state is now ${stateNames[state-1].toLowerCase()}\n`
                                            changeAmt++
                                        }
                                        if(xpos != undefined && levelDataObj.charData[indexCheck].xpos != xpos) {
                                            levelDataObj.charData[indexCheck].xpos = xpos;
                                            changed += `Character ${indexCheck+1}'s x position is now ${xpos}\n`
                                            changeAmt++
                                        }
                                        if(ypos != undefined && levelDataObj.charData[indexCheck].ypos != ypos) {
                                            levelDataObj.charData[indexCheck].ypos = ypos;
                                            changed += `Character ${indexCheck+1}'s y position is now ${ypos}\n`
                                            changeAmt++
                                        }
                                        if(speed != undefined) {
                                            levelDataObj.charData[indexCheck].speed = speed;
                                            changed += `Character ${indexCheck+1}'s speed is now ${speed} frames per tile\n`
                                            changeAmt++
                                        }else{
                                            if(charnum == undefined) levelDataObj.charData[indexCheck].speed = 10;
                                        }
                                        try{
                                            let toSend = "";
                                            for(let i = 0; i < levelDataObj.charData.length; i++) {
                                                toSend += "`Character " 
                                                + (i+1) + ": " 
                                                + charNames[levelDataObj.charData[i].id] 
                                                + " " + charEmojis[levelDataObj.charData[i].id] 
                                                +  ", positioned at " + levelDataObj.charData[i].xpos 
                                                + " by " 
                                                + levelDataObj.charData[i].ypos 
                                                + ". " + stateNames[levelDataObj.charData[i].charstate-1] 
                                                + ((levelDataObj.charData[i].charstate == 3 || levelDataObj.charData[i].charstate == 4) ? ` at a speed of ${levelDataObj.charData[i].speed} frames per tile` : "") + ".`\n";
                                            }

                                            let embedTest = new EmbedBuilder().setTitle("Characters").setDescription(toSend)
                                            let embedTest2 = new EmbedBuilder().setTitle("Changes").setDescription(changed)
                                            interaction.channel.send({content:`<@${interaction.user.id}> changed/added a character!`,embeds:[embedTest,embedTest2]})
                                            interaction.editReply({content:"character changed/added!",flags:MessageFlags.Ephemeral})
                                            cooldownObj = markStatistic(interaction.user.id,"character",cooldownObj,changeAmt);
                                            cooldownObj.users[interaction.user.id] = Math.floor(Date.now() / 1000) + cooldownObj.cooldowns["character"];     
                                            
                                        }catch(error){
                                            console.log(error)
                                        }finally{
                                            fs.writeFileSync(thisLevelPath,JSON.stringify(levelDataObj))  
                                            fs.writeFileSync(thisCoolPath,JSON.stringify(cooldownObj))   
                                        }
                                    }
                                }
                            }else{
                                interaction.editReply("invalid emoji! check with key to make sure you're placing a correct one")
                            }
                        } 
                    }
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
function formSec(nubmer) {
	let minutes = Math.floor(nubmer/60)
	let seconds = nubmer % 60;
	return minutes + " minutes and " + seconds + " seconds"
}
function markStatistic(user,type,obj,editNum) {
    if(obj.statistics.userStatistics[user] == undefined) {
        obj.statistics.userStatistics[user] = new Object();
    }
    if(obj.statistics.userStatistics[user][type] == undefined) {
        obj.statistics.userStatistics[user][type] = 0;
    }
    if(obj.statistics.userStatistics[user][type+"Commands"] == undefined) {
        obj.statistics.userStatistics[user][type+"Commands"] = 0;
    }
    obj.statistics.userStatistics[user][type]+=editNum;
    if(type == "tile" && editNum > 1) {
        if(obj.statistics.userStatistics[user]['rect'] == undefined) {
            obj.statistics.userStatistics[user]['rect'] = 0;
            
        }
        if(obj.statistics.userStatistics[user]['rectCommands'] == undefined) {
            obj.statistics.userStatistics[user]['rectCommands'] = 0;
            
        }
        obj.statistics["rect"]++;
        obj.statistics.userStatistics[user]["rect"]++;
        obj.statistics.userStatistics[user]["rectCommands"]++;
    }else{
        obj.statistics.userStatistics[user][type+"Commands"]++;
    }
    obj.statistics[type]+=editNum;
    if(obj.statistics[type+"Commands"] == undefined) obj.statistics[type+"Commands"] = 0;
    obj.statistics[type+"Commands"]++;
    if(obj.statistics.userStatistics[user]["actions"] == undefined) {
        obj.statistics.userStatistics[user]["actions"] = 0;
    }
    obj.statistics.userStatistics[user]["actions"]++;
    obj.statistics.actions ++;
    console.log(JSON.stringify(obj))
    return obj;
}