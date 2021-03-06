function convertOld(Building) {
    if (Building.json.type == "production" && !(Building.json.is_special)) {
        return;
    }

    var createHeader = true;
    Building.AgeData = [];
    Building.header = [];

    const AbilityIndex = {...NewAbilityIndex};

    var p = "",
        value,
        type,
        DP = false,
        pol = false;

    //check which abilities are included
    if (Building.json.abilities) {

        for (let ability in Building.json.abilities) {
            let a = Building.json.abilities[ability].__class__
            if (a === "DoubleProductionWhenMotivatedAbility") {
                DP = true;
                continue;
            }
            if (a === "PolishableAbility") {
                pol = true;
                continue;
            }
            if (!AbilityIndex[a]) continue;
            AbilityIndex[a] = ability;
        }
    }


    for (let Age in ages) {//run through the Ages as in the Ages List
        Building.size = Building.json.width * Building.json.length;
        let AgeData = [];
        //Age
        if (ages[Age]) {
            AgeData.push(ages[Age]); //push Wiki Age if available
        } else {
            AgeData.push(Age); //push raw age if no wikidata available - should not trigger in the current version, as only "known" ages are looped
        }
        if (createHeader) { //create Header only on firt age runthrough - similar below
            Building.header.push(prodHeaders.age);
        }


        if (Building.json.entity_levels) {
            for (let level in Building.json.entity_levels) {
                let Level = Building.json.entity_levels[level];
                if (Level.era == Age) {
                    //population
                    let pop = 0;
                    if (Level.provided_population) {
                        pop = Level.provided_population;
                    }
                    if (Level.required_population) {
                        pop = pop - Level.required_population;
                    }

                    if (pop) {
                        if (pop > 0) {
                            pop = "+" + numberWithCommas(pop);
                        }
                        else {
                            pop = numberWithCommas(pop);
                        }
                        AgeData.push(pop);
                        if (createHeader) {
                            Building.header.push(prodHeaders.provided_population);
                        }
                    }
                    //happiness
                    if (Level.provided_happiness) {
                        let hap = Level.provided_happiness;
                        if (hap) {
                            let hapeff = Math.round(hap / Building.size)
                            if (hap > 0) {
                                hap = "+" + numberWithCommas(hap);
                                hapeff = "+" + numberWithCommas(hapeff);
                            } else {
                                hap = numberWithCommas(hap);
                                hapeff = numberWithCommas(hapeff);
                            }
                            AgeData.push(hap);
                            if (Building.size != 1) {
                                AgeData.push(hapeff)
                            }
                            if (createHeader) {
                                Building.header.push((((Building.json.type == "culture" || Building.json.type == "decoration") && pol) ? headerExtra.DP : "") + prodHeaders.provided_happiness);
                                if (Building.size != 1) {
                                    Building.header.push(prodHeaders.hapeff);
                                }

                            }
                        }
                    }
                    if (Level.produced_money) {
                        AgeData.push(numberWithCommas(Level.produced_money))
                        if (createHeader) {
                            Building.header.push((DP ? headerExtra.DP : "") + prodHeaders.produced_money);
                        }
                    }
                    //ranking points
                    if (Level.points) {
                        AgeData.push(numberWithCommas(Level.points))
                        if (createHeader) {
                            Building.header.push(prodHeaders.points);
                        }
                    }
                    if (Level.clan_power) {
                        AgeData.push(numberWithCommas(Level.clan_power))
                        if (createHeader) {
                            Building.header.push((DP ? headerExtra.DP : "") + prodHeaders.clan_power);
                        }
                    }
                    //Productions of Production buildings
                    if (Level.production_values) {
                        for (let prod in Level.production_values) {
                            let Prod = Level.production_values[prod];
                            AgeData.push(numberWithCommas(Prod.value));
                            if (createHeader) {
                                Building.header.push((DP ? headerExtra.DP : "") + headerExtra["Prod " + prod] + prodHeaders[Prod["type"]]);
                            }
                        }
                    }
                }
            }
        }

        if (Building.json.abilities) {
            for (let ability in AbilityIndex) {
                if (AbilityIndex[ability] >= 0) {
                    let Ability = Building.json.abilities[AbilityIndex[ability]];
                    let goods = 0;

                    switch (ability) {
                        case "AddResourcesAbility":
                            for (let res in prodHeaders) {//test the resources for possible resources listed in prodheaders
                                value = 0;
                                if (Ability.additionalResources[Age]) {
                                    if (Ability.additionalResources[Age].resources[res]) {
                                        value += Ability.additionalResources[Age].resources[res];
                                    }
                                }
                                if (Ability.additionalResources.AllAge) {
                                    if (Ability.additionalResources.AllAge.resources[res]) {
                                        value += Ability.additionalResources.AllAge.resources[res];
                                    }
                                }
                                if (categoryGoods.includes(res)) { //when resource is goods, goods are tallied
                                    goods += value;
                                } else {
                                    if (res == "Goods_Sum") value = goods; //occurence of Goods_sum triggers the addition of goods to the array
                                    if (value) {
                                        AgeData.push(numberWithCommas(value));
                                        if (createHeader) {
                                            Building.header.push(prodHeaders[res])
                                        }
                                    }
                                }
                            }
                            break;
                        case "AddResourcesWhenMotivatedAbility":

                            for (let res in prodHeaders) {//test the resources for possible resources listed in prodheaders
                                value = 0;
                                if (Ability.additionalResources[Age]) {
                                    if (Ability.additionalResources[Age].resources[res]) {
                                        value += Ability.additionalResources[Age].resources[res];
                                    }
                                }
                                if (Ability.additionalResources.AllAge) {
                                    if (Ability.additionalResources.AllAge.resources[res]) {
                                        value += Ability.additionalResources.AllAge.resources[res];
                                    }
                                }

                                if (categoryGoods.includes(res)) { //when resource is goods, goods are tallied
                                    goods += value;
                                } else {
                                    if (res == "Goods_Sum") value = goods; //occurence of Goods_sum triggers the addition of goods to the array
                                    if (value) {
                                        AgeData.push(numberWithCommas(value));
                                        if (createHeader) {
                                            Building.header.push(headerExtra.mot + prodHeaders[res])
                                        }
                                    }
                                }
                            }
                            break;
                        case "RandomUnitOfAgeWhenMotivatedAbility":
                            AgeData.push(numberWithCommas(Ability.amount));
                            if (createHeader) {
                                Building.header.push(headerExtra.mot + prodHeaders["Unit-Production"])
                            }
                            break;
                        case "RandomBlueprintWhenMotivatedAbility":
                            AgeData.push(1);
                            if (createHeader) {
                                Building.header.push(headerExtra.mot + prodHeaders["BP-Production"])
                            }
                            break;
                        case "AddResourcesToGuildTreasuryAbility":
                            //clan power
                            let CP = 0
                            if (Ability.additionalResources[Age]) {
                                if (Ability.additionalResources[Age].resources.clan_power) {
                                    CP = Ability.additionalResources[Age].resources.clan_power
                                }
                            }
                            if (Ability.additionalResources.AllAge) {
                                if (Ability.additionalResources.AllAge.resources.clan_power) {
                                    CP = CP + Ability.additionalResources.AllAge.resources.clan_power
                                }
                            }
                            if (CP) {
                                AgeData.push(numberWithCommas(CP));
                                if (createHeader) {
                                    Building.header.push(prodHeaders.clan_power);
                                }
                            }
                            //clan goods
                            let CG = 0
                            if (Ability.additionalResources[Age]) {
                                if (Ability.additionalResources[Age].resources.all_goods_of_age) {
                                    CG = Ability.additionalResources[Age].resources.all_goods_of_age
                                }
                            }
                            if (Ability.additionalResources.AllAge) {
                                if (Ability.additionalResources.AllAge.resources.all_goods_of_age) {
                                    CG += Ability.additionalResources.AllAge.resources.all_goods_of_age
                                }
                            }
                            if (CG) {
                                AgeData.push(numberWithCommas(CG));
                                if (createHeader) {
                                    Building.header.push(prodHeaders.clan_goods);
                                }
                            }
                            break;
                        //Boosts
                        case "BoostAbility":
                            for (let boost in Ability.boostHints) {
                                let Boost = Ability.boostHints[boost];
                                let value = 0;
                                let type = "";
                                if (Boost.boostHintEraMap[Age]) {
                                    value += Boost.boostHintEraMap[Age].value;
                                    type = prodHeaders[Boost.boostHintEraMap[Age].type]
                                }
                                if (Boost.boostHintEraMap.AllAge) {
                                    value += Boost.boostHintEraMap.AllAge.value;
                                    type = prodHeaders[Boost.boostHintEraMap.AllAge.type]
                                }
                                if (value > 0) {
                                    value += "%";
                                    AgeData.push(value);
                                    if (createHeader) {
                                        Building.header.push(type);
                                    }
                                }
                            }
                            break;
                        //Sets
                        case "BonusOnSetAdjacencyAbility":
                            for (let bonus in Ability.bonuses) {
                                let Bonus = Ability.bonuses[bonus];
                                if (Object.keys(Bonus.boost).length > 0) {
                                    if (Bonus.boost[Age]) {
                                        value = numberWithCommas(Bonus.boost[Age].value);
                                        type = Bonus.boost[Age].type;
                                        if (type == "happiness_amount" && value >> 0) value = "+" + value;
                                        if (categoryBoosts.includes(type)) value += "%";
                                        AgeData.push(value)
                                        if (createHeader) {
                                            Building.header.push(headerExtra["Set " + Bonus["level"]] + prodHeaders[type]);
                                        }
                                    } else {
                                        if (Bonus.boost.AllAge) {
                                            value = numberWithCommas(Bonus.boost.AllAge.value);
                                            type = Bonus.boost.AllAge.type;
                                            if (type == "happiness_amount" && value >> 0) value = "+" + value;
                                            if (categoryBoosts.includes(type)) value += "%";
                                            AgeData.push(value)
                                            if (createHeader) {
                                                Building.header.push(headerExtra["Set " + Bonus["level"]] + prodHeaders[type]);
                                            }
                                        }
                                    }
                                } else {
                                    if (Bonus.revenue[Age]) {
                                        for (res in Bonus.revenue[Age].resources) {
                                            AgeData.push(numberWithCommas(Bonus.revenue[Age].resources[res]))
                                            if (createHeader) {
                                                Building.header.push(headerExtra["Set " + Bonus["level"]] + prodHeaders[res]);
                                            }
                                        }
                                    } else {
                                        if (Bonus.revenue.AllAge) {
                                            for (res in Bonus.revenue.AllAge.resources) {
                                                AgeData.push(numberWithCommas(Bonus.revenue.AllAge.resources[res]))
                                                if (createHeader) {
                                                    Building.header.push(headerExtra["Set " + Bonus["level"]] + prodHeaders[res]);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            break;
                        //Chain
                        case "ChainLinkAbility":
                            for (let bonus in Ability.bonuses) {
                                let Bonus = Ability.bonuses[bonus];
                                if (Object.keys(Bonus.boost).length > 0) {
                                    if (Bonus.boost[Age]) {
                                        value = numberWithCommas(Bonus.boost[Age].value);
                                        type = Bonus.boost[Age].type;
                                        if (type == "happiness_amount" && value >> 0) value = "+" + value;
                                        if (categoryBoosts.includes(type)) value += "%";
                                        AgeData.push(value)
                                        if (createHeader) {
                                            Building.header.push(headerExtra.Chain + (chainOutput ? headerExtra["Chain " + Bonus["level"]] : "") + prodHeaders[type]);
                                        }

                                    } else {
                                        value = numberWithCommas(Bonus.boost.AllAge.value);
                                        type = Bonus.boost.AllAge.type;
                                        if (type == "happiness_amount" && value >> 0) value = "+" + value;
                                        if (categoryBoosts.includes(type)) value += "%";
                                        AgeData.push(value)
                                        if (createHeader) {
                                            Building.header.push(headerExtra.Chain + (chainOutput ? headerExtra["Chain " + Bonus["level"]] : "") + prodHeaders[type]);
                                        }
                                    }
                                }
                                if (Object.keys(Bonus.revenue).length > 0) {
                                    if (Bonus.revenue[Age]) {
                                        for (res in Bonus.revenue[Age].resources) {
                                            AgeData.push(numberWithCommas(Bonus.revenue[Age].resources[res]))
                                            if (createHeader) {
                                                Building.header.push(headerExtra.Chain + (chainOutput ? headerExtra["Chain " + Bonus["level"]] : "") + prodHeaders[res]);
                                            }
                                        }
                                    } else {
                                        if (Bonus.revenue.AllAge) {
                                            for (res in Bonus.revenue.AllAge.resources) {
                                                AgeData.push(numberWithCommas(Bonus.revenue.AllAge.resources[res]))
                                                if (createHeader) {
                                                    Building.header.push(headerExtra.Chain + (chainOutput ? headerExtra["Chain " + Bonus["level"]] : "") + prodHeaders[res]);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            break;
                        //Random Production (Crow's Nest)
                        case "RandomChestRewardAbility":
                            for (let reward in Ability.rewards[Age].possible_rewards) {
                                let Reward = Ability.rewards[Age].possible_rewards[reward];
                                switch (Reward.reward.type) {
                                    case "resource":
                                        AgeData.push(numberWithCommas(Reward.reward.amount));
                                        if (createHeader) {
                                            Building.header.push(Reward.drop_chance + "% for<br>" + prodHeaders[Reward.reward.subType]);
                                        }
                                        break;
                                    case "chest":
                                        AgeData.push(numberWithCommas(Reward.reward.possible_rewards[1].reward.amount));
                                        if (createHeader) {
                                            Building.header.push(Reward.drop_chance + "% for<br>" + prodHeaders[Reward.reward.possible_rewards[1].reward.type]);
                                        }
                                        break;
                                    case "blueprint":
                                        AgeData.push(numberWithCommas(Reward.reward.amount));
                                        if (createHeader) {
                                            Building.header.push(Reward.drop_chance + "% for<br>" + prodHeaders["BP-Production"]);
                                        }
                                        break;
                                    case "good":
                                        AgeData.push(numberWithCommas(Reward.reward.totalAmount));
                                        if (createHeader) {
                                            Building.header.push(Reward.drop_chance + "% for<br>" + prodHeaders["good"]);
                                        }
                                        break;
                                    case "guild_goods":
                                        AgeData.push(numberWithCommas(Reward.reward.totalAmount));
                                        if (createHeader) {
                                            Building.header.push(Reward.drop_chance + "% for<br>" + prodHeaders["clan_goods"]);
                                        }
                                        break;
        
                                }
                            }
                            break;
                    }
                }
            }
        }

        // add data of current Age to Age table
        Building.AgeData.push(AgeData);

        //create table Header only with first age passed
        createHeader = false

    }
}
