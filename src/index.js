const {MessageFlags, Client, HexColorString, IntentsBitField, Collection, Events, GatewayIntentBits, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, PermissionsBitField,EmbedBuilder,ButtonBuilder,ButtonStyle,AttachmentBuilder } = require("discord.js");
const path = require("node:path");
const fs = require("node:fs");

require("dotenv").config();

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

const eventsPath = path.join(__dirname, "events")
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"));
somehtml5bstuff:{
    // https://github.com/coppersalts/HTML5b/blob/ec69f9e875985f69392664ecda0c300c2830f638/5b.js#L6735
function tileIDFromChar(c) {
	if (c == 8364) return 93;
	if (c <= 126) return c - 46;
	if (c <= 182) return c - 80;
	return c - 81;
}

// https://github.com/coppersalts/HTML5b/blob/ec69f9e875985f69392664ecda0c300c2830f638/5b.js#L6344
function readLevelString(str) {
  let level = {};

  let lines = str.split("\r\n");
  if (lines.length == 1) lines = str.split("\n");
  let i = 0;
  
  while (i < lines.length && lines[i] == "") i++;
  if (i >= lines.length) return "No level data found.";
  level.name = lines[i];
  i++;
  if (i >= lines.length) return "No level data found.";
  
  let levelInfo = lines[i].split(",");
  if (levelInfo.length < 5) return "Fewer than 5 comma separated values in the line below the title.";
  level.width = Math.max(parseInt(levelInfo[0], 10), 1);
  level.height = Math.max(parseInt(levelInfo[1], 10), 1);
  level.charCount = parseInt(levelInfo[2], 10);
  level.background = parseInt(levelInfo[3], 10);
  let longMode = levelInfo[4] == "H";
  i++;
  if (i >= lines.length || isNaN(level.width) || isNaN(level.height) || isNaN(level.charCount) || level.charCount > 50) {
    let errorToSend = i >= lines.length ? "No tile map was provided." : "One or more values in the level's metadata was invalid.";
    return errorToSend
  }   
  
  level.charData = new Array(level.charCount);
  
  level.levelData = new Array(level.height);
  if (longMode) {
    for (let y = 0; y < level.height; y++) {
      level.levelData[y] = new Array(level.width);
      for (let x = 0; x < level.width; x++) {
        if (i + y >= lines.length || x * 2 + 1 >= lines[i + y].length) level.levelData[y][x] = 0;
        else {
          level.levelData[y][x] = 111 * tileIDFromChar(lines[i + y].charCodeAt(x * 2)) +
                              tileIDFromChar(lines[i + y].charCodeAt(x * 2 + 1));
          if (level.levelData[y][x] > 135 || level.levelData[y][x] < 0) level.levelData[y][x] = 0;
        }
      }
    }
  } else {
    for (let y = 0; y < level.height; y++) {
      level.levelData[y] = new Array(level.width);
      for (let x = 0; x < level.width; x++) {
        if (i + y >= lines.length || x >= lines[i + y].length) level.levelData[y][x] = 0;
        else {
          level.levelData[y][x] = tileIDFromChar(lines[i + y].charCodeAt(x));
          if (level.levelData[y][x] > 135 || level.levelData[y][x] < 0) level.levelData[y][x] = 0;
        }
      }
    }
  }
  
  i += level.height;
  if (i >= lines.length) return "No entity data was provided."
  
  for (let e = 0; e < level.charData.length; e++) {
    if (i + e >= lines.length) return "Number of entities did not match the provided count."
    let entityInfo = lines[i + e].split(",").join(" ").split(" ");
    level.charData[e] = {};
    if (entityInfo.length > 3) {
      if (isNaN(parseInt(entityInfo[0], 10)) || isNaN(parseFloat(entityInfo[1], 10)) || isNaN(parseFloat(entityInfo[2], 10)) || isNaN(parseInt(entityInfo[3], 10)))
        return "A data value in one entity's data parsed to NaN."
      level.charData[e].id = Math.max(Math.min(parseInt(entityInfo[0], 10), 56), 0);
      level.charData[e].xpos = Math.max(Math.ceil(parseFloat(entityInfo[1], 10)),1);
      level.charData[e].ypos = Math.max(Math.ceil(parseFloat(entityInfo[2], 10)),1);
      level.charData[e].charstate = Math.max(Math.min(parseInt(entityInfo[3], 10), 10), 3);
      level.charData[e].movementData = [];
      if(level.charData[e].charstate == 7) level.charData[e].charstate = 8;
    }
    let id = level.charData[e][0];
    if (id > 8 && id < 35) id = 8;
    else if (id >= 35 && id < 37) id = 37;
    if (level.charData[e].charstate == 3 || level.charData[e].charstate == 4) {
			if (entityInfo.length == 5) {
				level.charData[e].speed = parseInt(entityInfo[4].slice(0, 2), 10);
				let d = entityInfo[4].charCodeAt(2) - 48;
				let btm = 1;
				for (let m = 2; m < entityInfo[4].length - 1; m++) {
					if (d != entityInfo[4].charCodeAt(m + 1) - 48) {
						level.charData[e].movementData.push({dire:Math.min(Math.max(d, 0), 3),dist:btm});
						btm = 1;
						d = entityInfo[4].charCodeAt(m + 1) - 48;
					} else {
						btm++;
					}
				}
				level.charData[e].movementData.push({dire:Math.min(Math.max(d, 0), 3),dist:btm});
			} else {
				level.charData[e].charstate = 6;
			}
		}
  }
  
  i += level.charData.length;
  if (i >= lines.length) return "Number of dialogue lines was not provided."
  
  level.dialogueStuff = new Array(parseInt(lines[i], 10));
  i++;
  for (let d = 0; d < level.dialogueStuff.length; d++) {
    if (i + d >= lines.length) return "Number of dialogue lines did not match the provided count."
    level.dialogueStuff[d] = { char: 0, happy: false, message: "" };
    level.dialogueStuff[d].char = Math.max(parseInt(lines[i + d].slice(0, 2), 10),0);
    if(level.dialogueStuff[d].char > level.charData.length && !((level.dialogueStuff[d].char >= 50 && level.dialogueStuff[d].char <= 52) || level.dialogueStuff[d].char == 99)) level.dialogueStuff[d].char == 99
    if (isNaN(level.dialogueStuff[d].char)) level.dialogueStuff[d].char = 99;
    level.dialogueStuff[d].happy = lines[i + d].charAt(2) == "S" ? false : true;
    level.dialogueStuff[d].message = lines[i + d].substring(4);
  }
  
  i += level.dialogueStuff.length;
  if (i >= lines.length) return "Necessary deaths not provided."

  level.necessaryDeaths = parseInt(lines[i], 10);
  if(lines[i+1] != undefined) return "Single levels only, please. If there are no extra levels, delete any whitespace and/or extra characters at the bottom of the TXT."
  level.width = undefined;
  level.height = undefined;
return level;
}
    
}

const commandsPath = path.join(eventsPath, "slashcommands")
const commandsFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
const emojiRegE = /\p{Extended_Pictographic}|\p{Regional_Indicator}|\p{RGI_Emoji}/v
let charValues = ["id","xpos","ypos","charstate","movementData"]
let statevalues = [3,4,5,6,8,9,10]

client.commands = new Collection();

