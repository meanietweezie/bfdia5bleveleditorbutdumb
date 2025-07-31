const { SlashCommandBuilder,EmbedBuilder,Embed,MessageFlags,ButtonBuilder,ActionRowBuilder,ButtonStyle} = require('discord.js');
const path = require("node:path");
const fs = require("node:fs");
let parentPath = String(__dirname).slice(0,String(__dirname).lastIndexOf("src")+3)
let levelPath = path.join(parentPath,"/leveldatafold")
let cooldownPath = path.join(parentPath,"/cooldowndatafold")
let cooldownObj;
let charNames = [
    "Ruby","Book","Ice Cube","Match","Pencil","Bubble","Lego Brick","Waffle","Tune","","","","","","","","","","","","","","","","","","","","","","","","","","","HPRC (Wide)","HPRC (Thin)","Crate","Metal Box","Small Gray Platform","Large Spike Ball","Package","Companion Cube","Rusty Apparatus","Purple Enemy","Saw Blade","Small Spike Ball","Metal Pillar","Large Gray Platform","Spinning Blue Spike Ball","Epic Acid Monster","Small Acid Covered Platform","Gold Platform","Green Block","Blue Block","Wall of Spikes"
]
let charEmojis = [
    "💎","📓","🧊","🧨","✏️","🫧","🏭","🧇","🎶","🔲","","","","","","","","","","","","","","","","","","","","","","","","","","⌨️","🖨️","💼","🧰","🕳️","🔆","📦","💟","🔱","👿","⚙️","🔅","🧂","➖","*️⃣","🤢","🤮","🚧","💵","💶","⚔️"
]
charNames[99] = "Narrator"
charEmojis[99] = "👻"
const switchcolors = ["yellow","blue","green",null,null,"conveyor"]
const switchnums = [50,51,52,55]
function checkEmoji(emojiString) {
    for(let i = 0; i < charEmojis.length; i++) {
        if(emojiString == charEmojis[i]) return i+1;
    }
    return false;
}
const stateNames = [null,null,"Deadly and moving", "Moving", "Deadly with gravity", "Carryable", null, "Non-playable character", "Rescuable", "Playable"]
module.exports = {
	data: new SlashCommandBuilder()
		.setName("dialogue-delete")
		.setDescription("Allows to move or delete a line of dialogue.")
        .addIntegerOption(option => option.setName("dialoguenum").setDescription("Which dialogue do you want to move?").setMinValue(1).setRequired(true))
        .addIntegerOption(option => option.setName("newplace").setDescription("Where do you want the dialogue to be now? Leave blank to delete it completely. ").setMinValue(1)),
	async execute(interaction) {
        let thisLevelPath;
        let thisCoolPath;
        let levelDataObj;
        let newplace = interaction.options.getInteger("newplace")
        let dialoguenum = interaction.options.getInteger("dialoguenum")
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
                    if(dialoguenum > levelDataObj.dialogueStuff.length) {
                        interaction.editReply({content:"This dialogue does not exist!",flags:MessageFlags.Ephemeral})
                    }else{
                        let copy = levelDataObj.dialogueStuff[dialoguenum-1]
                        let charId = (copy.char == 99 || switchnums.includes(copy.char)) ? 99 : levelDataObj.charData[copy.char].id
                        let stringVer;

                        if(switchnums.includes(copy.char)) stringVer = ", which was a " + switchcolors[copy.char-50] + " switch event. `\n"
                        else stringVer = ", which was character " + (copy.char+1) + " (" + charNames[charId] + " " + charEmojis[charId] + ") saying \"" + copy.message + "\" " + ((copy.happy) ? "positively." : "negatively.")
                        levelDataObj.dialogueStuff.splice(dialoguenum-1,1)
                        if(newplace) {
                            newplace = Math.min(newplace-1,levelDataObj.dialogueStuff.length)
                            levelDataObj.dialogueStuff.splice(newplace,0,copy)
                        }
                        try{
                            let toSend = "";
                            let beginning = (newplace != undefined) ? Math.max(0,newplace-3) : 0;
                            let end = (newplace != undefined) ? Math.min(levelDataObj.dialogueStuff.length,newplace+3) : 4;
                            for(let i = 0; i < levelDataObj.dialogueStuff.length; i++) {
                                charId = (levelDataObj.dialogueStuff[i].char == 99 || switchnums.includes(levelDataObj.dialogueStuff[i].char)) ? 99 : levelDataObj.charData[levelDataObj.dialogueStuff[i].char].id
                                if(switchnums.includes(levelDataObj.dialogueStuff[i].char))toSend += "`Line " + (i+1) +": (" + switchcolors[levelDataObj.dialogueStuff[i].char-50] + " switch event) `\n"
                                else toSend += "`Line " + (i+1) +": Character " + (Math.min(levelDataObj.dialogueStuff[i].char+1,99)) + ": " + charNames[charId] + " " + charEmojis[charId] + ", saying \"" + levelDataObj.dialogueStuff[i].message.substring(0,50).concat((levelDataObj.dialogueStuff[i].message.length > 50) ? "..." : "") + "\" " + ((levelDataObj.dialogueStuff[i].happy) ? "positively" : "negatively.") + "`\n"
                            }
                            let embedTest = new EmbedBuilder().setTitle("Dialogue").setDescription(toSend)
                            interaction.channel.send({content:`<@${interaction.user.id}> ${(newplace) ? "moved line " + dialoguenum + " to line " + newplace + "!" : "deleted line " + dialoguenum + stringVer}`,embeds:[embedTest]})
                            interaction.editReply({content:"dialogue changed/added!",flags:MessageFlags.Ephemeral})  
                            cooldownObj = markStatistic(interaction.user.id,"dialogue",cooldownObj,1);
                            cooldownObj.users[interaction.user.id] = Math.floor(Date.now() / 1000) + cooldownObj.cooldowns["dialogue"];               
                            
                        }catch(error){
                            console.log(error)
                        }finally{
                            fs.writeFileSync(thisLevelPath,JSON.stringify(levelDataObj,null,"\t"))
                            fs.writeFileSync(thisCoolPath,JSON.stringify(cooldownObj,null,"\t"))  
                        }
                                
                    
                    }
                }
            }
        });
        
	}
}
function markStatistic(user,type,obj,editNum) {
    let typeAction = type;
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
        obj.statistics["rectCommands"]++;
        obj.statistics.userStatistics[user]["rect"]++;
        obj.statistics.userStatistics[user]["rectCommands"]++;
        typeAction = "rect"
    }else{
        obj.statistics.userStatistics[user][type+"Commands"]++;
    }
    obj.statistics[type]+=editNum;
    if(obj.statistics[type+"Commands"] == undefined) obj.statistics[type+"Commands"] = 0;
    if(!(type == "tile" && editNum > 1)) obj.statistics[type+"Commands"]++;
    if(obj.statistics.userStatistics[user]["actions"] == undefined) {
        obj.statistics.userStatistics[user]["actions"] = 0;
    }
    obj.statistics.userStatistics[user]["actions"]++;
    obj.statistics.userStatistics[user].lastAction = type;
    obj.statistics.actions ++;
    return obj;
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
