const {AttachmentBuilder,MessageFlags, SlashCommandBuilder,EmbedBuilder,Embed} = require('discord.js');
const path = require("node:path");
const fs = require("node:fs");
let parentPath = String(__dirname).slice(0,String(__dirname).lastIndexOf("src")+3)
let levelPath = path.join(parentPath,"/leveldatafold")
module.exports = {
        data: new SlashCommandBuilder()
                .setName("level-copybotstring")
                .setDescription("Copies the current bot-read string of the level, allowing for later loading."),
        async execute(interaction) {
                
                interaction.deferReply({content: "Here is the data of the current level. Make sure to keep it safe if you want to edit it later!", flags:MessageFlags.Ephemeral}).then(() => {
                        let bufferpath = path.join(__dirname,"levelbuffer.txt")
                        let currentLevelPath = path.join(levelPath,String(interaction.guildId) + ".txt")
                        let data = fs.readFileSync(currentLevelPath)
                        fs.writeFileSync(bufferpath,data)
                        let attachh = new AttachmentBuilder()
                        attachh.attachment = bufferpath
                        attachh.name = "strigforyou.txt"
                        interaction.editReply({files: [attachh]})
                })
        }
}