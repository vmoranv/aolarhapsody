# Battle Effectiveness Calculation

The battle effectiveness calculation module in the Aola module provides the following core functions:

## Function Overview

The battle effectiveness calculation module provides the following core functions:

1. **Basic Attribute Battle Effectiveness Calculation** - Calculate basic battle effectiveness based on pet's basic attributes (attack, defense, etc.)
2. **Equipment Bonus Calculation** - Calculate equipment's contribution to battle effectiveness
3. **Trait Bonus Calculation** - Calculate pet trait's contribution to battle effectiveness
4. **Miracle Bonus Calculation** - Calculate miracle system's contribution to battle effectiveness
5. **Inscription Bonus Calculation** - Calculate inscription system's contribution to battle effectiveness
6. **Astral Spirit Bonus Calculation** - Calculate astral spirit system's contribution to battle effectiveness
7. **God Weapon Bonus Calculation** - Calculate god weapon system's contribution to battle effectiveness
8. **Soul Card Bonus Calculation** - Calculate soul card system's contribution to battle effectiveness
9. **Extra Talent Bonus Calculation** - Calculate extra talent bonus for special type pets
10. **Extra Effort Bonus Calculation** - Calculate extra effort bonus for special type pets

## Battle Effectiveness Calculation Formula

Based on system code analysis, the battle effectiveness calculation formula is as follows:

```javascript
TotalBattleEffectiveness = BaseAttributeBattleEffectiveness + VariousBonuses;
```

## Base Attribute Battle Effectiveness

The base attribute battle effectiveness calculation formula is:

```javascript
BaseAttributeBattleEffectiveness =
  PetStarCoefficient *
  TypeCoefficient *
  (Speed + Attack + SpecialAttack + Defense + SpecialDefense + HP);
```

The calculation method for each ability value is:

```javascript
AbilityValue =
  int((((RaceValue * 2 + 1.3 * IndValue + int(Effort / 4.0)) / 100) * Level + 5) * 2) * NatureBonus;
```

- Pet star coefficient: From the pmBattleEff field in pet data
- Type coefficient: 1.12 for super type, 1 for normal type
- Nature bonus: Recommended nature bonus is 1.1,克制 nature is 0.9, others are 1

## Trait Bonus (PetCard2)

Trait bonus provides different battle effectiveness bonuses based on trait color and level.

Trait bonus value table:

```javascript
PetBattleEffHelper.PetCard2Eff = [
  [100, 150, 200, 250], // Green trait (index 0)
  [300, 350, 400, 450, 500], // Blue trait (index 1)
  [500, 550, 600, 650, 700, 750], // Purple trait (index 2)
];
```

Trait level correspondence:

```javascript
PetBattleEffHelper.PetCard2Index = [3, 4, 5];
```

This array represents:

- Index 0 corresponds to green trait (trait level 3)
- Index 1 corresponds to blue trait (trait level 4)
- Index 2 corresponds to purple trait (trait level 5)

The specific bonus value calculation is as follows:

First, determine the index based on trait color:

- Green trait corresponds to index 0
- Blue trait corresponds to index 1
- Purple trait corresponds to index 2

Then get the corresponding bonus from the array based on trait level and index:

### Example

Suppose you have a normal pet equipped with a level 3 blue trait:

1. Trait color is blue, corresponding to index 1 in PetCard2Index
2. Get the blue trait array from PetCard2Eff through index 1: [300, 350, 400, 450, 500]
3. Trait level is 3, corresponding to array index 2 (level-1)
4. Final bonus is 400 battle effectiveness

### Mathematical Expression:

Let trait color index be i, trait level be l, then trait bonus is:

```javascript
TraitBonus = PetCard2Eff[i][l - 1];
```

## Equipment Bonus (PetCard3)

Equipment bonus consists of two parts: quality base value and additional attribute value.

Equipment quality base value:

```javascript
PetBattleEffHelper.PetCard3Eff = [
  [50], // White equipment: 50
  [100], // Green equipment: 100
  [200, 220], // Blue equipment: 200-220 (based on star level)
  [300, 330, 360], // Purple equipment: 300-360 (based on star level)
  [400, 440, 480, 520], // Gold equipment: 400-520 (based on star level)
  [592, 692, 792, 892], // Diamond equipment: 592-892 (based on star level)
];
```

Equipment additional attribute value calculation is based on the following coefficients:

