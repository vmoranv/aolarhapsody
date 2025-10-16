# Damage Calculation

## Function Overview

:::info
This function is limited to calculating damage for GQ pets only. Other era pets have different damage calculation formulas and cannot be fully applied to this damage calculator.

The damage calculator uses decimal format, not percentage. Please note the format conversion when using.
:::

::: warning
The parts of damage bonus | crit damage bonus | value bonus are more complex and controversial, with larger errors compared to actual values.
:::

Welcome suggestions from Aola Star players interested in measuring PVE damage values for specific modifications to the bonus calculation formulas.

## Penetration Defense Benefit

Formula:
$$Y = \frac{1}{1-X}$$

::: info
X = Dragon God/Heavenly Sword specific value.
:::

![placeholder](/aola/damage_001.png)![placeholder](/aola/damage_002.png)![placeholder](/aola/damage_003.png)

The skill ignores xx% of target's normal/special defense when attacking.

## Restraint Relationship

Only related to type and imprint cultivation.

- Normal restraint = 2
- Normal restraint + full imprint = 2.8
- Absolute restraint = 3
- Absolute restraint + full imprint = 3.8

::: tip
Dual type restraint multipliers stack
:::

![placeholder](/aola/damage_004.png) (Out-of-battle)
![placeholder](/aola/damage_005.png) (In-battle) Take fixed value 2.8/3.8.

## Imprint Level and Damage Boost Effect

By checking _StampConfig.STAMP_VALUE_2_LEVEL_MAP_ and _StampSysData.data_, we can determine the actual damage boost effect per imprint level.

### Actual Damage Boost Calculation

Strong attack imprint damage boost formula:

Let imprint level be $level$, imprint star be $star$, then:

$$S = (level \times 5 + star + 5)\%$$

$$A = S \times 0.4 = (level \times 5 + star + 5)\% \times 0.4$$

Where:

- $S$ is shown damage bonus
- $A$ is actual damage bonus
- $level \in [0, 5]$，$star \in [1, 10]$ (when $level = 0$, $star \in [1, 5]$)

## Restraint Multiplier

Formula:

```
Y=1+Starry Feather bonus + On-field assist bonus + Self bonus
```

![placeholder](/aola/damage_006.png) (Specific restraint multiplier bonus values look at out-of-battle Starry, full set is 150%, take fixed 150%)

- **On-field assist bonus**: Star Ring Master or other assist types, bonus is relatively fixed, generally 120%, 100%, 75%, 0%.
- **Self bonus**: Self bonus type restraint multiplier is very rare, generally 100% or 0, suggest directly count 0.

Restraint multiplier can be simplified to fixed values: 2, 2.2, 2.5, 3.5, 3.7. Non-Star Ring Master take 2.5, Star Ring Master take 3.7.

## Panel Attack

Out-of-battle panel's skill corresponding attack type values.

![placeholder](/aola/damage_007.png)

Normal attack skills refer to normal attack values, special attack skills refer to special attack values, look at panel reading and add.

## Skill Power

Based on the skill power value of the skill to be calculated, if there is power coefficient increase, multiply by the corresponding power coefficient bonus.

![placeholder](/aola/damage_008.png) (Out-of-battle)
![placeholder](/aola/damage_009.png) (In-battle)

## Attribute Level

Formula:

$$ Y = \frac{(4+att1) \times (4+def1)}{(4+att2) \times (4+def2)} $$

Where:

- `att` is our attack (special attack) attribute level, `def` is enemy defense (special defense) attribute level, \{ att,def \in \mathbb{Z} \mid -10 \leq att,def \leq 10 \}.
- When `att > 0`, att1 = att, att2 = 0.
- When `att < 0`, att1 = 0, att2 = att.
- When `def > 0`, def1 = 0, def2 = def.
- When `def < 0`, def1 = def, def2 = 0.

Formula logic follows:

- Our attack (special attack) attribute `att`: positive (>0) acts on numerator, negative (<0) absolute value acts on denominator.
- Enemy defense (special defense) attribute `def`: positive (>0) acts on denominator, negative (<0) absolute value acts on numerator.
- If attribute level is 0, no effect.

::: tip
When attribute level is our +6 enemy -6, value is 6.25.
:::

Below is the Python implementation of this formula and a calculation example:

```python
def calculate_attribute_bonus(x1, x2):
    """
    Parameters:
    x1 (int): Our attack attribute level (-10 to 10)
    x2 (int): Enemy defense attribute level (-10 to 10)

    Returns:
    float: Damage bonus coefficient
    """
    if not -10 <= x1 <= 10 or not -10 <= x2 <= 10:
        raise ValueError("Attribute levels must be between -10 and 10")

    x1_eff = max(0, x1)
    x1_eff_neg = max(0, -x1)

    x2_eff = max(0, x2)
    x2_eff_neg = max(0, -x2)

    numerator = (4 + x1_eff) * (4 + x2_eff_neg)
    denominator = (4 + x1_eff_neg) * (4 + x2_eff)

    return float('inf') if denominator == 0 else numerator / denominator

# --- Example ---
# Assume our special attack attribute level is +6, enemy special defense attribute level is -3
our_attack_level = 6
enemy_defense_level = -3

bonus = calculate_attribute_bonus(our_attack_level, enemy_defense_level)

print(f"Our special attack attribute level: {our_attack_level}")
print(f"Enemy special defense attribute level: {enemy_defense_level}")
print(f"Calculated damage bonus coefficient: {bonus}")

# Expected result:
# x1_eff = 6, x1_eff_neg = 0
# x2_eff = 0, x2_eff_neg = 3
# numerator = (4 + 6) * (4 + 3) = 10 * 7 = 70
# denominator = (4 + 0) * (4 + 0) = 4 * 4 = 16
# y = 70 / 16 = 4.375
print("Expected result: 4.375")
```

