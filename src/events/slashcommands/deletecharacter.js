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
const stateNames = [null,null,"Deadly and moving", "Moving", "Deadly with gravity", "Carryable", null, "Non-playable character", "Rescuable", "Playable"]
const exceptions = [50,51,52,55,99]
module.exports = {
	data: new SlashCommandBuilder()
		.setName("char-delete")
		.setDescription("Deletes a character and its related dialogue.")
        .addIntegerOption(option => option.setName("charnum").setDescription("Which character do you want to delete?").setMinValue(1).setRequired(true)),
	async execute(interaction) {
        let thisLevelPath;
        let thisCoolPath;
        let levelDataObj;
        let charnum = interaction.options.getInteger("charnum")
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
                    if(charnum > levelDataObj.charData.length) {
                        interaction.editReply({content:"This character does not exist!",flags:MessageFlags.Ephemeral})
                    }else{
                        let copy = levelDataObj.charData[charnum-1]
                        const stringVer = ", which was a " + stateNames[copy.charstate-1] + " " + charNames[copy.id] + " (" + charEmojis[copy.id] + ") positioned at tile " + copy.xpos + " by " + copy.ypos + "." 
                        levelDataObj.charData.splice(charnum-1,1)
                        for(let i = 0; i < levelDataObj.dialogueStuff.length; i++) {
                            if(levelDataObj.dialogueStuff[i].char == charnum-1) {
                               levelDataObj.dialogueStuff.splice(i,1)
                               i--;
                               continue;
                            }else if(levelDataObj.dialogueStuff[i].char >= charnum-1 && !exceptions.includes(levelDataObj.dialogueStuff[i].char)) {
                               levelDataObj.dialogueStuff[i].char--;
                            }
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
                            let embedTest = new EmbedBuilder().setTitle("Character").setDescription(toSend)
                            interaction.channel.send({content:`<@${interaction.user.id}> deleted character ${charnum}${stringVer}`,embeds:[embedTest]})
                            interaction.editReply({content:"character removed!",flags:MessageFlags.Ephemeral})  
                            cooldownObj = markStatistic(interaction.user.id,"character",cooldownObj,1);
                            cooldownObj.users[interaction.user.id] = Math.floor(Date.now() / 1000) + cooldownObj.cooldowns["character"];               
                            
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
