/*
Copyright 2021 basharalassad424 (https://github.com/basharalassad424)

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//

require('dotenv').config();

const Discord = require('discord.js');
const COMMAND_CHAR = '!';
const client = new Discord.Client();
const prefix = '!';
const commands = require('./ArmoryCommands.js');
const commonCommands = require('./Commands.js');
const maps_folder = 'Pictures/Map\ Pictures'
const token = process.env.token;
const format = require('./Formatting.js');
const fs = require('fs');
const Q = require('q');
const decks_file = 'Data/decks.txt';
const bot_icon = 'Pictures/bot_icon.png';
const csv = require('csv-parser');
const results = [];
let status = "​";
let color;
let displaylimit = '30';
let limit = '3';
let commoncommands = true;
var heatdata = require('./Data/HeatKeData.json');
var units = require('./Data/UnitData.json');
var stringSimilarity = require('string-similarity');

client.once('ready', () => {
	console.log('Bot running in the index file.');
	client.user.setAvatar(bot_icon);
	client.user.setActivity({
		type: 'WATCHING',
		name: ' the Armory'
	}); //sets the bot's status to the default status
});

String.prototype.replaceAll = function(search, replacement) {
	var target = this;
	return target.replace(new RegExp(search, 'g'), replacement);
};

units.sort((a, b) => (a.Name > b.Name) ? 1 : ((b.Name > a.Name) ? -1 : 0)); //sort the units by name
//start of commands
client.on('error', err => {
	console.log(err)
});

// send welcome message on user join server
client.on('guildMemberAdd', member => {
	const channelId = '845014788488429640'; // welcome channel 
	welcome_msg = `Hi <@${member.id}>. Welcome to the Bashar Al-Assad 10v10 discord!\n\n`; 
	welcome_msg += 'Make sure to read the <#813032700210053130> and <#751452902496927756>. To use this server you must agree to them.\n\n'; 
	welcome_msg += 'Feel free to ask questions and engage with the community!\n\n'; 
	welcome_msg += `Please change your discord nickname on this server to your ingame nickname. You can do this by right clicking here:<@${member.id}>, then change nickname \n\n`; 
	welcome_msg += 'The <#838139755212308480> is where i help you with useful commands. Go there and type !help if you want to learn more.\n\n'; 
	welcome_msg += 'Here <#855996297298313256> you can use reactions and get role assigned to get and send notifications for people looking for games.\n\n'; 
	welcome_msg += 'Check <#813044003925655583> for quick tips for beginners.\n\n'; 
	welcome_msg += 'Report any abuse(game or discord) on <#817357644348129301>, follow the format in the channel description.\n\n'; 
	welcome_msg += 'Stay tuned for announcements on <#834958637394427904>.\n\n';
	welcome_msg += 'Good luck, Have fun!\n';
	const channel = client.channels.cache.get(channelId);
	channel.send(welcome_msg);
});

client.on('message', async message => {
	//message.member = await message.guild.members.fetch(message.author);
	const args = message.content.split(' ');
	if(message.channel.id != '838139755212308480') return;
	if(message.attachments.first())
		if(message.attachments.first().url.endsWith('.wargamerpl2')) {
			commonCommands.replay(args, message);
		}
	if(message.author.bot) {
		return; //if the author of the message is the bot, do nothing.
	}
	if(message.channel.type == "dm") { //If the message is sent via DMs.
		message.reply('WHY ARE YOU SUMMONING ME IN DMS MORTAL');
		return;
	}
	const capitalArgs = message.content.split(' ');
	for(let i = args.length - 1; i >= 0; i--) {
		args[i] = args[i];
	}
	var argsCommaSplit = message.content.split(',');
	var commandName = args.shift();
	if(!commandName.startsWith(COMMAND_CHAR)) {
		return;
	}
	commandName = commandName.slice(1);
	commandName = commandName.toLowerCase();
	let admin = false;
	if(message.author.id === '473148843077271558') {
		admin = true;
	}
	//allows you to check if youre an admin
	if(commandName === 'checkadmin') {
		message.reply(admin ? 'You have the power.' : 'You do not have enough power, mortal.');
	}
	if(commandName === 'ping') {
		message.reply('pong');
	}
	// write commands below this line ---------------------------------------------------
	switch(commandName) {
		case 'dynocommands':
			if(!admin) {
				message.reply('Not enough admin mayo to complete this action');
				return;
			}
			if(commoncommands === true) {
				message.reply('Turned off dyno commands');
				commoncommands = false;
				return;
			} else if(commoncommands === false) {
				message.reply('Turned on dyno commands');
				commoncommands = true;
				console.log(commoncommands);
				return;
			}
			break;
		case 'changelimit':
			if(!admin) {
				message.reply('You must be an admin to use this command');
			} else if(admin) {
				if(!isNaN(args[0])) {
					limit = args[0];
					message.channel.send('Changed unit limit to ' + limit);
				} else if(isNaN(args[0])) {
					message.channel.send('Please use a valid number');
				}
			}
			break;
			//same as !changelimit but changes the limit of matching units displayed in the list
		case 'changedisplaylimit':
			if(!admin) {
				message.reply('You must be an admin to use this command');
			} else if(admin) {
				if(!isNaN(args[0])) {
					displaylimit = args[0];
					message.channel.send('Changed display limit to ' + displaylimit);
				} else if(isNaN(args[0])) {
					message.channel.send('Please use a valid number'); // if args[0] is not a number, throw out args 0 and return this
				}
			}
			break;
			// displays the unit limit
		case 'limit':
			message.reply(limit);
			break;
		case 'displaylimit':
			message.reply(displaylimit);
			break;
		case 'similarity':
			argsCommaSplit[0] = argsCommaSplit[0].replaceAll(/(\w*!similarity\w*)*\s/gi, '').toLowerCase();
			argsCommaSplit[1] = argsCommaSplit[1].replaceAll(/\s/g, '').toLowerCase();
			var similarity = stringSimilarity.compareTwoStrings(argsCommaSplit[0], argsCommaSplit[1]);
			message.channel.send(Math.round(similarity * 100) + '%');
			break;
		case 'userinvite':
			commonCommands.userinvite(message);
			break;
		case 'unit':
			commands.unit(args, message, limit, displaylimit);
			break;
		case 'unitlist':
			commands.unitlist(args, message, limit, displaylimit);
			break;
		case 'list':
			commands.list(args, message, displaylimit);
			break;
		case 'aptable':
			commands.aptable(args, message);
			break;
		case 'armor':
		case 'armour':
			commands.ke(args, message, heatdata);
			break;
		case 'ke':
			commands.ketable(args, message);
			break;
		case 'heat':
			commands.heattable(args, message);
			break;
		case 'he':
			commands.hetable(args, message);
			break;
		case 'invite':
			commonCommands.invite(message, admin, args);
			break;
		case 'vet':
			message.channel.send({
				files: ['./Pictures/Misc/VetTable.png']
			});
			break;
		case 'optics':
		case 'recon':
		case 'optic':
		case 'stealth':
			message.channel.send({
				files: ['./Pictures/Misc/Optics.png']
			});
			break;
		case 'help':
		case 'commands':
			commonCommands.help(args, message);
			break;
		case 'adminhelp':
			commonCommands.adminhelp(args, message);
			break;
		case 'map':
			commonCommands.map(args, message)
			break;
		case 'compare':
			commands.compare(args, message)
	}
	if(commoncommands == true) {
		switch(commandName) {
			case 'links':
				message.channel.send('\n' + 'Eugen oficial game manual: <http://cdn.akamai.steamstatic.com/steam/apps/251060/manuals/WARGAME_RED-DRAGON_manuel_INT-digital.pdf?t=1407520147>' + '\n' + 'WebBrowser Deck editor: <https://aqarius90.github.io/FA_WG_Utilities/>' + '\n' + 'Rate of fire spreadsheet: <https://docs.google.com/spreadsheets/d/1dx28wRZ_3ofnP7kWKcoziGpPw2tOAJcixnuiKjJPL-A/edit#gid=1401351233>' + '\n' + 'List of critical hits: <https://docs.google.com/document/d/1cUyJFaJAiMl4WnQMEmGw_D955oEgDUjGwFMnxboZewQ/edit>' + '\n' + 'Armory tool: <https://forums.eugensystems.com/viewtopic.php?t=59265>' + '\n' + 'Hon beginner guide: <https://honhonhonhon.wordpress.com/how-to-get-started-with-wargame/>' + '\n' + 'Key Values to remember: <https://www.reddit.com/r/wargamebootcamp/comments/7oj7nx/list_of_key_values_to_keep_track_of_for_beginners/>' + '\n' + 'Desumark compilation of unit review by razzman: <https://docs.google.com/spreadsheets/d/1RLcMuQyuNO10v3UYB3btzr4RMSpBONdw_-rOscD6j1A>' + '\n' + 'Guide to put flags and specs in deck names: <https://steamcommunity.com/sharedfiles/filedetails/?id=355698402>');
				break;
			case 'replayfolder':
				message.channel.send('here is the directory for the replay folder: \n\n *Windows: C:\\Users%username%\\Saved Games\\EugenSystems\\WarGame3* \n\nLinux: ~/.config/EugenSystems/Wargame3/saves \n\n Mac: [Hard drive] > Users > [your account] > Library > Application Support > EugenSystems > Wargame3 > SavedGames');
				break;
			case 'maps':
				msg = '';
				let maps = fs.readdirSync(maps_folder);
				maps.forEach(map => {msg += map.replace(/\.png|\.jpg/g, '') + '\n'});
				message.channel.send(msg);	
				//message.channel.send('  Mud fight \n Plunjing valley \n Paddy field \n Punchbowl \n Corner Hell \n Highway to seoul \n Nuclear winter \n Wonsan Harbor \n Death Row \n Jungle Law \n Cliff Hanger \n 38th Parallel');
				break;
			case 'decks':
				var array = fs.readFileSync(decks_file).toString().split("\n");
				message.channel.send(array);
				break;
			case 'maplist':
				let embed = new Discord.MessageEmbed().setTitle('Maplist').setColor('ORANGE');
				let serverListNames = ['Tactical 1', 'Tactical 2', 'Tactical 3', 'Tactical 4', 'Destruction', 'Conquest', 'NoIncome'];
				let serverList = ['../tactical1/myconfig.py', '../tactical2/myconfig.py',  '../tactical3/myconfig.py',   '../tactical4/myconfig.py',   '../destruction1/myconfig.py',  '../conquest1/myconfig.py',   '../noincome1/myconfig.py'];
				serverList.forEach((serverFile, index) => {
					var myconfig = fs.readFileSync(serverFile).toString().split("\n");
					var maps = [];
					myconfig.forEach((line) => {if(line.startsWith("MAP_POOL['")) {
						maps.push(line.match(/\'([\w]+)/)[0]
							.replace("'", "")
						);
					}});
					embed.addField(serverListNames[index], maps.sort().join(', '));
				});
				message.channel.send(embed);
				break;
			case 'unicorns':
			case 'unicorn':
				message.channel.send("This list is for the banned units in the random deck server deck submit \n:flag_us: - Sup: Atacms, Patriot. Rec: ah-64d longbow. Air: f-117 nighthawk, a-10 thunderbolt \n:flag_gb: - Inf: sas. Vhc: rover wombat.  \n:flag_fr: - Inf: legion90. Sup: crotale. Tnk: Leclerc. Hel: tigre had, tigre hap. Air: rafale cf1 \n:flag_de: - \n:flag_ca: - Sup: m113 adats \n:flag_dk: - Sup: Otomatic. Air: f-16a mlu \n:flag_se: - Inf: norrlandsjagare. Sup: bkan 1c.  \n:flag_no: - \n:flag_au: - Vhc: vickers mk11, rover wombat \n:flag_jp: - Tnk: kyu maru shiki. Rec: oh-1 ninja.  \n:flag_kr: - Air: kf-16c block52d, f-4e peace pheasant ii \n:flag_nl: - Hel: ah-64 escort .Air: f-16a block 15 ocu \n:flag_il: - Inf: dorban-lr. Sup: machbet, lar-160, mar-290. Rec: maglan. Vhc: zelda. Hel: tzefa e, nimrod.  \n<:flag_prinsenvlag:894734990062014536> - Inf: sasf '90. Sup: cactus, cactus sahv, rooikat za-hvm. Tnk: rooikat 105. Air: cheetah D \n<:flag_gdr:838029564361703434> - Inf: lstr-40 \n<:flag_su:838026756879024148> - Log t80-uk. Sup: bm-27 uragan, bm-30 smerch. Rec: spetsnaz gru. Vhc: btr-90, bmpt. Air: su-27m, su25-t.  \n:flag_pl:  - \n:flag_fi: - Sup: rakh 91, ito 90. Rec: bmp-1kt, erikoisrajajaakari. Air: mig-29 9.13(meme mig) \n<:flag_yug:838030505794076692> - Sup: rl-4m pracka, svlr m-94 plammen-s. Tnk: m-91 vihor, m-91a vihor. Rec: hi-45 hera , m-84an. Air: n-62m super galeb \n:flag_cz: - \n:flag_cn: - Sup: hq-7. Air: jh-7a feibao \n<:flag_dprk:838030223021965372> - Vhc: vtt-323 hwasung-chong Air: mig-29 9-12b \n:ship: - Blue: lafayette, strb90, monitor zippo. Red: Nanushka-iii, jianghu-iii, hujian");
				break;
		}
	}
});

client.login(token);
