/** 
 *  Developed By Rasya R. @chocopys
 *  Protected By MIT License
 *  My Instagram : https://instagram.com/r.rdtyptr
 *  My Github : https://github.com/Rasya25
*/

import baileys from "@whiskeysockets/baileys";
import config from "../dist/config.js"
import { appenTextMessage } from "./lib/serialize.js";
import * as Func from "./lib/functions.js"
import os from "os"
import util from "util"
import chalk from "chalk"
import { readFileSync, unwatchFile, watchFile, writeFileSync } from "fs";
import axios from 'axios';
import { fileURLToPath } from "url";
import { exec } from "child_process";
import speed from "performance-now"
import ytdl from 'youtubedl-core';
import { performance } from "perf_hooks";
import { writeExif } from "./lib/sticker.js"
import dScrape from "d-scrape";
import { GPT4, igdl, DownTracks, Spotifys, tiktokdl, processing, ytmp3, ytmp4, search, qc } from "./scapers/route.js"
import { toImage } from "./lib/converts.js";

const antilink = JSON.parse(readFileSync('./dist/db/antilink.json'));
const usr = JSON.parse(readFileSync('./dist/db/users.json'));

/**
 *
 * @export
 * @param {*} client
 * @param {*} store
 * @param {*} m
 * @return {*} 
 */