```javascript
// ["HP","Speed","Attack","Defense","SpecialAttack","SpecialDefense"] increase coefficients
PetBattleEffHelper.PetCard3Quotiety = [3, 3, 4, 4, 4, 4];
```

This means:

- HP and speed: Each point increases 3 battle effectiveness
- Attack, defense, special attack, special defense: Each point increases 4 battle effectiveness

Number of holes for different quality equipment:

```javascript
PetBattleEffHelper.HoleNum = [0, 1, 2, 3, 3, 3];
```

This means:

- White equipment: 0 holes
- Green equipment: 1 hole
- Blue equipment: 2 holes
- Purple, gold, diamond equipment: 3 holes

Equipment hole attribute maximum values:

```javascript
UserPetCard3ExtInfo.addValue = [
  [12, 8, 6, 9, 6, 9], // White equipment attribute maximum values
  [12, 8, 6, 9, 6, 9], // Green equipment attribute maximum values
  [12, 8, 6, 9, 6, 9], // Blue equipment attribute maximum values
  [12, 12, 9, 9, 9, 9], // Purple equipment attribute maximum values
  [12, 12, 9, 9, 9, 9], // Gold equipment attribute maximum values
  [12, 12, 9, 9, 9, 9], // Diamond equipment attribute maximum values
];
```

### Example

Suppose you have a purple 2-star equipment with additional attributes:

- Attack +5
- Defense +3
- Speed +2

Calculation process:

1. Quality base value: Check PetCard3Eff array, purple 2-star is 330 battle effectiveness

2. Additional attribute value calculation:
   - Attack +5: 5 × 4 = 20 battle effectiveness
   - Defense +3: 3 × 4 = 12 battle effectiveness
   - Speed +2: 2 × 3 = 6 battle effectiveness
   - Total additional attribute value: 20 + 12 + 6 = 38 battle effectiveness

3. Total equipment battle effectiveness: 330 + 38 = 368 battle effectiveness

### Mathematical Expression:

Let equipment quality index be $i$, star level be $s$, additional attribute value array be $a$, attribute coefficient array be $q$, then equipment bonus is:
$$\text{EquipmentBonus} = \text{PetCard3Eff}[i][s] + \sum_{j=0}^{n-1} a[j] \times q[j]$$

Where $n$ is the number of attribute types.

## Miracle Bonus

Miracle bonus is calculated based on the amount of miracle breakthrough materials and base ability values.

Miracle bonus coefficients:

```javascript
// Miracle pet battle effectiveness = original part + (attack*3 + special attack*3 + defense*2.4 + special defense*2.4 + HP*1.5 + speed*3)
PetBattleEffHelper.MIRACLE_EFF_COEFFICIENTS = [1.5, 3, 2.4, 3, 2.4, 3];
```

These coefficients correspond to six basic attributes:

- HP: 1.5
- Attack: 3
- Defense: 2.4
- Special Attack: 3
- Special Defense: 2.4
- Speed: 3

### Calculation Process:

1. Get the current amount of equipped miracle breakthrough materials
2. Calculate the ability value increase based on material amount
3. Get the base ability values of the miracle pet
4. Pass the material-increased ability values and base ability values to the getAbilityAddBattleEff method
5. This method multiplies each attribute value by the corresponding coefficient and sums them to get the final battle effectiveness bonus

### Example

For example, if a miracle pet has increased 100 attack points and 50 defense points through materials, with base ability values of 200 attack points and 100 defense points, then:

- Attack bonus: (100 + 200) × 3 = 900
- Defense bonus: (50 + 100) × 2.4 = 360
- Total battle effectiveness bonus: Sum of all bonuses

### Mathematical Expression:

Let miracle bonus coefficient array be $c$, material-increased ability value array be $m$, base ability value array be $b$, then miracle bonus is:
$$\text{MiracleBonus} = \sum_{i=0}^{5} (m[i] + b[i]) \times c[i]$$

## Complete Miracle Bonus

Complete miracle bonus is calculated based on the additional attribute values of complete miracle pets.

Complete miracle bonus uses the same coefficient array as miracle bonus:

```javascript
PetBattleEffHelper.COMPLETE_MIRACLE_EFF_COEFFICIENTS = [1.5, 3, 2.4, 3, 2.4, 3];
```

### Calculation Process:

1. Check if the pet is a complete miracle pet
2. If so, get the additional attribute values of the complete miracle pet
3. Multiply each attribute value by the corresponding coefficient and sum them to get the final battle effectiveness bonus

