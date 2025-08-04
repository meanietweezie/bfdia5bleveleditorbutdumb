const { SlashCommandBuilder,EmbedBuilder,Embed, MessageFlags, PermissionFlagsBits, AttachmentBuilder} = require('discord.js');
const path = require("node:path");
const fs = require("node:fs");
const sharp = require("sharp");
const {Jimp,intToRGBA,colorDiff,RG} = require("jimp");
const convert = require("color-convert");
let parentPath = String(__dirname).slice(0,String(__dirname).lastIndexOf("src")+3)
//imagemagick.identify.path = path.join(parentPath.replace("\\src",""),"node_modules","node-imagemagick","index.js");
const validImageTypes = ["image/png", "image/jpeg", "image/webp"];
function calculateColorDistance(imgPix, tileCol) {
    const dx = tileCol.h - imgPix.h;
    const dy = tileCol.s - imgPix.s;
    const dz = tileCol.v - imgPix.v;
    if(tileCol.v > 10 && imgPix.v < 10) return 10000000
    return Math.sqrt(dx * dx + (dy * dy + dz * dz)/3);
}
function calculateColorDistance2(imgPix, tileCol) {
    return Math.sqrt((imgPix.r - tileCol.r)**2 + (imgPix.g - tileCol.g)**2 + (imgPix.b - tileCol.b)**2);
}


