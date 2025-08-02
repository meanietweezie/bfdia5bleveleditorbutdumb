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
    return Math.abs(imgPix.r - tileCol.r) + Math.abs(imgPix.g - tileCol.g) + Math.abs(imgPix.b - tileCol.b);
}


const tileColors = [
  { "sim": "./", "h": 0.0, "s": 90.91, "v": 81.96 },
  { "sim": ".¯", "h": 0.0, "s": 44.79, "v": 63.92 },
  { "sim": ".7", "h": 0.0, "s": 63.1, "v": 32.94 },
  { "sim": ".º", "h": 0.0, "s": 100.0, "v": 100.0 },
  { "sim": "/A", "h": 0.0, "s": 60.0, "v": 100.0 },
  { "sim": ".q", "h": 0.0, "s": 0.0, "v": 0.0 },
  { "sim": ".¼", "h": 0.0, "s": 0.0, "v": 20.0 },
  { "sim": ".²", "h": 0.0, "s": 0.0, "v": 31.37 },
  { "sim": "..", "h": 0.0, "s": 0.0, "v": 100.0 },
  { "sim": ".¸", "h": 12.0, "s": 100.0, "v": 100.0 },
  { "sim": ".»", "h": 36.3, "s": 75.7, "v": 41.96 },
  { "sim": ".¶", "h": 36.92, "s": 96.86, "v": 100.0 },
  { "sim": ".®", "h": 37.38, "s": 50.0, "v": 47.84 },
  { "sim": ".€", "h": 37.41, "s": 50.0, "v": 66.67 },
  { "sim": ".M", "h": 48.0, "s": 100.0, "v": 94.12 },
  { "sim": ".N", "h": 48.06, "s": 100.0, "v": 82.75 },
  { "sim": "/B", "h": 51.2, "s": 64.1, "v": 91.76 },
  { "sim": ".´", "h": 85.88, "s": 100.0, "v": 100.0 },
  { "sim": ".9", "h": 107.06, "s": 60.0, "v": 33.33 },
  { "sim": ".8", "h": 108.11, "s": 85.38, "v": 50.98 },
  { "sim": ".o", "h": 120.0, "s": 85.65, "v": 87.45 },
  { "sim": ".j", "h": 120.0, "s": 85.23, "v": 69.02 },
  { "sim": ".b", "h": 215.94, "s": 100.0, "v": 79.22 },
  { "sim": ".a", "h": 216.0, "s": 100.0, "v": 100.0 },
  { "sim": ".w", "h": 276.0, "s": 100.0, "v": 100.0 },
  { "sim": ".{", "h": 277.89, "s": 54.81, "v": 40.78 },
  { "sim": "./", "h": 330.0, "s": 90.91, "v": 81.96 },
  { "sim": ".¯", "h": 330.0, "s": 44.79, "v": 63.92 },
  { "sim": ".7", "h": 330.0, "s": 63.1, "v": 32.94 },
  { "sim": ".º", "h": 330.0, "s": 100.0, "v": 100.0 },
  { "sim": "/A", "h": 330.0, "s": 60.0, "v": 100.0 }
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
            
        ).addSubcommand(
            subcommand => subcommand.setName("scale").setDescription("Scale down the image chosen, retaining the aspect ratio.")
            .addAttachmentOption(option => option.setName("image").setDescription("Image to convert to a level.").setRequired(true))
            .addIntegerOption(option => option.setName("scale").setDescription("Percentage of original dimensions.").setMinValue(1).setMaxValue(100).setRequired(true))
            
        ),
    
    async execute(interaction) { 
        interaction.deferReply({flags:MessageFlags.Ephemeral}).then(() => {
            
            let sub = interaction.options.getSubcommand();
            let image = interaction.options.getAttachment("image");
            let width = interaction.options.getInteger("width");
            let height = interaction.options.getInteger("height");
            let scale = interaction.options.getInteger("scale");
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
                                Jimp.read(path.join(parentPath,"newimg.jpeg")).then((img) => {

                                    for(let y = 0; y < height; y++) {
                                        for(let x = 0; x < width; x++) {
                                            const color = img.getPixelColor(x, y);
                                            const hex = intToRGBA(color);
                                            if(hex.a < 30) {
                                                level += "..";
                                            }else{
                                                hex.a = 255;
                                                const [h, s, v] = convert.default.rgb.hsv(hex.r, hex.g, hex.b);
                                                let hsvPix = { h, s, v }
                                                let closestColor = null;
                                                let closestDiff = Infinity;
                                                tileColors.forEach(value => {
                                                    const diff = calculateColorDistance(hsvPix, value);
                                                    if(diff < closestDiff) {
                                                        closestDiff = diff;
                                                        closestColor = value.sim;
                                                    }
                                                    
                                                })
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