## 功能概述

战斗力计算模块提供以下核心功能:

- **基础属性战斗力计算** - 根据宠物的基础属性(攻击、防御等)计算基础战斗力
- **装备加成计算** - 计算装备对战斗力的加成
- **特性加成计算** - 计算宠物特性对战斗力的加成
- **神迹加成计算** - 计算神迹系统对战斗力的加成
- **铭文加成计算** - 计算铭文系统对战斗力的加成
- **星灵加成计算** - 计算星灵系统对战斗力的加成
- **神兵加成计算** - 计算神兵系统对战斗力的加成
- **魂卡加成计算** - 计算魂卡系统对战斗力的加成
- **天赋额外加成计算** - 计算特定类型宠物的天赋额外加成
- **学习力额外加成计算** - 计算特定类型宠物的学习力额外加成

## 战斗力计算总公式

根据系统代码分析,战斗力计算公式如下:

```javascript
总战斗力 = 基础属性战斗力 + 各种加成;
```

## 基础属性战斗力

基础属性战斗力计算公式为:

```javascript
基础属性战斗力 = 亚比星级系数 * 超系系数 * (速度 + 攻击 + 特攻 + 防御 + 特防 + 体力);
```

其中各项能力值的计算方式为:

```javascript
能力值 = int((((种族值 * 2 + 1.3 * 天赋值 + int(学习力 / 4.0)) / 100) * 等级 + 5) * 2) * 性格加成;
```

- 亚比星级系数:来自宠物数据中的pmBattleEff字段
- 超系系数:超系为1.12,普通系为1
- 性格加成:推荐性格加成为1.1,克制性格为0.9,其他为1
- 加速度推荐攻击并降低对位攻击的性格也满战

## 特性加成 (PetCard2)

特性加成根据特性的颜色和等级提供不同的战斗力加成.

特性加成数值表:

```javascript
PetBattleEffHelper.PetCard2Eff = [
  [100, 150, 200, 250], // 绿色特性(索引0)
  [300, 350, 400, 450, 500], // 蓝色特性(索引1)
  [500, 550, 600, 650, 700, 750], // 紫色特性(索引2)
];
```

特性等级对应关系:

```javascript
PetBattleEffHelper.PetCard2Index = [3, 4, 5];
```

这个数组表示:

- 索引0对应绿色特性(特性等级为3)
- 索引1对应蓝色特性(特性等级为4)
- 索引2对应紫色特性(特性等级为5)

具体的加成数值计算如下:

首先根据特性颜色确定索引:

- 绿色特性对应索引0
- 蓝色特性对应索引1
- 紫色特性对应索引2

然后根据特性等级和索引从数组中获取对应加成:

### 实例说明

假设你有一只普通亚比装备了等级为3的蓝色特性:

1. 特性颜色为蓝色,对应PetCard2Index中的索引1
2. 通过索引1获取PetCard2Eff中的蓝色特性数组:[300, 350, 400, 450, 500]
3. 特性等级为3,对应数组索引2(等级-1)
4. 最终加成为400战斗力

### 数学表达式:

设特性颜色索引为 i,特性等级为 l,则特性加成为:

```javascript
特性加成 = PetCard2Eff[i][l - 1];
```

## 装备加成 (PetCard3)

装备加成包含两个部分:品质基础值和附加属性值.

装备品质基础值:

```javascript
PetBattleEffHelper.PetCard3Eff = [
  [50], // 白装:50
  [100], // 绿装:100
  [200, 220], // 蓝装:200-220(根据星级)
  [300, 330, 360], // 紫装:300-360(根据星级)
  [400, 440, 480, 520], // 金装:400-520(根据星级)
  [592, 692, 792, 892], // 钻石装:592-892(根据星级)
];
```

装备附加属性值计算基于以下系数:

```javascript
// ["体力","速度","攻击","防御","特攻","特防"]增加系数
PetBattleEffHelper.PetCard3Quotiety = [3, 3, 4, 4, 4, 4];
```

这意味着:

- 体力和速度:每个点数增加3点战斗力
- 攻击、防御、特攻、特防:每个点数增加4点战斗力

不同品质装备拥有的孔数:

```javascript
PetBattleEffHelper.HoleNum = [0, 1, 2, 3, 3, 3];
```

这意味着:

- 白装:0个孔
- 绿装:1个孔
- 蓝装:2个孔
- 紫装、金装、钻石装:3个孔

装备孔属性最大值:

