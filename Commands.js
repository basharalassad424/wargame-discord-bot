/*
Copyright 2021 basharalassad424 (https://github.com/basharalassad424)

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//
const Discord = require('discord.js');
const fetch = require('node-fetch');
const maps_folder = 'Pictures/Map\ Pictures'
const maplist = require('./Data/MapList.json');
const help = ('\n' + '**!unit <unit>** - Displays the full stats of any units with the matching name \n' + '**!unitlist <unit>** - Displays a message where you can scroll through the units using reactions \n' + '**!compare <unit1> vs <unit2>** - Compare 2 units with the matching names side by side \n' + '**!list <unit>** - Lists all matching units \n' + '**!ke <ke value>** - Displays a table of armor damage values for that ke value \n' + '**!heat <heat value>** - Displays a table of armor damage for that heat value \n' + '**!armor <0 - 25 armor>** - Displays the damage resistance of an armor value towards ke and heat \n' + '**!map <map>** - Displays a map, Example: !map mudfight \n' + '**!maplist** - List of maps in the tactical servers \n' + '**!decks** - gives a list of decks for tacticals \n' + '**!optics** - Shows optics and stealth infograph\n' + '**!vet** - Shows Vlern\'s table of accuracy with upvetting \n' + '**!links** - Shows useful links for wargame related posts and documents \n' + '**!userinvite** - Makes a 2 hour, 1 use invite for you to invite someone \n' + '**!replayfolder** - Folder Where game replays are stored \n' + 'Dragging a replay file on to this channel will show info about the match\n');
const adminhelp = ('List of admin commands: \n**!invite <duration in minutes> <uses>** - Creates an invite link, set duration to zero to make it infinite duration \n **!changelimit <number>** - Changes the limit of matching units to display fully \n **!changedisplaylimit <number>** - Changes the limit of units to be shown in a name list \n **!dynocommands** - Turns on / off the dyno commands (!unspec !rookie, etc)');
const deck = require('./Data/Deck.js');

module.exports.map = (args, message) => {
	const filter = (reaction, user, member) => {
		return ['🗑'].includes(reaction.emoji.name) && user.id === message.author.id;
	};
	var allArgs = '';
	for(let i = 0; i < args.length; i++) {
		allArgs += args[i].toLowerCase() + ' ';
	}
	allArgs = allArgs.trim(); //strip any leading or trailing spaces
	if(allArgs === '') {
		message.reply('Command requires a parameter');
		return;
	}
	const matchingMaps = maplist.filter((i, index) => { //make matchingMaps into a filter of maps
		s1 = allArgs.replace(/[^\w]/g, '').toLowerCase();
		s2 = i.replace(/[^\w]/g, '').toLowerCase();
		if(s2.match(s1)) { // check if map includes allArgs
			return i;
		}
	});
	if(matchingMaps.length === 0) {
		message.reply('No maps matched with the name ' + allArgs);
		return;
	}
	if(matchingMaps.length !== 1) {
		message.reply('Too many maps matched the name ' + allArgs);
		return;
	}
	let embed = new Discord.MessageEmbed().setTitle('Here is the map ' + matchingMaps[0]).setColor('WHITE').attachFiles(maps_folder + '/' + matchingMaps[0].replace(/\ /g, '_').toLowerCase() + '.png');
	message.reply(embed).then(m => {
		m.react('🗑');
		m.awaitReactions(filter, {
			max: 1,
			time: 30000,
			errors: ['Time'],
		}).then(collected => {
			const reaction = collected.first();
			if(reaction.emoji.name === '🗑') {
				m.delete().then(() => {
					message.delete(message);
				});
			}
		}).catch(err => {
			m.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
		});
	});
};

module.exports.userinvite = (message) => {
	message.channel.createInvite({
		maxAge: Number((2 * 60) * 60),
		maxUses: Number(1),
	}).then(m => {
		message.reply('created invite: ' + m);
	}).catch(err => {
		console.log(err);
	});
};

module.exports.help = (args, message) => {
	const filter = (reaction, user, member) => {
		return ['🗑'].includes(reaction.emoji.name) && user.id === message.author.id;
	};
	message.channel.send(help).then(m => {
		m.react('🗑');
		m.awaitReactions(filter, {
			max: 1,
			time: 60000,
			errors: ['Time'],
		}).then(collected => {
			const reaction = collected.first();
			if(reaction.emoji.name === '🗑') {
				m.delete().then(() => {
					message.delete(message);
				});
			}
		}).catch(err => {
			m.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
		});
	});
};

module.exports.adminhelp = (args, message) => {
	const filter = (reaction, user, member) => {
		return ['🗑'].includes(reaction.emoji.name) && user.id === message.author.id;
	};
	message.reply(adminhelp).then(m => {
		m.react('🗑');
		m.awaitReactions(filter, {
			max: 1,
			time: 5000,
			errors: ['Time'],
		}).then(collected => {
			const reaction = collected.first();
			if(reaction.emoji.name === '🗑') {
				m.delete().then(() => {
					message.delete(message);
				});
			}
		}).catch(err => {
			m.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
		});
	});
};

module.exports.invite = (message, admin, args) => {
	const duration = args[0] * 60;
	const uses = args[1];
	if(!admin) {
		message.reply('Must be an admin to use this command');
		return;
	}
	if(isNaN(duration) || isNaN(uses)) {
		message.reply('Please use a number for the inputs');
		return;
	}
	message.channel.createInvite({
		maxAge: Number(duration),
		maxUses: Number(uses),
	}).then(m => {
		message.channel.send('created invite: ' + m);
	}).catch(err => {
		console.log(err);
	});
};

module.exports.replay = (args, message) => {
	const url = (message.attachments.first().url);
	const fileType = require('file-type');
	fetch(url).then(res => res.buffer()).then(buffer => {
		fileType.fromBuffer(buffer)
		content = buffer;
		const jsonsize = content.readInt16BE(0x32);
		let json = content.slice(0x38, 0x38 + jsonsize).toString();
		json = JSON.parse(json);
		let users = Object.values(json).slice(1);
		json.game.Map = json.game.Map.replace(/\_/g, ' ');
		const income = {
			"1": "Very Low -40%",
			"2": "Low - 20%",
			"3": "Normal -0%",
			"4": "High +20%",
			"5": "Very High +40%"
		}
		const map = {
			"Conquete 2x3 Gangjin": "Mud Fight",
			"Conquete 2x3 Hwaseong": "Nuclear Winter",
			"Conquete 3x3 Muju": "Plunjing Valley",
			"Conquete 2x3 Tohoku Alt": "Paddy Field",
			"Conquete 3x3 Muju Alt": "Punchbowl",
			"Conquete 3x3 Marine 3 Reduite Terrestre": "Hell in a very small place",
			"Conquete 3x3 Highway Small": "Highway to Seoul"
		}
		const mode = {
			"1": "Destuction",
			"2": "Siege",
			"3": "Economy",
			"4": "Conquest"
		}
		if(map.hasOwnProperty(json.game.Map)) json.game.Map = map[json.game.Map];
		if(income.hasOwnProperty(json.game.IncomeRate)) json.game.IncomeRate = income[json.game.IncomeRate];
		if(mode.hasOwnProperty(json.game.VictoryCond)) json.game.VictoryCond = mode[json.game.VictoryCond];
		let embed = new Discord.MessageEmbed().setTitle(json.game.ServerName).setDescription('\n **Map**: ' + json.game.Map + '\n **Mode**: ' + json.game.VictoryCond + '\n **Starting Points**: ' + json.game.InitMoney + '\n **Winning Points**: ' + json.game.ScoreLimit + '\n **Game Duration**: ' + (json.game.TimeLimit / 60 + 'm') + '\n **Income Rate**: ' + json.game.IncomeRate).setColor('ORANGE');
		let teams = ['BLUFOR', 'REDFOR'];
		teams.forEach(team => {
			embed.addField(team + ':', '|');
			users.forEach(user => {
				if((user.PlayerAlliance === '1' && team === 'REDFOR') || (user.PlayerAlliance === '0' && team === 'BLUFOR')) {
					let player_string = '**ID**: ' + user.PlayerUserId + '| **Level**: ' + user.PlayerLevel + '| **Deck**: ' + deck.decode(user.PlayerDeckContent) + '| **Code**: ' + user.PlayerDeckContent;
					embed.addField(user.PlayerName, player_string);
				}
			})
			if(team === 'BLUFOR') embed.addField('\u200b', '\u200b');
		})
		const filter = (reaction, user, member) => {
			return ['🗑'].includes(reaction.emoji.name) && user.id === message.author.id;
		};
		message.reply(embed).then(m => {
			m.react('🗑');
			m.awaitReactions(filter, {
				max: 1,
				time: 50000,
				errors: ['Time'],
			}).then(collected => {
				const reaction = collected.first();
				if(reaction.emoji.name === '🗑') {
					m.delete().then(() => {
						message.delete(message);
					});
				}
			}).catch(err => {
				m.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
			});
		});
	}).then(type => {
		/* ... */ });
}