For example, if a complete miracle pet has additional attributes:

- HP: 100
- Attack: 150
- Defense: 120
- Special Attack: 150
- Special Defense: 120
- Speed: 150

Then the battle effectiveness bonus is:

- HP: 100 × 1.5 = 150
- Attack: 150 × 3 = 450
- Defense: 120 × 2.4 = 288
- Special Attack: 150 × 3 = 450
- Special Defense: 120 × 2.4 = 288
- Speed: 150 × 3 = 450
- Total bonus: 150 + 450 + 288 + 450 + 288 + 450 = 2076

### Mathematical Expression:

Let complete miracle bonus coefficient array be c, additional attribute value array be a, then complete miracle bonus is:
$$\text{CompleteMiracleBattleEff} = \sum_{i=0}^{5} a[i] \times c[i]$$

## Legend Soul Bonus

Legend soul bonus provides fixed numerical battle effectiveness bonus based on legend soul level.

Legend soul bonus array:

```javascript
PetBattleEffHelper.LengedSoulAddArr = [0, 500, 1000, 1500];
```

This array defines the battle effectiveness bonus provided by different legend soul levels:

- Level 0 (inactive): 0 battle effectiveness
- Level 1: 500 battle effectiveness
- Level 2: 1000 battle effectiveness
- Level 3: 1500 battle effectiveness

### Calculation Process:

1. Get the legend soul level of the pet (legendSoulLv)
2. Directly get the corresponding battle effectiveness bonus value from the LengedSoulAddArr array

For example, if a legend pet has legend soul level 2, it will get 1000 battle effectiveness bonus.

### Mathematical Expression:

Let legend soul level be l, then legend soul bonus is:

```
LegendSoulBonus = LengedSoulAddArr[l]
```

## Inscription Bonus

Inscription bonus is divided into attribute inscription and non-attribute inscription types.

Inscription bonus array:

```javascript
PetBattleEffHelper.DegeneratorInscriptionAddArr = [300, 600, 900, 1200, 1500];
```

This array defines the battle effectiveness bonus provided by different inscription levels:

- Level 0: 300 battle effectiveness
- Level 1: 600 battle effectiveness
- Level 2: 900 battle effectiveness
- Level 3: 1200 battle effectiveness
- Level 4: 1500 battle effectiveness

### Calculation Process:

1. Check if the pet is a Xinghui or GQ pet, if so, it does not enjoy inscription bonus
2. Iterate through two types of inscriptions (type 0 and type 1)
3. Get information for each type of inscription
4. Determine if it is an attribute inscription:
   - If it is an attribute inscription, base value is 1500 battle effectiveness, each additional attribute increases 50 battle effectiveness
   - If it is a non-attribute inscription, get battle effectiveness bonus from DegeneratorInscriptionAddArr array based on inscription level
5. Add the bonus values of both inscriptions to get the total bonus

For example, if a degenerator pet has a level 3 non-attribute inscription and an attribute inscription with 2 additional attributes:

- Non-attribute inscription bonus: 1200 battle effectiveness
- Attribute inscription bonus: 1500 + 2 × 50 = 1600 battle effectiveness
- Total bonus: 1200 + 1600 = 2800 battle effectiveness

### Mathematical Expression:

Let inscription level be $l$, number of additional attributes for attribute inscription be $n$, then inscription bonus is:

$$
\text{InscriptionBonus} = \begin{cases}
\text{DegeneratorInscriptionAddArr}[l], & \text{Non-attribute inscription} \\
1500 + n \times 50, & \text{Attribute inscription}
\end{cases}
$$

Total inscription bonus is the sum of both inscription bonuses.

## Astral Spirit Bonus

Astral spirit bonus provides fixed numerical battle effectiveness bonus based on astral spirit level, only Xinghui pets can enjoy.

Astral spirit bonus array:

```javascript
PetBattleEffHelper.XinghuiAstralSpiritAddArr = [800, 1100, 1400, 1700, 2000];
```

This array defines the battle effectiveness bonus provided by different astral spirit levels:

- Level 1: 800 battle effectiveness
- Level 2: 1100 battle effectiveness
- Level 3: 1400 battle effectiveness
- Level 4: 1700 battle effectiveness
- Level 5: 2000 battle effectiveness

### Calculation Process:

