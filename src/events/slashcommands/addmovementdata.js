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
const movements = ["Up","Down","Left","Right"]
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
		.setName("char-movement-edit")
		.setDescription("Allows to edit the movement data of a character")
        .addSubcommand(
            subcommand => subcommand.setName("new").setDescription("Adds a new movement for a character.")
            .addIntegerOption(option => option.setName("charnum").setDescription("Which level character is this for?").setMinValue(1).setRequired(true))
            .addStringOption(option => option.setName("dire").setDescription("The new direction of the movement")
            .addChoices(
                {name: 'Up', value: '0' },
                {name: 'Down', value: '1' },
                {name: 'Left', value: '2' },
                {name: 'Right', value: '3' }))
            .addIntegerOption(option => option.setName("dist").setDescription("The new distance of the movement").setMinValue(1))
        )
        .addSubcommand(
            subcommand => subcommand.setName("existing").setDescription("Edits an existing movement for a character.")
            .addIntegerOption(option => option.setName("charnum").setDescription("Which level character is this for?").setMinValue(1).setRequired(true))
            .addIntegerOption(option => option.setName("movementnum").setDescription("Which movement do you want to edit?").setMinValue(1).setRequired(true))
            .addStringOption(option => option.setName("dire").setDescription("The new direction of the movement")
            .addChoices(
                {name: 'Up', value: '0' },
                {name: 'Down', value: '1' },
                {name: 'Left', value: '2' },
                {name: 'Right', value: '3' }))
            .addIntegerOption(option => option.setName("dist").setDescription("The new distance of the movement").setMinValue(1))
        ).addSubcommand(
            subcommand => subcommand.setName("delete").setDescription("Deletes an existing movement for a character.")
            .addIntegerOption(option => option.setName("charnum").setDescription("Which level character is this for?").setMinValue(1).setRequired(true))
            .addIntegerOption(option => option.setName("movementnum").setDescription("Which movement do you want to delete?").setMinValue(1).setRequired(true))
        ),
	async execute(interaction) {
        let thisLevelPath;
        let thisCoolPath;
        let levelDataObj;
        let charnum = interaction.options.getInteger("charnum")
        let movementnum = interaction.options.getInteger("movementnum")
        let dist = interaction.options.getInteger("dist")
        let dire = Number(interaction.options.getString("dire"))
        let newThing = Boolean(interaction.options.getSubcommand() == "new")
        let del = Boolean(interaction.options.getSubcommand() == "delete")
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
                    if(levelDataObj.charData[charnum-1] == undefined) interaction.editReply({content:"This character doesn't exist brah....",flags:MessageFlags.Ephemeral})
                    else if(levelDataObj.charData[charnum-1].charstate != 3 && levelDataObj.charData[charnum-1].charstate != 4) interaction.editReply({content:"This character is not a Moving or Deadly and Moving entity! If you want it to be one, use /char-edit.",flags:MessageFlags.Ephemeral})
                    else if(newThing && levelDataObj.charData[charnum-1].movementData.length >= 50) {
                        interaction.editReply({content:"No more than 50 movements!",flags:MessageFlags.Ephemeral})
                    }else{
                            let indexCheck = (movementnum != undefined) ? movementnum - 1: levelDataObj.charData[charnum-1].movementData.push(new Object())-1
                            let changeAmt = 0;
                            let copy;
                            if(indexCheck >= levelDataObj.charData[charnum-1].movementData.length) interaction.editReply({content:"This movement doesn't exist!",flags:MessageFlags.Ephemeral})
                            else{
                                let changed = ""
                                if(del) {
                                    copy = levelDataObj.charData[charnum-1].movementData[indexCheck]
                                    levelDataObj.charData[charnum-1].movementData.splice(indexCheck,1)
                                    changeAmt = 1;
                                }else{
                                    if(movementnum == undefined) {
                                        changed += `Movement ${indexCheck+1} was added\n`
                                        changeAmt++
                                    }
                                    if(dire != undefined && levelDataObj.charData[charnum-1].movementData[indexCheck].dire != dire) {
                                        levelDataObj.charData[charnum-1].movementData[indexCheck].dire = dire;
                                        changed += `Movement ${indexCheck+1}'s direction is now ${movements[dire]}\n`
                                        changeAmt++
                                    }
                                    if(dist != undefined && levelDataObj.charData[charnum-1].movementData[indexCheck].dist != dist) {
                                        levelDataObj.charData[charnum-1].movementData[indexCheck].dist = dist;
                                        changed += `Movement ${indexCheck+1}'s distance is now ${dist}\n`
                                        changeAmt++
                                    }
                                }
                                try{
                                    let toSend = "";
                                    for(let i = 0; i < levelDataObj.charData[charnum-1].movementData.length; i++) {
                                        toSend += "Movement " + (i+1) + ": " + movements[levelDataObj.charData[charnum-1].movementData[i].dire] + " for " + levelDataObj.charData[charnum-1].movementData[i].dist + " tiles\n"
                                    }
                                    if(levelDataObj.charData[charnum-1].movementData.length == 0) toSend = "This moving character seems to be quite Static Rn....maybe you should do smth about that..../char-movement-add..."
                                    let embedTest = new EmbedBuilder().setTitle(`Character ${charnum} (${charNames[levelDataObj.charData[charnum-1].id]}${charEmojis[levelDataObj.charData[charnum-1].id]}) `).setDescription(toSend)
                                    let embedTest2;
                                    let embedd = [embedTest]
                                    if(!changed) changed = "no changes. idk why they even ran this command."
                                    if(!del) {
                                        embedTest2 = new EmbedBuilder().setTitle("Changes").setDescription(changed)
                                        embedd.push(embedTest2)
                                    }
                                    interaction.channel.send({content:`<@${interaction.user.id}> ${del ? `deleted movement ${indexCheck} from character ${charnum} (${movements[levelDataObj.charData[charnum-1].movementData[i].dire]} for ${levelDataObj.charData[charnum-1].movementData[i].dist} tiles)` :(interaction.options.getSubcommand() == "new" ? "added movement to a character!" : "changed movement to a character!")}`,embeds:embedd})
                                    interaction.editReply({content: del ? "movement deleted!" : "movement changed/added!",flags:MessageFlags.Ephemeral})
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