```javascript
UserPetCard3ExtInfo.addValue = [
  [12, 8, 6, 9, 6, 9], // 白装各属性最大值
  [12, 8, 6, 9, 6, 9], // 绿装各属性最大值
  [12, 8, 6, 9, 6, 9], // 蓝装各属性最大值
  [12, 12, 9, 9, 9, 9], // 紫装各属性最大值
  [12, 12, 9, 9, 9, 9], // 金装各属性最大值
  [12, 12, 9, 9, 9, 9], // 钻石装各属性最大值
];
```

### 实例说明

假设你有一个紫色2星装备,附加属性为:

- 攻击+5
- 防御+3
- 速度+2

计算过程如下:

1. 品质基础值:查看PetCard3Eff数组,紫装2星为330点战斗力

2. 附加属性值计算:
   - 攻击+5:5 × 4 = 20点战斗力
   - 防御+3:3 × 4 = 12点战斗力
   - 速度+2:2 × 3 = 6点战斗力
   - 附加属性总值:20 + 12 + 6 = 38点战斗力

3. 装备总战斗力:330 + 38 = 368点战斗力

### 数学表达式:

设装备品质索引为 $i$,星级为 $s$,附加属性值数组为 $a$,属性系数数组为 $q$,则装备加成为:
$$\text{PetCard3Eff} = \text{PetCard3Eff}[i][s] + \sum_{j=0}^{n-1} a[j] \times q[j]$$

其中 $n$ 为属性种类数.

## 神迹加成

神迹加成基于神迹突破材料数量和基础能力值计算.

神迹加成系数:

```javascript
// 神迹亚比战斗力=原部分+(攻击*3+特攻*3+防御*2.4+特防*2.4+体力*1.5+速度*3)
PetBattleEffHelper.MIRACLE_EFF_COEFFICIENTS = [1.5, 3, 2.4, 3, 2.4, 3];
```

这些系数分别对应六项基础属性:

- 体力:1.5
- 攻击:3
- 防御:2.4
- 特攻:3
- 特防:2.4
- 速度:3

### 计算过程:

1. 获取当前装备的神迹突破材料数量
2. 根据材料数量计算材料增加的能力值
3. 获取神迹亚比的基础能力值
4. 将材料增加的能力值和基础能力值传入getAbilityAddBattleEff方法
5. 该方法将各项属性值分别乘以对应的系数后求和,得到最终的战斗力加成

### 实例说明

例如,如果一个神迹亚比通过材料增加了100点攻击和50点防御,基础能力值为200点攻击和100点防御,那么:

- 攻击加成:(100 + 200) × 3 = 900
- 防御加成:(50 + 100) × 2.4 = 360
- 总战斗力加成:各项加成之和

### 数学表达式:

设神迹加成系数数组为 $c$(神迹加成系数,对应六项基础属性),材料增加能力值数组为 $m$(通过神迹突破材料增加的能力值),基础能力值数组为 $b$(神迹亚比的基础能力值),则神迹加成为:
$$\text{MiracleBonus} = \sum_{i=0}^{5} (m[i] + b[i]) \times c[i]$$

## 完全体神迹加成

完全体神迹加成基于完全体亚比的附加属性值计算.

完全体神迹加成使用与神迹加成相同的系数数组:

```javascript
PetBattleEffHelper.COMPLETE_MIRACLE_EFF_COEFFICIENTS = [1.5, 3, 2.4, 3, 2.4, 3];
```

### 计算过程:

1. 检查亚比是否为完全体神迹亚比
2. 如果是,则获取完全体神迹亚比的附加属性值
3. 将各项属性值乘以对应的系数后求和,得到最终的战斗力加成

例如,如果一个完全体神迹亚比的附加属性为:

- 体力:100
- 攻击:150
- 防御:120
- 特攻:150
- 特防:120
- 速度:150

那么战斗力加成为:

- 体力:100 × 1.5 = 150
- 攻击:150 × 3 = 450
- 防御:120 × 2.4 = 288
- 特攻:150 × 3 = 450
- 特防:120 × 2.4 = 288
- 速度:150 × 3 = 450
- 总加成:150 + 450 + 288 + 450 + 288 + 450 = 2076

### 数学表达式:

设完全体神迹加成系数数组为 c,附加属性值数组为 a,则完全体神迹加成为:
$$\text{CompleteMiracleBattleEff} = \sum_{i=0}^{5} a[i] \times c[i]$$

