
String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};
const fetch = require('node-fetch');
const Discord = require('discord.js');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

module.exports.formatting = (i, show_img=false) => {

  if (i.Name === '') {
    return;
  }

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


  if (groundOptics.hasOwnProperty(i.OpticalStrengthGround)) {
    i.OpticalStrengthGround = groundOptics[i.OpticalStrengthGround];
  }

  if (stealth.hasOwnProperty(i.Stealth)) {
    i.Stealth = stealth[i.Stealth];
  }

	if (i.Nationalite === '1'){
    color = "RED";
		side = '1';
	}else {
    color = "BLUE";
		side = '0';
	}

	if (country_flags.hasOwnProperty(i.MotherCountry)) {
    country_flag = country_flags[i.MotherCountry];
  }

  if (i.ArmorFrontSplashResistant.toLowerCase() === 'true') {
    armorfront = '0';
  } else {
    armorfront = i.ArmorFront;
  }
  if (i.ArmorSidesSplashResistant.toLowerCase() === 'true') {
    armorsides = '0';
  } else {
    armorsides = i.ArmorSides;
  }
  if (i.ArmorRearSplashResistant.toLowerCase() === 'true') {
    armorrear = '0';
  } else {
    armorrear = i.ArmorRear;
  }
  if (i.ArmorTopSplashResistant.toLowerCase() === 'true') {
    armortop = '0';
  } else {
    armortop = i.ArmorTop;
  }

  if (i.IsPrototype.toLowerCase() === 'false') {
    proto = '**Not prototype**';
  } else if (i.IsPrototype.toLowerCase() === 'true') {
    proto = '**Prototype**';
  }

  //defaults

  let title = ('**' + i.Name.toUpperCase() + ('%', ' ') + '**');

  let availability = (rookieavail + trainedavail + hardenedavail + veteranavail + eliteavail);

  let price = (i.Price);

  let category = ('**Logistics** | **Nationality**: ' + country_flag + ' | ' + proto);

	let armor = '\n**Armor: ** Front: ' + armorfront + ' | Sides: ' + armorsides + ' | Rear: ' + armorrear + ' | Top: ' + armortop

	let autonomy = '\n**Autonomy: **' + i.Autonomy; + ' seconds'

	let movement = ('**Movement**', '**Type**: ' + i.MovementType + ' | **Speed**: ' + Math.trunc(i.MaxSpeed) + 'kph | **Stealth**: ' + i.Stealth +  '\n'  + '**Air detection**: ' + i.OpticalStrengthAir + ' | **Ground optics**: ' + i.OpticalStrengthGround);

  //specialized formatting

  if (i.Tab === 'LOG') { //logistics tab formatting
    if (i.SupplyCapacity === '') {
      title = ('**' + i.Name.toUpperCase() + '**' + ' <:command:583070567301644290>');
    } //if its a cv, give it the cv icon

    category = ('**Logistics** | **Nationality**: ' + country_flag + ' | ' + proto);
    if (i.Training !== '') {
    	movement = (movement + '\n**Training**: ' + i.Training);
    }else {
			movement = (movement + armor + autonomy);
			}
    if (armorfront == 'none' && armorsides == 'none' && armorrear == 'none' && armortop == 'none') {
      movement = (movement + '\n**Armor**: Splash');
    }

  } else if (i.Tab === 'INF') {
    category = ('**Infantry** | **Nationality**: ' + country_flag + ' | ' + proto);
    movement = (movement + '\n**Training**: ' + i.Training);

  } else if (i.Tab === 'SUP') {
    category = ('**Support** | **Nationality**: ' + country_flag + ' | ' + proto);
		movement = (movement + armor + autonomy);
  } else if (i.Tab === 'TNK') {
    category = ('**Tank** | **Nationality**: ' + country_flag + ' | ' + proto);
		movement = (movement + armor + autonomy);
    if (i.Weapon1ShotsPerSalvo == i.Weapon1DisplayedAmmunition) {
      category = category + ' | **Autoloaded**';

    }

  } else if (i.Tab === 'REC') {
    category = ('**Recon** | **Nationality**: ' + country_flag + ' | ' + proto);
    if (i.Training !== '') {
    	movement = (movement + '\n**Training**: ' + i.Training);
    }else {
			movement = (movement + armor + autonomy);
			}
  } else if (i.Tab === 'VHC') {
    category = ('**Vehicle** | **Nationality**: ' + country_flag + ' | ' + proto);
		movement = (movement + armor + autonomy);
  } else if (i.Tab === 'HEL') {
    category = ('**Helicopter** | **Nationality**: ' + country_flag + ' | ' + proto);
		movement = (movement + armor + autonomy);
  } else if (i.Tab === 'PLA') {

    const airOptics = {
      '150': 'Good (150)',
      '300': 'Very Good (300)',
      '450': 'Exceptional (450)',
      '900': 'Exceptional + (900)',
    };
    if (airOptics.hasOwnProperty(i.OpticalStrengthAir)) {
      i.OpticalStrengthAir = airOptics[i.OpticalStrengthAir];
    }

    category = ('**Plane** | **Nationality**: ' + country_flag + ' | ' + proto);
    movement = ('**Movement**', '**Type**: ' + i.MovementType + ' | **Speed**: ' + Math.trunc(i.MaxSpeed) + 'kph | **Stealth**: ' + i.Stealth + ' \n **Air Detection**: ' + i.OpticalStrengthAir);
		movement = (movement + armor + autonomy);

  } else if (i.Tab = 'NAV') {
    category = ('**Naval** | **Nationality**: ' + country_flag + ' | ' + proto);
    movement = ('**Movement**', '**Type**: ' + i.MovementType + ' | **Speed**: ' + Math.trunc(i.MaxSpeed/18.5) + 'kt | **Stealth**: ' + i.Stealth + ' \n **Ground optics**: ' + i.OpticalStrengthGround + ' \n **Air Detection**: ' + i.OpticalStrengthAir + ' \n**CIWS**: ' + i.CIWS);
		movement = (movement + '\n' + armor);
  }

  if (i.SupplyCapacity !== '') {
    category = ('**Logistics** | **Supply capacity**: ' + i.SupplyCapacity + ' | **Nationality**: ' + country_flag + ' | ' + proto);
  }
	if (i.Amphibious === 'TRUE'){ 
  	category = category + (' | **Amphibious**: ');
	}

	deck_id = side + i.DeckID
  category = category + (' \n **Spec decks**: ' + i.Decks);


	const attachments = new Discord.MessageAttachment('Pictures/picsb/' + deck_id + '.png')
  const embed = new Discord.MessageEmbed()
    .setTitle(title)
    .setColor(color)

		.addField('**Price: **' + price, '\n**Strength**: ' + i.Strength)

    .addField('**Category**', category)

    .addField('**Movement**', movement)

    .addField('**Availability**', availability);

		
		if ( show_img === true){
		  embed.attachFiles(attachments);
			embed.setThumbnail('attachment://'+ deck_id + '.png');
		}

	//loop through all weapons
  for (j=1; j<=11; j++)
	{
		name = i['Weapon' + j + 'Name'];
		tags = i['Weapon' + j + 'Tags'];
		type  = i['Weapon' + j + 'Type'];
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
		time_between_shots  = i['Weapon' + j + 'TimeBetweenShots'];
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

  	const true_rof = Math.round(60 * shots_per_salvo / ((shots_per_salvo- 1) * time_between_shots - -time_between_salvos));
  	const rof = Math.round((displayed_ammo /(number_of_salvos * shots_per_salvo)) * true_rof);
		
  	// the dude that made the final data csv bungled the helo range for autocannons
		// previous fix messed up the SUP SPAAGs
  	if (type == 'Autocannon' && Math.trunc(range_ground) > 1575 && i.Tab != "SUP") {
  		range_heli = range_ground - 175;
  		} else if (type == 'Autocannon' && Math.trunc(range_ground) <= 1575 && i.Tab != "SUP") {
  	  		range_heli = range_ground;
					}


		let weapon = '';
		weapon += '**' + type + '**\n';
		weapon +=  '**Name: **'+ name + '\n';
		weapon +=  caliber + ' x' + displayed_ammo + '\n';
  	if(tags) {
			weapon += '**' + tags.replace('IFC','') + '**\n';
  	}	else {
			weapon += '\n';
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
		weapon += '**Accuracy:** ' + Math.round(hit_prob*100)	 + '%' + '\n';
		weapon += '**Stabilizer:** ' + Math.round(hit_prob_moving*100) + '%' + '\n';
		weapon += '**Dispersion:** ' + Math.round(dispersion_at_max_range) + '\n';
		weapon += '**AP Power:** ' + ap + '\n';
		weapon += '**HE Power:** ' + he + '\n';
		let arty_types = ['Howitzer', 'Mortar', 'MLRS']
  	if(arty_types.includes(type)) {
  	  weapon += '**Damage Radius**: ' + Math.round(radius_splash_physical) + '\n';
  	  weapon += '**Supress Radius**: ' + Math.round(radius_splash_suppress)  + '\n';
  	}
		weapon += '**Aim Time:** ' + aim_time + 's' + '\n';
		weapon += '**ROF:** ' + rof + ' r/m' + '\n';
		weapon += '**TrueROF:** ' + true_rof + ' r/m' + '\n';
		weapon += '**Salvo:** ' + shots_per_salvo + ' Shots' + '\n';
		weapon += '**Reloads:** \n' + time_between_shots + ' s/Shots, ' +  time_between_salvos +  's/Salvo' + '\n';
		weapon += '**Supply Cost:** ' + supply_cost + '/Salvo' + '\n';

		//
  	//add fields for weapons only if the unit has the weapons
  	if (name !== '') {
  	  embed.addField('**Weapon ' + j + '**:', weapon,  true);
  	}
	}

  return embed;
};
