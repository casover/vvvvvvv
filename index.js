const express = require('express');
const app = express();
const request = require("request")

app.get('/', (req, res) => {
  res.send('Hello Express app!')
})


app.use('/ping', (req, res) => {
  res.send(new Date());
});

app.listen(3000, () => {
  console.log(('Express is ready.').blue.bold)
});

const colors = require("colors");
const wait = require('node:timers/promises').setTimeout;
const { Client, Collection, Partials, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, EmbedBuilder, ActivityType, SlashCommandBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ContextMenuCommandBuilder, ApplicationCommandType, ChannelType, PermissionsBitField, IntentsBitField, AttachmentBuilder } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.GuildMember,
    Partials.Reaction,
    Partials.GuildScheduledEvent,
    Partials.User,
    Partials.ThreadMember
  ],
  shards: "auto",
  allowedMentions: {
    parse: [],
    repliedUser: false
  },
})

process.on("unhandledRejection", e => {
  console.log(e)
})
process.on("uncaughtException", e => {
  console.log(e)
})
process.on("uncaughtExceptionMonitor", e => {
  console.log(e)
})

const prefix = "-";

client.once(Events.ClientReady, bot => {
  console.log((`Logged in as ${bot.user.tag}`).bold.red);
  client.user.setStatus("dnd")
  client.user.setActivity(`${prefix}MLK System`, { type: ActivityType.Listening })
});

setTimeout(() => {
  if (!client || !client.user) {
    console.log("Client Not Login, Process Kill")
    process.kill(1);
  } else {
    console.log("Client Login")
  }
}, 5 * 1000 * 60);

client.login("MTAzNDQ5MDIyMTE4NzgzMzk2Nw.GX_VZI.OFMShuvlvcz1M0pJdX8WXw50s2BpC7tSZ4PWSE").catch((err) => {
  console.log(err.message)
})









client.on("messageCreate", async (message) => {
  try {
    if (message.channel.id != "1169712100436889622") return;
    const args = message.content.trim().split(/ +/g);
    const link = args[0];
    setTimeout(() => {
      if (message.author.bot) return;
      message.delete();
    }, 1000);
    if (
      !link.includes("https://www.tiktok.com/") &&
      link.includes("https://vt.tiktok.com/") &&
      link.includes("https://www.instagram.com")
    )
      return;
    if (
      link.includes("https://www.tiktok.com/") ||
      link.includes("https://vt.tiktok.com/")
    ) {
      message.channel.send({ content: `انتظر التحميل` }).then(async (msg) => {
        const options = {
          method: "GET",
          url: "https://tiktok89.p.rapidapi.com/tiktok",
          qs: {
            link: link,
          },
          headers: {
            "X-RapidAPI-Key":
              "ec9a297239msh041e57e3c5d74e2p1febd1jsnb6c46e61d539",
            "X-RapidAPI-Host": "tiktok89.p.rapidapi.com",
            useQueryString: true,
          },
        };

        request(options, async function(error, response, body) {
          if (error) throw new Error(error);
          const json = JSON.parse(body);
          const attach = new AttachmentBuilder();
          if (json.video.play_addr.url_list[0].endsWith(".mp3")) {
            message.channel.send({ content: `${message.author}` });
            for (let i = 0; i < json.image_post_info.images.length; i++) {
              attach.setFile(
                `${json.image_post_info.images[i].display_image.url_list[0]}`
              ),
                attach.setName(`photo${i}.jpg`);
              message.channel.send({
                files: [attach],
              });
            }
            await msg.delete();
          } else {
            attach.setFile(`${json.video.play_addr.url_list[0]}`);
            attach.setName("video.mp4");
            msg.edit({
              content: `${message.author}`,
              files: [attach],
            });
          }
        });
      });
    } else if (link.includes("https://www.instagram.com")) {
      const options = {
        method: "GET",
        url: "https://instagram-downloader-download-instagram-videos-stories.p.rapidapi.com/index",
        qs: { url: `${link}` },
        headers: {
          "X-RapidAPI-Key":
            "ec9a297239msh041e57e3c5d74e2p1febd1jsnb6c46e61d539",
          "X-RapidAPI-Host":
            "instagram-downloader-download-instagram-videos-stories.p.rapidapi.com",
          useQueryString: true,
        },
      };
      message.channel.send({ content: `انتظر التحميل` }).then(async (msg) => {
        request(options, function(error, response, body) {
          if (error) throw new Error(error);
          const json = JSON.parse(body);

          console.log(json);
          const attach = new AttachmentBuilder();
          if (json.Type == "Story-Image" || json.Type == "Post-Image") {
            attach.setFile(`${json.media}`);
            attach.setName("photo.jpg");
          } else if (json.Type == "Post-Video" || json.Type == "Story-Video") {
            attach.setFile(`${json.media}`);
            attach.setName("video.mp4");
          }
          const embed = new EmbedBuilder()
            .setTitle("Instagram Downloader")
            .setFields({
              name: "title",
              value: `\`${json.title ? json.title : "No title"}\``,
              inline: true,
            })
            .setColor("Random")
            .setTimestamp()
            .setThumbnail(json.thumbnail);
          msg.edit({
            content: `${message.author}`,
            embeds: [embed],
            files: [attach],
          });
        });
      });
    }
  } catch (e) { }
});












client.on('messageCreate', message => {
  if (message.content.startsWith('-help')) {
    return message.reply('**اهلا بك عزيزي العضو انت طلبت المساعده لتحميل مقطع تك توك او انستقرام الرجاء التوجه الى روم <#1095024168946384906> وحط الرابط وانتظر التحميل وشكرا**')
  }
});


const { joinVoiceChannel } = require('@discordjs/voice');
client.on('ready', () => {

  setInterval(async () => {
    client.channels.fetch("1000503790618816672")
      .then((channel) => {
        const VoiceConnection = joinVoiceChannel({
          channelId: channel.id,
          guildId: channel.guild.id,
          adapterCreator: channel.guild.voiceAdapterCreator
        });
      }).catch((error) => { return; });
  }, 1000)
});