1. Get the equipped astral spirit information array of the pet
2. Iterate through each equipped astral spirit
3. Get the corresponding battle effectiveness bonus from the `XinghuiAstralSpiritAddArr` array based on astral spirit level (starting from 1)
4. Add all astral spirit bonus values to get the total bonus

For example, if a Xinghui pet has equipped 3 astral spirits with levels 2, 4, and 5 respectively, then its astral spirit bonus is:
1100 + 1700 + 2000 = 4800 battle effectiveness

Astral spirit deification related content:

- Maximum level of astral spirit is level 5
- Deification opens at level 5
- After deification, attribute enhancement can be performed, different types of astral spirits have different enhancement ranges

### Mathematical Expression:

Let astral spirit level be l, then single astral spirit bonus is:

```javascript
AstralSpiritBonus = XinghuiAstralSpiritAddArr[l - 1];
```

Total astral spirit bonus is the sum of all equipped astral spirit bonuses.

## God Weapon Bonus

God weapon bonus provides fixed numerical battle effectiveness bonus based on god weapon quality and star level, only god weapon pets can enjoy.

God weapon bonus array:

```javascript
PetBattleEffHelper.GOD_CARD_ADD_CONST = [
  [500, 600, 700, 800], // White quality god weapon
  [1000, 1200, 1400, 1600], // Green quality god weapon
  [2000, 2300, 2600, 3000], // Blue quality god weapon
];
```

This array defines the battle effectiveness bonus provided by different quality and level god weapons:

- White quality god weapon:
  - 0 stars: 500 battle effectiveness
  - 1 star: 600 battle effectiveness
  - 2 stars: 700 battle effectiveness
  - 3 stars: 800 battle effectiveness
- Green quality god weapon:
  - 0 stars: 1000 battle effectiveness
  - 1 star: 1200 battle effectiveness
  - 2 stars: 1400 battle effectiveness
  - 3 stars: 1600 battle effectiveness
- Blue quality god weapon:
  - 0 stars: 2000 battle effectiveness
  - 1 star: 2300 battle effectiveness
  - 2 stars: 2600 battle effectiveness
  - 3 stars: 3000 battle effectiveness

### Calculation Process:

1. Check if the pet is a god weapon pet and if there is a god weapon list
2. Get the god weapon service instance
3. Iterate through each god weapon in the god weapon list
4. Get the corresponding battle effectiveness bonus from the `GOD_CARD_ADD_CONST` 2D array based on god weapon quality and level
5. Add all god weapon bonus values to get the total bonus

For example, if a god weapon pet has equipped the following god weapons:

- 1 white quality 2-star god weapon: 700 battle effectiveness
- 1 green quality 1-star god weapon: 1200 battle effectiveness
- 1 blue quality 3-star god weapon: 3000 battle effectiveness

Then its god weapon bonus is: 700 + 1200 + 3000 = 4900 battle effectiveness

### Mathematical Expression:

Let god weapon quality be q, star level be s, then single god weapon bonus is:

```javascript
GodWeaponBonus = GOD_CARD_ADD_CONST[q][s];
```

Total god weapon bonus is the sum of all equipped god weapon bonuses.

## Soul Card Bonus

Soul card bonus provides fixed numerical battle effectiveness bonus based on the number of activated entry slots, only GQ pets can enjoy.

Soul card bonus configuration:

```javascript
/**
 * Battle effectiveness: number of entries * 200 + number of activated level 1 entries * 200 + number of activated level 2 or 3 entries * 400 + number of activated level 4 or 5 entries * 800. Maximum entry level is 5
 */
HKConfig.BattleArr = [200, 400, 400, 800, 800];
HKConfig.OneCardBaseBattle = 200;
```

These configurations define the soul card bonus calculation rules:

- Base battle effectiveness per soul card: 200
- Each activated entry slot provides additional battle effectiveness:
  - 1st slot: 200 battle effectiveness
  - 2nd-3rd slots: 400 battle effectiveness
  - 4th-5th slots: 800 battle effectiveness

Soul card slot level configuration:

```javascript
HKConfig.CardSlotMaxLevelArr = [1, 3, 5, 3, 1];
```

This means the maximum level of slots for 5 soul cards are:

- 1st soul card: level 1
- 2nd soul card: level 3
- 3rd soul card: level 5 (core soul card)
- 4th soul card: level 3
- 5th soul card: level 1

### Calculation Process:

