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

const headerExtra = {
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


const prodHeaders = {                       //translates production options to wiki code (table heads), determines the order of listing of the options in the output-tabel
    "age": "{{IAGE}}",
    "provided_population": "{{IPOP}}",
    "provided_happiness": "{{IHAP}}",
    "hapeff": "{{IHAP}}/{{ISIZ}}",
    "money": "{{ICOI}}",
    "supplies": "{{ISUP}}",
    "medals": "{{IMED}}",
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
    "strategy_points": "{{FP}}",
    "points": "{{Prestige}}",
    "premium": "{{IDIA}}",
    "happiness_amount": "{{IHAP}}",
    "produced_money": "{{ICOI}}",
    "clan_power": "{{Power}}",
    "clan_goods": "{{GUIG}}",
    "BP-Production": "{{BP}}",
    "Unit-Production" : "{{IMU}}"
    "att_boost_attacker": "{{IATT}}",
    "def_boost_defender": "{{DEF}}",
    "att_boost_defender": "{{DATT}}",
    "def_boost_attacker": "{{ADEF}}",
    "coin_production": "{{ICOI}} Boost",
    "supply_production": "{{ISUP}} Boost",
    
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

const multiageWiki = {
    "tableDef":'{| class="FoETable AgeTable ProdTable"',
    "styleFirstRow" : '!  style="width:50px; | ',
    "styleRow" : '!  style="width:70px; | ',
}