const gameEmojis = [
    [
        "➖","🟥","🔽","🔼","▶️","◀️","🚪","🎋","💬","🔴","🟩","🟢","🪙","🔝","⏮️","🔥","⏭️","✴️","⏫","⬇️","⬆️","➡️","⬅️","⏏️","🕕","🕞","📛","🕘","♊","🕒","🕤","🌕","🌝","🌑","🌚","🌛","🌜","🔍","🔎","💚","📙","📘","🏔️","⛰️","⏩","↩️","↪️","🌫️","⚫","💡","🪨","1️⃣","☑️","0️⃣","🔘","🗻","⬜","🪒","🧪","🌴","🍀","❎","☘️","🎄","🌲","✅","🕯️","🔳","⏪","⏬","🚎","📗","✴️","🟪","🏁","🚦","🚥","🟣","⭐","🌟","🌳","🌔","🌘","🔙","👈","🔜","👉","↙️","↘️","ℹ️","⛔","✝️","☦️","🟫","🟤","⚠️","↗️","↖️","🩶","💩","🍋‍🟩","♻️","🟨","🔶","🔸","❤️","🟡","🖤","🔦","✒️","🖼️","","","","","","","","","","","","","","","","","","","","🌊","🧱","🔤","☔","☂️"
    ],
    [
        "Air","Red Ground Block","Gray Spikes Facing Down","Gray Spikes Facing Up","Gray Spikes Facing Right","Gray Spikes Facing Left","End Level Door","E Tree","Dialogue Trigger","Red Background Block","Green Ground Block","Green Background Block","Win Token","Piston","Conveyer Left","Heat Block","Conveyer Right","Gray Spike Ball","One-Way Platform Facing Up","Black Spikes Facing Down","Black Spikes Facing Up","Black Spikes Facing Right","Black Spikes Facing Left","Black Spikes Facing Down With Support Cable","Support Cable Vertical Isolated","Support Cable Vertical Connected Right","Support Cable Horizontal Isolated","Support Cable Connector Bottom Right","Support Cable Vertical Connected Left Right","Support Cable Horizontal Connected Top","Support Cable Vertical Connected Left","Yellow Switch Block Solid","Yellow Switch Block Dark Solid","Yellow Switch Block Invisible","Yellow Switch Block Dark Invisible","Yellow Lever Left","Yellow Lever Right","Blue Lever Left","Blue Lever Right","Green Background Block With One-Way Platform Facing Up","Yellow Button","Blue Button","Gray Grass Block","Gray Dirt Block","One-Way Platform Facing Right","Gray Spikes Two Way Joint Left","Gray Spikes Two Way Joint Right","Crumbling Rock","Conglomerate-Like Gray Background Block","Lamp Block","Gray Gems","Blue Switch Block Solid","Blue Switch Block Dark Solid","Blue Switch Block Invisible","Blue Switch Block Dark Invisible","Conglomerate-Like Gray Background Block With One-Way Platform Facing Up","Gray Block","Green Lever Left","Green Lever Right","V Tree","Green Switch Block Dark Solid","Green Switch Block Invisible","Green Switch Block Dark Invisible","Green Switch One-Way Platform Facing Up Solid","Green Switch One-Way Platform Facing Up Invisible","Green Switch Block Solid","Lamp/Spotlight","Black Block","One-Way Platform Facing Left","One-Way Platform Facing Down","Green Background Block with One-Way Platform Facing Left","Green Button","Black Spike Ball","Purple Ground Block","Wind Gust Block","Electric Barrier Vertical","Electric Barrier Horizontal","Purple Background Block","Yellow Switch Spike Block Invisible","Yellow Switch Spike Block Solid","I Tree","Yellow Switch One-Way Platform Facing Up Solid","Yellow Switch One-Way Platform Facing Up Invisible","One-Way Platform Conveyor Left","One-Way Platform Conveyor Left (Stopped)","One-Way Platform Conveyor Right","One-Way Platform Conveyor Right (Stopped)","Purple Background Slanted Bottom Left","Purple Background Slanted Bottom Right","Light Gray Support Cable Vertical Isolated","Light Gray Support Cable Horizontal Isolated","Light Gray Support Cable Vertical Connected Left Right","Light Gray Support Cable Horizontal Connected Top","Wooden Ground Block","Wooden Background Block","Danger Zone Background Block","Purple Background Block Slanted Top Right","Purple Background Block Slanted Top Left","Gray Metal Ground Block","Wooden Background Block (Duplicate)","Acid","Acid Glow","Yellow Metal Ground Block","Lava","Lava Glow","Red Metal Ground Block","Yellow Metal Background Block","Dark Gray Metal Ground Block","Gray Switch Left","Gray Switch Right","Picture","","","","","","","","","","Picture","","","","","","","","","","Water","Brick Ground Block","Wall of Text","Blue Switch One-Way Platform Facing Up Solid","Blue Switch One-Way Platform Facing Up Invisible"
    ]
];
const charEmojis = [
    [
        ":broken_heart:",":notebook:",":ice_cube:",":firecracker:",":pencil2:",":bubbles:",":factory:",":waffle:",":notes:","","","","","","","","","","","","","","","","","","","","","","","","","","",":desktop:",":printer:",":briefcase:",":toolbox:",":hole:",":high_brightness:",":package:",":heart_decoration:",":trident:",":imp:",":gear:",":low_brightness:",":salt:",":heavy_minus_sign:",":asterisk:",":nauseated_face:",":face_vomiting:",":construction:",":dollar:",":euro:",":crossed_swords:"
    ],
    [
        "💎","📓","🧊","🧨","✏️","🫧","🏭","🧇","🎶","🔲","","","","","","","","","","","","","","","","","","","","","","","","","","⌨️","🖨️","💼","🧰","🕳️","🔆","📦","💟","🔱","👿","⚙️","🔅","🧂","➖","*️⃣","🤢","🤮","🚧","💵","💶","⚔️"
    ],
    [
        "Ruby","Book","Ice Cube","Match","Pencil","Bubble","Lego Brick","Waffle","Tune","","","","","","","","","","","","","","","","","","","","","","","","","","","HPRC (Wide)","HPRC (Thin)","Crate","Metal Box","Small Gray Platform","Large Spike Ball","Package","Companion Cube","Rusty Apparatuses","Purple Enemy","Saw Blade","Small Spike Ball","Metal Pillar","Large Gray Platform","Spinning Blue Spike Ball","Acid Monster","Small Acid Covered Platform","Gold Platform","Green Block","Blue Block","Wall of Spikes"
    ]
]
charEmojis[2][99] = "Narrator"
charEmojis[1][99] = "👻"
const switchcolors = ["yellow","blue","green",null,null,"conveyor"]
const switchnums = [50,51,52,55]
let levelDataObj = new Object();
let displayLevelView = new Object();
let currentMessage = new Object();
let currentRow = new Object();
let currentReset = new Object();
let cooldownObj = new Object();
let currentReload = new Object();

for(const file of eventFiles) {
    const filePath = path.join(eventsPath, file)
    const event = require(filePath)
    if(event.once) {
        client.once(event.name, (...args) => event.execute(...args))
    }else{
        client.on(event.name, (...args) => event.execute(...args))
    }
}

for(const filee of commandsFiles) {
    const commandPath = path.join(commandsPath, filee)
    const slashCommand = require(commandPath)
    if ('data' in slashCommand && 'execute' in slashCommand) {
        client.commands.set(slashCommand.data.name, slashCommand);
    } else {
        console.log(`[WARNING] The command at ${commandPath} is missing a required "data" or "execute" property.`);
    }
}