1. Check if the pet is a GQ pet, if not, return 0
2. Get the equipped soul card ID array and slot level array of the pet
3. Iterate through each soul card:
   - If the soul card ID is valid, add base battle effectiveness 200
   - Get soul card data and the number of activated slots
   - Accumulate battle effectiveness according to BattleArr array based on the number of activated slots
4. Return total battle effectiveness bonus

For example, if a GQ pet has equipped 5 soul cards and all have activated the maximum number of slots:

- Base battle effectiveness of 5 soul cards: 5 × 200 = 1000
- 1st soul card 1 slot: 200
- 2nd soul card 3 slots: 200 + 400 + 400 = 1000
- 3rd soul card 5 slots: 200 + 400 + 400 + 800 + 800 = 2600
- 4th soul card 3 slots: 200 + 400 + 400 = 1000
- 5th soul card 1 slot: 200
- Total battle effectiveness bonus: 1000 + 200 + 1000 + 2600 + 1000 + 200 = 6000

### Mathematical Expression:

Let the number of soul cards be $n$, the number of slots activated for the $i$th soul card be $s_i$, then soul card bonus is:
$$\text{SoulCardBonus} = \sum_{i=0}^{n-1} \left(200 + \sum_{j=0}^{s_i-1} \text{BattleArr}[j]\right)$$

## Extra Talent Bonus

Extra talent bonus is additional battle effectiveness bonus provided for special type pets (legend, degenerator, Xinghui, GQ).

Extra talent bonus is divided into two parts:

1. Bonus based on talent value
2. Additional reward bonus when meeting specific conditions

Single extra talent bonus calculation:

```javascript
getSingleIndExtraBE(raceId, indValue, level) {
    let indCoefficient = Math.floor((indValue - 1) / 12 + 1) * (indValue - Math.floor((indValue - 1) / 12) * 6);
    if (this.isLegendPet(raceId)) {
        return Math.floor(Math.floor(indCoefficient * level / 50) * 1.4);
    }
    else if (this.isDegeneratorPet(raceId) || this.isXinghuiPet(raceId) || this.isGQPet(raceId)) {
        return Math.floor(Math.floor(indCoefficient * level / 50) * 1.4 * 1.1);
    }
    else {
        return 0;
    }
}
```

### Calculation Process:

1. First calculate the talent coefficient:
   - `Math.floor((indValue - 1) / 12 + 1)` calculates the talent level segment
   - `(indValue - Math.floor((indValue - 1) / 12) * 6)` calculates the specific value in that segment
   - Multiply both to get the talent coefficient

2. Calculate additional bonus based on pet type:
   - Legend pet: `Math.floor(Math.floor(indCoefficient * level / 50) * 1.4)`
   - Degenerator, Xinghui, GQ pet: `Math.floor(Math.floor(indCoefficient * level / 50) * 1.4 * 1.1)`
   - Other pets: 0 (do not enjoy extra talent bonus)

Total extra talent bonus calculation:

```javascript
getPetIndTotalExtraBE(pbi) {
    let total = 0;
    let key = "";
    for (let i = 0; i < this.IND_ABILITY_KEYS.length; i++) {
        key = this.IND_ABILITY_KEYS[i];
        total += (this.getSingleIndExtraBE(pbi.raceId, pbi[key], pbi.level));
    }
    if (this.getIsXinghuiPMByRaceid(pbi.raceId) && (pbi.indAll >= 70 * this.IND_ABILITY_KEYS.length)) {
        return total + 500;
    }
    else if (this.isGQPet(pbi.raceId)) {
        if (pbi.indAll >= (70 * 4 + 100 * 2)) {
            return total + 1000;
        }
        else if (pbi.indAll >= 70 * this.IND_ABILITY_KEYS.length) {
            return total + 500;
        }
    }
    return total;
}
```

### Calculation Process:

1. Iterate through all 6 talent attributes (speed, attack, special attack, defense, special defense, HP)
2. Calculate extra bonus for each talent attribute separately and accumulate
3. Judge whether to give additional reward based on pet type and total talent:
   - Xinghui pet: Additional reward of 500 battle effectiveness when all talent values reach 70 or above
   - GQ pet:
     - Additional reward of 1000 battle effectiveness when total talent meets specific value (4 items ≥ 70 and 2 items ≥ 100)
     - Additional reward of 500 battle effectiveness when all talent values reach 70 or above

### Mathematical Expression:

