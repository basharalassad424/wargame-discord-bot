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
const command_emoji = '<:command:839991090093621300>';
const country_flags = {
	"Poland": ":flag_pl:",
	'Czechoslavakia': ':flag_cz:',
	'Soviet Union': '<:flag_su:838026756879024148>',
	'Yugoslavia': '<:flag_yug:838030505794076692>',
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
const airOptics = {
	'150': 'Good (150)',
	'300': 'Very Good (300)',
	'450': 'Exceptional (450)',
	'900': 'Exceptional + (900)',
};

module.exports.comparing = (i1, i2) => {

	if(i1.Name === '') {
		return;
	}
	i1.Weapon1Type = i1.Weapon1Type.replaceAll('Assault Rifles', 'Assault Rifle');
	i1.Weapon2Type = i1.Weapon2Type.replaceAll('LAW', 'AT');
	i1.Weapon3Type = i1.Weapon3Type.replaceAll('LAW', 'AT');
	// i.Name = i.Name.replaceAll('%', ' ');
	//
	let i1_deck_id;
	let i1_side;
	let i1_country_flag;
	let i1_proto;
	let i1_armorfront;
	let i1_armorsides;
	let i1_armorrear;
	let i1_armortop;

	let i1_rookieavail = ('\n|Rookie:**' + i1.RookieDeployableAmount + '**|  ');
	let i1_trainedavail = ('\n|Trained:**' + i1.TrainedDeployableAmount + '**|   ');
	let i1_hardenedavail = ('\n|Hardened:**' + i1.HardenedDeployableAmount + '**|   ');
	let i1_veteranavail = ('\n|Veteran:**' + i1.VeteranDeployableAmount + '**|   ');
	let i1_eliteavail = ('\n|Elite:**' + i1.EliteDeployableAmount + '**|   ');

	if(groundOptics.hasOwnProperty(i1.OpticalStrengthGround)) {
		i1.OpticalStrengthGround = groundOptics[i1.OpticalStrengthGround];
	}
	if(stealth.hasOwnProperty(i1.Stealth)) {
		i1.Stealth = stealth[i1.Stealth];
	}
	if(i1.Nationalite === '1') {
		i1_color = "RED";
		i1_side = '1';
	} else {
		i1_color = "BLUE";
		i1_side = '0';
	}
	if(country_flags.hasOwnProperty(i1.MotherCountry)) {
		i1_country_flag = country_flags[i1.MotherCountry];
	}
	if(i1.ArmorFrontSplashResistant.toLowerCase() === 'true') {
		i1_armorfront = '0';
	} else {
		i1_armorfront = i1.ArmorFront;
	}
	if(i1.ArmorSidesSplashResistant.toLowerCase() === 'true') {
		i1_armorsides = '0';
	} else {
		i1_armorsides = i1.ArmorSides;
	}
	if(i1.ArmorRearSplashResistant.toLowerCase() === 'true') {
		i1_armorrear = '0';
	} else {
		i1_armorrear = i1.ArmorRear;
	}
	if(i1.ArmorTopSplashResistant.toLowerCase() === 'true') {
		i1_armortop = '0';
	} else {
		i1_armortop = i1.ArmorTop;
	}
	if(i1.IsPrototype.toLowerCase() === 'true') 
		i1_proto = '\n**Prototype**';
	else
		i1_proto = ''
	//defaults
	let i1_title = ('**' + i1.Name.toUpperCase() + ('%', ' ') + '**');
	let i1_availability = (i1_rookieavail + i1_trainedavail + i1_hardenedavail + i1_veteranavail + i1_eliteavail);
	let i1_price = (i1.Price);
	let i1_year = '\n**Year**: ' + i1.Year;
	let i1_category = (i1_year + '\n**Nationality**: ' + i1_country_flag + i1_proto);
	let i1_armor = '\n**Armor: ** \nFront: ' + i1_armorfront + '\nSides: ' + i1_armorsides + '\nRear: ' + i1_armorrear + '\nTop: ' + i1_armortop
	let i1_ecm = '\n**ECM: **' + Math.abs(100*i1.ECM) + '%';
	let i1_autonomy = '\n**Autonomy: **' + i1.Autonomy + 's';
	let i1_movement = ('**Movement**', '\n**Type**: ' + i1.MovementType + '\n**Speed**: ' + Math.trunc(i1.MaxSpeed) + 'kph\n**Stealth**: ' + i1.Stealth + '\n' + '**Air detection**: ' + i1.OpticalStrengthAir + '\n**Ground optics**: ' + i1.OpticalStrengthGround);
	//specialized formatting
	if(i1.Tab === 'LOG') { //logistics tab formatting
		if(i1.SupplyCapacity === '') {
			i1_title = ('**' + i1.Name.toUpperCase() + '**' + command_emoji);
		} //if its a cv, give it the cv icon
		i1_category = ('\n**Logistics** ' + i1_year + '\n**Nationality**: ' + i1_country_flag + i1_proto);
		if(i1.Training !== '') {
			i1_movement = (i1_movement + '\n**Training**: ' + i1.Training);
		} else {
			i1_movement = (i1_movement + i1_armor + i1_autonomy);
		}
		if(i1_armorfront == 'none' && i1_armorsides == 'none' && i1_armorrear == 'none' && i1_armortop == 'none') {
			i1_movement = (i1_movement + '\n**Armor**: Splash');
		}
	} else if(i1.Tab === 'INF') {
		i1_category = ('\n**Infantry**  ' + i1_category);
		i1_movement = (i1_movement + '\n**Training**: ' + i1.Training);
	} else if(i1.Tab === 'SUP') {
		i1_category = ('\n**Support** ' + i1_category);
		i1_movement = (i1_movement + i1_armor + i1_autonomy);
	} else if(i1.Tab === 'TNK') {
		i1_category = ('\n**Tank** ' + i1_category);
		i1_movement = (i1_movement + i1_armor + i1_autonomy);
		if(i1.Weapon1ShotsPerSalvo == i1.Weapon1DisplayedAmmunition) {
			i1_category = i1_category + '\n**Autoloaded**';
		}
	} else if(i1.Tab === 'REC') {
		if(i1.IsTransporter === 'TRUE')
			i1_category = ('\n**Recon** ' + '\n**Transport**' + i1_category);
		else
			i1_category = ('\n**Recon** ' + i1_category);
		if(i1.Training !== '') {
			i1_movement = (i1_movement + '\n**Training**: ' + i1.Training);
		} else {
			i1_movement = (i1_movement + i1_armor + i1_autonomy);
		}
	} else if(i1.Tab === 'VHC') {
		if(i1.IsTransporter === 'TRUE')
			i1_category = ('\n**Vehicle** ' + '\n**Transport**' + i1_category);
		else
			i1_category = ('\n**Vehicle** ' + i1_category);
		i1_movement = (i1_movement + i1_armor + i1_autonomy);
	} else if(i1.Tab === 'HEL') {
		if(i1.IsTransporter === 'TRUE')
			i1_category = ('\n**Helicopter** ' + '\n**Transport**' + i1_category);
		else
			i1_category = ('\n**Helicopter** ' + i1_category);
		i1_movement = (i1_movement + i1_armor + i1_autonomy);
	} else if(i1.Tab === 'PLA') {
		if(airOptics.hasOwnProperty(i1.OpticalStrengthAir)) {
			i1.OpticalStrengthAir = airOptics[i1.OpticalStrengthAir];
		}
		//Data doesnt import turn radius | mouvementhandler => TAirplanephysicConfiguration => AgilityRadiusInMeter
		//let turn_radius = ' | **Turn Radius**: ' + i.TurnRadius
		i1_category = ('\n**Plane** ' + i1_category);
		i1_movement = ('**Movement**', '\n**Type**: ' + i1.MovementType + '\n**Speed**: ' + Math.trunc(i1.MaxSpeed) + 'kph\n**Stealth**: ' + i1.Stealth + '\n**Air Detection**: ' + i1.OpticalStrengthAir);
		i1_movement = (i1_movement + i1_armor + i1_autonomy + i1_ecm);
	} else if(i1.Tab = 'NAV') {
		if(i1.IsTransporter === 'TRUE')
			i1_category = ('\n**Naval** ' + '\n**Transport**' + i1_category);
		else
			i1_category = ('\n**Naval** ' + i1_category);
		i1_movement = ('**Movement**', '\n**Type**: ' + i1.MovementType + '\n**Speed**: ' + Math.trunc(i1.MaxSpeed / 18.5) + 'kt\n**Stealth**: ' + i1.Stealth + ' \n**Ground optics**: ' + i1.OpticalStrengthGround + '\n**Air Detection**: ' + i1.OpticalStrengthAir + '\n**CIWS**: ' + i1.CIWS + i1_ecm);
		i1_movement = (i1_movement + '\n' + i1_armor);
	}
	if(i1.SupplyCapacity !== '') {
		i1_category = ('\n**Logistics** ' + i1_category +'\n**Supply capacity**: ' + i1.SupplyCapacity);
	}
	if(i1.Amphibious === 'TRUE') {
		i1_category = i1_category + ('\n**Amphibious** ');
	}
	i1_deck_id = i1_side + i1.DeckID
	i1_category = i1_category + (' \n **Spec decks**:\n' + i1.Decks.split('|').join('\n'));

	if(i2.Name === '') {
		return;
	}
	i2.Weapon1Type = i2.Weapon1Type.replaceAll('Assault Rifles', 'Assault Rifle');
	i2.Weapon2Type = i2.Weapon2Type.replaceAll('LAW', 'AT');
	i2.Weapon3Type = i2.Weapon3Type.replaceAll('LAW', 'AT');
	// i.Name = i.Name.replaceAll('%', ' ');
	//
	let i2_deck_id;
	let i2_side;
	let i2_country_flag;
	let i2_proto;
	let i2_armorfront;
	let i2_armorsides;
	let i2_armorrear;
	let i2_armortop;

	let i2_rookieavail = ('\n|Rookie:**' + i2.RookieDeployableAmount + '**|  ');
	let i2_trainedavail = ('\n|Trained:**' + i2.TrainedDeployableAmount + '**|   ');
	let i2_hardenedavail = ('\n|Hardened:**' + i2.HardenedDeployableAmount + '**|   ');
	let i2_veteranavail = ('\n|Veteran:**' + i2.VeteranDeployableAmount + '**|   ');
	let i2_eliteavail = ('\n|Elite:**' + i2.EliteDeployableAmount + '**|   ');

	if(groundOptics.hasOwnProperty(i2.OpticalStrengthGround)) {
		i2.OpticalStrengthGround = groundOptics[i2.OpticalStrengthGround];
	}
	if(stealth.hasOwnProperty(i2.Stealth)) {
		i2.Stealth = stealth[i2.Stealth];
	}
	if(i2.Nationalite === '1') {
		i2_color = "RED";
		i2_side = '1';
	} else {
		i2_color = "BLUE";
		i2_side = '0';
	}
	if(country_flags.hasOwnProperty(i2.MotherCountry)) {
		i2_country_flag = country_flags[i2.MotherCountry];
	}
	if(i2.ArmorFrontSplashResistant.toLowerCase() === 'true') {
		i2_armorfront = '0';
	} else {
		i2_armorfront = i2.ArmorFront;
	}
	if(i2.ArmorSidesSplashResistant.toLowerCase() === 'true') {
		i2_armorsides = '0';
	} else {
		i2_armorsides = i2.ArmorSides;
	}
	if(i2.ArmorRearSplashResistant.toLowerCase() === 'true') {
		i2_armorrear = '0';
	} else {
		i2_armorrear = i2.ArmorRear;
	}
	if(i2.ArmorTopSplashResistant.toLowerCase() === 'true') {
		i2_armortop = '0';
	} else {
		i2_armortop = i2.ArmorTop;
	}
	if(i2.IsPrototype.toLowerCase() === 'true') 
		i2_proto = '\n**Prototype**';
	else
		i2_proto = ''
	//defaults
	let i2_title = ('**' + i2.Name.toUpperCase() + ('%', ' ') + '**');
	let i2_availability = (i2_rookieavail + i2_trainedavail + i2_hardenedavail + i2_veteranavail + i2_eliteavail);
	let i2_price = (i2.Price);
	let i2_year = '\n**Year**: ' + i2.Year;
	let i2_category = (i2_year + '\n**Nationality**: ' + i2_country_flag + i2_proto);
	let i2_armor = '\n**Armor: ** \nFront: ' + i2_armorfront + '\nSides: ' + i2_armorsides + '\nRear: ' + i2_armorrear + '\nTop: ' + i2_armortop
	let i2_ecm = '\n**ECM: **' + Math.abs(100*i2.ECM) + '%';
	let i2_autonomy = '\n**Autonomy: **' + i2.Autonomy + 's';
	let i2_movement = ('**Movement**', '\n**Type**: ' + i2.MovementType + '\n**Speed**: ' + Math.trunc(i2.MaxSpeed) + 'kph\n**Stealth**: ' + i2.Stealth + '\n' + '**Air detection**: ' + i2.OpticalStrengthAir + '\n**Ground optics**: ' + i2.OpticalStrengthGround);
	//specialized formatting
	if(i2.Tab === 'LOG') { //logistics tab formatting
		if(i2.SupplyCapacity === '') {
			i2_title = ('**' + i2.Name.toUpperCase() + '**' + command_emoji);
		} //if its a cv, give it the cv icon
		i2_category = ('\n**Logistics** ' + i2_year + '\n**Nationality**: ' + i2_country_flag + i2_proto);
		if(i2.Training !== '') {
			i2_movement = (i2_movement + '\n**Training**: ' + i2.Training);
		} else {
			i2_movement = (i2_movement + i2_armor + i2_autonomy);
		}
		if(i2_armorfront == 'none' && i2_armorsides == 'none' && i2_armorrear == 'none' && i2_armortop == 'none') {
			i2_movement = (i2_movement + '\n**Armor**: Splash');
		}
	} else if(i2.Tab === 'INF') {
		i2_category = ('\n**Infantry**  ' + i2_category);
		i2_movement = (i2_movement + '\n**Training**: ' + i2.Training);
	} else if(i2.Tab === 'SUP') {
		i2_category = ('\n**Support** ' + i2_category);
		i2_movement = (i2_movement + i2_armor + i2_autonomy);
	} else if(i2.Tab === 'TNK') {
		i2_category = ('\n**Tank** ' + i2_category);
		i2_movement = (i2_movement + i2_armor + i2_autonomy);
		if(i2.Weapon1ShotsPerSalvo == i2.Weapon1DisplayedAmmunition) {
			i2_category = i2_category + '\n**Autoloaded**';
		}
	} else if(i2.Tab === 'REC') {
		if(i2.IsTransporter === 'TRUE')
			i2_category = ('\n**Recon** ' + '\n**Transport**' + i2_category);
		else
			i2_category = ('\n**Recon** ' + i2_category);
		if(i2.Training !== '') {
			i2_movement = (i2_movement + '\n**Training**: ' + i2.Training);
		} else {
			i2_movement = (i2_movement + i2_armor + i2_autonomy);
		}
	} else if(i2.Tab === 'VHC') {
		if(i2.IsTransporter === 'TRUE')
			i2_category = ('\n**Vehicle** ' + '\n**Transport**' + i2_category);
		else
			i2_category = ('\n**Vehicle** ' + i2_category);
		i2_movement = (i2_movement + i2_armor + i2_autonomy);
	} else if(i2.Tab === 'HEL') {
		if(i2.IsTransporter === 'TRUE')
			i2_category = ('\n**Helicopter** ' + '\n**Transport**' + i2_category);
		else
			i2_category = ('\n**Helicopter** ' + i2_category);
		i2_movement = (i2_movement + i2_armor + i2_autonomy);
	} else if(i2.Tab === 'PLA') {
		if(airOptics.hasOwnProperty(i2.OpticalStrengthAir)) {
			i2.OpticalStrengthAir = airOptics[i2.OpticalStrengthAir];
		}
		//Data doesnt import turn radius | mouvementhandler => TAirplanephysicConfiguration => AgilityRadiusInMeter
		//let turn_radius = ' | **Turn Radius**: ' + i.TurnRadius
		i2_category = ('\n**Plane** ' + i2_category);
		i2_movement = ('**Movement**', '\n**Type**: ' + i2.MovementType + '\n**Speed**: ' + Math.trunc(i2.MaxSpeed) + 'kph\n**Stealth**: ' + i2.Stealth + '\n**Air Detection**: ' + i2.OpticalStrengthAir);
		i2_movement = (i2_movement + i2_armor + i2_autonomy + i2_ecm);
	} else if(i2.Tab = 'NAV') {
		if(i2.IsTransporter === 'TRUE')
			i2_category = ('\n**Naval** ' + '\n**Transport**' + i2_category);
		else
			i2_category = ('\n**Naval** ' + i2_category);
		i2_movement = ('**Movement**', '\n**Type**: ' + i2.MovementType + '\n**Speed**: ' + Math.trunc(i2.MaxSpeed / 18.5) + 'kt\n**Stealth**: ' + i2.Stealth + ' \n**Ground optics**: ' + i2.OpticalStrengthGround + '\n**Air Detection**: ' + i2.OpticalStrengthAir + '\n**CIWS**: ' + i2.CIWS + i2_ecm);
		i2_movement = (i2_movement + '\n' + i2_armor);
	}
	if(i2.SupplyCapacity !== '') {
		i2_category = ('\n**Logistics** ' + i2_category +'\n**Supply capacity**: ' + i2.SupplyCapacity);
	}
	if(i2.Amphibious === 'TRUE') {
		i2_category = i2_category + ('\n**Amphibious** ');
	}
	i2_deck_id = i2_side + i2.DeckID
	i2_category = i2_category + (' \n **Spec decks**:\n' + i2.Decks.split('|').join('\n'));

	const embed = new Discord.MessageEmbed().setTitle('Comparing:');

	embed.addField(i1_title, '**Price**: ' + i1_price + '\n**Strength**: ' + i1.Strength, true);
	embed.addField(i2_title, '**Price**: ' + i2_price + '\n**Strength**: ' + i2.Strength, true);
	embed.addField('\u200b', '\u200b', true);
	embed.addField('**Category**: ', i1_category, true);
	embed.addField('**Category**: ', i2_category, true);
	embed.addField('\u200b', '\u200b', true);
	embed.addField('**Movement**: ', i1_movement, true);
	embed.addField('**Movement**: ', i2_movement, true);
	embed.addField('\u200b', '\u200b', true);
	embed.addField('**Availability**: ', i1_availability, true);
	embed.addField('**Availability**: ', i2_availability, true);
	embed.addField('\u200b', '\u200b', true);

	//loop through all weapons
	function insertWeapon(i, j, weapon_repeat, embed)
	{
		//check for repated naval guns
		name = i['Weapon' + j + 'Name'];
		type = i['Weapon' + j + 'Type'];

		//if it repeats display only the last one
		while(weapon_repeat[name+type]>0)
		{
			j += 1;
			if(j > 11)
				return;
			name = i['Weapon' + j + 'Name'];
			type = i['Weapon' + j + 'Type'];
		}
		weapon_repeat[name+type] = 1;
		for(k=j+1; k<=11; k++){
			if(i.Tab === 'NAV' && name === i['Weapon' + k + 'Name'] && type === i['Weapon' + k + 'Type']){
				weapon_repeat[name+type] += 1;
			}
		}

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
		if(weapon_repeat[name+type]>1)
			type =  weapon_repeat[name+type] + 'x ' + type + 's';
		if(name !== '') {
			embed.addField('**' + type + '**:', weapon, true);
			k = 0;
		}
		return;
	}
	let i1_weapon_repeat = {};
	let i2_weapon_repeat = {};
	let i1_weapons_done = false;
	let i2_weapons_done = false;
	for(j = 1; j<=11; j++)
	{
		if(i1['Weapon' + j + 'Name'] !== '') {
			if(embed.fields.length > 23){
				embed.addField('Error', 'Couldn\'t print all weapons due to discord embed field count limit');
				break;
			}
			insertWeapon(i1, j, i1_weapon_repeat, embed);
		}else {
			i1_weapons_done = true;
			embed.addField('\u200b', '\u200b', true);
		}
		//check if embed is bound to exceed discord 6000 char limit
		if(embed.length > 5700){
			embed.addField('Error', 'Couldn\'t print all weapons due to discord embed character count limit');
			break;
		}
		if(i2['Weapon' + j + 'Name'] !== '') {
			insertWeapon(i2, j, i2_weapon_repeat, embed);
		}else {
			i2_weapons_done = true;
			embed.addField('\u200b', '\u200b', true);
		}

		if(i1_weapons_done && i2_weapons_done)
			break;
		embed.addField('\u200b', '\u200b', true);
		//check if embed is bound to exceed discord 6000 char limit
		if(embed.length > 5700){
			embed.addField('Error', 'Couldn\'t print all weapons due to discord embed character count limit');
			break;
		}
	}
	return embed;
};