## 传奇魂加成

传奇魂加成根据传奇魂等级提供固定数值的战斗力加成.

传奇魂加成数组:

```javascript
PetBattleEffHelper.LengedSoulAddArr = [0, 500, 1000, 1500];
```

这个数组定义了不同等级传奇魂提供的战斗力加成:

- 等级0(未激活):0战斗力
- 等级1:500战斗力
- 等级2:1000战斗力
- 等级3:1500战斗力

### 计算过程:

1. 获取亚比的传奇魂等级(legendSoulLv)
2. 直接从LengedSoulAddArr数组中获取对应等级的战斗力加成值

例如,如果一个传奇亚比的传奇魂等级为2,那么它将获得1000点战斗力加成.

### 数学表达式:

设传奇魂等级为 l,则传奇魂加成为:

```
传奇魂加成 = LengedSoulAddArr[l]
```

## 铭文加成

铭文加成分为属性铭文和非属性铭文两种类型.

铭文加成数组:

```javascript
PetBattleEffHelper.DegeneratorInscriptionAddArr = [300, 600, 900, 1200, 1500];
```

这个数组定义了不同等级铭文提供的战斗力加成:

- 等级0:300战斗力
- 等级1:600战斗力
- 等级2:900战斗力
- 等级3:1200战斗力
- 等级4:1500战斗力

### 计算过程:

1. 检查亚比是否为星辉或光启亚比,如果是则不享受铭文加成
2. 遍历两种类型的铭文(类型0和类型1)
3. 获取每种类型的铭文信息
4. 判断是否为属性铭文:
   - 如果是属性铭文,基础值为1500战斗力,每条附加属性再增加50战斗力
   - 如果是非属性铭文,根据铭文等级从DegeneratorInscriptionAddArr数组获取战斗力加成
5. 将两种铭文的加成值相加得到总加成

例如,如果一个异次元亚比拥有一个等级为3的非属性铭文和一个拥有2条附加属性的属性铭文:

- 非属性铭文加成:1200战斗力
- 属性铭文加成:1500 + 2 × 50 = 1600战斗力
- 总加成:1200 + 1600 = 2800战斗力

### 数学表达式:

设铭文等级为 $l$ (inscription level),属性铭文附加属性数为 $n$ (number of additional attributes for attribute inscription),则铭文加成为:

$$
\text{InscriptionBonus} = \begin{cases}
\text{DegeneratorInscriptionAddArr}[l], & \text{Non-attribute inscription} \\
1500 + n \times 50, & \text{Attribute inscription}
\end{cases}
$$

其中 $l$ 取值范围为 0-4.

总铭文加成为两种铭文加成之和.

## 星灵加成

星灵加成根据星灵等级提供固定数值的战斗力加成,仅星辉亚比可享受.

星灵加成数组:

```javascript
PetBattleEffHelper.XinghuiAstralSpiritAddArr = [800, 1100, 1400, 1700, 2000];
```

这个数组定义了不同等级星灵提供的战斗力加成:

- 等级1:800战斗力
- 等级2:1100战斗力
- 等级3:1400战斗力
- 等级4:1700战斗力
- 等级5:2000战斗力

### 计算过程:

1. 获取亚比装备的星灵信息数组
2. 遍历每个装备的星灵
3. 根据星灵等级(从1开始)从`XinghuiAstralSpiritAddArr`数组获取对应的战斗力加成
4. 将所有星灵的加成值相加得到总加成

例如,如果一个星辉亚比装备了3个等级分别为2、4、5的星灵,那么它的星灵加成为:
1100 + 1700 + 2000 = 4800战斗力

星灵神化相关内容:

- 星灵最高等级为5级
- 神化开启等级为5级
- 神化后可以进行属性强化,不同类型的星灵有不同的强化范围

### 数学表达式:

设星灵等级为 l,则单个星灵加成为:

```javascript
星灵加成 = XinghuiAstralSpiritAddArr[l - 1];
```

总星灵加成为所有装备星灵加成之和.

## 神兵加成

神兵加成根据神兵品质和星级提供固定数值的战斗力加成,仅神兵亚比可享受.

神兵加成数组:

```javascript
PetBattleEffHelper.GOD_CARD_ADD_CONST = [
  [500, 600, 700, 800], // 白装品质神兵
  [1000, 1200, 1400, 1600], // 绿装品质神兵
  [2000, 2300, 2600, 3000], // 蓝装品质神兵
];
```

