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
		.setName("dialogue-edit")
		.setDescription("Allows to add or change a line of dialogue and its properties.")
        .addSubcommandGroup(subcommandgroup => subcommandgroup
            .setName("new")
            .setDescription("Add new dialogue!")
            .addSubcommand(subcommand => subcommand
                .setName("normal")
                .setDescription("Change/add dialogue to/as normal dialogue")
                .addIntegerOption(option => option.setName("charnum").setDescription("Which character in the list is saying the dialogue? /viewchars to see list. Type 100 for narrator").setMinValue(1).setRequired(true))
                .addBooleanOption(option => option.setName("happy").setDescription("Is the message stated positively?").setRequired(true))
                .addStringOption(option => option.setName("message").setDescription("What should the character say? You don't have to add quotation marks around message.").setMaxLength(100).setMinLength(1).setRequired(true)))
            .addSubcommand(subcommand => subcommand
                .setName("switchevent")
                .setDescription("Change/add dialogue to/as a switch event")
                .addStringOption(option => option.setName("switchcolor").setDescription("What color should be switched?").addChoices(
                    {name:"Switch Yellow",value:"50"},
                    {name:"Switch Blue",value:"51"},
                    {name:"Switch Green",value:"52"},
                    {name:"Switch Conveyors",value:"55"}
                ).setRequired(true))
                .addIntegerOption(option => option.setName("dialoguenum").setDescription("Which dialogue do you want to change? Don't input here to add a new one.").setMinValue(1))
            )
        )
        .addSubcommandGroup(subcommandgroup => subcommandgroup
            .setName("existing")
            .setDescription("Edit old dialogue!")
            .addSubcommand(subcommand => subcommand
                .setName("normal")
                .setDescription("Change/add dialogue to/as normal dialogue")
                .addIntegerOption(option => option.setName("dialoguenum").setDescription("Which dialogue do you want to change? Don't input here to add a new one.").setMinValue(1).setRequired(true))
                .addIntegerOption(option => option.setName("charnum").setDescription("Which character in the list is saying the dialogue? /viewchars to see list. Type 100 for narrator").setMinValue(1))
                .addBooleanOption(option => option.setName("happy").setDescription("Is the message stated positively?"))
                .addStringOption(option => option.setName("message").setDescription("What should the character say? You don't have to add quotation marks around message.").setMaxLength(100).setMinLength(1)))
            .addSubcommand(subcommand => subcommand
                .setName("switchevent")
                .setDescription("Change/add dialogue to/as a switch event")
                .addIntegerOption(option => option.setName("dialoguenum").setDescription("Which dialogue do you want to change? Don't input here to add a new one.").setMinValue(1).setRequired(true))
                .addStringOption(option => option.setName("switchcolor").setDescription("What color should be switched?").addChoices(
                    {name:"Switch Yellow",value:"50"},
                    {name:"Switch Blue",value:"51"},
                    {name:"Switch Green",value:"52"},
                    {name:"Switch Conveyors",value:"55"}
                ).setRequired(true))
                
                )
        ),
	async execute(interaction) {
        let thisLevelPath;
        let thisCoolPath;
        let levelDataObj;
        let charnum = interaction.options.getInteger("charnum")
        let dialoguenum = interaction.options.getInteger("dialoguenum")
        let happy = interaction.options.getBoolean("happy")
        let message = interaction.options.getString("message")
        let switchcolor = Number(interaction.options.getString("switchcolor"));
        let switchevent = interaction.options.getSubcommand() == "switchevent"
        console.log(interaction.options.getSubcommand())
        
        if(message != undefined) message.trim();
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
                    let idthig = interaction.guildId;
                    let indexCheck = (dialoguenum != undefined) ? dialoguenum - 1: levelDataObj.dialogueStuff.push(new Object())-1;
                    let changeAmt = 0;
                    if(message != undefined) {
                        message = message.replaceAll(!/^[\u0020-\u007e\u00a0-\u00ff‘’]*$/,"")
                        //message.replaceAll("@","\@")
                    }
                    if(indexCheck >= levelDataObj.dialogueStuff.length) interaction.editReply({content:"This line doesn't exist! To add one, leave the 'dialoguenum' value empty.",flags:MessageFlags.Ephemeral})
                    else if(charnum != undefined && charnum-1 >= levelDataObj.charData.length && charnum != 100) interaction.editReply({content:"This character doesn't exist!",flags:MessageFlags.Ephemeral})
                    else if(message != undefined && message.length == 0) interaction.editReply({content:"Invalid message.",flags:MessageFlags.Ephemeral})
                    else if(dialoguenum != undefined && switchnums.includes(levelDataObj.dialogueStuff[indexCheck].char) && !switchcolor) interaction.editReply({content:"You cannot edit other properties of switch events.",flags:MessageFlags.Ephemeral})
                    else{
                        let changed = ""
                        if(dialoguenum == undefined) {
                            changed += `Line ${indexCheck+1} was added\n`
                            changeAmt++;
                        }
                        if(happy != undefined && levelDataObj.dialogueStuff[indexCheck].happy != happy) {
                            levelDataObj.dialogueStuff[indexCheck].happy = happy;
                            changed += `Line ${indexCheck+1} is now said with a ${(happy == true) ? "positive" : "negative"} tone\n`
                            changeAmt++;
                        }
                        if(charnum != undefined && levelDataObj.dialogueStuff[indexCheck].char != charnum-1) {
                            
                            levelDataObj.dialogueStuff[indexCheck].char = charnum-1;
                            let charId = (levelDataObj.dialogueStuff[indexCheck].char == 99 || switchnums.includes(levelDataObj.dialogueStuff[indexCheck].char)) ? 99 : levelDataObj.charData[levelDataObj.dialogueStuff[indexCheck].char].id
                            changed += `Line ${indexCheck+1}'s is now said by Character ${Math.min(charnum,99)} (${charNames[charId]} ${charEmojis[charId]})\n`
                            changeAmt++;
                        }
                        if(message != undefined && levelDataObj.dialogueStuff[indexCheck].message != message) {
                            levelDataObj.dialogueStuff[indexCheck].message = message;
                            changed += `Line ${indexCheck+1}'s text now says "${message}"\n`
                            changeAmt++;
                        }
                        if(switchevent) {
                            levelDataObj.dialogueStuff[indexCheck].char = switchcolor;
                            levelDataObj.dialogueStuff[indexCheck].happy = false;
                            levelDataObj.dialogueStuff[indexCheck].message = "switches can't talk dude";
                            changed += `Line ${indexCheck+1}'s is now a ${switchcolors[switchcolor-50]} switch event\n`
                            changeAmt++;
                        }
                        
                        try{
                            let charList = levelDataObj.charData;
                            let dialogueList = levelDataObj.dialogueStuff;
                            let toSend = "";
                            for(let i = Math.max(0,indexCheck-3); i < Math.min(indexCheck+3,levelDataObj.dialogueStuff.length); i++) {
                                let charId = (levelDataObj.dialogueStuff[i].char == 99 || switchnums.includes(levelDataObj.dialogueStuff[i].char)) ? 99 : levelDataObj.charData[levelDataObj.dialogueStuff[i].char].id
                                if(switchnums.includes(levelDataObj.dialogueStuff[i].char)) toSend += "`Line " + (i+1) +": " + switchcolors[levelDataObj.dialogueStuff[i].char-50] + " switch event `\n"
                                else toSend += "`Line " + (i+1) +": Character " + (Math.min(levelDataObj.dialogueStuff[i].char+1,99)) + ": " + charNames[charId] + " " + charEmojis[charId] + ", saying \"" + levelDataObj.dialogueStuff[i].message.substring(0,50).concat((levelDataObj.dialogueStuff[i].message.length > 50) ? "..." : "") + "\" " + ((levelDataObj.dialogueStuff[i].happy) ? "positively" : "negatively.") + "`\n"
                            }
                            if(changed == "") changed = "There were no changes, apparently. Lol"
                            let embedTest = new EmbedBuilder().setTitle("Dialogue").setDescription(toSend)
                            let embedTest2 = new EmbedBuilder().setTitle("Changes").setDescription(changed)
                            interaction.channel.send({content:`<@${interaction.user.id}> changed/added dialogue!`,embeds:[embedTest,embedTest2]})
                            interaction.editReply({content:"dialogue changed/added!",flags:MessageFlags.Ephemeral})  
                            cooldownObj = markStatistic(interaction.user.id,"dialogue",cooldownObj,changeAmt);
                            cooldownObj.users[interaction.user.id] = Math.floor(Date.now() / 1000) + cooldownObj.cooldowns["dialogue"];               
                            
                        }catch(error){
                            console.log(error)
                        }finally{
                            fs.writeFileSync(thisLevelPath,JSON.stringify(levelDataObj))
                            fs.writeFileSync(thisCoolPath,JSON.stringify(cooldownObj))  
                        }
                                
                    }
                
                }
            }
        });
        
	}
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