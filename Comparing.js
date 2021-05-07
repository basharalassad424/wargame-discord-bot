/*
Copyright 2021 basharalassad424 (https://github.com/basharalassad424)

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//

const Discord = require('discord.js');

const airOptics = {
    '150': 'Good (150)',
    '300': 'Very Good (300)',
    '450': 'Exceptional (450)',
    '900': 'Exceptional + (900)',
};

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

function handleSign(n)
{
    return (n<=0?"":"+") + n
}

function addParenthesis(str)
{
    return ('(' + str + ')')
}

function getArmorUnit(unit)
{
	if(unit.ArmorFrontSplashResistant.toLowerCase() === 'true') {
		armorfront = '0';
	} else {
		armorfront = unit.ArmorFront;
	}
	if(unit.ArmorSidesSplashResistant.toLowerCase() === 'true') {
		armorsides = '0';
	} else {
		armorsides = unit.ArmorSides;
	}
	if(unit.ArmorRearSplashResistant.toLowerCase() === 'true') {
		armorrear = '0';
	} else {
		armorrear = unit.ArmorRear;
	}
	if(unit.ArmorTopSplashResistant.toLowerCase() === 'true') {
		armortop = '0';
	} else {
		armortop = unit.ArmorTop;
    }
    return {armorfront, armorsides, armorrear, armortop}
}

function addSomeProperties(unit)
{
	if(groundOptics.hasOwnProperty(unit.OpticalStrengthGround)) {
		unit.OpticalStrengthGround = groundOptics[unit.OpticalStrengthGround];
	}
	if(stealth.hasOwnProperty(unit.Stealth)) {
		unit.Stealth = stealth[unit.Stealth];
	}
	if(country_flags.hasOwnProperty(unit.MotherCountry)) {
		unit.country_flag = country_flags[unit.MotherCountry];
    }
}

function getName(unit)
{
	const command_emoji = '<:command:839991090093621300>';
    if(unit.SupplyCapacity === '') {
        return ('**' + unit.Name.toUpperCase() + '**' + command_emoji);
    } else {
        return ('**' + unit.Name.toUpperCase() + ('%', ' ') + '**')
    }
}

function getCategory(unit)
{
	if(unit.Tab === 'LOG') {
		return '**Logistic**'
	} else if(unit.Tab === 'INF') {
		return '**Infantry**'
	} else if(unit.Tab === 'SUP') {
		return '**Support**'
	} else if(unit.Tab === 'TNK') {
		return '**Tank**'
	} else if(unit.Tab === 'REC') {
		if(unit.IsTransporter === 'TRUE')
			return '**Recon** | **Transport**'
		else
			return '**Recon**'
	} else if(unit.Tab === 'VHC') {
		if(unit.IsTransporter === 'TRUE')
			return '**Vehicle** | **Transport**'
		else
			return '**Vehicle** '
	} else if(unit.Tab === 'HEL') {
		if(unit.IsTransporter === 'TRUE')
			return '**Helicopter** | **Transport**'
		else
			return '**Helicopter** '
	} else if(unit.Tab === 'PLA') {
		return ('**Plane**')
	} else if(unit.Tab = 'NAV') {
		if(unit.IsTransporter === 'TRUE')
			return '**Naval** | **Transport**'
		else
			return '**Naval**'
	}
}

function getAmphibious(unit)
{
    return (unit.Amphibious === 'TRUE' ? 'Yes' : 'No')
}

function makeDescCmp(unit1, unit2)
{
	let rookieavail =    '|Rookie:**' + unit1.RookieDeployableAmount + '(' + handleSign(unit1.RookieDeployableAmount - unit2.RookieDeployableAmount) +  ')**|  '
	let trainedavail = '|Trained:**' + unit1.TrainedDeployableAmount + '(' + handleSign(unit1.TrainedDeployableAmount - unit2.TrainedDeployableAmount) + ')**|   '
	let hardenedavail = '|Hardened:**' + unit1.HardenedDeployableAmount + '(' + handleSign(unit1.HardenedDeployableAmount - unit2.HardenedDeployableAmount) + ')**|   '
	let veteranavail = '|Veteran:**' + unit1.VeteranDeployableAmount + '(' + handleSign(unit1.VeteranDeployableAmount - unit2.VeteranDeployableAmount) + ')**|   '
    let eliteavail = '|Elite:**' + unit1.EliteDeployableAmount + '(' + handleSign(unit1.EliteDeployableAmount - unit2.EliteDeployableAmount) + ')**|   '
    const armorUnit1 = getArmorUnit(unit1)
    const armorUnit2 = getArmorUnit(unit2)
    addSomeProperties(unit1)
    addSomeProperties(unit2)
    let title = getName(unit1) + addParenthesis(getName(unit2))
	let availability = (rookieavail + trainedavail + hardenedavail + veteranavail + eliteavail);
	let price = unit1.Price + addParenthesis(handleSign(unit1.Price - unit2.Price))
	let year = ' | **Year**: ' + unit1.Year + addParenthesis(unit2.Year)
	let category = getCategory(unit1) + addParenthesis(getCategory(unit2)) + (year + ' | **Nationality**: ' + unit1.country_flag + addParenthesis(unit2.country_flag));
	let armor = '\n**Armor: ** Front: ' + armorUnit1.armorfront + addParenthesis(handleSign(armorUnit1.armorfront - armorUnit2.armorfront)) + ' | Sides: ' + armorUnit1.armorsides + addParenthesis(handleSign(armorUnit1.armorsides - armorUnit2.armorsides)) + ' | Rear: '  + armorUnit1.armorrear + addParenthesis(handleSign(armorUnit1.armorrear - armorUnit2.armorrear)) + ' | Top: ' + armorUnit1.armortop + addParenthesis(handleSign(armorUnit1.armortop - armorUnit2.armortop))
	let autonomy = '\n**Autonomy: **' + unit1.Autonomy + addParenthesis(handleSign(unit1.Autonomy - unit2.Autonomy)) + (unit1.Tab === 'PLA' ? ' seconds' : ' km');
    let amphibious = '**Amphibious: ** ' + getAmphibious(unit1) + addParenthesis(getAmphibious(unit2))
    let movement = ('**Movement**', '**Type**: ' + unit1.MovementType + addParenthesis(unit2.MovementType) + ' | **Speed**: ' + Math.trunc(unit1.MaxSpeed) + 'kph' + addParenthesis(handleSign(Math.trunc(unit1.MaxSpeed) - Math.trunc(unit2.MaxSpeed))) +  ' | **Stealth**: ' + unit1.Stealth + addParenthesis(unit2.Stealth) + '\n' + '**Air detection**: ' + unit1.OpticalStrengthAir + addParenthesis(unit2.OpticalStrengthAir) + ' | **Ground optics**: ' + unit1.OpticalStrengthGround + addParenthesis(unit2.OpticalStrengthGround)) + ' | ' + amphibious;
    let training = '\n**Training**: ' + unit1.Training + addParenthesis(unit2.Training)
	//specialized formatting
	if(unit1.Tab === 'LOG' && unit2.Tab === 'LOG') {
		if(unit1.Training !== '' && unit2.Training !== '') {
			movement += training
		} else {
			movement += armor + autonomy
		}
	} else if(unit1.Tab === 'INF' && unit2.Tab === 'INF') {
		movement += training
	} else if(unit1.Tab === 'SUP' && unit2.Tab === 'SUP') {
		movement += armor + autonomy
	} else if(unit1.Tab === 'TNK' && unit2.Tab === 'TNK') {
		movement += armor + autonomy
	} else if(unit1.Tab === 'REC' && unit2.Tab === 'REC') {
		if(unit1.Training !== '' && unit2.Training !== '') {
			movement += training
		} else if (unit1.Training === '' && unit2.Training === ''){
			movement += armor + autonomy
		}
	} else if(unit1.Tab === 'VHC' && unit2.Tab === 'VHC') {
		movement += armor + autonomy
	} else if(unit1.Tab === 'HEL' && unit2.Tab === 'VHC') {
		movement += armor + autonomy
	} else if(unit1.Tab === 'PLA' && unit2.Tab === 'PLA') {
        unit1.OpticalStrengthAir = airOptics[unit1.OpticalStrengthAir];
		unit2.OpticalStrengthAir = airOptics[unit2.OpticalStrengthAir];
		movement = ('**Movement**', '**Type**: ' + unit1.MovementType + addParenthesis(unit2.MovementType) + ' | **Speed**: ' + Math.trunc(unit1.MaxSpeed) + addParenthesis(handleSign(Math.trunc(unit1.MaxSpeed) - Math.trunc(unit2.MaxSpeed))) + 'kph | **Stealth**: ' + unit1.Stealth + addParenthesis(unit2.Stealth) + ' \n **Air Detection**: ' + unit1.OpticalStrengthAir + addParenthesis(unit2.OpticalStrengthAir));
		movement += armor + autonomy
	} else if(unit1.Tab === 'NAV' && unit2.Tab === 'NAV') {
		movement = ('**Movement**', '**Type**: ' + unit1.MovementType + addParenthesis(unit2.MovementType) + ' | **Speed**: ' + Math.trunc(unit1.MaxSpeed / 18.5) + addParenthesis(handleSign(Math.trunc(unit1.MaxSpeed / 18.5) - Math.trunc(unit2.MaxSpeed / 18.5))) + 'kt | **Stealth**: ' + unit1.Stealth + addParenthesis(unit2.Stealth)  +' \n **Ground optics**: ' + unit1.OpticalStrengthGround + addParenthesis(unit2.OpticalStrengthGround) + ' \n **Air Detection**: ' + unit1.OpticalStrengthAir + addParenthesis(unit2.OpticalStrengthAir) + ' \n**CIWS**: ' + unit1.CIWS + addParenthesis(unit2.CIWS));
		movement += '\n' + armor;
	}
	if(unit1.SupplyCapacity !== '' && unit2.SupplyCapacity !== '') {
		movement += ' | **Supply capacity**: ' + unit1.SupplyCapacity + addParenthesis(unit2.SupplyCapacity);
	}
   return {title, price, category, movement, availability}
}

module.exports.comparing = (unit1, unit2) => {
    const desc = makeDescCmp(unit1, unit2)
    const embed = new Discord.MessageEmbed()
        .setTitle(desc.title)
        .addField('**Price: **' + desc.price, '\n**Strength**: ' + unit1.Strength + addParenthesis(handleSign(unit1.Strength - unit2.Strength)))
        .addField('**Category**', desc.category)
        .addField('**Movement**', desc.movement)
        .addField('**Availability**', desc.availability);
    return embed
}