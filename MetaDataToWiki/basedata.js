const ages = {
    "BronzeAge": "'''BA'''",
    "IronAge": "'''IA'''",
    "EarlyMiddleAge": "'''EMA'''",
    "HighMiddleAge": "'''HMA'''",
    "LateMiddleAge": "'''LMA'''",
    "ColonialAge": "'''CA'''",
    "IndustrialAge": "'''INA'''",
    "ProgressiveEra": "'''PE'''",
    "ModernEra": "'''ME'''",
    "PostModernEra": "'''PME'''",
    "ContemporaryEra": "'''CE'''",
    "TomorrowEra": "'''TE'''",
    "FutureEra": "'''FE'''",
    "ArcticFuture": "'''AF'''",
    "OceanicFuture": "'''OF'''",
    "VirtualFuture": "'''VF'''",
    "SpaceAgeMars": "'''SAM'''",
    "SpaceAgeAsteroidBelt": "'''SAAB'''",
    "SpaceAgeVenus": "'''SAV'''",
}

const headerextra = {
    "Set 1": "1<sup>st</sup> Bonus",
    "Set 2": "2<sup>nd</sup> Bonus",
    "Set 3": "3<sup>rd</sup> Bonus",
    "Set 4": "4<sup>th</sup> Bonus",
    "Set 5": "5<sup>th</sup> Bonus",
    "Set 6": "6<sup>th</sup> Bonus",
    "Chain": "if chained to",
    "Prod 0": "{{ITIM}}5m",
    "Prod 1": "{{ITIM}}15m",
    "Prod 2": "{{ITIM}}1h",
    "Prod 3": "{{ITIM}}4h",
    "Prod 4": "{{ITIM}}8h",
    "Prod 5": "{{ITIM}}24h",
}


const prodheaders = {
    "money": "{{ICOI}}",
    "supplies": "{{ISUP}}",
    "medals": "{{IMED}}",
    "clan_power": "{{Power}}",
    "random_good_of_age": "{{Goods}}",
    "random_good_of_age_1": "{{Goods}}",
    "random_good_of_age_2": "{{Goods}}",
    "random_good_of_age_3": "{{Goods}}",
    "random_good_of_age_4": "{{Goods}}",
    "goods": "{{Goods}}",
    "good": "{{Goods}}",
    "era_goods": "{{Goods}}",
    "all_goods_of_age": "{{Goods}}",
    "Goods_Sum": "{{Goods}}",           // Goods_Sum has to be the last item that translates to {{Goods}} 
                                        //and defines the position of gooods in the resulting table
                                        //Goods_Sum may not occur in the categoryGoods variable below!!!
    "clan_goods": "{{GUIG}}",
    "strategy_points": "{{FP}}",
    "premium": "{{IDIA}}",
    "att_boost_attacker": "{{IATT}}",
    "def_boost_defender": "{{DEF}}",
    "att_boost_defender": "{{DATT}}",
    "def_boost_attacker": "{{ADEF}}",
    "coin_production": "{{ICOI}} Boost",
    "supply_production": "{{ISUP}} Boost",
    "Unit-Production": "{{IMU}}",
    "BP-Production": "{{BP}}",
    "provided_population": "{{IPOP}}",
    "provided_happiness": "{{IHAP}}",
    "happiness_amount": "{{IHAP}}",
    "produced_money": "{{ICOI}}",
    "points": "{{Prestige}}",
    "hapeff": "{{IHAP}}/{{ISIZ}}",
    "age": "{{IAGE}}"
}

const categoryGoods = [
    "random_good_of_age",
    "random_good_of_age_1",
    "random_good_of_age_2",
    "random_good_of_age_3",
    "random_good_of_age_4",
    "goods",
    "good",
    "era_goods",
    "all_goods_of_age",  
]

const categoryBoosts = [   
    "att_boost_attacker",
    "def_boost_defender",
    "att_boost_defender",
    "def_boost_attacker",
    "coin_production",
    "supply_production",
]