client.on(Events.InteractionCreate, async interaction => {
    if(interaction.inGuild()) {
        if(interaction.type == 2) {
            const command = interaction.client.commands.get(interaction.commandName);

            if(interaction.commandName == "level-viewandcopy") {
                checkLevelFile(interaction.guildId);
                interaction.deferReply({flags:MessageFlags.Ephemeral}).then(() => {
                    displayLevelView[interaction.user.id] = new Array(4);
                    displayLevelView[interaction.user.id][0] = Math.max((Number(interaction.options.getInteger("tilex"))-1)/20,0);
                    displayLevelView[interaction.user.id][1] = Math.max((Number(interaction.options.getInteger("tiley"))-1)/20,0);
                    displayLevelView[interaction.user.id][2] = interaction.options.getBoolean("tiles");
                    displayLevelView[interaction.user.id][3] = interaction.options.getBoolean("chars");
                    if(currentMessage[interaction.user.id] != undefined) {
                        currentMessage[interaction.user.id].editReply({ content: '\u200B', components: [] })
                    }
                    if(displayLevelView[interaction.user.id][0]*20 > levelDataObj[interaction.guildId].levelData[0].length || displayLevelView[interaction.user.id][1]*20 > levelDataObj[interaction.guildId].levelData.length) {
                        displayLevelView[interaction.user.id][0] = 0;
                        displayLevelView[interaction.user.id][1] = 0;
                    }
                    showLevelPriv(interaction,true,displayLevelView[interaction.user.id][0],displayLevelView[interaction.user.id][1],null,null,null,displayLevelView[interaction.user.id][2],displayLevelView[interaction.user.id][3])
                });
            }
            if(interaction.commandName == "level-add-tile") {
                interaction.deferReply({flags:MessageFlags.Ephemeral}).then(() => {
                    checkSettingsFile(interaction.guildId);
                    let emojiIndex = interaction.options.getString("tile").search(emojiRegE)
                    let idthig = interaction.guildId;
                    levelPath = path.join(__dirname,"leveldatafold/" + String(idthig) + ".txt")
                    cooldownPath = path.join(__dirname,"cooldowndatafold/" + String(idthig) + ".txt")
                    let timeLeft = (cooldownObj[idthig].users[String(interaction.user.id)] != undefined) ? Math.floor(Date.now() / 1000) - cooldownObj[idthig].users[interaction.user.id] : 0;
                    if(timeLeft < 0 && !checkPerms(interaction.member,interaction)) {
                        interaction.editReply({content:"Too soon! Wait " + formSec(-timeLeft) + " until you can do another action.",flags:MessageFlags.Ephemeral})
                    }else{
                        if(emojiIndex == -1) {
                            interaction.editReply("please send a string with an actual emoji in it")
                        }else{
                            let emojiStrig = interaction.options.getString("tile").match(emojiRegE).input
                            let numberThing = checkEmoji(emojiStrig)
                            if(numberThing) {
                                var ypos = interaction.options.getInteger("ypos");
                                var xpos = interaction.options.getInteger("xpos")
                                if(ypos > levelDataObj[idthig].levelData.length) {
                                    interaction.editReply("The y position is out of range!") 
                                }else if(xpos > levelDataObj[idthig].levelData[0].length) {
                                    interaction.editReply("The x position is out of range!")    
                                }else{
                                    levelDataObj[idthig].levelData[ypos-1][xpos-1] = numberThing - 1;
                                    try{
                                        try{
                                            interaction.editReply({content:"placed!",flags:MessageFlags.Ephemeral})
                                        }catch (error) {
                                            console.log(error)
                                        }finally{
                                            if(numberThing-1 == 6) {
                                                if(levelDataObj[idthig].endCoord == undefined) {
                                                    levelDataObj[idthig].endCoord = [xpos-1,ypos-1]
                                                    interaction.channel.send(`<@${interaction.user.id}> placed the ${gameEmojis[1][numberThing-1].toLowerCase()} at tile ${xpos}x${ypos}!`)
                                                }
                                                else {
                                                    levelDataObj[idthig].levelData[levelDataObj[idthig].endCoord[1]][levelDataObj[idthig].endCoord[0]] = 0;
                                                    interaction.channel.send(`<@${interaction.user.id}> changed the position of the ${gameEmojis[1][numberThing-1].toLowerCase()} to tile ${xpos}x${ypos}!`)
                                                    levelDataObj[idthig].endCoord = [xpos-1,ypos-1]
                                                    levelDataObj[idthig].levelData[ypos-1][xpos-1] = numberThing - 1;
                                                }
                                            }else if(numberThing-1 == 12) {
                                                if(levelDataObj[idthig].tokenCoord == undefined) {
                                                    levelDataObj[idthig].tokenCoord = [xpos-1,ypos-1]
                                                    interaction.channel.send(`<@${interaction.user.id}> placed the ${gameEmojis[1][numberThing-1].toLowerCase()} at tile ${xpos}x${ypos}!`)
                                                }
                                                else {
                                                    levelDataObj[idthig].levelData[levelDataObj[idthig].tokenCoord[1]][levelDataObj[idthig].tokenCoord[0]] = 0;
                                                    interaction.channel.send(`<@${interaction.user.id}> changed the position of the ${gameEmojis[1][numberThing-1].toLowerCase()} to tile ${xpos}x${ypos}!`)
                                                    levelDataObj[idthig].tokenCoord = [xpos-1,ypos-1]
                                                    levelDataObj[idthig].levelData[ypos-1][xpos-1] = numberThing - 1;
                                                }
                                            }else{
                                                interaction.channel.send(`<@${interaction.user.id}> placed a(n) ${gameEmojis[1][numberThing-1].toLowerCase()} at tile ${xpos}x${ypos}!`)
                                            }   
                                        }


                                    }catch(error){
                                        console.log(error)
                                    }finally{
                                        fs.writeFileSync(levelPath,JSON.stringify(levelDataObj[idthig],null,'\t'))   
                                        showLevel(Math.floor((xpos-1)/20),Math.floor((ypos-1)/20),interaction.channel);
                                        cooldownObj[idthig].users[interaction.user.id] = Math.floor(Date.now() / 1000) + cooldownObj[idthig].cooldowns.tile;
                                        cooldownObj[idthig] = markStatistic(interaction.user.id,"tile",cooldownObj[idthig],1)
                                        fs.writeFileSync(cooldownPath,JSON.stringify(cooldownObj[idthig],null,'\t'))
                                    }

                                }
                            }else{
                                interaction.editReply("invalid emoji! check with key to make sure you're placing a correct one")
                            }
                        }
                    }
                });
            }
            if(interaction.commandName == "level-add-tilerect") {
                interaction.deferReply({flags:MessageFlags.Ephemeral}).then(() => {
                    checkSettingsFile(interaction.guildId);
                    let emojiIndex = (interaction.options.getString("tile")) ? interaction.options.getString("tile").search(emojiRegE) : undefined;
                    let idthig = interaction.guildId;
                    let isCopy = interaction.options.getSubcommand() == "copy";
                    levelPath = path.join(__dirname,"leveldatafold/" + String(idthig) + ".txt")
                    cooldownPath = path.join(__dirname,"cooldowndatafold/" + String(idthig) + ".txt")
                    let timeLeft = (cooldownObj[idthig].users[interaction.user.id] != undefined) ? Math.floor(Date.now() / 1000) - cooldownObj[idthig].users[interaction.user.id] : 0
                    if(timeLeft < 0 && !checkPerms(interaction.member,interaction)) {
                        interaction.editReply({content:"Too soon! Wait `" + formSec(-timeLeft) + " until you can do another action.",flags:MessageFlags.Ephemeral})
                    }else{
                        if(emojiIndex == -1 && !isCopy) {
                            interaction.editReply("please send a string with an actual emoji in it")
                        }else{
                            let emojiStrig;
                            let numberThing = true;
                            if(!isCopy) {
                                emojiStrig = interaction.options.getString("tile").match(emojiRegE).input;
                                numberThing = checkEmoji(emojiStrig)
                            }
                            if(numberThing) {
                                var ypos = interaction.options.getInteger("ypos");
                                var xpos = interaction.options.getInteger("xpos");
                                var width = interaction.options.getInteger("length");
                                var height = interaction.options.getInteger("height");
                                var pypos = interaction.options.getInteger("prevypos");
                                var pxpos = interaction.options.getInteger("prevxpos");
                                if(ypos-1 + height > levelDataObj[idthig].levelData.length) {
                                    interaction.editReply("The bottom of the attempted added rectangle is out of range!") 
                                }else if(xpos-1 + width > levelDataObj[idthig].levelData[0].length) {
                                    interaction.editReply("The right of the attempted added rectangle is out of range!")    
                                }else if(isCopy && pxpos-1 + width > levelDataObj[idthig].levelData[0].length) {
                                    interaction.editReply("The right side of the attempted original rectangle is out of range!")    
                                }else if(isCopy && pypos-1 + height > levelDataObj[idthig].levelData.length) {
                                    interaction.editReply("The bottom of the attempted original rectangle is out of range!") 
                                }else{
                                    if(numberThing != 13 && numberThing != 7) {
                                        for(let y = 0; y < height; y ++) {
                                            for(let x = 0; x < width; x ++) {
                                                if(isCopy) numberThing = levelDataObj[idthig].levelData[pypos-1+y][pxpos-1+x]+1;
                                                levelDataObj[idthig].levelData[ypos-1+y][xpos-1+x] = numberThing - 1;
                                            }
                                        }
                                        try{
                                            try{
                                                interaction.editReply({content:"placed!",flags:MessageFlags.Ephemeral})
                                            }catch (error) {
                                                console.log(error)
                                            }finally{
                                                if(isCopy) interaction.channel.send(`<@${interaction.user.id}> copied an array of tiles! (original was ${pxpos}x${pypos} to ${pxpos+width-1}x${pypos+height-1}, new is ${xpos}x${ypos} to ${xpos+width-1}x${ypos+height-1})`)
                                                else interaction.channel.send(`<@${interaction.user.id}> placed an array of ${gameEmojis[1][numberThing-1].toLowerCase()} tiles from tile ${xpos}x${ypos} to ${xpos+width-1}x${ypos+height-1}!`)  

                                            }

                                        }catch(error){
                                            console.log(error)
                                        }finally{

                                            fs.writeFileSync(levelPath,JSON.stringify(levelDataObj[idthig],null,'\t'))   
                                            showLevel(Math.max(xpos-6,0)/20,Math.max(ypos-6,0)/20,interaction.channel);
                                            cooldownObj[idthig].users[interaction.user.id] = Math.floor(Date.now() / 1000) + cooldownObj[idthig].cooldowns.rect + (isCopy ? cooldownObj[idthig].cooldowns.copyArr : 0);
                                            cooldownObj[idthig] = markStatistic(interaction.user.id,"tile",cooldownObj[idthig],height*width)
                                            fs.writeFileSync(cooldownPath,JSON.stringify(cooldownObj[idthig],null,'\t'))   
                                        }
                                    }else if(numberThing-1 == 6) {
                                        interaction.editReply({content:"End gates are not allowed with this function.",flags:MessageFlags.Ephemeral})
                                    }else if(numberThing-1 == 12) {
                                        interaction.editReply({content:"Win tokens are not allowed with this function.",flags:MessageFlags.Ephemeral})
                                    }
                                }
                            }else{
                                interaction.editReply("invalid emoji! check with key to make sure you're placing a correct one")
                            }
                        }
                    }
                });
            }
            if(interaction.commandName == "level-reset") {
                interaction.deferReply({flags:MessageFlags.Ephemeral}).then(() => {
                    checkSettingsFile(interaction.guildId);
                    if(checkPerms(interaction.member,interaction)) {
                        const confirmreset = new ButtonBuilder().setCustomId('confirmreset')
                        .setLabel('Yes, Reset Board')
                        .setStyle(ButtonStyle.Danger)
                        const cancelreset = new ButtonBuilder().setCustomId('cancelreset')
                        .setLabel('Cancel Reset')
                        .setStyle(ButtonStyle.Primary)
                        const resetChoice = new ActionRowBuilder().addComponents(cancelreset,confirmreset);
                        interaction.editReply({content:"Are you sure you want to reset the board?",components:[resetChoice],flags:MessageFlags.Ephemeral})
                        currentReset[interaction.user.id] = [interaction.options.getInteger('width'),interaction.options.getInteger('height'),interaction.options.getString('tile')]
                    }else{
                        interaction.editReply({content:"You aren't authorized to use this command.",flags:MessageFlags.Ephemeral})
                    }
                })
            }
            if(interaction.commandName == "level-loadstring-bot" || interaction.commandName == "level-loadstring-regular") {
                let adde = ""
                if(interaction.commandName == "level-loadstring-regular") adde = "2";
                interaction.deferReply({flags:MessageFlags.Ephemeral}).then(() => {
                    checkSettingsFile(interaction.guildId);

                    fetch(interaction.options.getAttachment("string").attachment).then(response => {
                        console.log(response)
                        response.text().then(data => {
                            try{

                            }finally{
                                if(checkPerms(interaction.member,interaction)) {
                                    if (interaction.options.getAttachment("string").contentType.split(";")[0] != "text/plain") {
                                        interaction.editReply("must be text");
                                    }else{
                                        console.log(data)
                                        const confirmreset = new ButtonBuilder().setCustomId('confirmload'+adde)
                                        .setLabel('Yes, Load Level')
                                        .setStyle(ButtonStyle.Danger)
                                        const cancelreset = new ButtonBuilder().setCustomId('cancelreset')
                                        .setLabel('Cancel Load')
                                        .setStyle(ButtonStyle.Primary)
                                        const resetChoice = new ActionRowBuilder().addComponents(cancelreset,confirmreset);
                                        interaction.editReply({content:"Are you sure you want to load in a new level? Remember: this original one will be completely lost if you didn't export it.",components:[resetChoice],flags:MessageFlags.Ephemeral})
                                        currentReload[interaction.guildId] = data;


                                    }

                                }else{
                                    interaction.editReply({content:"You aren't authorized to use this command.",flags:MessageFlags.Ephemeral})
                                }

                            }
                        })
                    })
                })
            }
            if(interaction.commandName == "level-set-name") {
                interaction.deferReply({flags:MessageFlags.Ephemeral}).then(() => {
                    checkSettingsFile(interaction.guildId);
                    levelPath = path.join(__dirname,"leveldatafold/" + interaction.guildId + ".txt")
                    cooldownPath = path.join(__dirname,"cooldowndatafold/" + String(interaction.guildId) + ".txt")
                    let timeLeft = (cooldownObj[interaction.guildId].name != undefined) ? Math.floor(Date.now() / 1000) - cooldownObj[interaction.guildId].name : 0
                    if(timeLeft < 0 && !checkPerms(interaction.member,interaction)) {
                        interaction.editReply({content:"Too soon! The name will be available to set in " + formSec(-timeLeft) + ". Make sure to act fast before someone else does!",flags:MessageFlags.Ephemeral})
                    }else{
                        message = interaction.options.getString("name").replace(/\@/g,"\\@")
                        if(message.length < 1 || message == "" || !/^[\u0020-\u007e\u00a0-\u00ff‘’]*$/.test(message)) {
                            interaction.editReply({content:"Invalid string! Make sure all characters in name are printable. You shouldn't be using characters outside the regular keyboard.",flags:MessageFlags.Ephemeral})
                        }else if (message.indexOf("@everyone") > -1 || message.indexOf("@here") > -1 || message.includes("http") || message.indexOf("<@") > -1){
                            interaction.editReply({content:"Don't do that.",flags:MessageFlags.Ephemeral})
                        }else{
                            if(levelDataObj[interaction.guildId].name == message) {
                                levelDataObj[interaction.guildId].name = message
                                interaction.editReply({content:"name set! wait that's the same name. can you read. dude. are we srs. bruh",flags:MessageFlags.Ephemeral})
                                interaction.channel.send(`<@${interaction.user.id}> changed the level name to...itself? Why? Whatever, your cooldown's still set. lol.`)
                            }else{
                                levelDataObj[interaction.guildId].name = message
                                interaction.editReply({content:"name set!",flags:MessageFlags.Ephemeral})
                                interaction.channel.send(`<@${interaction.user.id}> changed the level name to ${message}!`)
                            } 

                            fs.writeFileSync(levelPath,JSON.stringify(levelDataObj[interaction.guildId],null,'\t'))  
                            showLevel(0,0,interaction.channel); 
                            cooldownObj[interaction.guildId].name = Math.floor(Date.now() / 1000) + cooldownObj[interaction.guildId].cooldowns.name;
                            cooldownObj[interaction.guildId] = markStatistic(interaction.user.id,"name",cooldownObj[interaction.guildId],1)
                            fs.writeFileSync(cooldownPath,JSON.stringify(cooldownObj[interaction.guildId],null,'\t'))
                        }

                    }
                })
            }
            if(interaction.commandName == "level-set-deaths") {
                interaction.deferReply({flags:MessageFlags.Ephemeral}).then(() => {
                    levelPath = path.join(__dirname,"leveldatafold/" + interaction.guildId + ".txt")
                    levelDataObj[interaction.guildId].necessaryDeaths = interaction.options.getInteger("deathcount")
                    interaction.editReply({content:"necessary deaths set!",flags:MessageFlags.Ephemeral})
                    interaction.channel.send(`<@${interaction.user.id}> changed the amount of necessary deaths to ${levelDataObj[interaction.guildId].name}!`)
                    fs.writeFileSync(levelPath,JSON.stringify(levelDataObj[interaction.guildId],null,'\t'))
                })
            }
            if(interaction.commandName == "level-add-roworcolumn") {
                interaction.deferReply({flags:MessageFlags.Ephemeral}).then(() => {
                    checkSettingsFile(interaction.guildId);
                    cooldownPath = path.join(__dirname,"cooldowndatafold/" + String(interaction.guildId) + ".txt")
                    let timeLeft = (cooldownObj[interaction.guildId].users[interaction.user.id] != undefined) ? Math.floor(Date.now() / 1000) - cooldownObj[interaction.guildId].users[interaction.user.id] : 0;
                    if(timeLeft < 0 && !checkPerms(interaction.member,interaction)) {
                        interaction.editReply({content:"Too soon! Wait `" + formSec(-timeLeft) + " until you can do another action.",flags:MessageFlags.Ephemeral})
                    }else{
                        let rowOrColumnNum = interaction.options.getInteger("position")-1
                        if(interaction.options.getString("whichone") == "row") showLevelPriv(interaction,true,0,Math.floor(rowOrColumnNum/20),rowOrColumnNum,undefined,"Are you sure you want to add a new " + interaction.options.getString("whichone") + " at " + interaction.options.getString("whichone") + " " + interaction.options.getInteger("position") + "?")
                        else if(interaction.options.getString("whichone") == "column") showLevelPriv(interaction,true,Math.floor(rowOrColumnNum/20),0,undefined,rowOrColumnNum,"Are you sure you want to add a new " + interaction.options.getString("whichone") + " at " + interaction.options.getString("whichone") + " " + interaction.options.getInteger("position") + "?")
                    }
                })
            }
            
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {

                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
                }
            }
        }else if(interaction.type == 3) {
            if(displayLevelView[interaction.user.id] == undefined) {
                displayLevelView[interaction.user.id] = new Array(2);
                displayLevelView[interaction.user.id][0] = 0;
                displayLevelView[interaction.user.id][1] = 0;
            }
            switch(interaction.customId) {
                case "shiftright":
                    interaction.deferReply({flags:MessageFlags.Ephemeral}).then(() => {
                        if((displayLevelView[interaction.user.id][0]+1)*20 >= levelDataObj[interaction.guildId].levelData[0].length) {
                            interaction.editReply({content:"out of bounds!",flags:MessageFlags.Ephemeral})
                        }else{
                            displayLevelView[interaction.user.id][0]++;
                            displayLevelView[interaction.user.id][0] = Number(Math.max(displayLevelView[interaction.user.id][0],0).toFixed(2))
                            showLevelPriv(interaction,true,displayLevelView[interaction.user.id][0],displayLevelView[interaction.user.id][1],null,null,null,displayLevelView[interaction.user.id][2],displayLevelView[interaction.user.id][3])
                        }
                    });
                    break;
                case "shiftleft":
                    interaction.deferReply({flags:MessageFlags.Ephemeral}).then(() => {
                        if(displayLevelView[interaction.user.id][0] == 0) {
                            interaction.editReply({content:"out of bounds!",flags:MessageFlags.Ephemeral})
                        }else{
                            displayLevelView[interaction.user.id][0]--;
                            displayLevelView[interaction.user.id][0] = Number(Math.max(displayLevelView[interaction.user.id][0],0).toFixed(2))
                            showLevelPriv(interaction,true,displayLevelView[interaction.user.id][0],displayLevelView[interaction.user.id][1],null,null,null,displayLevelView[interaction.user.id][2],displayLevelView[interaction.user.id][3])
                        }
                    });
                    break;
                case "shiftup":
                    interaction.deferReply({flags:MessageFlags.Ephemeral}).then(() => {
                        if(displayLevelView[interaction.user.id][1] == 0) {
                            interaction.editReply({content:"out of bounds!",flags:MessageFlags.Ephemeral})
                        }else{
                            displayLevelView[interaction.user.id][1]--;
                            displayLevelView[interaction.user.id][1] = Number(Math.max(displayLevelView[interaction.user.id][1],0).toFixed(2))
                            showLevelPriv(interaction,true,displayLevelView[interaction.user.id][0],displayLevelView[interaction.user.id][1],null,null,null,displayLevelView[interaction.user.id][2],displayLevelView[interaction.user.id][3])
                        }
                    });
                    break;
                case "shiftdown":
                    interaction.deferReply({flags:MessageFlags.Ephemeral}).then(() => {
                        if((displayLevelView[interaction.user.id][1]+1)*20 >= levelDataObj[interaction.guildId].levelData.length) {
                            interaction.editReply({content:"out of bounds!",flags:MessageFlags.Ephemeral})
                        }else{
                            displayLevelView[interaction.user.id][1]++;
                            displayLevelView[interaction.user.id][1] = Number(Math.max(displayLevelView[interaction.user.id][1],0).toFixed(2))
                            showLevelPriv(interaction,true,displayLevelView[interaction.user.id][0],displayLevelView[interaction.user.id][1],null,null,null,displayLevelView[interaction.user.id][2],displayLevelView[interaction.user.id][3])
                        }
                    });
                    break;
                case "confirmload2":
                    interaction.deferReply({flags:MessageFlags.Ephemeral}).then(() => {
                        if(currentReload[interaction.guildId]) {
                            let response = readLevelString(currentReload[interaction.guildId])
                            if(typeof response != "object") interaction.editReply("The level has been deemed invalid by the checker. Reason: " + response)
                            else{
                                levelPath = path.join(__dirname,"leveldatafold/" + interaction.guildId + ".txt")
                                levelDataObj[interaction.guildId] = response;
                                fs.writeFileSync(levelPath,JSON.stringify(levelDataObj[interaction.guildId],null,'\t'))
                                showLevel(0,0,interaction.channel)
                                interaction.editReply("level loaded!")
                                interaction.channel.send("<@" + interaction.user.id + "> has loaded in a new level!")
                            }   
                        }else{
                            interaction.editReply("No strings have been found in the loader. Try loading again.")
                        }

                    })
                    break;
                case "confirmrow":
                    interaction.deferReply({flags:MessageFlags.Ephemeral}).then(() => {
                        let rowNow = currentRow[interaction.user.id]
                        levelPath = path.join(__dirname,"leveldatafold/" + String(rowNow[2]) + ".txt")
                        cooldownPath = path.join(__dirname,"cooldowndatafold/" + String(rowNow[2]) + ".txt")
                        if(rowNow[0] == "row") {
                            let rowCopy = levelDataObj[rowNow[2].levelData[rowNow[1]]]
                            levelDataObj[rowNow[2]].levelData.splice(rowNow[1],0,rowCopy)
                            for(let i = 0; i < levelDataObj[rowNow[2]].charData.length; i++) {
                                if(levelDataObj[rowNow[2]].charData[i].ypos >= rowNow[1]) levelDataObj[rowNow[2]].charData[i].ypos++;
                            }
                            try{
                                interaction.editReply({content:"row added!",flags:MessageFlags.Ephemeral})
                            }catch(error){
                                console.log(error)
                            }finally{

                            }
                            interaction.channel.send(`<@${interaction.user.id}> added a new row at row ${rowNow[1] + 1}!`)
                            fs.writeFileSync(levelPath,JSON.stringify(levelDataObj[rowNow[2]],null,'\t'),null,'\t')
                            showLevel(Math.floor(rowNow[1]/20),0,interaction.channel)
                            cooldownObj[interaction.guildId].users[interaction.user.id] = Math.floor(Date.now() / 1000) + cooldownObj[interaction.guildId].cooldowns.row;
                            cooldownObj[interaction.guildId] = markStatistic(interaction.user.id,"column",cooldownObj[interaction.guildId],1)
                            fs.writeFileSync(cooldownPath,JSON.stringify(cooldownObj[interaction.guildId],null,'\t'),null,'\t')
                        }else if(rowNow[0] == "column") {
                            for(let y = 0; y < levelDataObj[rowNow[2]].levelData.length; y++) {
                                let curTile = levelDataObj[rowNow[2]].levelData[y][rowNow[1]]
                                levelDataObj[rowNow[2]].levelData[y].splice(rowNow[1],0,curTile)
                            }
                            if(levelDataObj[rowNow[2]].charData[i].xpos >= rowNow[1]) levelDataObj[rowNow[2]].charData[i].xpos++
                            try{
                                interaction.editReply({content:"column added!",flags:MessageFlags.Ephemeral})
                            }catch(error){
                                console.log(error)
                            }finally{

                            }
                            interaction.channel.send(`<@${interaction.user.id}> added a new column at column ${rowNow[1] + 1}!`)
                            fs.writeFileSync(levelPath,JSON.stringify(levelDataObj[rowNow[2]]),null,'\t')
                            showLevel(0,Math.floor(rowNow[1]/20),interaction.channel)
                            cooldownObj[interaction.guildId].users[interaction.user.id] = Math.floor(Date.now() / 1000) + cooldownObj[interaction.guildId].cooldowns.row;
                            cooldownObj[interaction.guildId] = markStatistic(interaction.user.id,"column",cooldownObj[interaction.guildId],1)
                            fs.writeFileSync(cooldownPath,JSON.stringify(cooldownObj[interaction.guildId]),null,'\t')
                        }
                    })
                    break;
                case "cancelrow":
                    await interaction.reply({content:"action canceled!",flags:MessageFlags.Ephemeral})
                    break;
                case "confirmreset":
                    interaction.deferReply({flags:MessageFlags.Ephemeral}).then(() => {
                        let emojiIndex = currentReset[interaction.user.id][2].search(emojiRegE)
                        let idthig = interaction.guildId;
                        levelPath = path.join(__dirname,"leveldatafold/" + String(idthig) + ".txt")
                        if(emojiIndex == -1) {
                            interaction.editReply("please send a string with an actual emoji in it")
                        }else{
                            let emojiStrig = currentReset[interaction.user.id][2].match(emojiRegE)[0]
                            let numberThing = checkEmoji(emojiStrig)
                            if(numberThing) {
                                var width = (currentReset[interaction.user.id][0] != undefined) ? currentReset[interaction.user.id][0] : levelDataObj[interaction.guildId].levelData[0].length;
                                var height = (currentReset[interaction.user.id][1] != undefined) ? currentReset[interaction.user.id][1] : levelDataObj[interaction.guildId].levelData.length;
                                if(numberThing != 13 && numberThing != 7) {
                                    levelDataObj[interaction.guildId].levelData = new Array(height)
                                    levelDataObj[interaction.guildId].charData = [];
                                    levelDataObj[interaction.guildId].dialogueStuff = [];
                                    levelDataObj[interaction.guildId].necessaryDeaths = 0;
                                    levelDataObj[interaction.guildId].background = 0;
                                    levelDataObj[interaction.guildId].endCoord = undefined;
                                    levelDataObj[interaction.guildId].tokenCoord = undefined;
                                    levelDataObj[interaction.guildId].name = "Untitled";
                                    for(let y = 0; y < height; y ++) {
                                        levelDataObj[interaction.guildId].levelData[y] = new Array(width)
                                        levelDataObj[interaction.guildId].levelData[y].fill(numberThing-1)
                                    }
                                    try{
                                        try{
                                            interaction.editReply({content:"board reset!",flags:MessageFlags.Ephemeral})
                                        }catch (error) {
                                            console.log(error)
                                        }finally{
                                            interaction.channel.send(`<@${interaction.user.id}> reset the board to a ${width} by ${height} grid of ${gameEmojis[1][numberThing-1].toLowerCase()} tiles!`)  
                                        }   
                                    }catch(error){
                                        console.log(error)
                                    }finally{
                                        fs.writeFileSync(levelPath,JSON.stringify(levelDataObj[interaction.guildId]),null,'\t') 
                                        showLevel(0,0,interaction.channel);  
                                    }
                                }else if(numberThing-1 == 6) {
                                    interaction.editReply({content:"End gates are not allowed with this function.",flags:MessageFlags.Ephemeral})
                                }else if(numberThing-1 == 12) {
                                    interaction.editReply({content:"Win tokens are not allowed with this function.",flags:MessageFlags.Ephemeral})
                                }

                            }else{
                                interaction.editReply({content:"invalid emoji! check with key to make sure you're placing a correct one",flags:MessageFlags.Ephemeral})
                            }
                        }
                    })
                    break;
                case "cancelreset":
                    await interaction.reply({content:"action canceled!",flags:MessageFlags.Ephemeral})
                    break;
                case "setbg":
                    interaction.deferReply({flags:MessageFlags.Ephemeral}).then(() => {
                        levelPath = path.join(__dirname,"leveldatafold/" + interaction.guildId + ".txt")
                        let bgToSet = Number(interaction.message.content.replaceAll(/\D+/g,""))-1
                        interaction.editReply({content:"background set!", flags:MessageFlags.Ephemeral})
                        let bgNum2 = (bgToSet >= 10) ? "00" + bgToSet : "000" + bgToSet;
                        levelDataObj[interaction.guildId].background = bgToSet;
                        embedTest = {
                            title: 'Background Number ' + (bgToSet+1),
                            image:{
                                url:`https://raw.githubusercontent.com/coppersalts/HTML5b/ec69f9e875985f69392664ecda0c300c2830f638/visuals/bg/bg${bgNum2}.png`
                            }
                        }
                        fs.writeFileSync(levelPath,JSON.stringify(levelDataObj[interaction.guildId]),null,'\t')  
                        interaction.channel.send({content:`<@${interaction.user.id}> set the background to background #${bgToSet+1}!`,embeds:[embedTest]})
                        cooldownObj[interaction.guildId].background = Math.floor(Date.now() / 1000) + cooldownObj[interaction.guildId].cooldowns.background;
                        cooldownObj[interaction.guildId] = markStatistic(interaction.user.id,"background",cooldownObj[interaction.guildId],1)
                        fs.writeFileSync(cooldownPath,JSON.stringify(cooldownObj[interaction.guildId]),null,'\t')
                    })
                    break;
                case "copylevel":
                    interaction.deferReply({flags:MessageFlags.Ephemeral}).then(() => {
                        levelPath = path.join(__dirname,"leveldatafold/" + interaction.guildId + ".txt")
                        let rawDataPrev = fs.readFileSync(levelPath)
                        let rawData = JSON.parse(rawDataPrev);
                        let longmode = "L";
                        for(var y = 0; y < rawData.levelData.length; y++) {
                            for(var x = 0; x < rawData.levelData[y].length; x++) {
                                if(rawData.levelData[y][x] >= 111) {
                                    longmode = "H"
                                    break;
                                }
                            }
                        }
                        let toSend = ""
                        toSend += rawData.name + "\n"
                        toSend += twoDigitNum(rawData.levelData[0].length) + "," + twoDigitNum(rawData.levelData.length) + "," + twoDigitNum(rawData.charData.length) + "," + twoDigitNum(rawData.background) + "," + longmode + "\n"
                        for(var y = 0; y < rawData.levelData.length; y++) {
                            for(var x = 0; x < rawData.levelData[y].length; x++) {
                                if(longmode == "H") {
                                    toSend += String(tileTo(Math.floor(rawData.levelData[y][x]/111)))
                                    toSend += String(tileTo(rawData.levelData[y][x]%111))
                                }else{
                                    toSend += String(tileTo(rawData.levelData[y][x]))
                                }
                            }
                            toSend += "\n"
                        }
                        for(var i = 0; i < rawData.charData.length; i++) {
                            toSend += twoDigitNum(rawData.charData[i].id) + "," + "0" + (rawData.charData[i].xpos-0.5) + "0,0" + rawData.charData[i].ypos + ".00," + twoDigitNum(rawData.charData[i].charstate);
                            if(rawData.charData[i].charstate == 3 || rawData.charData[i].charstate == 4) {
                                toSend += " " + String(rawData.charData[i].speed).padStart(2,"0")
                                for(var j = 0; j < rawData.charData[i].movementData.length; j++) {
                                    let m = 0;
                                    m = rawData.charData[i].movementData[j].dist;
                                    while(m > 0) {
                                        toSend += rawData.charData[i].movementData[j].dire;
                                        m--;
                                    }
                                }
                            }
                            toSend += "\n"
                        }
                        toSend += twoDigitNum(rawData.dialogueStuff.length) + "\n"
                        for(var i = 0; i < rawData.dialogueStuff.length; i++) {
                            toSend += twoDigitNum(rawData.dialogueStuff[i].char) + ((rawData.dialogueStuff[i].happy) ? "H" : "S") + " " + rawData.dialogueStuff[i].message;
                            toSend += "\n";
                        }
                        toSend += String(rawData.necessaryDeaths).padStart(6,"0")
                        let bufferpath = path.join(__dirname,"levelbuffer.txt")
                        fs.writeFileSync(bufferpath,toSend)
                        let attachh = new AttachmentBuilder()
                        attachh.attachment = bufferpath
                        attachh.name = "stringforyou.txt"
                        interaction.editReply({files: [attachh], content: "Here is a string of the current level, have fun (you can use Coppersalts HTML5b to play)!", flags:MessageFlags.Ephemeral})
                    });
                    break;
                case "confirmload":
                    let toLoad;
                    interaction.deferReply({flags:MessageFlags.Ephemeral}).then(() => {
                        if(currentReload[interaction.guildId]) {
                            try{
                                toLoad = JSON.parse(currentReload[interaction.guildId])
                            }catch(error){
                                interaction.editReply("This JSON is invalid! Make sure you have the correct bot string.")
                                console.log(error)
                            }finally{
                                if(toLoad == undefined){

                                }else{
                                    if(typeof toLoad.necessaryDeaths != "number" || toLoad.necessaryDeaths > 999999 ) toLoad.necessaryDeaths = 0;
                                    if(typeof toLoad.background != "number" || toLoad.background > 12) toLoad.background = 0;
                                    toLoad.name = String(toLoad.name)
                                    if(toLoad.name.match(!/^[\u0020-\u007e\u00a0-\u00ff‘’]*$/)) {
                                        interaction.editReply("Invalid name! Please only include regular printable characters.")
                                    }
                                    else{
                                        if(toLoad.levelData == undefined) interaction.editReply("The level data is missing!")
                                        else if(!Array.isArray(toLoad.levelData)) {
                                            interaction.editReply("The level data is not an array!")
                                        }
                                        else{
                                            let goodToGo = true;
                                            let rowLength;
                                            for(let y = 0; y < toLoad.levelData.length; y++) {
                                                if(y == 0) rowLength = toLoad.levelData[y].length
                                                if(!Array.isArray(toLoad.levelData[y])) {
                                                    interaction.editReply("The value at the level data index " + y + " is not an array!")
                                                    goodToGo = false;
                                                    break;
                                                }else{
                                                    if(toLoad.levelData[y].length != rowLength && y != 0) {
                                                        if(toLoad.levelData[y].length > rowLength) toLoad.levelData[y].length = rowlength
                                                        else while(toLoad.levelData[y].length < rowLength) toLoad.levelData[y].push(0)
                                                    }else{
                                                        for(let x = 0; x < toLoad.levelData[y].length; x++) {
                                                            if(typeof toLoad.levelData[y][x] != "number") {
                                                                toLoad.levelData[y][x] = 0;
                                                            }
                                                            if(!((toLoad.levelData[y][x] >= 0 && toLoad.levelData[y][x] < 112) || (toLoad.levelData[y][x] >= 130 && toLoad.levelData[y][x] <= 134))) toLoad.levelData[y][x] = 0;
                                                            toLoad.levelData[y][x] = Math.floor(toLoad.levelData[y][x])
                                                        }
                                                    }
                                                }
                                            }
                                            if(goodToGo) {
                                                if(!Array.isArray(toLoad.charData)) {
                                                    toLoad.charData = [];
                                                }else{
                                                    for(var i = 0; i < toLoad.charData.length; i++) {
                                                        for(var j = 0; j < charValues.length; j++) {
                                                            if(typeof toLoad.charData[i][charValues[j]] != "number" && charValues[j] != "movementData") {
                                                                if(charValues[j] == "charstate") toLoad.charData[i][charValues[j]] = 8
                                                                else toLoad.charData[i][charValues[j]] = 1
                                                            }else if(!Array.isArray(toLoad.charData[i][charValues[j]]) && j == "movementData") {
                                                                toLoad.charData[i][charValues[j]] = [];
                                                            }
                                                            for(var k = 0; k < toLoad.charData[i].movementData.length; k++) {
                                                                if(!(toLoad.charData[i].movementData[k].dire >= 0 && toLoad.charData[i].movementData[k].dire <= 3) || !(toLoad.charData[i].movementData[k].dist >= 0) || typeof toLoad.charData[i].movementData[k].dire != "number" || typeof toLoad.charData[i].movementData[k].dist != "number" ) {
                                                                    toLoad.charData[i].movementData[k].dire = 0;
                                                                    toLoad.charData[i].movementData[k].dist = 1;
                                                                }
                                                                toLoad.charData[i].movementData[k].dire = Math.floor(toLoad.charData[i].movementData[k].dire)
                                                                toLoad.charData[i].movementData[k].dist = Math.floor(toLoad.charData[i].movementData[k].dist)
                                                            }
                                                            if(j < 4) toLoad.charData[i][charValues[j]] = Math.ceil(toLoad.charData[i][charValues[j]])
                                                        }
                                                        toLoad.charData[i].xpos = Math.min(Math.max(1,toLoad.charData[i].xpos),toLoad.levelData[0].length)
                                                        toLoad.charData[i].ypos = Math.min(Math.max(1,toLoad.charData[i].ypos),toLoad.levelData.length)
                                                        if(statevalues.indexOf(toLoad.charData[i].charstate) == -1) toLoad.charData[i].charstate = 8;
                                                    }
                                                    if(!Array.isArray(toLoad.dialogueStuff)) {
                                                        toLoad.dialogueStuff = [];
                                                    }else{
                                                        for(var i = 0; i < toLoad.dialogueStuff.length; i++) {
                                                            if(typeof toLoad.dialogueStuff[i].char != "number" || toLoad.dialogueStuff[i].char >= toLoad.charData.length || toLoad.dialogueStuff[i].char < 0) {
                                                                toLoad.dialogueStuff[i].char = 0;
                                                            }else if(typeof toLoad.dialogueStuff[i].happy != "boolean") {
                                                                toLoad.dialogueStuff[i].happy = true;
                                                            }
                                                            toLoad.dialogueStuff[i].message = String(toLoad.dialogueStuff[i].message)
                                                            if(toLoad.dialogueStuff[i].message.match(!/^[\u0020-\u007e\u00a0-\u00ff‘’]*$/)) {
                                                                toLoad.dialogueStuff[i].message = ""
                                                            }
                                                            toLoad.dialogueStuff[i].char = Math.round(toLoad.dialogueStuff[i].char)
                                                        }
                                                    }
                                                }
                                                levelPath = path.join(__dirname,"leveldatafold/" + interaction.guildId + ".txt")
                                                levelDataObj[interaction.guildId] = toLoad;
                                                fs.writeFileSync(levelPath,JSON.stringify(levelDataObj[interaction.guildId]),null,'\t')
                                                showLevel(0,0,interaction.channel)
                                                interaction.editReply("level loaded!")
                                                interaction.channel.send("<@" + interaction.user.id + "> has loaded in a new level!")
                                            }
                                        }
                                    }
                                }
                            }
                        }else{
                            interaction.editReply("No strings have been found in the loader. Try loading again.")
                        }
                    });
                    break;
                case "seemore":
                    let start = parseInt(interaction.message.embeds[0].data.title.substring(interaction.message.embeds[0].data.title.lastIndexOf(" ")+1))
                    interaction.deferReply({flags:MessageFlags.Ephemeral}).then(() => {
                        checkLevelFile(interaction.guildId)
                        if(start >= levelDataObj[interaction.guildId].dialogueStuff.length) {
                            interaction.editReply("dialogue is out of bounds!")
                        }else{
                            let toSend = "";
                            let thisSend = ""
                            let incomplete = false;
                            for(let i = start; i < levelDataObj[interaction.guildId].dialogueStuff.length; i++) {
                                charId = (levelDataObj[interaction.guildId].dialogueStuff[i].char == 99 || switchnums.includes(levelDataObj[interaction.guildId].dialogueStuff[i].char)) ? 99 : levelDataObj[interaction.guildId].charData[levelDataObj[interaction.guildId].dialogueStuff[i].char].id
                                if(switchnums.includes(levelDataObj[interaction.guildId].dialogueStuff[i].char)) thisSend = "`Line " + (i+1) +": (" + switchcolors[levelDataObj[interaction.guildId].dialogueStuff[i].char-50] + " switch event) `\n"
                                else thisSend = "`Line " + (i+1) +": Character " + (Math.min(levelDataObj[interaction.guildId].dialogueStuff[i].char+1,99)) + ": " + charEmojis[2][charId] + " " + charEmojis[1][charId] + ", saying \"" + levelDataObj[interaction.guildId].dialogueStuff[i].message + "\" " + ((levelDataObj[interaction.guildId].dialogueStuff[i].happy) ? "positively" : "negatively.") + "`\n"
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
                            let embedTest = new EmbedBuilder().setTitle("Dialogue" + ((incomplete) ? " Lines " + (start+1) + " through " + incomplete : "") ).setDescription(toSend)
                            interaction.editReply({embeds:[embedTest],flags:MessageFlags.Ephemeral,components:[thrag]})
                        }

                });
                    break;
                }

        }else if(interaction.type == 5) {

        }
    }else{
        interaction.reply("You can't use those here.")
    }
});