export default async function message(client, store, m, chatUpdate) {
    try {
        (m.type === 'conversation') ? m.message.conversation : (m.type == 'imageMessage') ? m.message.imageMessage.caption : (m.type == 'videoMessage') ? m.message.videoMessage.caption : (m.type == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.type == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.type == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.type == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.type == 'interactiveResponseMessage') ? appenTextMessage(JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id, chatUpdate, m, client) : (m.type == 'templateButtonReplyMessage') ? appenTextMessage(m.msg.selectedId, chatUpdate, m, client) : (m.type === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ''
        let quoted = m.isQuoted ? m.quoted : m
        let downloads = async (fileName) => await client.downloadMediaMessage(quoted, fileName)
        let isOwner = JSON.stringify(config.owner).includes(m.sender.replace(/\D+/g, "")) || false
        let isUsers = usr.includes(m.sender)
        let isCommand = (m.prefix && m.body.startsWith(m.prefix)) || false
        let isAntiLink = antilink.includes(m.from) && m.isGroup

        if (isAntiLink) {
            if (m.body.includes("whatsapp.com") || m.body.includes("chat.whatsapp")) {
                if (m.isAdmin) return;
                if (m.isCreator) return;
                await client.sendMessage(m.from, { delete: quoted.key })
            }
        }

        if (m.isBot) return;

        if (m.message && !m.isBot) {
            if (!isUsers) {
                usr.push(m.sender)
                writeFileSync('./dist/db/users.json', JSON.stringify(usr, null, 2))
            }

            console.log(
                `${chalk.blackBright.bold.blue("FROM")}: ${chalk.bgYellow.bold.black(m.pushName + " => " + m.sender)}\n` +
                `${chalk.blackBright.bold.blue("IN")}: ${chalk.magenta(m.isGroup ? "👥 Group" : "👤 Private")}\n` +
                `${chalk.blackBright.bold.blue("MESSAGE")}: ${chalk.bold.green(m.body || m.type)}\n` +
                `${chalk.blackBright.bold.blue("TYPE")}: ${chalk.bgBlue.bold.yellow(m.type)}\n` +
                `${chalk.blackBright.bold.blue("TIME")}: ${chalk.bold.red(new Date().toLocaleTimeString())}\n` +
                `--------------------------------------------------\n` +
                `${chalk.blue("Rasya R. - @chocopys")}\n` +
                `--------------------------------------------------`
            );
        }

        // Remind Pray
        client.autoshalat = client.autoshalat ? client.autoshalat : {};
        let who =
          m.mentionedJid && m.mentionedJid[0]
        ? m.mentionedJid[0]
        : m.fromMe
          ? client.user.id
          : m.sender;
        let id = m.chat;
        if (id in client.autoshalat) {
          return false;
        }
        let jadwalSholat = {
          Shubuh: "04:12",
          Dzuhur: "11:27",
          Ashar: "14:48",
          Maghrib: "17:20",
          Isya: "18:43",
          Tahajud: "00:05",
        };
        const datek = new Date(
          new Date().toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
          }),
        );
        const hours = datek.getHours();
        const minutes = datek.getMinutes();
        const timeNow = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
        for (let [sholat, waktu] of Object.entries(jadwalSholat)) {
          if (timeNow === waktu) {
        let caption = `Hello kak ${m.pushName}, *Waktu ${sholat}* telah tiba, ambilah air wudhu dan segeralah shalat .\n\n*${waktu}*\n_Untuk wilayah JawaTimur dan sekitarnya._\n\n_Luangkan Waktu Mu Sejenak Untuk Mendekatkan Diri Kepada Yang Maha Kuasa_`;
        client.autoshalat[id] = [
          m.reply(caption),
          setTimeout(async() => {
        delete client.autoshalat[m.chat];
          }, 57000),
        ];
          }
        }

        switch (isCommand ? m.command.toLowerCase() : false) {
            case "menu":
            case "allmenu":
            case "help": {
                let txt = `Hello ${m.pushName} 👋🏻\n\n`;
                Object.entries(config.cmd).forEach(([category, commands]) => {
                    txt += `*${Func.toUpper(category)} Commands*\n`
                    txt += `* ${commands.map(command => `${m.prefix + command}`).join('\n- ')}\n\n`
                })
                await m.reply(txt)
            }
                break

            // Don't delete this!
            case 'tqto':
            case 'thanksto':
                {const tqto = ["Allah SWT.", "Nabi Muhammad SAW.", "My Parrents.", "My Friends.", "Rasya R.", "Xyz Teams ( All Members )."]
                let txt = "*Thanks To:*\n";
                tqto.map(v => txt += `* ${v}\n`);
                client.sendMs(m.from, txt, m)}
                break
            
            case "alive": case "runtime": {
                m.reply(`Runtime : ${Func.runtime(process.uptime())}`)
            }
                break
            case 'ping':
            case 'botstatus':
            case 'statusbot': {
                const used = process.memoryUsage()
                const cpus = os.cpus().map(cpu => {
                    cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0)
                    return cpu
                })
                const cpu = cpus.reduce((last, cpu, _, { length }) => {
                    last.total += cpu.total
                    last.speed += cpu.speed / length
                    last.times.user += cpu.times.user
                    last.times.nice += cpu.times.nice
                    last.times.sys += cpu.times.sys
                    last.times.idle += cpu.times.idle
                    last.times.irq += cpu.times.irq
                    return last
                }, {
                    speed: 0,
                    total: 0,
                    times: {
                        user: 0,
                        nice: 0,
                        sys: 0,
                        idle: 0,
                        irq: 0
                    }
                })
                let timestamp = speed()
                let latensi = speed() - timestamp
                let neww = performance.now()
                let oldd = performance.now()
                let respon = `
Kecepatan Respon ${latensi.toFixed(4)} _Second_ \n ${oldd - neww} _miliseconds_

💻 Info Server
RAM: ${Func.formatp(os.totalmem() - os.freemem())} / ${Func.formatp(os.totalmem())}

_NodeJS Memory Usaage_
${Object.keys(used).map((key, _, arr) => `${key.padEnd(Math.max(...arr.map(v => v.length)), ' ')}: ${Func.formatp(used[key])}`).join('\n')}

${cpus[0] ? `_Total CPU Usage_
${cpus[0].model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}
_CPU Core(s) Usage (${cpus.length} Core CPU)_
${cpus.map((cpu, i) => `${i + 1}. ${cpu.model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}`).join('\n\n')}` : ''}
`.trim()
client.sendMessage(m.from, {
                    text: respon,
                    contextInfo: {
                        externalAdReply: {
                            title: "Information Server",
                            body: '',
                            thumbnail: config.img.server,
                            showAdAttribution: true,
                            renderLargerThumbnail: true,
                            mediaType: 1
                        }
                    }
                }, { quoted: m });
            }
            break
            
            case "owner":
            case "creator":
            case "author": {
                await client.sendContact(m.from, config.owner, m)
                m.reply("this my developers don't spamm and call!")
            }
                break

            case 'get':
            case 'fetch': {
                if (!m.text) return client.sendMs(m.from, config.mess.query, m)
                const res = await axios.request(m.text, {
                    method: 'GET',
                    headers: {
                        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Windows; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36"
                    }
                })
                if (!/text|json/.test(res.headers['content-type'])) {
                    if (res.headers['content-length'] > 300 * 1024 * 1024) return m.reply('File terlalu besar')
                    return m.reply(util.format(res.data))
                } else {
                    return m.reply(util.format(res.data))
                }
            }
                break


            case "ai":
            case "openai": {
                if (!m.text) return client.sendMs(m.from, config.mess.query, m);
                await GPT4(m.text).then((res) => {
                    client.sendMs(m.from, res, m);
                }).catch((err) => {
                    console.error(err)
                    client.sendMs(m.from, config.mess.error, m)
                })
            }
                break
            case "remini":
            case "hdr":
            case "hd":
            case "upscale": {
                client.enhancer = client.enhancer ? client.enhancer : {};
                if (Number(quoted.msg.fileLength.low) > 500000) return m.reply("The file is too large.")
                if (m.sender in client.enhancer) return m.reply("Please wait, there is still something in process")
                if (/image|webp/.test(quoted.msg.mimetype)) {
                    client.enhancer[m.sender] = true
                    try {
                        let media = await downloads();
                        let upload = await Func.upload.telegra(media);
                        let res = await Func.getBuffer(upload);
                        let imageData = Buffer.from(res, 'binary');
                        let pros = await processing(imageData, 'enhance');
                        var error;
                        client.sendMessage(m.from, { image: pros, caption: config.mess.success }, { quoted: m });
                    } catch (err) {
                        console.error(err)
                        client.sendMs(m.from, config.mess.error, m)
                        error = true
                        delete client.enhancer[m.sender]
                    } finally {
                        if (error) return m.reply("Error processing the image.");
                        delete client.enhancer[m.sender]
                    }
                } else {
                    client.sendMs(m.from, config.mess.src, m)
                }
            }
                break

                case "tweetc": {
                    if (!m.text) return m.reply("Please enter the text.")
                    let replies = Math.floor(Math.random() * 100) + 1
                    let likes = Math.floor(Math.random() * 1000) + 1
                    let retweets = Math.floor(Math.random() * 100) + 1
                    let api = `https://some-random-api.com/canvas/misc/tweet?displayname=${m.pushName}&username=${m.pushName}&avatar=https://i.pinimg.com/564x/8a/e9/e9/8ae9e92fa4e69967aa61bf2bda967b7b.jpg&comment=${m.text}&replies=${replies + 'k'}&likes=${likes + 'k'}&retweets=${retweets + "k"}&theme=dark`
                    await client.sendMessage(m.from, { image: { url: api } }, { quoted: m })
                }
                    break
                case "ytc":
                case "ytcomment": {
                    if (!m.text) return m.reply("Please enter the text.")
                    let api = `https://some-random-api.com/canvas/misc/youtube-comment?username=${m.pushName}&avatar=https://i.pinimg.com/564x/8a/e9/e9/8ae9e92fa4e69967aa61bf2bda967b7b.jpg&comment=${m.text}`
                    await client.sendMessage(m.from, { image: { url: api } }, { quoted: m })
                }
                    break
                    
            // Pinterest Command by Adrian
            case 'pin':
            case 'pinterest': {
                if (!m.text) return client.sendMs(m.from, config.mess.query, m);
                const [query, countStr] = m.text.split("|");
                const rules = JSON.parse(readFileSync('./dist/db/pinterest.json'));
                if (rules.some(rule => m.text.includes(rule))) return client.sendMs(m.from, config.mess.notAllow, m);
                let count = countStr ? parseInt(countStr) : 1;
                if (!query) return client.sendMs(m.from, config.mess.query, m);
                if (count > 10) return client.sendMs(m.from, 'Max 10', m);

                try {
                    const res = await dScrape.search.pinterest(query);
                    if (!res || res.length === 0) return client.sendMs(m.from, config.mess.notfound, m);
                    const jmlh = []
                    for (let i = 0; i < count; i++) {
                        const pick = Func.pickRandom(res)
                        jmlh.push(pick)
                    }
                    if (jmlh.length === 1) {
                        await client.sendImage(m.from, jmlh[0], query, m)
                    } else {
                        await client.sendCard(m.from, `Pinterest: ${query.toUpperCase()}`, jmlh)
                    }
                } catch (error) {
                    console.error(error);
                    return client.sendMs(m.from, config.mess.error, m);
                }
            }
                break;

            case 'addrulespin':
            case 'addpinrule': {
                if (!m.text) return client.sendMs(m.from, 'Enter Rules', m)
                const rules = JSON.parse(readFileSync('./dist/db/pinterest.json'))
                if (rules.includes(m.text)) return client.sendMs(m.from, 'Rules already exist', m);
                rules.push(m.text)
                writeFileSync('./dist/db/pinterest.json', JSON.stringify(rules))
                client.sendMs(m.from, 'Rules Added', m)
            }
                break

            case 'delrulespin':
            case 'delpinrule': {
                if (!m.text) return client.sendMs(m.from, 'Enter Rules', m)
                const rules = JSON.parse(readFileSync('./dist/db/pinterest.json'))
                if (!rules.includes(m.text)) return client.sendMs(m.from, 'There are no rules', m);
                rules.splice(rules.indexOf(m.text), 1)
                writeFileSync('./dist/db/pinterest.json', JSON.stringify(rules))
                client.sendMs(m.from, 'Rules Removed', m)
            }
                break

            // Downloader
            case 'igdl':
            case 'instagram':
            case 'ig': {
                if (!m.text) return client.sendMs(m.from, config.mess.query, m)
                if (!/instagram.com/.test(m.text)) return client.sendMs(m.from, 'Invalid URL', m)
                await igdl(m.text).then(async (res) => {
                    if (res.length === 0) return client.sendMs(m.from, 'Instagram Tidak Ditemukan', m)
                    for (let i = 0; i < res.length; i++) {
                        if (res[i].includes("https://scontent.cdninstagram.com")) {
                            await client.sendImage(m.from, res[i], '', m)
                        } else {
                            await client.sendVideo(m.from, res[i], '', m)
                        }
                    }
                }).catch(() => client.sendMs(m.from, 'Instagram Tidak Ditemukan', m))
            }
                break
            case 'igstory':
            case 'igstalker': {
                if (!m.text) return client.sendMs(m.from, 'Send Nickname Instagram', m)
                await dScrape.downloader.igStory('https://www.instagram.com/stories/' + m.text).then(async (res) => {
                    if (res.length === 0) return client.sendMs(m.from, 'Story Tidak Ditemukan Atau Username Tidak Valid', m)
                    for (let i = 0; i < res.length; i++) {
                        if (res[i].url.includes("https://scontent.cdninstagram.com")) {
                            await client.sendImage(m.from, res[i].url, '', m)
                        } else {
                            await client.sendVideo(m.from, res[i].url, '', m)
                        }
                    }
                }).catch((err) => {
                    console.log(err);
                    client.sendMs(m.from, config.mess.error, m)
                });
            }
                break
            case 'mediafire':
            case 'mf': {
                if (!m.text) return client.sendMs(m.from, config.mess.query, m);
                if (/mediafire.com/.test(m.text)) return client.sendMs(m.from, 'Invalid URL', m);
                const res = await dScrape.downloader.mediafire(m.text);
                const size = 0
                if (res.size.includes('GB')) return size = parseInt(res.size) * 1024
                if (res.size.includes('MB')) return size = parseInt(res.size)

                if (size > 100) return client.sendMs(m.from, 'File too large', m)
                await client.sendMessage(m.from, {
                    document: {
                        url: res.url,
                        mimetype: "application/" + res.title.split('.').pop(),
                        filename: res.title,
                        caption: `*Title:* ${res.title}\n*Size:* ${res.size}\n*Download:* ${res.url}`
                    }
                })
            }
                break

            // Source XyzTeam n Adrian
            case "tiktok": {
                if (!m.text) return client.sendMs(m.from, config.mess.query, m)
                await client.sendList(m.from, '*Tiktok Downloader*', '(c) 2024 PycosAI', { title: 'Click Me :)', sections: [{ title: "Pilih Salah Satunya", highlight_label: 'Rekomendasi', rows: [{ title: "Video Tiktok", decoreion: "Download Video Tiktok", id: '.tiktokdl ' + m.text }, { title: "Audio Tiktok", decoreion: "Download Audio Tiktok", id: '.tiktokaudiodl ' + m.text }] }] })
            }
                break

            case 'tiktokdl':
            case 'ttdl':
            case 'tt': {
                if (!m.text) return client.sendMs(m.from, config.mess.query, m);
                if (!m.text.includes('tiktok.com')) return client.sendMs(m.from, 'Invalid Tiktok URL', m)
                await tiktokdl(m.text).then(async (res) => {
                    if (res.status === false) return client.sendMs(m.from, 'Video Not Found', m);
                    await client.sendMessage(m.from, { video: { url: res.server1.url }, caption: res.caption }, { quoted: m });
                }).catch(() => client.sendMs(m.from, 'Video Not Found', m));
            }
                break;

            case 'tiktokaudiodl':
            case 'tiktokmusic': {
                if (!m.text) return client.sendMs(m.from, config.mess.query, m);
                if (!m.text.includes('tiktok.com')) return client.sendMs(m.from, 'Invalid Tiktok URL', m)
                const { audio } = await dScrape.downloader.tiktok(m.text)
                if (!audio) return client.sendMs(m.from, 'Music Not Found', m);
                await client.sendMessage(m.from, { audio: { url: audio }, mimeType: 'audio/mp4' }, { quoted: m });
            }
                break

            case "spotify": {
                if (!m.text) return client.sendMs(m.from, config.mess.query, m)
                let res = await Spotifys(m.text)
                if (res.length === 0) return client.sendMs(m.from, 'Not Found', m)
                await client.sendList(m.from, 'Spotify Search', '(c) 2024 PycosAI', {
                    title: 'Click Me :)',
                    sections: [
                        {
                            title: 'Result',
                            highlight_label: "Best Result",
                            rows: res.map(a => ({
                                title: a.name.toUpperCase(),
                                decoreion: a.artist.toUpperCase(),
                                id: '.spotifydl ' + a.url
                            }))
                        }]
                })
            }
                break

            case "spotifydl": {
                if (!m.text) return client.sendMs(m.from, config.mess.query, m)
                const res = await DownTracks(m.text);
                await client.sendMessage(m.from, { audio: res, mimetype: 'audio/mp4' }, { quoted: m });
            }
                break

            case "play":
            case "ytplay": {
                if (!m.text) return client.sendMs(m.from, config.mess.query, m)
                let res = await search(m.text)
                if (res.length === 0) return client.sendMs(m.from, config.mess.notfound, m)
                client.sendList(m.from, "Result", "(c) 2024 PycosAI", {
                    title: 'Click Me :)',
                    sections: [{
                        title: "Hasil Pencarian",
                        highlight_label: "Best Result",
                        rows: res.map(a => ({
                            title: a.title.toUpperCase(),
                            description: a.description.toUpperCase(),
                            id: `.ytdl ${a.url}`
                        }))
                    }]
                })
            }
                break

            case "ytdl":
            case "yt":
            case "youtube": {
                if (!m.text) return client.sendMs(m.from, config.mess.query, m)
                let img = (await ytdl.getInfo(m.text)).videoDetails.thumbnails[4].url
                const { title, description } = (await ytdl.getBasicInfo(m.text)).videoDetails
                const text = `*${title.toUpperCase()}*\n\n${description}`
                client.sendListWithImage(m.from, text, "(c) 2024 PycosAI", { title: 'Click Me :)', sections: [{ title: "Pilih Format", rows: [{ title: "MP3", decoreion: "Download lagu dalam format MP3", id: `.ytmp3 ${m.text}` }, { title: "MP4", decoreion: "Download video dalam format MP4", id: `.ytmp4 ${m.text}` }] }] }, img, { contextInfo: { mentionedJid: [m.sender], isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: "120363182916458068@newsletter", newsletterName: '(c) 2024 PycosAI', serverMessageId: -1 }, } })
            }
                break

            case "ytmp3": {
                if (!m.text) return client.sendMs(m.from, config.mess.query, m)
                let res = await ytmp3(client, m, m.text)
                client.sendMs(m.from, config.config.mess.wait, m)
                if (res instanceof Error) return m.reply("Error: " + res.message)
            }
                break

            case "ytmp4": {
                if (!m.text) return client.sendMs(m.from, config.mess.query, m)
                let res = await ytmp4(client, m, m.text)
                client.sendMs(m.from, config.config.mess.wait, m)
                if (res instanceof Error) return m.reply("Error: " + res.message)
            }
                break
            // N

            case "antilink": {
                if (!m.isGroup) return client.sendMs(m.from, config.mess.group, m);
                if (!m.isAdmin) return client.sendMs(m.from, config.mess.admin, m);
                if (!m.isBotAdmin) return client.sendMs(m.from, config.mess.botAdmin, m);
                if (!m.text) return client.sendMs(m.from, "Please enter the command.", m);
                if (!m.text.startsWith("on") && !m.text.startsWith("off")) return client.sendMs(m.from, "Please enter on or off.", m);
                if (m.text === "on") {
                    if (antilink.includes(m.from)) return client.sendMs(m.from, "Anti-link has been activated in this group.", m);
                    antilink.push(m.from);
                    writeFileSync("./dist/db/antilink.json", JSON.stringify(antilink));
                    client.sendMs(m.from, "Successfully activated anti-link in this group.", m);
                } else if (m.text === "off") {
                    if (!antilink.includes(m.from)) return m.reply("Anti-link has been disabled in this group.");
                    antilink.splice(antilink.indexOf(m.from), 1);
                    writeFileSync("./dist/db/antilink.json", JSON.stringify(antilink));
                    client.sendMs(m.from, "Successfully deactivated anti-link in this group.", m);
                }
            }
                break
            case "hidetag":
            case "h": {
                if (!m.isGroup) return client.sendMs(m.from, config.mess.group, m);
                if (!m.isAdmin && !m.isCreator) return client.sendMs(m.from, config.mess.admin, m);
                if (!m.isBotAdmin) return client.sendMs(m.from, config.mess.botAdmin, m);
                if (!m.text) return client.sendMs(m.from, "Please enter the message.", m);
                if (quoted.isMedia) {
                    await m.reply({ forward: quoted, force: true, mentions: m.metadata.participants.map(a => a.id) })
                } else {
                    await client.sendMessage(m.from, { text: m.text ? m.text : "", mentions: m.metadata.participants.map(a => a.id) }, { quoted: m })
                }
            }
                break
            case 'kick': {
                if (!m.isGroup) return client.sendMs(m.from, config.mess.group, m);
                if (!m.isAdmin) return client.sendMs(m.from, config.mess.admin, m);
                if (!m.isBotAdmin) return client.sendMs(m.from, config.mess.botAdmin, m);
                const users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                if (m.sender === users) return client.sendMs(m.from, 'You can\'t kick yourself', m)
                if (!users) return client.sendMs(m.from, 'Please tag the person you want to kick', m)
                await client.groupParticipantsUpdate(m.from, [users], 'remove').then(() => {
                    client.sendMs(m.from, 'Success kick member', m)
                }).catch(() => {
                    client.sendMs(m.from, 'Failed to kick member', m)
                })
            }
                break
            case 'add': {
                if (!m.isGroup) return client.sendMs(m.from, config.mess.group, m);
                if (!m.isAdmin) return client.sendMs(m.from, config.mess.admin, m);
                if (!m.isBotAdmin) return client.sendMs(m.from, config.mess.botAdmin, m);
                const users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                if (!users) return client.sendMs(m.from, 'Please tag the person you want to add', m)
                await client.groupParticipantsUpdate(m.from, [users], 'add').then(() => {
                    client.sendMs(m.from, 'Success add member', m)
                }).catch(() => {
                    client.sendMs(m.from, 'Failed to add member', m)
                })
            }
                break


            case "rvo":
            case 'readviewonce': {
                if (!quoted.msg.viewOnce) return client.sendMs(m.from, 'Reply to a message with .rvo', m)
                quoted.msg.viewOnce = false
                await m.reply({ forward: quoted, force: true })
            }
                break
            case "delete":
            case "del": {
                if (quoted.fromMe) {
                    await client.sendMessage(m.from, { delete: quoted.key })
                } else {
                    if (!m.isBotAdmin) return client.sendMs(m.from, config.mess.botAdmin, m)
                    if (!m.isAdmin) return client.sendMs(m.from, config.mess.admin, m)
                    await client.sendMessage(m.from, { delete: quoted.key })
                }
            }
                break
            case "tourl": {
                if (!quoted.isMedia) return client.sendMs(m.from, config.mess.src, m)
                if (Number(quoted.msg.fileLength) > 10000000) return m.reply("The file is too large.")
                let media = await downloads();
                let url = (/video|image|webp/.test(quoted.msg.mimetype)) ? await Func.upload.telegra(media) : await Func.upload.pomf(media);
                await m.reply(url)
            }
                break
            case "qoute":
            case "quotely":
            case "qc":
            case "fakechat": {
                const avatar = await client.profilePictureUrl(m.sender, 'image').catch(() => 'https://i.pinimg.com/564x/8a/e9/e9/8ae9e92fa4e69967aa61bf2bda967b7b.jpg');
                if (!m.text) return client.sendMs(m.from, 'Please enter the message.', m)
                const res = await qc(m.text, avatar, m.pushName)
                let sticker = await writeExif({ mimetype: 'image/png', data: await Buffer.from(res.result.image, 'base64') }, { packName: config.env.packName, packPublish: config.env.packPublish });
                await m.reply({ sticker })
            }
                break;

            case 's':
            case 'sticker': {
                if (!quoted.isMedia) return client.sendMs(m.from, config.mess.src, m)
                let media = await downloads();
                let exif;
                if (m.text) {
                    let [packname, author] = m.text.split(/[,|\-+&]/);
                    exif = { packName: packname ? packname : '', packPublish: author ? author : '' };
                } else {
                    exif = { packName: config.env.packName, packPublish: config.env.packPublish };
                }
                let sticker = await writeExif({ mimetype: quoted.msg.mimetype, data: media }, exif);
                await m.reply({ sticker });
            }
                break

            case 'toimg':
            case 'toimage': {
                if (!quoted.isMedia) return client.sendMs(m.from, config.mess.src, m)
                let media = await downloads();
                await toImage(media).then(async (res) => {
                    await client.sendMessage(m.from, { image: res.data, mimetype: 'image/jpeg' }, { quoted: m });
                }).catch((err) => {
                    console.error(err)
                    client.sendMs(m.from, config.mess.error, m)
                })
            }
                break
            case 'listonline':
            case 'liston': {
                if (!m.isGroup) return client.sendMs(m.from, config.mess.group, m)
                if (!m.isAdmin) return client.sendMs(m.from, config.mess.admin, m)
                let id = m.args && /\d+\-\d+@g.us/.test(m.args[0]) ? m.args[0] : m.from
                let online = [...Object.keys(store.presences[id]), m.botNumber]
                let liston = 1
                let txt = `*List Online Members*\n\n`
                for (let user of online) {
                    txt += `${liston++}. ${user.replace(/@.+/, '')}\n`
                }
                await client.sendMs(m.from, txt, m)
            }
                break
            default:
                if (['>', 'eval', '=>'].some(a => m.command.toLowerCase().startsWith(a)) && isOwner) {
                    let evalCmd = '';
                    try {
                        evalCmd = /await/i.test(m.text) ? eval('(async() => { ' + m.text + ' })()') : eval(m.text);
                    } catch (e) {
                        evalCmd = e;
                    }
                    new Promise((resolve, reject) => {
                        try {
                            resolve(evalCmd);
                        } catch (err) {
                            reject(err);
                        }
                    })
                        ?.then(res => m.reply(util.format(res)))
                        ?.catch(err => m.reply(util.format(err)));
                }
                if (['$', 'exec'].some(a => m.command.toLowerCase().startsWith(a)) && isOwner) {
                    try {
                        exec(m.text, async (err, stdout) => {
                            if (err) return m.reply(util.format(err));
                            if (stdout) return m.reply(util.format(stdout));
                        });
                    } catch (e) {
                        await m.reply(util.format(e));
                    }
                }
        }
    } catch (e) {
        console.log(e);
        client.sendMessage("6285791346128@whatsapp.net", {text: "Hello My Devs, this error please fix it!\n\n" + e}, {quoted:m})
    }
}

let pathF = fileURLToPath(import.meta.url);
watchFile(pathF, () => {
    unwatchFile(pathF);
    console.log(`Successfully To Update File ${pathF}`)
})