const tileColors = [
  { "sim": "./", "h": 0.0, "s": 90.91, "v": 81.96, "r": 209, "g": 19, "b": 19 },
  { "sim": ".¯", "h": 0.0, "s": 44.79, "v": 63.92, "r": 163, "g": 90, "b": 90 },
  { "sim": ".7", "h": 0.0, "s": 63.1, "v": 32.94, "r": 84, "g": 31, "b": 31 },
  { "sim": ".º", "h": 0.0, "s": 100.0, "v": 100.0, "r": 255, "g": 0, "b": 0 },
  { "sim": ".q", "h": 0.0, "s": 0.0, "v": 0.0, "r": 0, "g": 0, "b": 0 },
  { "sim": ".¼", "h": 0.0, "s": 0.0, "v": 20.0, "r": 51, "g": 51, "b": 51 },
  { "sim": ".²", "h": 0.0, "s": 0.0, "v": 31.37, "r": 80, "g": 80, "b": 80 },
  { "sim": "..", "h": 0.0, "s": 0.0, "v": 100.0, "r": 255, "g": 255, "b": 255 },
  { "sim": ".¸", "h": 12.0, "s": 100.0, "v": 100.0, "r": 255, "g": 85, "b": 0 },
  { "sim": ".»", "h": 36.3, "s": 75.7, "v": 41.96, "r": 107, "g": 88, "b": 41 },
  { "sim": ".¶", "h": 36.92, "s": 96.86, "v": 100.0, "r": 255, "g": 170, "b": 3 },
  { "sim": ".®", "h": 37.38, "s": 50.0, "v": 47.84, "r": 122, "g": 102, "b": 61 },
  { "sim": ".€", "h": 37.41, "s": 50.0, "v": 66.67, "r": 170, "g": 142, "b": 85 },
  { "sim": ".M", "h": 48.0, "s": 100.0, "v": 94.12, "r": 240, "g": 240, "b": 0 },
  { "sim": ".N", "h": 48.06, "s": 100.0, "v": 82.75, "r": 211, "g": 211, "b": 0 },
  { "sim": "/B", "h": 51.2, "s": 64.1, "v": 91.76, "r": 234, "g": 229, "b": 88 },
  { "sim": ".´", "h": 85.88, "s": 100.0, "v": 100.0, "r": 134, "g": 255, "b": 0 },
  { "sim": ".9", "h": 107.06, "s": 60.0, "v": 33.33, "r": 54, "g": 85, "b": 34 },
  { "sim": ".8", "h": 108.11, "s": 85.38, "v": 50.98, "r": 18, "g": 130, "b": 37 },
  { "sim": ".o", "h": 120.0, "s": 85.65, "v": 87.45, "r": 32, "g": 223, "b": 32 },
  { "sim": ".j", "h": 120.0, "s": 85.23, "v": 69.02, "r": 26, "g": 176, "b": 26 },
  { "sim": ".b", "h": 215.94, "s": 100.0, "v": 79.22, "r": 0, "g": 47, "b": 202 },
  { "sim": ".a", "h": 216.0, "s": 100.0, "v": 100.0, "r": 0, "g": 51, "b": 255 },
  { "sim": ".w", "h": 276.0, "s": 100.0, "v": 100.0, "r": 204, "g": 0, "b": 255 },
  { "sim": ".{", "h": 277.89, "s": 54.81, "v": 40.78, "r": 105, "g": 47, "b": 104 },
  { "sim": "./", "h": 330.0, "s": 90.91, "v": 81.96, "r": 209, "g": 19, "b": 104 },
  { "sim": ".¯", "h": 330.0, "s": 44.79, "v": 63.92, "r": 163, "g": 90, "b": 118 },
  { "sim": ".7", "h": 330.0, "s": 63.1, "v": 32.94, "r": 84, "g": 31, "b": 55 },
  { "sim": ".º", "h": 330.0, "s": 100.0, "v": 100.0, "r": 255, "g": 0, "b": 128 },
  { "sim": "/A", "h": 206.21, "s": 60.0, "v": 100.0, "r": 102, "g": 170, "b": 255 }
]
const successMessages = [
    "here's your Strig....enjoy...teehee...",
    "ok i did the Thig. yay",
    "here ye here ye!",
    "i did it! i hope it comes out right. would be a real shame if it didn't",
    "paws at you",
    "i did the thing. i hope you like it. if you don't, well, that's too bad. i don't care. but i hope you do. because i did it for you. and i care about you. and i want you to be happy. and i want you to smile. and i want you to laugh. and i want you to have fun. and i want you to enjoy yourself. and i want you to feel good. and i want you to be proud of yourself. and i want you to know that you're awesome",
    "spongebob squarepants!"
]
module.exports = {
    data: new SlashCommandBuilder()
        .setName("imagetolevel")
        .setDescription("sorry oskar")
        .addSubcommand(
            subcommand => subcommand.setName("customdim").setDescription("Custom dimensions for the image to level conversion.")
            .addAttachmentOption(option => option.setName("image").setDescription("Image to convert to a level.").setRequired(true))
            .addIntegerOption(option => option.setName("width").setDescription("Width of the level in tiles.").setMinValue(1).setMaxValue(400).setRequired(true))
            .addIntegerOption(option => option.setName("height").setDescription("Height of the level in tiles.").setMinValue(1).setMaxValue(400).setRequired(true))
            .addBooleanOption(option => option.setName("huefocus").setDescription("Toggles on hue-saturation-value comparing rather than RGB comparing, often improving color matching.").setRequired(false))
        ).addSubcommand(
            subcommand => subcommand.setName("scale").setDescription("Scale down the image chosen, retaining the aspect ratio.")
            .addAttachmentOption(option => option.setName("image").setDescription("Image to convert to a level.").setRequired(true))
            .addIntegerOption(option => option.setName("scale").setDescription("Percentage of original dimensions.").setMinValue(1).setMaxValue(100).setRequired(true))
            .addBooleanOption(option => option.setName("huefocus").setDescription("Toggles on hue-saturation-value comparing rather than RGB comparing, often improving color matching.").setRequired(false))
        ),
    
    async execute(interaction) { 
        interaction.deferReply({flags:MessageFlags.Ephemeral}).then(() => {
            
            let sub = interaction.options.getSubcommand();
            let image = interaction.options.getAttachment("image");
            let width = interaction.options.getInteger("width");
            let height = interaction.options.getInteger("height");
            let scale = interaction.options.getInteger("scale");
            let hueFocus = interaction.options.getBoolean("huefocus");
            if(!validImageTypes.includes(image.contentType)) {
                interaction.editReply("this isn't the right type of image bro use a png. or a jpeg. or a webp. yeah. maybe i'll add more later idk");
            }else{
                //console.log(image.proxyURL);
                const type = image.contentType.split("/")[1];
                const imgPath = path.join(parentPath, "temp_image."+type);
                const file = fs.createWriteStream(imgPath);
                
                let ifMaxed = "";
                require('https').get(image.attachment, response => {
                    response.pipe(file);

                    file.on('finish', () => {
                        file.close();
                        console.log(`Image downloaded as ${image.name}`);
                        interaction.editReply(`image ${image.name} received. processing...`);
                        sharp(imgPath).metadata().then(metadata => {
                            console.log(metadata)
                            if(sub == "scale"){
                                width = Math.floor(metadata.width * (scale / 100));
                                height = Math.floor(metadata.height * (scale / 100));
                            }
                            const higher = Math.max(width, height);
                            if(higher > 400) {
                                if(width >= height) {
                                    height = Math.floor(height * (400 / higher));
                                    width = 400;
                                }else{
                                    width = Math.floor(width * (400 / higher));
                                    height = 400;
                                }
                                ifMaxed = " (maxed to 400 tiles)" + (width == 400 ? " long" : " tall" + ".");
                            }
                            sharp(imgPath).resize(width, height, {fit:"fill"}).png().toFile(path.join(parentPath,"newimg.png")).then(() => {
                                console.log(`Image resized to ${width}x${height}`);
                                let level = image.name + "\r\n";
                                level += width + "," + height + ",00,00,H\r\n";
                                interaction.editReply(`Image ${image.name} has been converted to a level with dimensions ${width}x${height}.`);
                                Jimp.read(path.join(parentPath,"newimg.png")).then((img) => {

                                    for(let y = 0; y < height; y++) {
                                        for(let x = 0; x < width; x++) {
                                            const color = img.getPixelColor(x, y);
                                            const hex = intToRGBA(color);
                                            if(hex.a < 30) {
                                                level += "..";
                                            }else{
                                                let closestColor = null;
                                                if(hueFocus) {
                                                    const [h, s, v] = convert.rgb.hsv(hex.r, hex.g, hex.b);
                                                    let hsvPix = { h, s, v }
                                                    let closestDiff = Infinity;
                                                    tileColors.forEach(value => {
                                                        const diff = calculateColorDistance(hsvPix, value);
                                                        if(diff < closestDiff) {
                                                            closestDiff = diff;
                                                            closestColor = value.sim;
                                                        }
                                                        
                                                    })
                                                }else{
                                                    let closestDiff = Infinity;
                                                    tileColors.forEach(value => {
                                                        const diff = calculateColorDistance2(hex, value);
                                                        if(diff < closestDiff) {
                                                            closestDiff = diff;
                                                            closestColor = value.sim;
                                                        }
                                                        
                                                    })
                                                }
                                                level += closestColor;
                                            }
                                        }
                                        level += "\r\n";
                                    }
                                    level += "00\r\n00000"
                                    fs.unlink(imgPath, err => {
                                        if (err) console.error("Error deleting temporary image file:", err);
                                    });
                                    //fs.unlinkSync(path.join(parentPath,"newimg.jpeg"));
                                    const levelPath = path.join(parentPath, image.name + ".txt");
                                    fs.writeFile(levelPath, level, (err) => {
                                        if (err) {
                                            console.error("Error writing level file:", err);
                                            interaction.editReply("woops something bad happened. try again maybe");
                                        } else {
                                            const attachment = new AttachmentBuilder(levelPath);
                                            interaction.editReply({
                                                content: successMessages[Math.floor(Math.random() * successMessages.length)] + ifMaxed,
                                                files: [attachment]
                                                
                                            });
                                            //fs.unlinkSync(levelPath);
                                        }
                                    });
                                });
                            
                            }).catch(err => {
                                console.error("Error resizing image:", err);
                                interaction.editReply("woops something bad happened. try again maybe");
                            });
                            

                        }).catch(err => {
                            console.error("Error reading image metadata:", err);
                            interaction.editReply("woops something bad happened. try again maybe. make sure the image is valid.");
                        });
                        
                            
                    });
                }).on('error', err => {
                    fs.unlink(imageName);
                    console.error(`Error downloading image: ${err.message}`);
                });
                
            }
        });
    }
}