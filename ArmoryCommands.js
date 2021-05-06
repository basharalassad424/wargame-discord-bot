/*
Copyright 2021 basharalassad424 (https://github.com/basharalassad424)

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//
const Discord = require('discord.js');
const units = require('./Data/UnitData.json');
const format = require('./Formatting.js');
const damage = require('./Data/FinalArmorData.json');
const fs = require('fs');

module.exports.unit = (args, message, limit, displaylimit) => {
	var allArgs = '';
	for(let i = 0; i < args.length; i++) { //adds up all arguements after command
		allArgs += args[i] + ' ';
	}
	allArgs = allArgs.trim(); //strip any leading or trailing spaces
	if(allArgs === '') {
		message.reply('Command requires a parameter'); //if the user does !unitlist <space> or !unitlist, return and reply this.
		return;
	}
	const matchingUnits2 = units.filter((i, index) => { //make matchingUnits into a filter of units
		s1 = allArgs.replace(/[^\w]/g, '').toLowerCase();
		s2 = i.Name.replace(/[^\w]/g, '').toLowerCase();
		if(s2 == s1) { // check if unit includes allArgs
			return i;
		}
	});
	if(matchingUnits2[0]) {
		i = matchingUnits2[0];
		const send = format.formatting(i, show_msg = true);
		const filter = (reaction, user, member) => { //make a filter of only the reaction wastebasket made by the user
			return ['🗑'].includes(reaction.emoji.name) && user.id === message.author.id;
		};
		message.channel.send(send).then(m => {
			m.react('🗑'); //react with a wastebasket to the bots own post
			m.awaitReactions(filter, {
					max: 1,
					time: 60000,
					errors: ['Time'],
				}) //wait 30 seconds for reactions and throw an error if none are found after 15seconds
				.then(collected => {
					const reaction = collected.first();
					if(reaction.emoji.name === '🗑') { //if the reaction is wastebasket, delete the bot's message, and if the unit matching length is less than 2, delete the user's message
						m.delete().then(() => {
							message.delete(message).catch(err => {});
						});
					}
				}).catch(err => { //if there are no reactions after 15 seconds that match the filter, throw an error, on that error, clear all reactions
					m.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
				});
		});
		return;
	}
	const matchingUnits = units.filter((i, index) => { //make matchingUnits into a filter of units
		s1 = allArgs.replace(/[^\w]/g, '').toLowerCase();
		s2 = i.Name.replace(/[^\w]/g, '').toLowerCase();
		if(s2.match(s1)) { // check if unit includes allArgs
			return i;
		}
	});
	if(matchingUnits.length === 0) {
		message.reply('No units matched with the name ' + allArgs);
	}
	if(matchingUnits.length === 1) {
		i = matchingUnits[0];
		const send = format.formatting(i, show_msg = true);
		const filter = (reaction, user, member) => { //make a filter of only the reaction wastebasket made by the user
			return ['🗑'].includes(reaction.emoji.name) && user.id === message.author.id;
		};
		message.channel.send(send).then(m => {
			m.react('🗑'); //react with a wastebasket to the bots own post
			m.awaitReactions(filter, {
					max: 1,
					time: 60000,
					errors: ['Time'],
				}) //wait 30 seconds for reactions and throw an error if none are found after 15seconds
				.then(collected => {
					const reaction = collected.first();
					if(reaction.emoji.name === '🗑') { //if the reaction is wastebasket, delete the bot's message, and if the unit matching length is less than 2, delete the user's message
						m.delete().then(() => {
							message.delete(message).catch(err => {});
						});
					}
				}).catch(err => { //if there are no reactions after 15 seconds that match the filter, throw an error, on that error, clear all reactions
					m.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
				});
		});
	} else if(matchingUnits.length > 1) {
		if(matchingUnits.length < displaylimit) {
			i = matchingUnits[0];
			if(matchingUnits.length < 50) {
				const send = format.formatting(i, show_msg = true);
				const filter = (reaction, user, member) => { //make a filter of only the reaction wastebasket made by the user
					return ['🗑'].includes(reaction.emoji.name) && user.id === message.author.id;
				};
				message.channel.send(send).then(m => {
					m.react('🗑'); //react with a wastebasket to the bots own post
					m.awaitReactions(filter, {
							max: 1,
							time: 60000,
							errors: ['Time'],
						}) //wait 30 seconds for reactions and throw an error if none are found after 15seconds
						.then(collected => {
							const reaction = collected.first();
							if(reaction.emoji.name === '🗑') { //if the reaction is wastebasket, delete the bot's message, and if the unit matching length is less than 2, delete the user's message
								m.delete().then(() => {
									message.delete(message).catch(err => {});
								});
							}
						}).catch(err => { //if there are no reactions after 15 seconds that match the filter, throw an error, on that error, clear all reactions
							m.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
						});
				});
			}
			const matching = [];
			matchingUnits.forEach((i) => {
				matching.push('**' + i.Name + '** | ');
			});
			message.channel.send('first unit sent, these are the other variations: ' + matching.join(''));
			return;
		} else if(matchingUnits.length > displaylimit) {
			message.reply('Too many matching units to display list');
			return;
		}
	}
};

module.exports.unitlist = (args, message, limit, displaylimit) => {
	var allArgs = '';
	for(let i = 0; i < args.length; i++) { //adds up all arguements after !git or !get into one single string named allArgs
		allArgs += args[i].toLowerCase() + ' ';
	}
	allArgs = allArgs.replace(/^\s+|\s+$/g, ''); //strip any leading or trailing spaces
	if(allArgs === '') {
		message.reply('Command requires a parameter'); //if the user does !git <space> or !git, return and reply this.
		return;
	}
	const matchingUnits5 = units.filter((i, index) => { //make matchingUnits into a filter of units
		s1 = allArgs.replace(/[^\w]/g, '').toLowerCase();
		s2 = i.Name.replace(/[^\w]/g, '').toLowerCase();
		if(s2.match(s1)) { // check if unit includes allArgs
			return i;
		}
	});
	if(matchingUnits5.length === 0) {
		message.reply('No units matched with the name ' + allArgs);
		return;
	}
	if(matchingUnits5.length > 10) {
		message.reply('Too many units to display paging');
		return;
	}
	let index = 0;
	let indexbefore;
	let indexafter;
	if(matchingUnits5.length === 1) {
		let embed = format.formatting(matchingUnits5[0], show_img = true);
		embed.setFooter((index - -1) + ' / ' + matchingUnits5.length);
		message.channel.send(embed);
		return;
	}
	let embed = format.formatting(matchingUnits5[index]).setFooter((index + 1) + ' / ' + matchingUnits5.length);
	message.channel.send(embed).then(m => {
		m.react('⬅').then(() => m.react('➡')).then(() => m.react('🗑')) //react with a wastebasket to the bots own post
			.catch(() => console.error('One of the emojis failed to react.'));
		const pagesFilter = (reaction, user) => user.id == message.author.id;
		const pages = new Discord.ReactionCollector(m, pagesFilter, {
			time: 60000,
		});
		pages.on('collect', r => {
			if(r.emoji.name == '⬅') {
				if(index === 0) {
					r.users.remove(message.author.id);
					index = matchingUnits5.length;
				}
				if(index > 0 && index) {
					index--;
					m.edit(content = '');
					embed = format.formatting(matchingUnits5[index], show_img = true);
					embed.setFooter((index - -1) + ' / ' + matchingUnits5.length);
					m.edit(embed).catch(err => {
						console.log(err);
					});
					r.users.remove(message.author.id);
				}
			} else if(r.emoji.name == '➡') {
				if(index === matchingUnits5.length - 1) {
					r.users.remove(message.author.id);
					index = -1;
				}
				if(index < matchingUnits5.length - 1) {
					index++;
					embed = format.formatting(matchingUnits5[index]);
					embed.setFooter((index - -1) + ' / ' + matchingUnits5.length);
					m.edit(embed).catch(err => {
						console.log(err);
					});
					r.users.remove(message.author.id);
				}
			} else if(r.emoji.name === '🗑') { //if the reaction is wastebasket, delete the bot's message, and if the unit matching length is less than 2, delete the user's message
				m.delete().then(() => {
					message.delete(message).catch(err => {});
				});
			}
		});
		pages.on('end', (collected, reason) => {
			if(reason == 'time') {
				m.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
			}
		});
	});
};

module.exports.list = (args, message, displaylimit) => {
	var allArgs = '';
	for(let i = 0; i < args.length; i++) { //adds up all arguements after !git or !get into one single string named allArgs
		allArgs += args[i].toLowerCase() + ' ';
	}
	allArgs = allArgs.trim(); //strip any leading or trailing spaces
	if(allArgs === '') {
		message.reply('Command requires a parameter'); //if the user does !git <space> or !git, return and reply this.
		return;
	}
	const matchingUnits4 = units.filter((i, index) => { //make matchingUnits into a filter of units
		s1 = allArgs.replace(/[^\w]/g, '').toLowerCase();
		s2 = i.Name.replace(/[^\w]/g, '').toLowerCase();
		if(s2.match(s1)) { // check if unit includes allArgs
			return i;
		}
	});
	if(matchingUnits4.length === 0) {
		message.reply('No units matched with the name ' + allArgs);
	}
	if(matchingUnits4.length < displaylimit) {
		matching = [];
		matchingUnits4.forEach((i) => {
			if(i > 1) {
				matching.push('** | ' + i.Name + '**');
			} else {
				matching.push('**' + i.Name + '** | ');
			}
		});
		message.reply(matching.join(''));
	} else {
		message.reply('Too many units to display list');
	}
};

module.exports.vet = () => {};

module.exports.ke = (args, message, heatdata) => {
	args[0] = args[0].replaceAll(' ', '');
	args[0] = args[0].toLowerCase();
	if(isNaN(args[0])) {
		message.reply('Please enter an armor value 1 - 25');
		return;
	}
	if(Number(args[0]) > 25 || Number(args[0]) < 1) {
		message.reply('Please enter an armor value 1 - 25');
		return;
	}
	args[0] = Number(args[0]);
	args[0] = Math.round(args[0]);
	const kedata = heatdata.filter((i, index) => {
		i.ArmorAP = i.ArmorAP.replaceAll('Armor ', '');
		const armor = i.ArmorAP.toLowerCase();
		if(armor == args[0]) {
			return i;
		}
	});
	kedata.forEach((i) => {
		const embed = new Discord.MessageEmbed().setTitle(i.ArmorAP + ' Armor Damage Table').setColor('WHITE').addField('​', '**AP 1**: ' + i.KE1 + '**\nAP 2**: ' + i.KE2 + '**\nAP 3**: ' + i.KE3 + '\n**AP 4**: ' + i.KE4 + '**\nAP 5**: ' + i.KE5 + '\n**AP 6**: ' + i.KE6 + '\n**AP 7**: ' + i.KE7 + '\n**AP 8**: ' + i.KE8 + '\n**AP 9**: ' + i.KE9 + '**\nAP 10**: ' + i.KE10 + '**\nAP 11**: ' + i.KE11 + '**\nAP 12**: ' + i.KE12 + '**\nAP 13**: ' + i.KE13 + '**\nAP 14**: ' + i.KE14 + '**\nAP 15**: ' + i.KE15 + '**\nAP 16**: ' + i.KE16 + '**\nAP 17**: ' + i.KE17 + '**\nAP 18**: ' + i.KE18 + '\n**AP 19**: ' + i.KE19 + '\n**AP 20**: ' + i.KE20 + '\n**AP 21**: ' + i.KE21 + '\n**AP 22**: ' + i.KE22 + '\n**AP 23**: ' + i.KE23 + '**\nAP 24**: ' + i.KE24 + '\n**AP 25**: ' + i.KE25 + '\n**AP 26**: ' + i.KE26 + '\n**AP 27**: ' + i.KE27 + '\n**AP 28**: ' + i.KE28 + '\n**AP 29**: ' + i.KE29 + '\n**AP 30**: ' + i.KE30, true).addField('​', '**HEAT 1**: ' + i.AP1 + '**\nHEAT 2**: ' + i.AP2 + '**\nHEAT 3**: ' + i.AP3 + '\n**HEAT 4**: ' + i.AP4 + '**\nHEAT 5**: ' + i.AP5 + '\n**HEAT 6**: ' + i.AP6 + '\n**HEAT 7**: ' + i.AP7 + '\n**HEAT 8**: ' + i.AP8 + '\n**HEAT 9**: ' + i.AP9 + '**\nHEAT 10**: ' + i.AP10 + '**\nHEAT 11**: ' + i.AP11 + '**\nHEAT 12**: ' + i.AP12 + '**\nHEAT 13**: ' + i.AP13 + '**\nHEAT 14**: ' + i.AP14 + '**\nHEAT 15**: ' + i.AP15 + '\n**HEAT16**: ' + i.AP16 + '**\nHEAT 17**: ' + i.AP17 + '\n**HEAT 18**: ' + i.AP18 + '\n**HEAT 19**: ' + i.AP19 + '\n**HEAT 20**: ' + i.AP20 + '\n**HEAT 21**: ' + i.AP21 + '\n**HEAT 22**: ' + i.AP22 + '\n**HEAT 23**: ' + i.AP23 + '**\nHEAT 24**: ' + i.AP24 + '\n**HEAT 25**: ' + i.AP25 + '\n**HEAT 26**: ' + i.AP26 + '\n**HEAT 27**: ' + i.AP27 + '\n**HEAT 28**: ' + i.AP28 + '\n**HEAT 29**: ' + i.AP29 + '\n**HEAT 30**: ' + i.AP30, true);
		message.channel.send(embed);
	});
};

module.exports.ketable = (args, message) => {
	let title;
	if(isNaN(args[0]) === true || args[0] > 30 || args[0] < 1) {
		message.reply('Please use a valid KE value between 1 and 30').catch(err => {
			console.log(err);
		});
		return;
	}
	args[0] = (args[0].replace(/[^\d]/g, ''));
	const matchingArmor = damage.filter((i, index) => {
		const replacedarmor = (i.ArmorAP.replace(/[^\d]/g, ''));
		if(replacedarmor === args[0]) {
			return i;
		}
	});
	const embed = new Discord.MessageEmbed().setTitle(args[0] + ' KE Damage table').setColor('GOLD');
	matchingArmor.shift();
	matchingArmor.forEach((i) => {
		embed.addField("KE", '**0 AV**: ' + i.Armor0 + '\n**1 AV**: ' + i.Armor1 + '\n**2 AV**: ' + i.Armor2 + '\n**3 AV**: ' + i.Armor3 + '\n**4 AV**: ' + i.Armor4 + '\n**5 AV**: ' + i.Armor5 + '\n**6 AV**: ' + i.Armor6 + '\n**7 AV**: ' + i.Armor7 + '\n**8 AV**: ' + i.Armor8 + '\n**9 AV**: ' + i.Armor9 + '\n**10 AV**: ' + i.Armor10 + '\n**11 AV**: ' + i.Armor11 + '\n**12 AV**: ' + i.Armor12 + '\n**13 AV**: ' + i.Armor13 + '\n**14 AV**: ' + i.Armor14 + '\n**15 AV**: ' + i.Armor15 + '\n**16 AV**: ' + i.Armor16 + '\n**17 AV**: ' + i.Armor17 + '\n**18 AV**: ' + i.Armor18 + '\n**19 AV**: ' + i.Armor19 + '\n**20 AV**: ' + i.Armor20 + '\n**21 AV**: ' + i.Armor21 + '\n**22 AV**: ' + i.Armor22 + '\n**23 AV**: ' + i.Armor23, true);
	});
	message.channel.send(embed).catch(err => {
		console.log(err + 'Error on line 484 armoryCommands.js');
	});
};

module.exports.heattable = (args, message) => {
	let title;
	if(isNaN(args[0]) === true || args[0] > 30 || args[0] < 1) {
		message.reply('Please use a valid HEAT value between 1 and 30').catch(err => {
			console.log(err);
		});
		return;
	}
	args[0] = (args[0].replace(/[^\d]/g, ''));
	const matchingArmor = damage.filter((i, index) => {
		const replacedarmor = (i.ArmorAP.replace(/[^\d]/g, ''));
		if(replacedarmor === args[0]) {
			return i;
		}
	});
	const embed = new Discord.MessageEmbed().setTitle(args[0] + ' HEAT Damage table').setColor('GOLD');
	matchingArmor.length = matchingArmor.length - 1;
	matchingArmor.forEach((i) => {
		embed.addField("HEAT", '**0 AV**: ' + i.Armor0 + '\n**1 AV**: ' + i.Armor1 + '\n**2 AV**: ' + i.Armor2 + '\n**3 AV**: ' + i.Armor3 + '\n**4 AV**: ' + i.Armor4 + '\n**5 AV**: ' + i.Armor5 + '\n**6 AV**: ' + i.Armor6 + '\n**7 AV**: ' + i.Armor7 + '\n**8 AV**: ' + i.Armor8 + '\n**9 AV**: ' + i.Armor9 + '\n**10 AV**: ' + i.Armor10 + '\n**11 AV**: ' + i.Armor11 + '\n**12 AV**: ' + i.Armor12 + '\n**13 AV**: ' + i.Armor13 + '\n**14 AV**: ' + i.Armor14 + '\n**15 AV**: ' + i.Armor15 + '\n**16 AV**: ' + i.Armor16 + '\n**17 AV**: ' + i.Armor17 + '\n**18 AV**: ' + i.Armor18 + '\n**19 AV**: ' + i.Armor19 + '\n**20 AV**: ' + i.Armor20 + '\n**21 AV**: ' + i.Armor21 + '\n**22 AV**: ' + i.Armor22 + '\n**23 AV**: ' + i.Armor23, true);
	});
	message.channel.send(embed).catch(err => {
		console.log(err + 'Error on line 484 armoryCommands.js');
	});
};
//477 + 177 + 373 + 539 