client.on(Events.ClientReady, async interaction => {
    client.guilds.cache.forEach((key,value) => {
        let guildid = String(value)
        levelPath = path.join(__dirname,"leveldatafold/" + guildid + ".txt")
        checkLevelFile(guildid)
        checkSettingsFile(guildid)
    })
});

client.on(Events.GuildCreate, async guild => {
    levelPath = path.join(__dirname,"leveldatafold/" + String(guild.id) + ".txt")
    let guildid = String(guild.id)
    checkLevelFile(guildid)
    checkSettingsFile(guildid)
});

client.login(process.env.TOKEN)

function checkLevelFile(idthig) {
    levelPath = path.join(__dirname,"leveldatafold/" + String(idthig) + ".txt")
    try{
        levelDataObj[idthig] = JSON.parse(String(fs.readFileSync(levelPath)));
    }catch(error){
        levelDataObj[idthig] = {};
        levelDataObj[idthig].levelData = new Array(18);
        for(let i = 0; i < 18; i++) {
            levelDataObj[idthig].levelData[i] = new Array(32);
            for(let j = 0; j < 32; j++) {
                levelDataObj[idthig].levelData[i][j] = 0;
            }
        }
        levelDataObj[idthig].charData = new Array();
        levelDataObj[idthig].charData.push({id:1,xpos:2,ypos:2,charstate:10})
        levelDataObj[idthig].dialogueStuff = new Array();
        levelDataObj[idthig].dialogueStuff.push({char:0,happy:true,message:"Wow! A brand new level....."})
        levelDataObj[idthig].name = "Untitled"
        levelDataObj[idthig].necessaryDeaths = 0;
        levelDataObj[idthig].background = 0;
        fs.writeFileSync(levelPath,JSON.stringify(levelDataObj[idthig]),null,'\t')
    }
    finally{}
}
function checkSettingsFile(idthig) {
    cooldownPath = path.join(__dirname,"/cooldowndatafold/" + String(idthig) + ".txt")
    try{
        cooldownObj[idthig] = JSON.parse(String(fs.readFileSync(cooldownPath)));
    }catch(error){
        cooldownObj[idthig] = {};
        cooldownObj[idthig].cooldowns = new Object();
        cooldownObj[idthig].cooldowns.row = 15*60;
        cooldownObj[idthig].cooldowns.rect = 6*60;
        cooldownObj[idthig].cooldowns.tile = 2*60;
        cooldownObj[idthig].cooldowns.character = 2*60;
        cooldownObj[idthig].cooldowns.dialogue = 2*60;
        cooldownObj[idthig].cooldowns.name = 30*60;
        cooldownObj[idthig].cooldowns.background = 15*60;
        cooldownObj[idthig].cooldowns.copyarr = 90;
        cooldownObj[idthig].users = new Object();
        cooldownObj[idthig].managers = [];
        cooldownObj[idthig].managerRoles = [];
        cooldownObj[idthig].statistics = {};
        cooldownObj[idthig].statistics.userStatistics = {};
        cooldownObj[idthig].statistics.name = 0;
        cooldownObj[idthig].statistics.background = 0;
        cooldownObj[idthig].statistics.row = 0;
        cooldownObj[idthig].statistics.column = 0;
        cooldownObj[idthig].statistics.rect = 0;
        cooldownObj[idthig].statistics.tile = 0;
        cooldownObj[idthig].statistics.character = 0;
        cooldownObj[idthig].statistics.dialogue = 0;
        cooldownObj[idthig].statistics.actions = 0;
        cooldownObj[idthig].statistics.nameCommands = 0;
        cooldownObj[idthig].statistics.backgroundCommands = 0;
        cooldownObj[idthig].statistics.rowCommands = 0;
        cooldownObj[idthig].statistics.columnCommands = 0;
        cooldownObj[idthig].statistics.rectCommands = 0;
        cooldownObj[idthig].statistics.tileCommands = 0;
        cooldownObj[idthig].statistics.characterCommands = 0;
        cooldownObj[idthig].statistics.dialogueCommands = 0;
        fs.writeFileSync(cooldownPath,JSON.stringify(cooldownObj[idthig]),null,'\t')
    }
    finally{
    }
}
function checkEmoji(emojiString) {
    for(let i = 0; i < gameEmojis[0].length; i++) {
        if(emojiString == gameEmojis[0][i]) return i+1;
    }
    return false;
}
function showLevelPriv(interactionn,deferred,viewX,viewY,row,column,messageText,tiles,chars) {
    checkLevelFile(interactionn.guildId)
    let toSend = ""
    let levelData = levelDataObj[interactionn.guildId].levelData;
    let charArray = new Array(levelDataObj[interactionn.guildId].levelData.length)
    for(let i = 0; i < charArray.length; i++) {
        charArray[i] = new Array(levelDataObj[interactionn.guildId].levelData[0].length).fill(9)
    }
    if (messageText == undefined) messageText = ""
    viewYTop = Math.ceil(Math.min((viewY+1)*20,levelData.length))
    viewXTop = Math.ceil(Math.min((viewX+1)*20,levelData[0].length));
    if(chars) {
        for(let i = 0; i < levelDataObj[interactionn.guildId].charData.length; i++) {
            charArray[levelDataObj[interactionn.guildId].charData[i].ypos-1][levelDataObj[interactionn.guildId].charData[i].xpos-1] = levelDataObj[interactionn.guildId].charData[i].id;
            if(levelDataObj[interactionn.guildId].charData[i].id == 55) {
                for(let j = Math.max(levelDataObj[interactionn.guildId].charData[i].ypos-19,0); j < levelDataObj[interactionn.guildId].charData[i].ypos-1; j++) {
                    charArray[j][levelDataObj[interactionn.guildId].charData[i].xpos-1] = levelDataObj[interactionn.guildId].charData[i].id;
                }
            }
        }
    }
    for(let y = viewY*20; y < viewYTop; y++) {
        toSend += "``"
        for(let x = viewX*20; x < viewXTop; x++) {
            //console.log(y)
            if(column != undefined && x == column) toSend += "🚩"
            else if(row != undefined && y == row) toSend += "🚩" 
            else if(chars && charArray[y][x] != 9) toSend += charEmojis[1][charArray[y][x]]
            else if(tiles !== false) toSend += gameEmojis[0][levelData[y][x]]
            else if(tiles == false && charArray[y][x] == 9) toSend += "❎"

        }
        toSend += "``\n"
    }
    
    let exampleembed = new EmbedBuilder().setTitle('"' + levelDataObj[interactionn.guild.id].name + '"' + " Tiles " + (viewX*20+1) + "x" + (viewY*20+1) + " to " + viewXTop + "x" + viewYTop).setDescription(toSend)
    const copylevel = new ButtonBuilder()
        .setCustomId('copylevel')
        .setLabel('Copy Level String')
        .setStyle(ButtonStyle.Primary);
    const shiftright = new ButtonBuilder()
        .setCustomId('shiftright')
        .setLabel('Shift View Right')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(((viewX+1)*20) >= levelData[0].length);
    const shiftleft = new ButtonBuilder()
        .setCustomId('shiftleft')
        .setLabel('Shift View Left')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(viewX == 0);
    const shiftdown = new ButtonBuilder()
        .setCustomId('shiftdown')
        .setLabel('Shift View Down')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(((viewY+1)*20) >= levelData.length);
    const shiftup = new ButtonBuilder()
        .setCustomId('shiftup')
        .setLabel('Shift View Up')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(viewY == 0);
    const confirmRow = new ButtonBuilder()
        .setCustomId('confirmrow')
        .setLabel('Yes')
        .setStyle(ButtonStyle.Primary)
    const cancelRow = new ButtonBuilder()
        .setCustomId('cancelrow')
        .setLabel('No')
        .setStyle(ButtonStyle.Danger)
    let bttns; 
    if(row != undefined || column != undefined) bttns = new ActionRowBuilder().addComponents(confirmRow,cancelRow)
    else bttns = new ActionRowBuilder().addComponents(copylevel,shiftleft,shiftright,shiftdown,shiftup);

    let messageOBJ = {embeds:[exampleembed],components:[bttns],flags:MessageFlags.Ephemeral,withResponse:true,content:messageText}

    if(deferred) interactionn.editReply(messageOBJ).then((response) => {
        currentMessage[interactionn.user.id] = interactionn;
        setTimeout(() => interactionn.editReply({components:[]}), 60_000)
    })
    else interactionn.reply(messageOBJ).then((response) => {currentMessage[interactionn.user.id] = interactionn;})
    if(row != undefined || column != undefined) currentRow[interactionn.user.id] = [(row == undefined) ? "column" : "row",(row == undefined) ? column : row, interactionn.guildId]
}
function showLevel(viewX,viewY,channelSend) {
    checkLevelFile(channelSend.guild.id)
    let toSend = ""
    let levelData = levelDataObj[channelSend.guild.id].levelData;
    viewYTop = Math.min((viewY+1)*20,levelData.length)
    viewXTop = Math.min((viewX+1)*20,levelData[0].length);
    let charArray = new Array(levelDataObj[channelSend.guild.id].levelData.length).fill()
    for(let i = 0; i < charArray.length; i++) {
        charArray[i] = new Array(levelDataObj[channelSend.guild.id].levelData[0].length).fill(9)
    }
    for(let i = 0; i < levelDataObj[channelSend.guild.id].charData.length; i++) {
        charArray[levelDataObj[channelSend.guild.id].charData[i].ypos-1][levelDataObj[channelSend.guild.id].charData[i].xpos-1] = levelDataObj[channelSend.guild.id].charData[i].id;
        if(levelDataObj[channelSend.guild.id].charData[i].id == 55) {
            for(let j = Math.max(levelDataObj[channelSend.guild.id].charData[i].ypos-19,0); j < levelDataObj[channelSend.guild.id].charData[i].ypos-1; j++) {
                charArray[j][levelDataObj[channelSend.guild.id].charData[i].xpos-1] = levelDataObj[channelSend.guild.id].charData[i].id;
            }
        }
    }
    for(let y = viewY*20; y < viewYTop; y++) {
        toSend += "``"
        for(let x = viewX*20; x < viewXTop; x++) {
            if(charArray[y][x] != 9) toSend += charEmojis[1][charArray[y][x]]
            else toSend += gameEmojis[0][levelData[y][x]]
        }
        toSend += "``\n"
    }
    if(toSend == "") toSend = "Nothing here...maybe an error occured oops"
    let exampleembed = new EmbedBuilder().setTitle('"' + levelDataObj[channelSend.guild.id].name + '"' + " Tiles " + (viewX*20+1) + "x" + (viewY*20+1) + " to " + viewXTop + "x" + viewYTop).setDescription(toSend)
    const copylevel = new ButtonBuilder()
        .setCustomId('copylevel')
        .setLabel('Copy Level String')
        .setStyle(ButtonStyle.Primary);
    const shiftright = new ButtonBuilder()
        .setCustomId('shiftright')
        .setLabel('Shift View Right')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(((viewX+1)*20) >= levelData[0].length);
    const shiftleft = new ButtonBuilder()
        .setCustomId('shiftleft')
        .setLabel('Shift View Left')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(viewX == 0);
    const shiftdown = new ButtonBuilder()
        .setCustomId('shiftdown')
        .setLabel('Shift View Down')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(((viewY+1)*20) >= levelData.length);
    const shiftup = new ButtonBuilder()
        .setCustomId('shiftup')
        .setLabel('Shift View Up')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(viewY == 0);
    const bttns = new ActionRowBuilder()
        .addComponents(copylevel);
    channelSend.send({embeds:[exampleembed],components:[bttns]})
}
function twoDigitNum(nubmer) {
    if(nubmer >= 10) return String(nubmer)
    else return "0"+String(nubmer)
}
function necessaryDeaths(nubmer) {
    var zeroes;
    if(nubmer == 0) return "000000"
    else{
      var zeroes = 5 - Math.floor(Math.log10(nubmer))
        var toReturn = ""
        while(zeroes > 0) {
            toReturn += "0"
            zeroes--;
        }
        toReturn += String(nubmer)
        return toReturn
    }
}
function tileTo(num) {
	if(num == 93) {
		return "€"
	}else if(num <= 80) {
		return String.fromCharCode(num+46)
		trace(String.fromCharCode(num+46))
	}else if(num <= 102) {
		return String.fromCharCode(num+80);
	}else{
		return String.fromCharCode(num+81);
	}
}
function checkPerms(member,interactionn) {
    perms = member.permissionsIn(interactionn.channel).has("0x0000000000000020")
    let roleOBJ = member.roles.valueOf();
    rolePerm = false;
    for(let i = 0; i < cooldownObj[interactionn.guildId].managerRoles.length; i ++) {
        if(roleOBJ.get(cooldownObj[interactionn.guildId].managerRoles[i]) != undefined) rolePerm = true;
    }
    let userPerm = cooldownObj[interactionn.guildId].managers.includes(interactionn.user.id)
    return (perms || rolePerm || userPerm)
}
function formSec(nubmer) {
	let minutes = Math.floor(nubmer/60)
	let seconds = nubmer % 60;
	return minutes + " minutes and " + seconds + " seconds"
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