## Boss Defense

Based on the value of the boss unit to challenge. Dummy defense is generally multiples of 4 million, suggest 12 million.

## Skill Segments

Based on the skill attack segments of the skill to be calculated. Attack target /d times.

## Power Bonus

Formula:

```
1+buff1+buff2+soul card bonus+crystal key bonus+skill own bonus
```

![placeholder](/aola/damage_010.png)![placeholder](/aola/damage_011.png)

- **buff1**: Power increase (increase value=80,150,200,300,400%)
  ![placeholder](/aola/damage_012.png)![placeholder](/aola/damage_013.png)

- **buff2**: Power blessing, skill power increase, upper limit=150,200,250%

- **Soul card bonus**: Power+[......], upper limit=60,80,90,100%. This part has too many descriptions and double judgment methods, and PVE double words, suggest take default 90%.

- **Crystal key bonus**: Related to configuration, count 0.

- **Skill own bonus**:
  ![placeholder](/aola/damage_014.png)
  The skill power +100,150,200,300%

## Damage Bonus

### Output Body

Formula:

```
1+soul weapon+god weapon+summoner+soul card+damage increase+skill damage
```

- **Soul weapon**:
  ![placeholder](/aola/damage_015.png)
  First appearance gain damage increase·soul, increase value=60%

- **God weapon**:
  ![placeholder](/aola/damage_016.png)
  First appearance gain damage increase·god weapon, increase value=100%
  First appearance gain damage increase·god weapon, increase value=60%

- **Soul card**:
  ![placeholder](/aola/damage_017.png)
  (Soul card) depends on configuration, rarely used, treat as 0, no need to calculate.

- **Summoner**:
  ![placeholder](/aola/damage_018.png)
  Summoner skill interface, deal damage +50% (directly count +50%)

- **Damage increase**:
  ![placeholder](/aola/damage_019.png)![placeholder](/aola/damage_020.png)
  Buff, damage increase (100,200,300,400%.

- **Skill own bonus**:
  ![placeholder](/aola/damage_021.png)
  The skill damage +100,150,200,300%.

Can simplify to `1+60%+100%+50%+0%+damage increase=3.1+damage increase+skill damage`

### In-battle Assist

Formula:

```
Void Awareness + assist (Dragon King/Black Wing/Version Child)
```

- **Void Awareness**:
  ![placeholder](/aola/damage_022.png)
  Void Awareness, 50% all skill damage bonus.

- **Assist**: Depends on lineup, not fixed.
  ![placeholder](/aola/damage_023.png)
  Dragon's War Cry, damage +150%
  ![placeholder](/aola/damage_024.png)
  Blood Blessing, damage +200%
  Version Child, xx·attack, damage increase 300% (calculate separately from buff damage increase)

- **Damage blessing**:
  ![placeholder](/aola/damage_025.png)
  Skill damage increase, upper limit=200,350% (generally ignore)

Can simplify to `50%+assist=0.5+assist`

### Total Damage Bonus

Formula:

```
Total damage bonus = output body + in-battle assist
```

Can simplify to `3.6+damage increase+skill damage+(assist)`

## Crit Damage Bonus

- **61 with Ice Snow Empress generally**: `200%+crit damage panel+soul card bonus+output own crit damage`
- **42 with Ice Snow Empress + Meng Po/Burning Angel generally**: `400%+crit damage panel+soul card bonus+output own crit damage`

![placeholder](/aola/damage_026.png)![placeholder](/aola/damage_027.png) (Out-of-battle crit damage panel)

- **Soul card bonus**: Count 0
- **Output own crit damage**: Only two items, crit damage increase, skill crit damage
  - **Crit damage increase**:
    ![placeholder](/aola/damage_028.png)
    (100%,200%,300%)
  - **Skill crit damage**:
    ![placeholder](/aola/damage_029.png) +100,150,200%

Simplify to: `200/400%+150%+crit damage increase+skill crit damage`

## Value Bonus

Formula:

```
1+Divine Judgment+Starry+God Weapon+Star Dream+Crystal Key+Soul Card Bonus
```

- **Divine Judgment**:
  ![placeholder](/aola/damage_030.png)
  All attribute ability value increase, default 70%

- **Starry**:
  ![placeholder](/aola/damage_031.png)
  Starry interface
  ![placeholder](/aola/damage_032.png)
  Default 80%

- **God Weapon**:
  ![placeholder](/aola/damage_033.png)
  (Value increase god weapon, simple calculation can treat as 0,10%,15%)

- **Star Dream**:
  ![placeholder](/aola/damage_034.png)![placeholder](/aola/damage_035.png)
  All attribute ability temporary increase, increase value=40,50%, upper limit=100,112%

- **Crystal Key**:
  ![placeholder](/aola/damage_036.png)
  After entering battle, own xx ability value temporary increase

- **Soul Card Bonus**:
  ![placeholder](/aola/damage_037.png)
  Special attack/normal attack ability value +xx%, base ability value bonus acts on panel, do not double calculate

::: tip
If hero pet then extra +50%, if not hero pet then extra +0%.
:::