这个数组定义了不同品质和等级神兵提供的战斗力加成:

- 白装品质神兵:
  - 0星:500战斗力
  - 1星:600战斗力
  - 2星:700战斗力
  - 3星:800战斗力
- 绿装品质神兵:
  - 0星:1000战斗力
  - 1星:1200战斗力
  - 2星:1400战斗力
  - 3星:1600战斗力
- 蓝装品质神兵:
  - 0星:2000战斗力
  - 1星:2300战斗力
  - 2星:2600战斗力
  - 3星:3000战斗力

### 计算过程:

1. 检查亚比是否为神兵亚比,以及是否存在神兵列表
2. 获取神兵服务实例
3. 遍历神兵列表中的每个神兵
4. 根据神兵的品质和等级从`GOD_CARD_ADD_CONST`二维数组中获取对应的战斗力加成
5. 将所有神兵的加成值相加得到总加成

例如,如果一个神兵亚比装备了以下神兵:

- 1个白装品质2星神兵:700战斗力
- 1个绿装品质1星神兵:1200战斗力
- 1个蓝装品质3星神兵:3000战斗力

那么它的神兵加成为:700 + 1200 + 3000 = 4900战斗力

### 数学表达式:

设神兵品质为 q,星级为 s,则单个神兵加成为:

```javascript
神兵加成 = GOD_CARD_ADD_CONST[q][s];
```

总神兵加成为所有装备神兵加成之和.

## 魂卡加成

魂卡加成根据魂卡激活的词条槽数量提供固定数值的战斗力加成,仅光启亚比可享受.

魂卡加成配置:

```javascript
/**
 * 战力:词条数* 200 + 激活1级词条数*200+激活2或3级词条数*400+激活4或5级词条数*800.词条等级最高为5
 */
HKConfig.BattleArr = [200, 400, 400, 800, 800];
HKConfig.OneCardBaseBattle = 200;
```

这些配置定义了魂卡加成的计算规则:

- 每张魂卡基础战斗力:200
- 每激活一个词条槽位提供额外战斗力:
  - 第1个槽位:200战斗力
  - 第2-3个槽位:400战斗力
  - 第4-5个槽位:800战斗力

魂卡槽位等级配置:

```javascript
HKConfig.CardSlotMaxLevelArr = [1, 3, 5, 3, 1];
```

这意味着5张魂卡的槽位最大等级分别为:

- 第1张魂卡:1级
- 第2张魂卡:3级
- 第3张魂卡:5级(核心魂卡)
- 第4张魂卡:3级
- 第5张魂卡:1级

### 计算过程:

1. 检查亚比是否为光启亚比,如果不是则返回0
2. 获取亚比装备的魂卡ID数组和槽位等级数组
3. 遍历每张魂卡:
   - 如果魂卡ID有效,则增加基础战斗力200
   - 获取魂卡数据和已开启的槽位数量
   - 根据已开启的槽位数量,按照BattleArr数组累加战斗力
4. 返回总战斗力加成

例如,如果一个光启亚比装备了5张魂卡,并且都开启了最大数量的槽位:

- 5张魂卡基础战斗力:5 × 200 = 1000
- 第1张魂卡1个槽位:200
- 第2张魂卡3个槽位:200 + 400 + 400 = 1000
- 第3张魂卡5个槽位:200 + 400 + 400 + 800 + 800 = 2600
- 第4张魂卡3个槽位:200 + 400 + 400 = 1000
- 第5张魂卡1个槽位:200
- 总战斗力加成:1000 + 200 + 1000 + 2600 + 1000 + 200 = 6000

### 数学表达式:

设魂卡数量为 $n$(魂卡总数量),第 $i$ 张魂卡开启的槽位数为 $s_i$(第 $i$ 张魂卡已激活的词条槽数量),则魂卡加成为:
$$\text{SoulCardBonus} = \sum_{i=0}^{n-1} \left(200 + \sum_{j=0}^{s_i-1} \text{BattleArr}[j]\right)$$

## 天赋额外加成

天赋额外加成是针对特殊类型亚比(传奇、异次元、星辉、光启)提供的额外战斗力加成.

天赋额外加成分为两部分:

1. 基于天赋值的加成
2. 满足特定条件时的额外奖励加成

单项天赋额外加成计算:

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

### 计算过程:

