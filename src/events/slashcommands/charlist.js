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
const stateNames = [null,null,"Deadly and moving", "Moving", "Deadly with gravity", "Carryable", null, "NPC", "Rescuable", "Playable"]
module.exports = {
	data: new SlashCommandBuilder()
		.setName("char-view")
		.setDescription("Displays an ordered list of all characters in the level."),
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
                console.log(charList)
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
                    + ((levelDataObj.charData[i].charstate == 3 || levelDataObj.charData[i].charstate == 4) ? ` at a speed of ${levelDataObj.charData[i].speed} frames per tile.` : ".") + "`\n";
                }
                if(levelDataObj.charData.length == 0) toSend = "There are no characters at the moment. lol"
                let embedTest = new EmbedBuilder().setTitle("Characters").setDescription(toSend)
                interaction.editReply({embeds:[embedTest],flags:MessageFlags.Ephemeral})
            }
        });
	}
}