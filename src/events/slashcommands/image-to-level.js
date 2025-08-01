const { SlashCommandBuilder,EmbedBuilder,Embed, MessageFlags, PermissionFlagsBits, AttachmentBuilder} = require('discord.js');
const path = require("node:path");
const fs = require("node:fs");
const sharp = require("sharp");
const {Jimp,intToRGBA,colorDiff,RG} = require("jimp");
let parentPath = String(__dirname).slice(0,String(__dirname).lastIndexOf("src")+3)
//imagemagick.identify.path = path.join(parentPath.replace("\\src",""),"node_modules","node-imagemagick","index.js");
const validImageTypes = ["image/png", "image/jpeg", "image/webp"];
function calculateColorDistance(col1, col2) {
    const dx = col2.r - col1.r;
    const dy = col2.g - col1.g;
    const dz = col2.b - col1.b;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
function calculateColorDistance2(col1, col2) {
    return Math.abs(col1.r - col2.r) + Math.abs(col1.g - col2.g) + Math.abs(col1.b - col2.b);
}
const tileColors = {
  "./": { "r": 209, "g": 19, "b": 19 },
  ".¸": { "r": 255, "g": 51, "b": 0 },
  ".¯": { "r": 163, "g": 90, "b": 90 },
  ".7": { "r": 84, "g": 31, "b": 31 },
  ".º": { "r": 255, "g": 0, "b": 0 },
  ".¶": { "r": 255, "g": 160, "b": 8 },
  ".»": { "r": 107, "g": 75, "b": 26 },
  ".®": { "r": 122, "g": 99, "b": 61 },
  ".€": { "r": 170, "g": 138, "b": 85 },
  ".M": { "r": 240, "g": 192, "b": 0 },
  ".N": { "r": 211, "g": 169, "b": 0 },
  "/B": { "r": 234, "g": 212, "b": 84 },
  ".o": { "r": 32, "g": 223, "b": 32 },
  ".j": { "r": 26, "g": 176, "b": 26 },
  ".´": { "r": 145, "g": 255, "b": 0 },
  ".8": { "r": 41, "g": 130, "b": 19 },
  ".9": { "r": 45, "g": 85, "b": 34 },
  "/A": { "r": 255, "g": 102, "b": 102 },
  ".a": { "r": 0, "g": 102, "b": 255 },
  ".b": { "r": 0, "g": 81, "b": 202 },
  ".w": { "r": 153, "g": 0, "b": 255 },
  ".{": { "r": 83, "g": 47, "b": 104 },
  ".q": { "r": 0, "g": 0, "b": 0 },
  ".¼": { "r": 51, "g": 51, "b": 51 },
  ".²": { "r": 80, "g": 80, "b": 80 },
  //"..": { "r": 255, "g": 255, "b": 255},
}
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
                            sharp(imgPath).resize(width, height, {fit:"fill"}).jpeg().toFile(path.join(parentPath,"newimg.jpeg")).then((data) => {
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
                                                let closestColor = null;
                                                let closestDiff = Infinity;
                                                for(const [key, value] of Object.entries(tileColors)) {
                                                    const diff = calculateColorDistance(hex, value);
                                                    if(diff < closestDiff) {
                                                        closestDiff = diff;
                                                        closestColor = key;
                                                    }
                                                    
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
                                    fs.unlinkSync(path.join(parentPath,"newimg.jpeg"));
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
                /*
                fetch(image.attachment).then(res => {
                    //console.log(res)
                    if (!res.ok) {
                        interaction.editReply("didn't work mb");
                        return;
                    }
                    res.buffer().then(data => {
                        const type = image.contentType.split("/")[1];
                        const imgPath = path.join(parentPath, "temp_image."+type)
                        fs.writeFile(imgPath, data, (erro) => {
                            if(erro) {
                                console.log("error writing image file:", erro);
                                return;
                            }
                            interaction.editReply(`image ${image.name} received. processing...`);
                            
                            imagemagick.identify("https://cdn.discordapp.com/ephemeral-attachments/1400577156857335950/1400640101586964593/hallowe_n_3.png?ex=688d5f3e&is=688c0dbe&hm=677e936776b6d05bb179663b468b2ae7ba010fa45e0db8fb69670a281c07c912&", function(err, features) {
                                if (err) {
                                    console.log("Error identifying image:", err);
                                    interaction.editReply("There was an error processing the image. Please try again with a valid image.");
                                    return;
                                }
                                console.log(features);
                            })
                            
                        })
                    
                    })
                    
                    if(sub == "customdim") {
                        // Handle custom dimensions logic here
                        interaction.editReply(`Image ${image.name} will be converted to a level with dimensions ${width}x${height}.`);
                    } else if(sub == "scale") {
                        interaction.editReply(`Image ${image.name} will be scaled down to ${scale}% of its original size.`);
                    } else {
                        interaction.editReply("Invalid subcommand.");
                    }
                    
                })
                */
            }
        });
    }
}