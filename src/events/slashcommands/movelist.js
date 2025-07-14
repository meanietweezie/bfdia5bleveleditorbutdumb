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
const movements = ["Up","Down","Left","Right"]
const stateNames = [null,null,"Deadly and moving.", "Moving.", "Deadly with gravity.", "Carryable.", null, "NPC.", "Rescuable.", "Playable."]
module.exports = {
	data: new SlashCommandBuilder()
		.setName("char-movement-view")
		.setDescription("Displays an ordered list of the movement data for a character")
        .addIntegerOption(option => option.setName("charnum").setDescription("Which character do you want to see the data of?").setMinValue(1).setRequired(true)),
	async execute(interaction) {
        let thisLevelPath;
        let levelDataObj;
        let charnum = interaction.options.getInteger("charnum")
        interaction.deferReply({flags:MessageFlags.Ephemeral}).then(() => {
            try{
                thisLevelPath = path.join(levelPath,interaction.guildId +".txt")
                let cah = fs.readFileSync(thisLevelPath)
                levelDataObj = JSON.parse(cah);
            }finally{
                if(levelDataObj.charData[charnum-1] == undefined) interaction.editReply({content:"This character doesn't exist brah....",flags:MessageFlags.Ephemeral})
                else if(levelDataObj.charData[charnum-1].charstate != 3 && levelDataObj.charData[charnum-1].charstate != 4) interaction.editReply({content:"This character is not a Moving or Deadly and Moving entity! If you want it to be one, use /addandeditchars to change its state.",flags:MessageFlags.Ephemeral})
                let toSend = "";
                for(let i = 0; i < levelDataObj.charData[charnum-1].movementData.length; i++) {
                    toSend += "Movement " + (i+1) + ": " + movements[levelDataObj.charData[charnum-1].movementData[i].dire] + " for " + levelDataObj.charData[charnum-1].movementData[i].dist + " tiles\n"
                }
                if(levelDataObj.charData[charnum-1].movementData.length == 0) toSend = "This moving character seems to be quite Static Rn....maybe you should do smth about that..../char-movement-edit..."
                let embedTest = new EmbedBuilder().setTitle(`Character ${charnum} (${charNames[levelDataObj.charData[charnum-1].id]}${charEmojis[levelDataObj.charData[charnum-1].id]}) `).setDescription(toSend)
                interaction.editReply({embeds:[embedTest],flags:MessageFlags.Ephemeral})
            }
        });
	}
}