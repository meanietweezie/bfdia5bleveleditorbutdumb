const { SlashCommandBuilder,EmbedBuilder,Embed,MessageFlags,ButtonBuilder,ActionRowBuilder,ButtonStyle} = require('discord.js');
const path = require("node:path");
const fs = require("node:fs");
let parentPath = String(__dirname).slice(0,String(__dirname).lastIndexOf("src")+3)
let levelPath = path.join(parentPath,"/leveldatafold")
let cooldownPath = path.join(parentPath,"/cooldowndatafold")
let cooldownObj;
module.exports = {
	data: new SlashCommandBuilder()
		.setName("level-set-bg")
		.setDescription("Displays background of that ID or the current background. Also allows to change it.")
		.addIntegerOption(option => option.setName("bgnum").setDescription("Which bg do you wanna see? Leave blank to see current.").setMinValue(1).setMaxValue(12)),
	async execute(interaction) {
        let thisLevelPath;
        let thisCoolPath;
        let levelDataObj;
        interaction.deferReply({flags:MessageFlags.Ephemeral}).then(() => {
            try{
                thisLevelPath = path.join(levelPath,interaction.guildId +".txt")
                thisCoolPath = path.join(cooldownPath,interaction.guildId +".txt")
                let bah = fs.readFileSync(thisLevelPath);
                let cah = fs.readFileSync(thisCoolPath)
                levelDataObj = JSON.parse(bah);
                cooldownObj = JSON.parse(cah);
            }finally{
                let timeLeft = (cooldownObj.background != undefined) ? Math.floor(Date.now() / 1000) - cooldownObj.background : 0;
                if(timeLeft < 0 && !checkPerms(interaction.member,interaction)) {
                    interaction.editReply({content:"Too soon! The background will be available to set in " + formSec(-timeLeft) + ". Make sure to act fast before someone else does!",flags:MessageFlags.Ephemeral})
                }else{
                    let bgNum = (interaction.options.getInteger("bgnum") != undefined) ? interaction.options.getInteger("bgnum")-1 : levelDataObj.background;
                    let bgNum2 = (bgNum >= 10) ? "00" + bgNum : "000" + bgNum;
                    console.log()
                    let sendThis = (interaction.options.getInteger("bgnum") != undefined) ? 'Background Number ' + (bgNum+1) : "Current Background"
                    embedTest = {
                        title: sendThis,
                        image:{
                            url:`https://raw.githubusercontent.com/coppersalts/HTML5b/ec69f9e875985f69392664ecda0c300c2830f638/visuals/bg/bg${bgNum2}.png`
                        }
                    }
                    const shiftup = new ButtonBuilder()
                        .setCustomId('setbg')
                        .setLabel('Set This as Background')
                        .setStyle(ButtonStyle.Primary)
                    const bttns = new ActionRowBuilder()
                        .addComponents(shiftup);
                    if(interaction.options.getInteger("bgnum") != undefined) interaction.editReply({components:[bttns],embeds:[embedTest],flags:MessageFlags.Ephemeral,background:bgNum,withResponse:true,content:"Do you want to set the background to number " + (bgNum+1) + "?"}).then((response) => {console.log(response)})
                    else interaction.editReply({embeds:[embedTest],flags:MessageFlags.Ephemeral})
                }
            }
        });
	}
}
function formSec(nubmer) {
	let minutes = Math.floor(nubmer/60)
	let seconds = nubmer % 60;
	return minutes + " minutes and " + seconds + " seconds"
}