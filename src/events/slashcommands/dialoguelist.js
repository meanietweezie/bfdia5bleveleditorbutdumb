const { SlashCommandBuilder,EmbedBuilder,Embed,MessageFlags,ButtonBuilder,ActionRowBuilder,ButtonStyle} = require('discord.js');
const path = require("node:path");
const fs = require("node:fs");
let parentPath = String(__dirname).slice(0,String(__dirname).lastIndexOf("src")+3)
let levelPath = path.join(parentPath,"/leveldatafold")
let cooldownPath = path.join(parentPath,"/cooldowndatafold")
const charNames = [
    "Ruby","Book","Ice Cube","Match","Pencil","Bubble","Lego Brick","Waffle","Tune","","","","","","","","","","","","","","","","","","","","","","","","","","","HPRC (Wide)","HPRC (Thin)","Crate","Metal Box","Small Gray Platform","Large Spike Ball","Package","Companion Cube","Rusty Apparatuses","Purple Enemy","Saw Blade","Small Spike Ball","Metal Pillar","Large Gray Platform","Spinning Blue Spike Ball","Acid Monster","Small Acid Covered Platform","Gold Platform","Green Block","Blue Block","Wall of Spikes"
]
const charEmojis = [
    "💎","📓","🧊","🧨","✏️","🫧","🏭","🧇","🎶","🔲","","","","","","","","","","","","","","","","","","","","","","","","","","⌨️","🖨️","💼","🧰","🕳️","🔆","📦","💟","🔱","👿","⚙️","🔅","🧂","➖","*️⃣","🤢","🤮","🚧","💵","💶","⚔️"
]
charNames[99] = "Narrator"
charEmojis[99] = "👻"
const switchcolors = ["yellow","blue","green",null,null,"conveyor"]
const switchnums = [50,51,52,55]
const stateNames = [null,null,"Deadly and moving.", "Moving.", "Deadly with gravity.", "Carryable.", null, "NPC.", "Rescuable.", "Playable."]
module.exports = {
	data: new SlashCommandBuilder()
		.setName("dialogue-view")
		.setDescription("Displays an ordered list of all dialogue in the level."),
	async execute(interaction) {
        let thisLevelPath;
        let levelDataObj;
        interaction.deferReply({flags:MessageFlags.Ephemeral}).then(() => {
            try{
                thisLevelPath = path.join(levelPath,interaction.guildId +".txt")
                let cah = fs.readFileSync(thisLevelPath)
                levelDataObj = JSON.parse(cah);
            }finally{
                let charList = levelDataObj.charData;
                let dialogueList = levelDataObj.dialogueStuff;
                let toSend = "";
                let thisSend = ""
                let incomplete = false;
                for(let i = 0; i < levelDataObj.dialogueStuff.length; i++) {
                    charId = (levelDataObj.dialogueStuff[i].char == 99 || switchnums.includes(levelDataObj.dialogueStuff[i].char)) ? 99 : levelDataObj.charData[levelDataObj.dialogueStuff[i].char].id
                    if(switchnums.includes(levelDataObj.dialogueStuff[i].char)) thisSend = "`Line " + (i+1) +": (" + switchcolors[levelDataObj.dialogueStuff[i].char-50] + " switch event) `\n"
                    else thisSend = "`Line " + (i+1) +": Character " + (Math.min(levelDataObj.dialogueStuff[i].char+1,99)) + ": " + charNames[charId] + " " + charEmojis[charId] + ", saying \"" + levelDataObj.dialogueStuff[i].message + "\" " + ((levelDataObj.dialogueStuff[i].happy) ? "positively" : "negatively.") + "`\n"
                    if(toSend.length + thisSend.length > 1000) {
                        toSend += "(more dialogue)"
                        incomplete = i;
                        break;
                    }else{
                        toSend += thisSend;
                    }
                }
                const seemore = new ButtonBuilder()
                    .setCustomId('seemore')
                    .setLabel('View More Dialogue')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(!Boolean(incomplete)); 
                const thrag = new ActionRowBuilder().addComponents(seemore);
                let embedTest = new EmbedBuilder().setTitle("Dialogue" + ((incomplete) ? " Lines 1 through " + incomplete : "") ).setDescription(toSend)
                interaction.editReply({embeds:[embedTest],flags:MessageFlags.Ephemeral,components:[thrag]})
            }
        });
	}
}