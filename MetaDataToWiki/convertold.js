function convertOld(Building) {
    if (Building.json.type == "production" && !(Building.json.is_special)) {
        return;
    }

    var createHeader = true;
    Building.AgeData = [];
    Building.header = [];

    const AbilityIndex = {                          //determines the order in which the abilities are parsed
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

    var bothAddRes = false;
    var p = "";
    var value
    var type

    //check which abilities are included
    if (Building.json["abilities"]) {

        for (let ability in Building.json["abilities"]) {
            AbilityIndex[Building.json["abilities"][ability]["__class__"]] = ability;
        }
        //handle special case, should there be both AddResources abilities
        if (AbilityIndex["AddResourcesAbility"] >= 0 && AbilityIndex["AddResourcesWhenMotivatedAbility"] >= 0) {
            AbilityIndex["AddResourcesWhenMotivatedAbility"] = -1;
            bothAddRes = true;
        }
    }


    for (let Age in ages) {//run through the Ages as in the Ages List
        Building.size = Building.json["width"] * Building.json["length"];
        var AgeData = [];
        //Age
        if (ages[Age]) {
            AgeData.push(ages[Age]); //push Wiki Age if available
        } else {
            AgeData.push(Age); //push raw age if no wikidata available - should not trigger in the current version, as only "known" ages are looped
        }
        if (createHeader) { //create Header only on firt age runthrough - similar below
            Building.header.push(prodheaders["age"]);
        }


        if (Building.json["entity_levels"]) {
            for (let level in Building.json["entity_levels"]) {
                var Level = Building.json.entity_levels[level];
                if (Level["era"] == Age) {
                    //population
                    var pop = 0;
                    if (Level["provided_population"]) {
                        pop = Level["provided_population"];
                    }
                    if (Level["required_population"]) {
                        pop = pop - Level["required_population"];
                    }

                    if (pop) {
                        pop = numberWithCommas(pop);
                        if (pop > 0) {
                            pop = "+" + pop;
                        }
                        AgeData.push(pop);
                        if (createHeader) {
                            Building.header.push(prodheaders["provided_population"]);
                        }
                    }
                    //happiness
                    if (Level["provided_happiness"]) {
                        var hap = Level["provided_happiness"];
                        if (hap) {
                            var hapeff = Math.round(hap / Building.size)
                            hap = numberWithCommas(hap);
                            hapeff = numberWithCommas(hapeff);
                            if (hap > 0) {
                                hap = "+" + hap;
                                hapeff = "+" + hapeff;
                            }
                            AgeData.push(hap);
                            if (Building.size != 1) {
                                AgeData.push(hapeff)
                            }
                            if (createHeader) {
                                Building.header.push(prodheaders["provided_happiness"]);
                                if (Building.size != 1) {
                                    Building.header.push(prodheaders["hapeff"]);
                                }

                            }
                        }
                    }
                    if (Level["produced_money"]) {
                        AgeData.push(numberWithCommas(Level["produced_money"]))
                        if (createHeader) {
                            Building.header.push(prodheaders["produced_money"]);
                        }
                    }
                    //ranking points
                    if (Level["points"]) {
                        AgeData.push(numberWithCommas(Level["points"]))
                        if (createHeader) {
                            Building.header.push(prodheaders["points"]);
                        }
                    }
                    if (Level["clan_power"]) {
                        AgeData.push(numberWithCommas(Level["clan_power"]))
                        if (createHeader) {
                            Building.header.push(prodheaders["clan_power"]);
                        }
                    }
                    //Productions of Production buildings
                    if (Level["production_values"]) {
                        for (let prod in Level["production_values"]) {
                            var Prod = Level.production_values[prod];
                            AgeData.push(numberWithCommas(Prod["value"]));
                            if (createHeader) {
                                Building.header.push(headerextra["Prod " + prod] + "<br>" + prodheaders[Prod["type"]]);
                            }
                        }
                    }
                }
            }
        }

        if (Building.json["abilities"]) {
            for (let ability in AbilityIndex) {
                if (AbilityIndex[ability] >= 0) {
                    var Ability = Building.json.abilities[AbilityIndex[ability]];

                    switch (ability) {
                        case "AddResourcesAbility":
                        case "AddResourcesWhenMotivatedAbility":
                            var goods = 0;

                            if (bothAddRes) {
                                Ability2 = Building.json.abilities[AbilityIndex["AddResourcesWhenMotivatedAbility"]];
                            }


                            for (let res in prodheaders) {//test the resources for possible resources listed in prodheaders
                                value = 0;
                                if (Ability["additionalResources"][Age]) {
                                    if (Ability["additionalResources"][Age]["resources"][res]) {
                                        value += Ability["additionalResources"][Age]["resources"][res];
                                    }
                                }
                                if (Ability["additionalResources"]["AllAge"]) {
                                    if (Ability["additionalResources"]["AllAge"]["resources"][res]) {
                                        value += Ability["additionalResources"]["AllAge"]["resources"][res];
                                    }
                                }
                                if (bothAddRes) {
                                    if (Ability2["additionalResources"][Age]) {
                                        if (Ability2["additionalResources"][Age]["resources"][res]) {
                                            value += Ability2["additionalResources"][Age]["resources"][res];
                                        }
                                    }
                                    if (Ability2["additionalResources"]["AllAge"]) {
                                        if (Ability2["additionalResources"]["AllAge"]["resources"][res]) {
                                            value += Ability2["additionalResources"]["AllAge"]["resources"][res];
                                        }
                                    }
                                }
                                if (categoryGoods.includes(res)) { //when resource is goods, goods are tallied
                                    goods += value;
                                } else {
                                    if (res == "Goods_Sum") value = goods; //occurence of Goods_sum triggers the addition of goods to the array
                                    if (value) {
                                        AgeData.push(numberWithCommas(value));
                                        if (createHeader) {
                                            Building.header.push(prodheaders[res])
                                        }
                                    }
                                }
                            }
                            break;
                        case "RandomUnitOfAgeWhenMotivatedAbility":
                            AgeData.push(numberWithCommas(Ability["amount"]));
                            if (createHeader) {
                                Building.header.push(prodheaders["Unit-Production"])
                            }
                            break;
                        case "RandomBlueprintWhenMotivatedAbility":
                            AgeData.push(1);
                            if (createHeader) {
                                Building.header.push(prodheaders["BP-Production"])
                            }
                            break;
                        case "AddResourcesToGuildTreasuryAbility":
                            //clan power
                            var CP = 0
                            if (Ability["additionalResources"][Age]) {
                                if (Ability["additionalResources"][Age]["resources"]["clan_power"]) {
                                    CP = Ability["additionalResources"][Age]["resources"]["clan_power"]
                                }
                            }
                            if (Ability["additionalResources"]["AllAge"]) {
                                if (Ability["additionalResources"]["AllAge"]["resources"]["clan_power"]) {
                                    CP = CP + Ability["additionalResources"]["AllAge"]["resources"]["clan_power"]
                                }
                            }
                            if (CP) {
                                AgeData.push(numberWithCommas(CP));
                                if (createHeader) {
                                    Building.header.push(prodheaders["clan_power"]);
                                }
                            }
                            //clan goods
                            var CG = 0
                            if (Ability["additionalResources"][Age]) {
                                if (Ability["additionalResources"][Age]["resources"]["all_goods_of_age"]) {
                                    CG = Ability["additionalResources"][Age]["resources"]["all_goods_of_age"]
                                }
                            }
                            if (Ability["additionalResources"]["AllAge"]) {
                                if (Ability["additionalResources"]["AllAge"]["resources"]["all_goods_of_age"]) {
                                    CG += Ability["additionalResources"]["AllAge"]["resources"]["all_goods_of_age"]
                                }
                            }
                            if (CG) {
                                AgeData.push(numberWithCommas(CG));
                                if (createHeader) {
                                    Building.header.push(prodheaders["clan_goods"]);
                                }
                            }
                            break;
                        //Boosts
                        case "BoostAbility":
                            for (let boost in Ability["boostHints"]) {
                                var Boost = Ability.boostHints[boost];
                                AgeData.push(Boost["boostHintEraMap"][Age]["value"] + "%")
                                if (createHeader) {
                                    Building.header.push(prodheaders[Boost["boostHintEraMap"][Age]["type"]]);
                                }
                            }
                            break;
                        //Sets
                        case "BonusOnSetAdjacencyAbility":
                            for (let bonus in Ability["bonuses"]) {
                                var Bonus = Ability["bonuses"][bonus];
                                if (Object.keys(Bonus["boost"]).length > 0) {
                                    if (Bonus["boost"][Age]) {
                                        value = numberWithCommas(Bonus["boost"][Age]["value"]);
                                        type = Bonus["boost"][Age]["type"];
                                        if (type == "happiness_amount" && value >> 0) value = "+" + value;
                                        if (categoryBoosts.includes(type)) value += "%";
                                        AgeData.push(value)
                                        if (createHeader) {
                                            Building.header.push(headerextra["Set " + Bonus["level"]] + "<br>" + prodheaders[type]);
                                        }
                                    } else {
                                        if (Bonus["boost"]["AllAge"]) {
                                            value = numberWithCommas(Bonus["boost"]["AllAge"]["value"]);
                                            type = Bonus["boost"]["AllAge"]["type"];
                                            if (type == "happiness_amount" && value >> 0) value = "+" + value;
                                            if (categoryBoosts.includes(type)) value += "%";
                                            AgeData.push(value)
                                            if (createHeader) {
                                                Building.header.push(headerextra["Set " + Bonus["level"]] + "<br>" + prodheaders[type]);
                                            }
                                        }
                                    }
                                } else {
                                    if (Bonus["revenue"][Age]) {
                                        for (res in Bonus["revenue"][Age]["resources"]) {
                                            AgeData.push(numberWithCommas(Bonus["revenue"][Age]["resources"][res]))
                                            if (createHeader) {
                                                Building.header.push(headerextra["Set " + Bonus["level"]] + "<br>" + prodheaders[res]);
                                            }
                                        }
                                    } else {
                                        if (Bonus["revenue"]["AllAge"]) {
                                            for (res in Bonus["revenue"]["AllAge"]["resources"]) {
                                                AgeData.push(numberWithCommas(Bonus["revenue"]["AllAge"]["resources"][res]))
                                                if (createHeader) {
                                                    Building.header.push(headerextra["Set " + Bonus["level"]] + "<br>" + prodheaders[res]);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            break;
                        //Chain
                        case "ChainLinkAbility":
                            for (let bonus in Ability["bonuses"]) {
                                var Bonus = Ability["bonuses"][bonus];
                                if (Object.keys(Bonus["boost"]).length > 0) {
                                    if (Bonus["boost"][Age]) {
                                        value = numberWithCommas(Bonus["boost"][Age]["value"]);
                                        type = Bonus["boost"][Age]["type"];
                                        if (type == "happiness_amount" && value >> 0) value = "+" + value;
                                        if (categoryBoosts.includes(type)) value += "%";
                                        AgeData.push(value)
                                        if (createHeader) {
                                            Building.header.push(headerextra["Chain"] + "<br>" + prodheaders[type]);
                                        }

                                    } else {
                                        value = numberWithCommas(Bonus["boost"]["AllAge"]["value"]);
                                        type = Bonus["boost"]["AllAge"]["type"];
                                        if (type == "happiness_amount" && value >> 0) value = "+" + value;
                                        if (categoryBoosts.includes(type)) value += "%";
                                        AgeData.push(value)
                                        if (createHeader) {
                                            Building.header.push(headerextra["Chain"] + "<br>" + prodheaders[type]);
                                        }
                                    }
                                } else {
                                    if (Bonus["revenue"][Age]) {
                                        for (res in Bonus["revenue"][Age]["resources"]) {
                                            AgeData.push(numberWithCommas(Bonus["revenue"][Age]["resources"][res]))
                                            if (createHeader) {
                                                Building.header.push(headerextra["Chain"] + "<br>" + prodheaders[res]);
                                            }
                                        }
                                    } else {
                                        if (Bonus["revenue"]["AllAge"]) {
                                            for (res in Bonus["revenue"]["AllAge"]["resources"]) {
                                                AgeData.push(numberWithCommas(Bonus["revenue"]["AllAge"]["resources"][res]))
                                                if (createHeader) {
                                                    Building.header.push(headerextra["Chain"] + "<br>" + prodheaders[res]);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            break;
                        //Random Production (Crow's Nest)
                        case "RandomChestRewardAbility":
                            for (let reward in Ability["rewards"][Age]["possible_rewards"]) {
                                var Reward = Ability["rewards"][Age]["possible_rewards"][reward];
                                switch (Reward["reward"]["type"]) {
                                    case "resource":
                                        AgeData.push(numberWithCommas(Reward["reward"]["amount"]));
                                        if (createHeader) {
                                            Building.header.push(Reward["drop_chance"] + "% for<br>" + prodheaders[Reward["reward"]["subType"]]);
                                        }
                                        break;
                                    case "chest":
                                        AgeData.push(numberWithCommas(Reward["reward"]["possible_rewards"][1]["reward"]["amount"]));
                                        if (createHeader) {
                                            Building.header.push(Reward["drop_chance"] + "% for<br>" + prodheaders[Reward["reward"]["possible_rewards"][1]["reward"]["type"]]);
                                        }
                                        break;
                                    case "blueprint":
                                        AgeData.push(numberWithCommas(Reward["reward"]["amount"]));
                                        if (createHeader) {
                                            Building.header.push(Reward["drop_chance"] + "% for<br>" + prodheaders["BP-Production"]);
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