1. 首先计算天赋系数:
   - `Math.floor((indValue - 1) / 12 + 1)` 计算天赋等级段
   - `(indValue - Math.floor((indValue - 1) / 12) * 6)` 计算该段内的具体值
   - 两者相乘得到天赋系数

2. 根据亚比类型计算额外加成:
   - 传奇亚比:`Math.floor(Math.floor(indCoefficient * level / 50) * 1.4)`
   - 异次元、星辉、光启亚比:`Math.floor(Math.floor(indCoefficient * level / 50) * 1.4 * 1.1)`
   - 其他亚比:0(不享受天赋额外加成)

总天赋额外加成计算:

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

### 计算过程:

1. 遍历所有6项天赋属性(速度、攻击、特攻、防御、特防、体力)
2. 分别计算每项天赋的额外加成并累加
3. 根据亚比类型和天赋总和判断是否给予额外奖励:
   - 星辉亚比:当所有天赋值都达到70以上时,额外奖励500战斗力
   - 光启亚比:
     - 当天赋总和达到特定值(4项70+2项100)时,额外奖励1000战斗力
     - 当所有天赋值都达到70以上时,额外奖励500战斗力

### 数学表达式:

设单项天赋额外加成为 $BE_{\text{ind},i}$,天赋系数为 $C_i$,等级为 $L$,则:

- 传奇亚比:
  $$BE_{\text{ind},i} = \left\lfloor \left\lfloor \frac{C_i \times L}{50} \right\rfloor \times 1.4 \right\rfloor$$

- 异次元、星辉、光启亚比:
  $$BE_{\text{ind},i} = \left\lfloor \left\lfloor \frac{C_i \times L}{50} \right\rfloor \times 1.4 \times 1.1 \right\rfloor$$

其中,天赋系数 $C_i$ 的计算公式为:
$$C_i = \left\lfloor \frac{\text{indValue} - 1}{12} + 1 \right\rfloor \times \left( \text{indValue} - \left\lfloor \frac{\text{indValue} - 1}{12} \right\rfloor \times 6 \right)$$

总天赋额外加成为各项天赋额外加成之和,即:
$$BE_{\text{ind},\text{total}} = \sum_{i=1}^{6} BE_{\text{ind},i}$$

再加上满足条件时的额外奖励:

- 星辉亚比:若所有天赋值 $\geq 70$,则:
  $$BE_{\text{ind},\text{total}} = BE_{\text{ind},\text{total}} + 500$$

- 光启亚比:
  - 若天赋总和满足特定条件(4项$\geq 70$且2项$\geq 100$),则:
    $$BE_{\text{ind},\text{total}} = BE_{\text{ind},\text{total}} + 1000$$
  - 若所有天赋值 $\geq 70$,则:
    $$BE_{\text{ind},\text{total}} = BE_{\text{ind},\text{total}} + 500$$

## 学习力额外加成

除了天赋额外加成,特殊亚比还享受学习力额外加成.

学习力单项加成:

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

学习力总加成计算:

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

### 计算过程:

1. 传奇和异次元亚比享受学习力额外加成,直接返回学习力值
2. 星辉和光启亚比享受固定1000战斗力加成
3. 异次元亚比有额外的加成计算:
   - 原始加成乘以1.1
   - 学习力总和部分加成:`(Math.floor(pbi.effAll * 1.8) + 40) * 1.1 + 1000`
4. 其他亚比不享受学习力额外加成

### 数学表达式:

设单项学习力额外加成为 $BE_{\text{eff},i}$,学习力值为 $E_i$,学习力总和为 $E_{\text{all}}$,则:

- 传奇和异次元亚比:
  $$BE_{\text{eff},i} = E_i$$

- 星辉和光启亚比:
  $$BE_{\text{eff},\text{total}} = 1000$$

- 异次元亚比:
  $$BE_{\text{eff},\text{total}} = \left\lfloor BE_{\text{eff},\text{total}} \times 1.1 \right\rfloor + \left\lfloor \left( \left\lfloor E_{\text{all}} \times 1.8 \right\rfloor + 40 \right) \times 1.1 \right\rfloor + 1000$$

- 其他亚比:
  $$BE_{\text{eff},\text{total}} = \left\lfloor E_{\text{all}} \times 1.8 \right\rfloor + 40$$

其中 $BE_{\text{eff},\text{total}}$ 初始值为各项学习力额外加成之和,即:
$$BE_{\text{eff},\text{total}} = \sum_{i=1}^{6} BE_{\text{eff},i}$$
