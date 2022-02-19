/*
Copyright 2021 basharalassad424 (https://github.com/basharalassad424)

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//
String.prototype.replaceAll = function(search, replacement) {
	var target = this;
	return target.replace(new RegExp(search, 'g'), replacement);
};

const fetch = require('node-fetch');
const Discord = require('discord.js');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

module.exports.formatting = (i, show_img = false) => {
	if(i.Name === '') {
		return;
	}
	i.Weapon1Type = i.Weapon1Type.replaceAll('Assault Rifles', 'Assault Rifle');
	i.Weapon2Type = i.Weapon2Type.replaceAll('LAW', 'AT');
	i.Weapon3Type = i.Weapon3Type.replaceAll('LAW', 'AT');
	// i.Name = i.Name.replaceAll('%', ' ');
	let deck_id;
	let side;
	let country_flag;
	let proto;
	let armorfront;
	let armorsides;
	let armorrear;
	let armortop;
	let rookieavail = ('|Rookie:**' + i.RookieDeployableAmount + '**|  ');
	let trainedavail = ('|Trained:**' + i.TrainedDeployableAmount + '**|   ');
	let hardenedavail = ('|Hardened:**' + i.HardenedDeployableAmount + '**|   ');
	let veteranavail = ('|Veteran:**' + i.VeteranDeployableAmount + '**|   ');
	let eliteavail = ('|Elite:**' + i.EliteDeployableAmount + '**|   ');
	const command_emoji = '<:command:839991090093621300>';
	const country_flags = {
		"Poland": ":flag_pl:",
		'Czechoslavakia': ':flag_cz:',
		'Soviet Union': '<:flag_su:838026756879024148>',
		'Yugoslavia': '<:flag_yug:838030505794076692>',
		'South Africa': '<:flag_prinsenvlag:894734990062014536>',
		'Finland': ':flag_fi:',
		'East Germany': '<:flag_gdr:838029564361703434>',
		'China': ':flag_cn:',
		'North Korea': '<:flag_dprk:838030223021965372>',
		"France": ":flag_fr:",
		'Canada': ':flag_ca:',
		'Sweden': ':flag_se:',
		'The Netherlands': ':flag_nl:',
		'ANZAC': ':flag_au:',
		'Israel': ':flag_il:',
		'United Kingdom': ':flag_gb:',
		'Japan': ':flag_jp:',
		'United States': ':flag_us:',
		'West Germany': ':flag_de:',
		'Denmark': ':flag_dk:',
		'South Korea': ':flag_kr:',
		'Norway': ':flag_no:',
	};
	const stealth = {
		'1': 'Poor',
		'1.25': 'Poor - Medium',
		'1.5': 'Medium',
		'2': 'Good',
		'2.5': 'Very good',
		'3': 'Exceptional',
	};
	const groundOptics = {
		'40': 'Bad',
		'60': 'Poor',
		'80': 'Medium',
		'120': 'Good',
		'170': 'Very Good',
		'220': 'Exceptional',
	};
	if(groundOptics.hasOwnProperty(i.OpticalStrengthGround)) {
		i.OpticalStrengthGround = groundOptics[i.OpticalStrengthGround];
	}
	if(stealth.hasOwnProperty(i.Stealth)) {
		i.Stealth = stealth[i.Stealth];
	}
	if(i.Nationalite === '1') {
		color = "RED";
		side = '1';
	} else {
		color = "BLUE";
		side = '0';
	}
	if(country_flags.hasOwnProperty(i.MotherCountry)) {
		country_flag = country_flags[i.MotherCountry];
	}
	if(i.ArmorFrontSplashResistant.toLowerCase() === 'true') {
		armorfront = '0';
	} else {
		armorfront = i.ArmorFront;
	}
	if(i.ArmorSidesSplashResistant.toLowerCase() === 'true') {
		armorsides = '0';
	} else {
		armorsides = i.ArmorSides;
	}
	if(i.ArmorRearSplashResistant.toLowerCase() === 'true') {
		armorrear = '0';
	} else {
		armorrear = i.ArmorRear;
	}
	if(i.ArmorTopSplashResistant.toLowerCase() === 'true') {
		armortop = '0';
	} else {
		armortop = i.ArmorTop;
	}
	if(i.IsPrototype.toLowerCase() === 'true') 
		proto = '| **Prototype**';
	else
		proto = ''
	//defaults
	let title = ('**' + i.Name.toUpperCase() + ('%', ' ') + '**');
	let availability = (rookieavail + trainedavail + hardenedavail + veteranavail + eliteavail);
	let price = (i.Price);
	let year = ' | **Year**: ' + i.Year;
	let category = (year + ' | **Nationality**: ' + country_flag + proto);
	let armor = '\n**Armor: ** Front: ' + armorfront + ' | Sides: ' + armorsides + ' | Rear: ' + armorrear + ' | Top: ' + armortop
	let ecm = ' | **ECM: **' + Math.abs(100*i.ECM) + '%';
	let autonomy = '\n**Autonomy: **' + i.Autonomy + ' seconds';
	let movement = ('**Movement**', '**Type**: ' + i.MovementType + ' | **Speed**: ' + Math.trunc(i.MaxSpeed) + 'kph | **Stealth**: ' + i.Stealth + '\n' + '**Air detection**: ' + i.OpticalStrengthAir + ' | **Ground optics**: ' + i.OpticalStrengthGround);
	//specialized formatting
	if(i.Tab === 'LOG') { //logistics tab formatting
		if(i.SupplyCapacity === '') {
			title = ('**' + i.Name.toUpperCase() + '**' + command_emoji);
		} //if its a cv, give it the cv icon
		category = ('**Logistics** ' + year + ' | **Nationality**: ' + country_flag + proto);
		if(i.Training !== '') {
			movement = (movement + '\n**Training**: ' + i.Training);
		} else {
			movement = (movement + armor + autonomy);
		}
		if(armorfront == 'none' && armorsides == 'none' && armorrear == 'none' && armortop == 'none') {
			movement = (movement + '\n**Armor**: Splash');
		}
	} else if(i.Tab === 'INF') {
		category = ('**Infantry**  ' + category);
		movement = (movement + '\n**Training**: ' + i.Training);
	} else if(i.Tab === 'SUP') {
		category = ('**Support** ' + category);
		movement = (movement + armor + autonomy);
	} else if(i.Tab === 'TNK') {
		category = ('**Tank** ' + category);
		movement = (movement + armor + autonomy);
		if(i.Weapon1ShotsPerSalvo == i.Weapon1DisplayedAmmunition) {
			category = category + ' | **Autoloaded**';
		}
	} else if(i.Tab === 'REC') {
		if(i.IsTransporter === 'TRUE')
			category = ('**Recon** ' + ' | **Transport**' + category);
		else
			category = ('**Recon** ' + category);
		if(i.Training !== '') {
			movement = (movement + '\n**Training**: ' + i.Training);
		} else {
			movement = (movement + armor + autonomy);
		}
	} else if(i.Tab === 'VHC') {
		if(i.IsTransporter === 'TRUE')
			category = ('**Vehicle** ' + ' | **Transport**' + category);
		else
			category = ('**Vehicle** ' + category);
		movement = (movement + armor + autonomy);
	} else if(i.Tab === 'HEL') {
		if(i.IsTransporter === 'TRUE')
			category = ('**Helicopter** ' + ' | **Transport**' + category);
		else
			category = ('**Helicopter** ' + category);
		movement = (movement + armor + autonomy);
	} else if(i.Tab === 'PLA') {
		const airOptics = {
			'150': 'Good (150)',
			'300': 'Very Good (300)',
			'450': 'Exceptional (450)',
			'900': 'Exceptional + (900)',
		};
		if(airOptics.hasOwnProperty(i.OpticalStrengthAir)) {
			i.OpticalStrengthAir = airOptics[i.OpticalStrengthAir];
		}
		//Data doesnt import turn radius | mouvementhandler => TAirplanephysicConfiguration => AgilityRadiusInMeter
		//let turn_radius = ' | **Turn Radius**: ' + i.TurnRadius
		category = ('**Plane** ' + category);
		movement = ('**Movement**', '**Type**: ' + i.MovementType + ' | **Speed**: ' + Math.trunc(i.MaxSpeed) + 'kph | **Stealth**: ' + i.Stealth + ' \n **Air Detection**: ' + i.OpticalStrengthAir);
		movement = (movement + armor + autonomy + ecm);
	} else if(i.Tab = 'NAV') {
		if(i.IsTransporter === 'TRUE')
			category = ('**Naval** ' + ' | **Transport**' + category);
		else
			category = ('**Naval** ' + category);
		movement = ('**Movement**', '**Type**: ' + i.MovementType + ' | **Speed**: ' + Math.trunc(i.MaxSpeed / 18.5) + 'kt | **Stealth**: ' + i.Stealth + ' \n **Ground optics**: ' + i.OpticalStrengthGround + ' \n **Air Detection**: ' + i.OpticalStrengthAir +' \n**CIWS**: ' + i.CIWS + ecm );
		movement = (movement + '\n' + armor);
	}
	if(i.SupplyCapacity !== '') {
		category = ('**Logistics** ' + category +' | **Supply capacity**: ' + i.SupplyCapacity);
	}
	if(i.Amphibious === 'TRUE') {
		category = category + (' **| Amphibious** ');
	}
	deck_id = side + i.DeckID
	category = category + (' \n **Spec decks**: ' + i.Decks);
	const embed = new Discord.MessageEmbed().setTitle(title).setColor(color).addField('**Price: **' + price, '\n**Strength**: ' + i.Strength).addField('**Category**', category).addField('**Movement**', movement).addField('**Availability**', availability);
	if(show_img === true && i.MotherCountry != 'South Africa') {
		const attachments = new Discord.MessageAttachment('Pictures/picsb/' + deck_id + '.png')
		embed.attachFiles(attachments);
		embed.setThumbnail('attachment://' + deck_id + '.png');
	}
	//loop through all weapons
	let weapon_repeat = {} ;
	for(j = 1; j <= 11; j++) {
		//check for repated naval guns
		name = i['Weapon' + j + 'Name'];
		type = i['Weapon' + j + 'Type'];

		let will_repeat = false
		for(k=j+1; k<=11; k++){
			if(i.Tab === 'NAV' && name === i['Weapon' + k + 'Name'] && type === i['Weapon' + k + 'Type']){
				will_repeat = true; // weapon count +2 for the first repeat and +1 for the next ones
				if(weapon_repeat[name]>0)
					weapon_repeat[name] += 1;
				else
					weapon_repeat[name] = 2;
			}
		}
		//if it repeats display only the last one
		if(will_repeat)
			continue;
		tags = i['Weapon' + j + 'Tags'];
		caliber = i['Weapon' + j + 'Caliber'];
		displayed_ammo = i['Weapon' + j + 'DisplayedAmmunition'];
		ap = i['Weapon' + j + 'AP'];
		he = i['Weapon' + j + 'HE'];
		noise = i['Weapon' + j + 'Noise'];
		aim_time = i['Weapon' + j + 'AimTime'];
		hit_prob = i['Weapon' + j + 'HitProbability'];
		hit_prob_moving = i['Weapon' + j + 'HitProbabilityWhileMoving'];
		min_crit_prob = i['Weapon' + j + 'MinimalCritProbability'];
		min_hit_prob = i['Weapon' + j + 'MinimalHitProbability'];
		can_smoke = i['Weapon' + j + 'CanSmoke'];
		angle_dispersion = i['Weapon' + j + 'AngleDispersion'];
		corrected_dispersion_mult = i['Weapon' + j + 'CorrectedShotDispersionMultiplier'];
		dispersion_at_max_range = i['Weapon' + j + 'DispersionAtMaxRange'];
		dispersion_at_min_range = i['Weapon' + j + 'DispersionAtMinRange'];
		time_between_salvos = i['Weapon' + j + 'TimeBetweenSalvos'];
		time_between_shots = i['Weapon' + j + 'TimeBetweenShots'];
		number_of_salvos = i['Weapon' + j + 'NumberOfSalvos'];
		shots_per_salvo = i['Weapon' + j + 'ShotsPerSalvo'];
		supply_cost = i['Weapon' + j + 'SupplyCost'];
		range_ground = i['Weapon' + j + 'RangeGround'];
		range_ground_min = i['Weapon' + j + 'RangeGroundMinimum'];
		range_heli = i['Weapon' + j + 'RangeHelicopters'];
		range_heli_min = i['Weapon' + j + 'RangeHelicoptersMinimum'];
		range_missiles = i['Weapon' + j + 'RangeMissiles'];
		range_missiles_min = i['Weapon' + j + 'RangeMissilesMinimum'];
		range_planes = i['Weapon' + j + 'RangePlanes'];
		range_planes_min = i['Weapon' + j + 'RangePlanesMinimum'];
		range_ship = i['Weapon' + j + 'RangeShip'];
		range_ship_min = i['Weapon' + j + 'RangeShipMinimum'];
		missile_max_acceleration = i['Weapon' + j + 'MissileMaxAcceleration'];
		missile_max_speed = i['Weapon' + j + 'MissileMaxSpeed'];
		missile_time_between_corr = i['Weapon' + j + 'MissileTimeBetweenCorrections'];
		position_on_card = i['Weapon' + j + 'PositionOnCard'];
		projectiles_per_shot = i['Weapon' + j + 'ProjectilesPerShot'];
		radius_splash_physical = i['Weapon' + j + 'RadiusSplashPhysicalDamage'];
		radius_splash_suppress = i['Weapon' + j + 'RadiusSplashSuppressDamage'];
		rayon_pinned = i['Weapon' + j + 'RayonPinned'];
		can_smoke = i['Weapon' + j + 'CanSmoke'];
		const salvo_duration = Math.round(time_between_shots * shots_per_salvo)
		const salvo_he_sum = Math.round(he * shots_per_salvo)
		const true_rof = Math.round(60 * shots_per_salvo / ((shots_per_salvo - 1) * time_between_shots - -time_between_salvos));
		const rof = Math.round((displayed_ammo / (number_of_salvos * shots_per_salvo)) * true_rof);
		
		//dual purpose missiles from adats and stormer dont have heli and plane range however they both follow the same pattern of relation between the ground range and the others
		if(type == 'Dual purpose missile'){
			range_heli =   Number(range_ground) + 3*175;
			range_planes = range_ground - 175;
		}
		// SA tag didnt work apparently
		if(caliber === 'SemAct radar')
			tags += '|SA';
		
		// the dude that made the final data csv bungled the helo range for autocannons
		// previous fix messed up the SUP SPAAGs
		if(type == 'Autocannon' && Math.trunc(range_ground) > 1575 && i.Tab != "SUP") {
			range_heli = range_ground - 175;
		} else if(type == 'Autocannon' && Math.trunc(range_ground) <= 1575 && i.Tab != "SUP") {
			range_heli = range_ground;
		}
		let arty_types = ['Howitzer', 'Mortar', 'MLRS'];
		let bomb_types = ['Laser Guided HE Bomb', 'Retarded HE Bomb', 'HE Bomb'];
		let automatic_gun_types = ['HMG', 'MMG', 'LMG', 'Assault Rifle', 'SAW', 'Autocannon', 'SMG', 'Grenade Launcher', 'Battle Rifle', 'Flamethrower', 'Rocket Launcher'];
		let weapon = '';
		weapon += name + '\n';
		weapon += caliber + ' x' + displayed_ammo + '\n';
		if(tags) {
			//at weapons can_smoke = true for some reason..
			//if(can_smoke === 'TRUE' && !tags.includes('SMK'))
			//	tags = tags + '|SMK'
			weapon += '**' + tags.replace('IFC', '') + '**\n';
		} else {
			weapon += '**|**\n';
		}
		weapon += '**Range**(min-max):' + '\n';
		weapon += 'Ground: ' + range_ground_min + " - " + range_ground + '\n';
		weapon += 'Heli: ' + range_heli_min + " - " + range_heli + '\n';
		weapon += 'Planes: ' + range_planes_min + " - " + range_planes + '\n';
		if(tags.includes('SHIP')) {
			weapon += 'Ships: ' + range_ship_min + " - " + range_ship + '\n';
		}
		if(tags.includes('DEF')) {
			weapon += 'Missiles: ' + range_missiles_min + " - " + range_missiles + '\n';
		}
		if(missile_max_speed !== '') {
			weapon += '**Missile Speed**: ' + Math.round(missile_max_speed) + 'kph' + '\n';
		}
		weapon += '**Accuracy:** ' + Math.round(hit_prob * 100) + '%' + '\n';
		weapon += '**Stabilizer:** ' + Math.round(hit_prob_moving * 100) + '%' + '\n';
		if(arty_types.includes(type)) {
			weapon += '**Dispersion**: ' + Math.round(dispersion_at_min_range * 26) + '\n';
		}
		weapon += '**AP Power:** ' + ap + '\n';
		weapon += '**HE Power:** ' + he + '\n';
		if(arty_types.includes(type) || bomb_types.includes(type)) {
			weapon += '**Damage Radius**: ' + Math.round(radius_splash_physical) + '\n';
			weapon += '**Supress Radius**: ' + Math.round(radius_splash_suppress) + '\n';
		}
		weapon += '**Aim Time:** ' + aim_time + 's' + '\n';
		//weapon += '**Noise:** ' + noise/100  + '\n';
		weapon += '**TrueROF:** ' + true_rof + ' r/m' + '\n';
		if(automatic_gun_types.includes(type)) {
			weapon += '**Salvo:** ' + shots_per_salvo + ' Shots' + '\n';
			weapon += 'Duration: ' + Math.round(salvo_duration) + ' seconds' + '\n' + 'Salvo HE Sum: ' + salvo_he_sum + '\n';
		} else {
			weapon += '**Salvo:** ' + shots_per_salvo + ' Shots' + '\n';
			weapon += 'Duration: ' + Math.round(salvo_duration) + ' seconds' + '\n';
		}
		weapon += '**Reloads:** \n' + time_between_shots + 's/Shot, ' + time_between_salvos + 's/Salvo' + '\n';
		weapon += '**Supply Cost:** ' + supply_cost + '/Salvo' + '\n';
		//
		//add fields for weapons only if the unit has the weapons
		if(weapon_repeat[name]>0)
			type =   weapon_repeat[name] + 'x ' + type + 's';
		if(name !== '') {
			embed.addField('**' + type + '**:', weapon, true);
		}
	}
	return embed;
};
