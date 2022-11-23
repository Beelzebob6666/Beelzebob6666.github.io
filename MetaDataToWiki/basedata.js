var chainOutput = false;

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
    "SpaceAgeJupiterMoon": "'''SAJM'''",
}

const headerExtra = {
    "Set 1": "1<sup>st</sup> Bonus<br>",
    "Set 2": "2<sup>nd</sup> Bonus<br>",
    "Set 3": "3<sup>rd</sup> Bonus<br>",
    "Set 4": "4<sup>th</sup> Bonus<br>",
    "Set 5": "5<sup>th</sup> Bonus<br>",
    "Set 6": "6<sup>th</sup> Bonus<br>",
    "Chain": "if chained to<br>",
    "Chain 1": "with length 1+<br>",
    "Chain 2": "with length 2+<br>",
    "Chain 3": "with length 3+<br>",
    "Chain 4": "with length 4+<br>",
    "Chain 5": "with length 5+<br>",
    "Chain 6": "with length 6+<br>",
    "Prod 0": "{{ITIM}}5m<br>",
    "Prod 1": "{{ITIM}}15m<br>",
    "Prod 2": "{{ITIM}}1h<br>",
    "Prod 3": "{{ITIM}}4h<br>",
    "Prod 4": "{{ITIM}}8h<br>",
    "Prod 5": "{{ITIM}}24h<br>",
    "mot":"{{ifMotivated}}<br>",
    "chance":" for<br>",
    "DP":"{{2xWhenMotivated}}<br>"
}


const prodHeaders = {                       //translates production options to wiki code (table heads), determines the order of listing of the options in the output-tabel for convertOld
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
    "all_goods_of_previous_age": "{{PEGoods}}",
    "random_good_of_previous_age": "{{PEGoods}}",
    "strategy_points": "{{FP}}",
    "points": "{{Prestige}}",
    "premium": "{{IDIA}}",
    "happiness_amount": "{{IHAP}}",
    "produced_money": "{{ICOI}}",
    "clan_power": "{{Power}}",
    "clan_goods": "{{GUIG}}",
    "BP-Production": "{{BP}}",
    "Unit-Production" : "{{IMU}}",
    "att_boost_attacker": "{{IATT}}",
    "def_boost_defender": "{{DEF}}",
    "att_boost_defender": "{{DATT}}",
    "def_boost_attacker": "{{ADEF}}",
    "coin_production": "{{CoinBoost}}",
    "supply_production": "{{SupplyBoost}}",
    "forge_points_production":"{{FPBoost}}",
 
}

const NewAbilityIndex = {                          //determines the order in which the abilities are parsed in convertOld
    "AddResourcesAbility": -1,
    "AddResourcesWhenMotivatedAbility": -1,
    "RandomUnitOfAgeWhenMotivatedAbility": -1,
    "RandomBlueprintWhenMotivatedAbility": -1,
    "AddResourcesToGuildTreasuryAbility": -1,
    "BoostAbility": -1,
    "BonusOnSetAdjacencyAbility": -1,
    "ChainLinkAbility": -1,
    "RandomChestRewardAbility": -1,
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
    "forge_points_production"
]

const multiageWiki = {
    "tableDef":'{| class="FoETable AgeTable ProdTable"',
    "styleFirstRow" : '!  style="width:50px;" | ',
    "styleRow" : '!  style="width:70px;" | ',
}

const specialProducts = {   // Reward strings - removed " of ", removed "+", made "Fragments" singular, removed leading numbers, removed spaces
    "FragmentOneUpKit": "[[File:OneUpKitFragment.png|20px|link=Fragments|Fragment of One Up Kit]]",
    "FragmentMassSelf-AidKit": "[[File:MassSelfAidFragment.png|20px|link=Fragments|Fragment of Mass Self Aid Kit]]",
    "Fragment30mMassSupplyRush": "[[File:MassSupplyRushFragment.png|20px|link=Fragment|Fragment of 30min Mass Supply Rush]]",
    "FragmentFinishAllSupplyProductions": "[[File:LargeMassSupplyRushFragment.png|20px|link=Fragment|Fragment of Finish All Productions Rush]]",
    "Fragment20%AttackerBoost": "[[File:LargeAttackBoostFragment.png|20px|link=Fragment|Fragment Large Attack Boost]]",
    "FragmentStoreBuilding": "[[File:StoreBuildingFragment.png|20px|link=Fragment|Fragment Store Building]]",
    "FragmentNutcrackerGuardhouse": "[[File:Fragment_Nutcracker_Guardhouse.png|30px|link=Fragment|Fragment Nutcracker Guardhouse]]",
    "Deadman'sBounty": "[[File:Reward_icon_dead_man_stash.png|20px|link=|Deadman's Bounty]]",
    "Buccaneer'sBounty": "[[File:Reward_icon_buccaneer.png|20px|link=|Buccaneer's Bounty]]",
    "RandomUnitChest": "{{IMU}}",
    "RandomUnit": "{{IMU}}",
}

const NewProductions = {                  // determines order of productions in convertNew        
    "money": 0,
    "supplies": 0,
    "medals": 0,
    "goods": 0,
    "all_goods_of_previous_age": 0,
    "random_good_of_previous_age":0,
    "strategy_points":0,
    "premium":0,
    "clan_power" :0,
    "clan_goods": 0,
    "BP-Production": 0,
    "Unit-Production" : 0,
    }