Let single extra talent bonus be $BE_{\text{ind},i}$, talent coefficient be $C_i$, level be $L$, then:

- Legend pet:
  $$BE_{\text{ind},i} = \left\lfloor \left\lfloor \frac{C_i \times L}{50} \right\rfloor \times 1.4 \right\rfloor$$

- Degenerator, Xinghui, GQ pet:
  $$BE_{\text{ind},i} = \left\lfloor \left\lfloor \frac{C_i \times L}{50} \right\rfloor \times 1.4 \times 1.1 \right\rfloor$$

Where, talent coefficient $C_i$ calculation formula is:
$$C_i = \left\lfloor \frac{\text{indValue} - 1}{12} + 1 \right\rfloor \times \left( \text{indValue} - \left\lfloor \frac{\text{indValue} - 1}{12} \right\rfloor \times 6 \right)$$

Total extra talent bonus is the sum of all extra talent bonuses, that is:
$$BE_{\text{ind},\text{total}} = \sum_{i=1}^{6} BE_{\text{ind},i}$$

Plus additional rewards when meeting conditions:

- Xinghui pet: If all talent values $\geq 70$, then:
  $$BE_{\text{ind},\text{total}} = BE_{\text{ind},\text{total}} + 500$$

- GQ pet:
  - If total talent meets specific conditions (4 items $\geq 70$ and 2 items $\geq 100$), then:
    $$BE_{\text{ind},\text{total}} = BE_{\text{ind},\text{total}} + 1000$$
  - If all talent values $\geq 70$, then:
    $$BE_{\text{ind},\text{total}} = BE_{\text{ind},\text{total}} + 500$$

## Extra Effort Bonus

In addition to extra talent bonus, special pets also enjoy extra effort bonus.

Single effort bonus:

```javascript
getSingleEffExtraBE(raceId, effValue) {
    if (this.isLegendPet(raceId) || this.isDegeneratorPet(raceId)) {
        return effValue;
    }
    else {
        return 0;
    }
}
```

Total effort bonus calculation:

```javascript
getPetEffTotalExtraBE(pbi) {
    let total = 0;
    let key = "";
    for (let i = 0; i < this.EFF_ABILITY_KEYS.length; i++) {
        key = this.EFF_ABILITY_KEYS[i];
        total += Math.floor(this.getSingleEffExtraBE(pbi.raceId, pbi[key]));
    }
    if (this.isXinghuiPet(pbi.raceId) || this.isGQPet(pbi.raceId)) {
        total = 1000;
    }
    else if (this.isDegeneratorPet(pbi.raceId)) {
        let tmpTotal = total * 1.1;
        total = Math.floor(tmpTotal + (Math.floor(pbi.effAll * 1.8) + 40) * 1.1 + 1000);
    }
    else {
        total += Math.floor(pbi.effAll * 1.8) + 40;
    }
    return total;
}
```

### Calculation Process:

1. Legend and degenerator pets enjoy extra effort bonus, directly return effort value
2. Xinghui and GQ pets enjoy fixed 1000 battle effectiveness bonus
3. Degenerator pets have additional bonus calculation:
   - Original bonus multiplied by 1.1
   - Effort total part bonus: `(Math.floor(pbi.effAll * 1.8) + 40) * 1.1 + 1000`
4. Other pets do not enjoy extra effort bonus

### Mathematical Expression:

Let single extra effort bonus be $BE_{\text{eff},i}$, effort value be $E_i$, total effort be $E_{\text{all}}$, then:

- Legend and degenerator pets:
  $$BE_{\text{eff},i} = E_i$$

- Xinghui and GQ pets:
  $$BE_{\text{eff},\text{total}} = 1000$$

- Degenerator pets:
  $$BE_{\text{eff},\text{total}} = \left\lfloor BE_{\text{eff},\text{total}} \times 1.1 \right\rfloor + \left\lfloor \left( \left\lfloor E_{\text{all}} \times 1.8 \right\rfloor + 40 \right) \times 1.1 \right\rfloor + 1000$$

- Other pets:
  $$BE_{\text{eff},\text{total}} = \left\lfloor E_{\text{all}} \times 1.8 \right\rfloor + 40$$

Where $BE_{\text{eff},\text{total}}$ initial value is the sum of all extra effort bonuses, that is:
$$BE_{\text{eff},\text{total}} = \sum_{i=1}^{6} BE_{\text{eff},i}$$
