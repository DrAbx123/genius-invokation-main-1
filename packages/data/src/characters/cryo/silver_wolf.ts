// Copyright (C) 2025 DrAbx123 @genius-invokation
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { character, skill, status, card, extension, pair, DamageType, DiceType, CharacterHandle, CardHandle, summon, combatStatus } from "@gi-tcg/core/builder";

// 创建一个统一的扩展来管理银狼的所有状态
const SilverWolfExtension = extension(97000, {
  lastConvertRound: pair(-1)        // 记录银狼上次通过以太编辑将元素骰转化为万能元素的回合
})
  .description("银狼角色状态管理")
  .done();

/**
 * @id 97104
 * @name 逻辑覆写：冰
 * @description
 * 所附属角色造成的物理伤害变为冰元素伤害。(一次性效果)
 */
export const CryoLogicOverwrite = status(97104)
  .on("modifySkillDamageType", (c, e) => e.type === DamageType.Physical)
  .changeDamageType(DamageType.Cryo)
  .usage(1)
  .done();

/**
 * @id 97204
 * @name 逻辑覆写：火
 * @description
 * 所附属角色造成的物理伤害变为火元素伤害。(一次性效果)
 */
export const PyroLogicOverwrite = status(97204)
  .on("modifySkillDamageType", (c, e) => e.type === DamageType.Physical)
  .changeDamageType(DamageType.Pyro)
  .usage(1)
  .done();

/**
 * @id 97304
 * @name 逻辑覆写：雷
 * @description
 * 所附属角色造成的物理伤害变为雷元素伤害。(一次性效果)
 */
export const ElectroLogicOverwrite = status(97304)
  .on("modifySkillDamageType", (c, e) => e.type === DamageType.Physical)
  .changeDamageType(DamageType.Electro)
  .usage(1)
  .done();

/**
 * @id 97404
 * @name 逻辑覆写：水
 * @description
 * 所附属角色造成的物理伤害变为水元素伤害。(一次性效果)
 */
export const HydroLogicOverwrite = status(97404)
  .on("modifySkillDamageType", (c, e) => e.type === DamageType.Physical)
  .changeDamageType(DamageType.Hydro)
  .usage(1)
  .done();

/**
 * @id 97504
 * @name 逻辑覆写：风
 * @description
 * 所附属角色造成的物理伤害变为风元素伤害。(一次性效果)
 */
export const AnemoLogicOverwrite = status(97504)
  .on("modifySkillDamageType", (c, e) => e.type === DamageType.Physical)
  .changeDamageType(DamageType.Anemo)
  .usage(1)
  .done();

/**
 * @id 97604
 * @name 逻辑覆写：岩
 * @description
 * 所附属角色造成的物理伤害变为岩元素伤害。(一次性效果)
 */
export const GeoLogicOverwrite = status(97604)
  .on("modifySkillDamageType", (c, e) => e.type === DamageType.Physical)
  .changeDamageType(DamageType.Geo)
  .usage(1)
  .done();

/**
 * @id 97704
 * @name 逻辑覆写：草
 * @description
 * 所附属角色造成的物理伤害变为草元素伤害。(一次性效果)
 */
export const DendroLogicOverwrite = status(97704)
  .on("modifySkillDamageType", (c, e) => e.type === DamageType.Physical)
  .changeDamageType(DamageType.Dendro)
  .usage(1)
  .done();

/**
 * @id 97020
 * @name 侵入
 * @description
 * 所附属角色下次受到元素反应伤害时，移除此效果，每层使此伤害+1。（层数可叠加，无上限）
 */
export const Intrusion = status(97020)
  .variableCanAppend("layer", 1, Infinity)
  .on("increaseDamage", (c, e) => e.getReaction() !== null)
  .do((c, e) => {
    // 根据层数增加伤害
    e.increaseDamage(c.getVariable("layer"));
    // 用完即弃
    c.dispose();
  })
  .done();

/**
 * @id 297010
 * @name 骇客扳机
 * @description
 * 特技：暴风狙击（可用次数2）我方银狼在场时，才能使用，造成1点银狼当前元素的伤害，目标角色附属"侵入"，生成手牌"骇客扳机"。
 */
export const HackerTrigger = card(297010)
  .unobtainable()
  .technique()
  .provideSkill(2970101)
  .costSame(1)
  .usage(2)
  .if((c) => {
    // 检查我方是否有银狼在场
    return c.$$("my characters").some(char =>
      [9700, 9701, 9702, 9703, 9704, 9705, 9706, 9707].includes(char.definition.id));
  })
  .do((c) => {
    // 寻找我方银狼
    const silverWolves = c.$$("my characters").filter(char =>
      [9700, 9701, 9702, 9703, 9704, 9705, 9706, 9707].includes(char.definition.id));

    if (silverWolves.length === 0) {
      return;
    }

    // 取第一个找到的银狼角色
    const silverWolf = silverWolves[0];

    // 根据银狼当前元素确定伤害类型
    const defId = silverWolf.definition.id;

    if (defId === 9701) {
      c.damage(DamageType.Cryo, 1);
    } else if (defId === 9702) {
      c.damage(DamageType.Pyro, 1);
    } else if (defId === 9703) {
      c.damage(DamageType.Electro, 1);
    } else if (defId === 9704) {
      c.damage(DamageType.Hydro, 1);
    } else if (defId === 9705) {
      c.damage(DamageType.Anemo, 1);
    } else if (defId === 9706) {
      c.damage(DamageType.Geo, 1);
    } else if (defId === 9707) {
      c.damage(DamageType.Dendro, 1);
    } else {
      c.damage(DamageType.Physical, 1);
    }

    // 为目标附加侵入状态
    c.characterStatus(Intrusion, "opp active");
  })
  .done();

/**
 * @id 2970101
 * @name 暴风狙击
 * @description
 * 造成1点银狼当前元素的伤害，目标角色附属"侵入"。
 */

/**
 * @id 197011
 * @name 追影械兔0019-|α>
 * @description
 * 结束阶段：造成1点冰元素伤害。如果该牌的可用次数仅剩余1，则抓1张牌。
 * 可用次数：2
 */
export const CryoMechaRabbit = summon(197011)
  .endPhaseDamage(DamageType.Cryo, 1)
  .usage(2)
  .on("endPhase")
  .if((c) => c.getVariable("usage") === 1)
  .drawCards(1)
  .done();

/**
 * @id 197012
 * @name 追影械兔0019-|β>
 * @description
 * 结束阶段：造成1点火元素伤害。如果该牌的可用次数仅剩余1，则抓1张牌。
 * 可用次数：2
 */
export const PyroMechaRabbit = summon(197012)
  .endPhaseDamage(DamageType.Pyro, 1)
  .usage(2)
  .on("endPhase")
  .if((c) => c.getVariable("usage") === 1)
  .drawCards(1)
  .done();

/**
 * @id 197013
 * @name 追影械兔0019-|γ>
 * @description
 * 结束阶段：造成1点雷元素伤害。如果该牌的可用次数仅剩余1，则抓1张牌。
 * 可用次数：2
 */
export const ElectroMechaRabbit = summon(197013)
  .endPhaseDamage(DamageType.Electro, 1)
  .usage(2)
  .on("endPhase")
  .if((c) => c.getVariable("usage") === 1)
  .drawCards(1)
  .done();

/**
 * @id 197014
 * @name 追影械兔0019-|δ>
 * @description
 * 结束阶段：造成1点水元素伤害。如果该牌的可用次数仅剩余1，则抓1张牌。
 * 可用次数：2
 */
export const HydroMechaRabbit = summon(197014)
  .endPhaseDamage(DamageType.Hydro, 1)
  .usage(2)
  .on("endPhase")
  .if((c) => c.getVariable("usage") === 1)
  .drawCards(1)
  .done();

/**
 * @id 197015
 * @name 追影械兔0019-|ε>
 * @description
 * 结束阶段：造成1点风元素伤害。如果该牌的可用次数仅剩余1，则抓1张牌。
 * 可用次数：2
 */
export const AnemoMechaRabbit = summon(197015)
  .endPhaseDamage(DamageType.Anemo, 1)
  .usage(2)
  .on("endPhase")
  .if((c) => c.getVariable("usage") === 1)
  .drawCards(1)
  .done();

/**
 * @id 197016
 * @name 追影械兔0019-|ζ>
 * @description
 * 结束阶段：造成1点岩元素伤害。如果该牌的可用次数仅剩余1，则抓1张牌。
 * 可用次数：2
 */
export const GeoMechaRabbit = summon(197016)
  .endPhaseDamage(DamageType.Geo, 1)
  .usage(2)
  .on("endPhase")
  .if((c) => c.getVariable("usage") === 1)
  .drawCards(1)
  .done();

/**
 * @id 197017
 * @name 追影械兔0019-|η>
 * @description
 * 结束阶段：造成1点草元素伤害。如果该牌的可用次数仅剩余1，则抓1张牌。
 * 可用次数：2
 */
export const DendroMechaRabbit = summon(197017)
  .endPhaseDamage(DamageType.Dendro, 1)
  .usage(2)
  .on("endPhase")
  .if((c) => c.getVariable("usage") === 1)
  .drawCards(1)
  .done();

/**
 * @id 97*01
 * @name 系统警告
 * @description
 * 造成1点物理伤害。
 */
export const NormalAttack = skill(97001)
  .type("normal")
  .costSame(2)
  .costVoid(1)  // 1个任意元素骰
  .damage(DamageType.Physical, 1)
  .done();

// 冰元素
export const CryoNormalAttack = skill(97101)
  .type("normal")
  .costCryo(2)
  .costVoid(1)
  .damage(DamageType.Physical, 1)
  .done();

// 火元素
export const PyroNormalAttack = skill(97201)
  .type("normal")
  .costPyro(2)
  .costVoid(1)
  .damage(DamageType.Physical, 1)
  .done();

// 雷元素
export const ElectroNormalAttack = skill(97301)
  .type("normal")
  .costElectro(2)
  .costVoid(1)
  .damage(DamageType.Physical, 1)
  .done();

// 水元素
export const HydroNormalAttack = skill(97401)
  .type("normal")
  .costHydro(2)
  .costVoid(1)
  .damage(DamageType.Physical, 1)
  .done();

// 风元素
export const AnemoNormalAttack = skill(97501)
  .type("normal")
  .costAnemo(2)
  .costVoid(1)
  .damage(DamageType.Physical, 1)
  .done();

// 岩元素
export const GeoNormalAttack = skill(97601)
  .type("normal")
  .costGeo(2)
  .costVoid(1)
  .damage(DamageType.Physical, 1)
  .done();

// 草元素
export const DendroNormalAttack = skill(97701)
  .type("normal")
  .costDendro(2)
  .costVoid(1)
  .damage(DamageType.Physical, 1)
  .done();

/**
 * @id 97003
 * @name 账号已封禁
 * @description
 * 造成1点物理伤害，对所有敌方后台角色造成1点穿透伤害，并使所有敌方角色附属"侵入"，生成手牌"骇客扳机"。
 */
export const ElementalBurst = skill(97003)
  .type("burst")
  .costSame(3)
  .costEnergy(2)
  .damage(DamageType.Physical, 1)
  .damage(DamageType.Piercing, 1, "opp standby characters")
  .characterStatus(Intrusion, "opp characters")
  .createHandCard(HackerTrigger)
  .done();

// 冰元素
export const CryoElementalBurst = skill(97103)
  .type("burst")
  .costCryo(3)
  .costEnergy(2)
  .damage(DamageType.Physical, 1)
  .damage(DamageType.Piercing, 1, "opp standby characters")
  .characterStatus(Intrusion, "opp characters")
  .createHandCard(HackerTrigger)
  .done();

// 火元素
export const PyroElementalBurst = skill(97203)
  .type("burst")
  .costPyro(3)
  .costEnergy(2)
  .damage(DamageType.Physical, 1)
  .damage(DamageType.Piercing, 1, "opp standby characters")
  .characterStatus(Intrusion, "opp characters")
  .createHandCard(HackerTrigger)
  .done();

// 雷元素
export const ElectroElementalBurst = skill(97303)
  .type("burst")
  .costElectro(3)
  .costEnergy(2)
  .damage(DamageType.Physical, 1)
  .damage(DamageType.Piercing, 1, "opp standby characters")
  .characterStatus(Intrusion, "opp characters")
  .createHandCard(HackerTrigger)
  .done();

// 水元素
export const HydroElementalBurst = skill(97403)
  .type("burst")
  .costHydro(3)
  .costEnergy(2)
  .damage(DamageType.Physical, 1)
  .damage(DamageType.Piercing, 1, "opp standby characters")
  .characterStatus(Intrusion, "opp characters")
  .createHandCard(HackerTrigger)
  .done();

// 风元素
export const AnemoElementalBurst = skill(97503)
  .type("burst")
  .costAnemo(3)
  .costEnergy(2)
  .damage(DamageType.Physical, 1)
  .damage(DamageType.Piercing, 1, "opp standby characters")
  .characterStatus(Intrusion, "opp characters")
  .createHandCard(HackerTrigger)
  .done();

// 岩元素
export const GeoElementalBurst = skill(97603)
  .type("burst")
  .costGeo(3)
  .costEnergy(2)
  .damage(DamageType.Physical, 1)
  .damage(DamageType.Piercing, 1, "opp standby characters")
  .characterStatus(Intrusion, "opp characters")
  .createHandCard(HackerTrigger)
  .done();

// 草元素
export const DendroElementalBurst = skill(97703)
  .type("burst")
  .costDendro(3)
  .costEnergy(2)
  .damage(DamageType.Physical, 1)
  .damage(DamageType.Piercing, 1, "opp standby characters")
  .characterStatus(Intrusion, "opp characters")
  .createHandCard(HackerTrigger)
  .done();


/**
 * @id 97002
 * @name 绝对安全协议
 * @description
 * 根据银狼当前的元素类型，召唤对应型号的"追影械兔0019"，然后，从3个元素类型中挑选一个，使自身转换元素类型，并附属该元素的"逻辑覆写"（召唤区最多同时存在2种"追影械兔0019"）
 */
export const ElementalSkill = skill(97002)
  .type("elemental")
  .costSame(3)
  .do((c) => {
    // 根据角色当前元素形态调用对应的元素战技
    const character = c.self.definition.id;
    if (character === 9701) {
      c.useSkill(CryoElementalSkill);
    } else if (character === 9702) {
      c.useSkill(PyroElementalSkill);
    } else if (character === 9703) {
      c.useSkill(ElectroElementalSkill);
    } else if (character === 9704) {
      c.useSkill(HydroElementalSkill);
    } else if (character === 9705) {
      c.useSkill(AnemoElementalSkill);
    } else if (character === 9706) {
      c.useSkill(GeoElementalSkill);
    } else if (character === 9707) {
      c.useSkill(DendroElementalSkill);
    }
  })
  .done();

/**
 * @id 97030
 * @name 预载装填
 * @description
 * 双方选择行动前，移除此效果，从4种元素类型中挑选1个，使银狼转换元素类型，并为其附属该元素的"逻辑覆写"。
 */
export const PreloadStatus = combatStatus(97030)
  .on("actionPhase")
  .do((c) => {
    // 移除此效果
    c.dispose();

    // 找到银狼角色
    const silverWolf = c.player.characters.find(char =>
      [9700, 9701, 9702, 9703, 9704, 9705, 9706, 9707].some(id => id === char.definition.id));

    if (silverWolf) {
      // 所有可选形态ID
      const allChoiceIds = [
        9701, // 冰
        9702, // 火
        9703, // 雷
        9704, // 水
        9705, // 风
        9706, // 岩
        9707  // 草
      ];

      // 随机选择4种元素
      const choiceIndices = c.randomSubset([0, 1, 2, 3, 4, 5, 6], 4);

      // 创建选择卡牌列表
      const choiceCards = [];
      for (const index of choiceIndices) {
        const choice = allChoiceIds[index];
        switch (choice) {
          case 9701:
            choiceCards.push(CryoChoiceCard);
            break;
          case 9702:
            choiceCards.push(PyroChoiceCard);
            break;
          case 9703:
            choiceCards.push(ElectroChoiceCard);
            break;
          case 9704:
            choiceCards.push(HydroChoiceCard);
            break;
          case 9705:
            choiceCards.push(AnemoChoiceCard);
            break;
          case 9706:
            choiceCards.push(GeoChoiceCard);
            break;
          case 9707:
            choiceCards.push(DendroChoiceCard);
            break;
        }
      }

      // 使用selectAndPlay，立即执行选择的卡牌效果
      c.selectAndPlay(choiceCards);
    }
  })
  .done();

/**
 * @id 97040
 * @name 以太编辑
 * @description
 * 【被动】战斗开始时，生成"预载装填"，我方银狼转换元素类型后，将1个元素骰转化为万能元素。（每回合1次）
 */
export const EtherEditPassive = skill(97040)
  .type("passive")
  .associateExtension(SilverWolfExtension)
  .on("battleBegin")
  .do((c) => {
    // 战斗开始时添加预载装填状态
    c.combatStatus(PreloadStatus);
  })
  .done();

/**
 * @id 97102
 * @name 绝对安全协议：冰
 * @description
 * 召唤追影械兔0019-|α>，然后从三种元素形态中随机选择一种切换（不包括当前形态）。
 */
export const CryoElementalSkill = skill(97102)
  .type("elemental")
  .costCryo(3)
  .associateExtension(SilverWolfExtension)
  .do((c) => {
    // 检查并控制召唤物数量，限制最多同时存在2种
    const allMechaSummons = [
      197011, 197012, 197013, 197014,
      197015, 197016, 197017
    ];

    // 找出当前存在的机械兔
    const existingSummons = c.$$("my summons").filter(s =>
      allMechaSummons.some(summon => summon === s.definition.id));

    // 如果已有两个不同的机械兔，随机移除一个
    if (existingSummons.length >= 2) {
      const uniqueTypes = [...new Set(existingSummons.map(s => s.definition.id))];
      if (uniqueTypes.length >= 2 && !uniqueTypes.includes(197011)) {
        // 至少有两种不同类型且不包含当前要召唤的类型，随机移除
        const toRemove = c.random(existingSummons);
        c.dispose(`my summons with id ${toRemove.id}`);
      }
      else {
        c.dispose(`my summons with definition id 197011`);
      }
    }

    // 召唤冰元素机械兔
    c.summon(CryoMechaRabbit);

    // 附加逻辑覆写状态
    c.characterStatus(CryoLogicOverwrite);

    // 所有可选形态ID（除了冰元素）
    const allChoiceIds = [
      9702, // 火
      9703, // 雷
      9704, // 水
      9705, // 风
      9706, // 岩
      9707  // 草
    ];

    // 随机选择3种元素（除了当前的冰元素）
    const choiceIndices = c.randomSubset([0, 1, 2, 3, 4, 5], 3);

    // 创建选择卡牌列表
    const choiceCards = [];
    for (const index of choiceIndices) {
      const choice = allChoiceIds[index];
      switch (choice) {
        case 9702:
          choiceCards.push(PyroChoiceCard);
          break;
        case 9703:
          choiceCards.push(ElectroChoiceCard);
          break;
        case 9704:
          choiceCards.push(HydroChoiceCard);
          break;
        case 9705:
          choiceCards.push(AnemoChoiceCard);
          break;
        case 9706:
          choiceCards.push(GeoChoiceCard);
          break;
        case 9707:
          choiceCards.push(DendroChoiceCard);
          break;
      }
    }

      // 使用selectAndPlay，立即执行选择的卡牌效果
      c.selectAndPlay(choiceCards);


  })
  .done();

/**
 * @id 97202
 * @name 绝对安全协议：火
 * @description
 * 召唤追影械兔0019-|β>，然后从三种元素形态中随机选择一种切换（不包括当前形态）。
 */
export const PyroElementalSkill = skill(97202)
  .type("elemental")
  .costPyro(3)
  .associateExtension(SilverWolfExtension)
  .do((c) => {
    // 检查并控制召唤物数量，限制最多同时存在2种
    const allMechaSummons = [
      197011, 197012, 197013, 197014,
      197015, 197016, 197017
    ];

    // 找出当前存在的机械兔
    const existingSummons = c.$$("my summons").filter(s =>
      allMechaSummons.some(summon => summon === s.definition.id));

    // 如果已有两个不同的机械兔，随机移除一个
    if (existingSummons.length >= 2) {
      const uniqueTypes = [...new Set(existingSummons.map(s => s.definition.id))];
      if (uniqueTypes.length >= 2 && !uniqueTypes.includes(197013)) {
        // 至少有两种不同类型且不包含当前要召唤的类型，随机移除
        const toRemove = c.random(existingSummons);
        c.dispose(`my summons with id ${toRemove.id}`);
      }
      else {
        c.dispose(`my summons with definition id 197013`);
      }
    }

    // 召唤火元素机械兔
    c.summon(PyroMechaRabbit);

    // 附加逻辑覆写状态
    c.characterStatus(PyroLogicOverwrite);


    // 所有可选形态ID（除了火元素）
    const allChoiceIds = [
      9701,
      9703,
      9704,
      9705,
      9706,
      9707
    ];

    // 随机选择3种元素（除了当前的火元素）
    const choiceIndices = c.randomSubset([0, 1, 2, 3, 4, 5], 3);

    // 创建选择卡牌列表
    const choiceCards = [];
    for (const index of choiceIndices) {
      const choice = allChoiceIds[index];
      switch (choice) {
        case 9701:
          choiceCards.push(CryoChoiceCard);
          break;
        case 9703:
          choiceCards.push(ElectroChoiceCard);
          break;
        case 9704:
          choiceCards.push(HydroChoiceCard);
          break;
        case 9705:
          choiceCards.push(AnemoChoiceCard);
          break;
        case 9706:
          choiceCards.push(GeoChoiceCard);
          break;
        case 9707:
          choiceCards.push(DendroChoiceCard);
          break;
      }
    }

      // 使用selectAndPlay，立即执行选择的卡牌效果
      c.selectAndPlay(choiceCards);



  })
  .done();

/**
 * @id 97302
 * @name 绝对安全协议：雷
 * @description
 * 召唤追影械兔0019-|γ>，然后从三种元素形态中随机选择一种切换（不包括当前形态）。
 */
export const ElectroElementalSkill = skill(97302)
  .type("elemental")
  .costElectro(3)
  .associateExtension(SilverWolfExtension)
  .do((c) => {
    // 检查并控制召唤物数量，限制最多同时存在2种
    const allMechaSummons = [
      197011, 197012, 197013, 197014,
      197015, 197016, 197017
    ];

    // 找出当前存在的机械兔
    const existingSummons = c.$$("my summons").filter(s =>
      allMechaSummons.some(summon => summon === s.definition.id));

    // 如果已有两个不同的机械兔，随机移除一个
    if (existingSummons.length >= 2) {
      const uniqueTypes = [...new Set(existingSummons.map(s => s.definition.id))];
      if (uniqueTypes.length >= 2 && !uniqueTypes.includes(197013)) {
        // 至少有两种不同类型且不包含当前要召唤的类型，随机移除
        const toRemove = c.random(existingSummons);
        c.dispose(`my summons with id ${toRemove.id}`);
      }
      else {
        c.dispose(`my summons with definition id 197013`);
      }
    }

    // 召唤雷元素机械兔
    c.summon(ElectroMechaRabbit);

    // 附加逻辑覆写状态
    c.characterStatus(ElectroLogicOverwrite);


    // 所有可选形态ID（除了雷元素）
    const allChoiceIds = [
      9701,
      9702,
      9704,
      9705,
      9706,
      9707
    ];

    // 随机选择3种元素（除了当前的雷元素）
    const choiceIndices = c.randomSubset([0, 1, 2, 3, 4, 5], 3);

    // 创建选择卡牌列表
    const choiceCards = [];
    for (const index of choiceIndices) {
      const choice = allChoiceIds[index];
      switch (choice) {
        case 9701:
          choiceCards.push(CryoChoiceCard);
          break;
        case 9702:
          choiceCards.push(PyroChoiceCard);
          break;
        case 9704:
          choiceCards.push(HydroChoiceCard);
          break;
        case 9705:
          choiceCards.push(AnemoChoiceCard);
          break;
        case 9706:
          choiceCards.push(GeoChoiceCard);
          break;
        case 9707:
          choiceCards.push(DendroChoiceCard);
          break;
      }
    }

      // 使用selectAndPlay，立即执行选择的卡牌效果
      c.selectAndPlay(choiceCards);



  })
  .done();

/**
 * @id 97402
 * @name 绝对安全协议：水
 * @description
 * 召唤追影械兔0019-|δ>，然后从三种元素形态中随机选择一种切换（不包括当前形态）。
 */
export const HydroElementalSkill = skill(97402)
  .type("elemental")
  .costHydro(3)
  .associateExtension(SilverWolfExtension)
  .do((c) => {
    // 检查并控制召唤物数量，限制最多同时存在2种
    const allMechaSummons = [
      197011, 197012, 197013, 197014,
      197015, 197016, 197017
    ];

    // 找出当前存在的机械兔
    const existingSummons = c.$$("my summons").filter(s =>
      allMechaSummons.some(summon => summon === s.definition.id));

    // 如果已有两个不同的机械兔，随机移除一个
    if (existingSummons.length >= 2) {
      const uniqueTypes = [...new Set(existingSummons.map(s => s.definition.id))];
      if (uniqueTypes.length >= 2 && !uniqueTypes.includes(197014)) {
        // 至少有两种不同类型且不包含当前要召唤的类型，随机移除
        const toRemove = c.random(existingSummons);
        c.dispose(`my summons with id ${toRemove.id}`);
      }
      else {
        c.dispose(`my summons with definition id 197014`);
      }
    }

    // 召唤水元素机械兔
    c.summon(HydroMechaRabbit);

    // 附加逻辑覆写状态
    c.characterStatus(HydroLogicOverwrite);

    // 所有可选形态ID（除了水元素）
    const allChoiceIds = [
      9701,
      9702,
      9703,
      9705,
      9706,
      9707
    ];

    // 随机选择3种元素（除了当前的水元素）
    const choiceIndices = c.randomSubset([0, 1, 2, 3, 4, 5], 3);

    // 创建选择卡牌列表
    const choiceCards = [];
    for (const index of choiceIndices) {
      const choice = allChoiceIds[index];
      switch (choice) {
        case 9701:
          choiceCards.push(CryoChoiceCard);
          break;
        case 9702:
          choiceCards.push(PyroChoiceCard);
          break;
        case 9703:
          choiceCards.push(ElectroChoiceCard);
          break;
        case 9705:
          choiceCards.push(AnemoChoiceCard);
          break;
        case 9706:
          choiceCards.push(GeoChoiceCard);
          break;
        case 9707:
          choiceCards.push(DendroChoiceCard);
          break;
      }
    }
      // 使用selectAndPlay，立即执行选择的卡牌效果
      c.selectAndPlay(choiceCards);



  })
  .done();

/**
 * @id 97502
 * @name 绝对安全协议：风
 * @description
 * 召唤追影械兔0019-|ε>，然后从三种元素形态中随机选择一种切换（不包括当前形态）。
 */
export const AnemoElementalSkill = skill(97502)
  .type("elemental")
  .costAnemo(3)
  .associateExtension(SilverWolfExtension)
  .do((c) => {
    // 检查并控制召唤物数量，限制最多同时存在2种
    const allMechaSummons = [
      197011, 197012, 197013, 197014,
      197015, 197016, 197017
    ];

    // 找出当前存在的机械兔
    const existingSummons = c.$$("my summons").filter(s =>
      allMechaSummons.some(summon => summon === s.definition.id));

    // 如果已有两个不同的机械兔，随机移除一个
    if (existingSummons.length >= 2) {
      const uniqueTypes = [...new Set(existingSummons.map(s => s.definition.id))];
      if (uniqueTypes.length >= 2 && !uniqueTypes.includes(197015)) {
        // 至少有两种不同类型且不包含当前要召唤的类型，随机移除
        const toRemove = c.random(existingSummons);
        c.dispose(`my summons with id ${toRemove.id}`);
      }
      else {
        c.dispose(`my summons with definition id 197015`);
      }
    }

    // 召唤风元素机械兔
    c.summon(AnemoMechaRabbit);

    // 附加逻辑覆写状态
    c.characterStatus(AnemoLogicOverwrite);

    // 所有可选形态ID（除了风元素）
    const allChoiceIds = [
      9701,
      9702,
      9703,
      9704,
      9706,
      9707
    ];

    // 随机选择3种元素（除了当前的风元素）
    const choiceIndices = c.randomSubset([0, 1, 2, 3, 4, 5], 3);

    // 创建选择卡牌列表
    const choiceCards = [];
    for (const index of choiceIndices) {
      const choice = allChoiceIds[index];
      switch (choice) {
        case 9701:
          choiceCards.push(CryoChoiceCard);
          break;
        case 9702:
          choiceCards.push(PyroChoiceCard);
          break;
        case 9703:
          choiceCards.push(ElectroChoiceCard);
          break;
        case 9704:
          choiceCards.push(HydroChoiceCard);
          break;
        case 9706:
          choiceCards.push(GeoChoiceCard);
          break;
        case 9707:
          choiceCards.push(DendroChoiceCard);
          break;
      }
    }
      // 使用selectAndPlay，立即执行选择的卡牌效果
      c.selectAndPlay(choiceCards);



  })
  .done();

/**
 * @id 97602
 * @name 绝对安全协议：岩
 * @description
 * 召唤追影械兔0019-|ζ>，然后从三种元素形态中随机选择一种切换（不包括当前形态）。
 */
export const GeoElementalSkill = skill(97602)
  .type("elemental")
  .costGeo(3)
  .associateExtension(SilverWolfExtension)
  .do((c) => {
    // 检查并控制召唤物数量，限制最多同时存在2种
    const allMechaSummons = [
      197011, 197012, 197013, 197014,
      197015, 197016, 197017
    ];

    // 找出当前存在的机械兔
    const existingSummons = c.$$("my summons").filter(s =>
      allMechaSummons.some(summon => summon === s.definition.id));

    // 如果已有两个不同的机械兔，随机移除一个
    if (existingSummons.length >= 2) {
      const uniqueTypes = [...new Set(existingSummons.map(s => s.definition.id))];
      if (uniqueTypes.length >= 2 && !uniqueTypes.includes(197016)) {
        // 至少有两种不同类型且不包含当前要召唤的类型，随机移除
        const toRemove = c.random(existingSummons);
        c.dispose(`my summons with id ${toRemove.id}`);
      }
      else {
        c.dispose(`my summons with definition id 197016`);
      }
    }

    // 召唤岩元素机械兔
    c.summon(GeoMechaRabbit);

    // 附加逻辑覆写状态
    c.characterStatus(GeoLogicOverwrite);

    // 所有可选形态ID（除了岩元素）
    const allChoiceIds = [
      9701,
      9702,
      9703,
      9704,
      9705,
      9707
    ];

    // 随机选择3种元素（除了当前的岩元素）
    const choiceIndices = c.randomSubset([0, 1, 2, 3, 4, 5], 3);

    // 创建选择卡牌列表
    const choiceCards = [];
    for (const index of choiceIndices) {
      const choice = allChoiceIds[index];
      switch (choice) {
        case 9701:
          choiceCards.push(CryoChoiceCard);
          break;
        case 9702:
          choiceCards.push(PyroChoiceCard);
          break;
        case 9703:
          choiceCards.push(ElectroChoiceCard);
          break;
        case 9704:
          choiceCards.push(HydroChoiceCard);
          break;
        case 9705:
          choiceCards.push(AnemoChoiceCard);
          break;
        case 9707:
          choiceCards.push(DendroChoiceCard);
          break;
      }
    }
      // 使用selectAndPlay，立即执行选择的卡牌效果
      c.selectAndPlay(choiceCards);



  })
  .done();

/**
 * @id 97702
 * @name 绝对安全协议：草
 * @description
 * 召唤追影械兔0019-|η>，然后从三种元素形态中随机选择一种切换（不包括当前形态）。
 */
export const DendroElementalSkill = skill(97702)
  .type("elemental")
  .costDendro(3)
  .associateExtension(SilverWolfExtension)
  .do((c) => {
    // 检查并控制召唤物数量，限制最多同时存在2种
    const allMechaSummons = [
      197011, 197012, 197013, 197014,
      197015, 197016, 197017
    ];

    // 找出当前存在的机械兔
    const existingSummons = c.$$("my summons").filter(s =>
      allMechaSummons.some(summon => summon === s.definition.id));

    // 如果已有两个不同的机械兔，随机移除一个
    if (existingSummons.length >= 2) {
      const uniqueTypes = [...new Set(existingSummons.map(s => s.definition.id))];
      if (uniqueTypes.length >= 2 && !uniqueTypes.includes(197017)) {
        // 至少有两种不同类型且不包含当前要召唤的类型，随机移除
        const toRemove = c.random(existingSummons);
        c.dispose(`my summons with id ${toRemove.id}`);
      }
      else {
        c.dispose(`my summons with definition id 197017`);
      }
    }


    // 召唤草元素机械兔
    c.summon(DendroMechaRabbit);
    // 附加逻辑覆写状态
    c.characterStatus(DendroLogicOverwrite);


    // 所有可选形态ID（除了草元素）
    const allChoiceIds = [
      9701,
      9702,
      9703,
      9704,
      9705,
      9706
    ];

    // 随机选择3种元素（除了当前的草元素）
    const choiceIndices = c.randomSubset([0, 1, 2, 3, 4, 5], 3);

    // 创建选择卡牌列表
    const choiceCards = [];
    for (const index of choiceIndices) {
      const choice = allChoiceIds[index];
      switch (choice) {
        case 9701:
          choiceCards.push(CryoChoiceCard);
          break;
        case 9702:
          choiceCards.push(PyroChoiceCard);
          break;
        case 9703:
          choiceCards.push(ElectroChoiceCard);
          break;
        case 9704:
          choiceCards.push(HydroChoiceCard);
          break;
        case 9705:
          choiceCards.push(AnemoChoiceCard);
          break;
        case 9706:
          choiceCards.push(GeoChoiceCard);
          break;
      }
    }
      // 使用selectAndPlay，立即执行选择的卡牌效果
      c.selectAndPlay(choiceCards);



  })
  .done();

// 元素选择卡片定义

/**
 * @id 297101
 * @name 冰元素选择
 * @description
 * 选择冰元素形态。
 */
export const CryoChoiceCard = card(297101)
  .unobtainable()
  .associateExtension(SilverWolfExtension)
  .do((c) => {
    const silverWolf = c.player.characters.find(char =>
      [SilverWolf, SilverWolfCryo, SilverWolfAnemo, SilverWolfDendro, SilverWolfElectro, SilverWolfGeo, SilverWolfPyro, SilverWolfHydro].includes(char.definition.id as CharacterHandle));


    if (silverWolf) {
      // 移除所有逻辑覆写状态 - 使用更安全的方式
      const statuses = c.$$(`status at with id ${silverWolf.id}`).filter(status =>
        [CryoLogicOverwrite, PyroLogicOverwrite, ElectroLogicOverwrite,
         HydroLogicOverwrite, AnemoLogicOverwrite, GeoLogicOverwrite,
         DendroLogicOverwrite].some(def => def === status.definition.id)
      );

      // 直接处理查询得到的状态对象
      for (const status of statuses) {
        c.dispose(status.state);
      }

      // 转换形态 - 最简单的方式
      c.transformDefinition(silverWolf, SilverWolfCryo);

      // 添加新的逻辑覆写状态
      c.characterStatus(CryoLogicOverwrite, silverWolf);

      // 以太编辑效果：每回合1次，元素转换后生成1个万能元素骰
      if (c.state.roundNumber !== c.getExtensionState().lastConvertRound[c.self.who]) {
        c.convertDice(DiceType.Omni, 1);

        // 记录本回合已使用
        c.setExtensionState((st) => {
          st.lastConvertRound[c.self.who] = c.state.roundNumber;
        });
      }
    }


  })
  .done();

/**
 * @id 297102
 * @name 火元素选择
 * @description
 * 选择火元素形态。
 */
export const PyroChoiceCard = card(297102)
  .unobtainable()
  .associateExtension(SilverWolfExtension)
  .do((c) => {
    const silverWolf = c.player.characters.find(char =>
      [SilverWolf, SilverWolfCryo, SilverWolfAnemo, SilverWolfDendro, SilverWolfElectro, SilverWolfGeo, SilverWolfPyro, SilverWolfHydro].includes(char.definition.id as CharacterHandle));


    if (silverWolf) {
      // 移除所有逻辑覆写状态 - 使用更安全的方式
      const statuses = c.$$(`status at with id ${silverWolf.id}`).filter(status =>
        [CryoLogicOverwrite, PyroLogicOverwrite, ElectroLogicOverwrite,
         HydroLogicOverwrite, AnemoLogicOverwrite, GeoLogicOverwrite,
         DendroLogicOverwrite].some(def => def === status.definition.id)
      );

      // 直接处理查询得到的状态对象
      for (const status of statuses) {
        c.dispose(status.state);
      }

      // 转换形态 - 传递角色对象而不是字符串引用
      c.transformDefinition(silverWolf, SilverWolfPyro);

      // 添加新的逻辑覆写状态
      c.characterStatus(PyroLogicOverwrite, silverWolf);

      // 以太编辑效果：每回合1次，元素转换后生成1个万能元素骰
      if (c.state.roundNumber !== c.getExtensionState().lastConvertRound[c.self.who]) {
        c.convertDice(DiceType.Omni, 1);

        // 记录本回合已使用
        c.setExtensionState((st) => {
          st.lastConvertRound[c.self.who] = c.state.roundNumber;
        });
      }
    }


  })
  .done();

/**
 * @id 297103
 * @name 雷元素选择
 * @description
 * 选择雷元素形态。
 */
export const ElectroChoiceCard = card(297103)
  .unobtainable()
  .associateExtension(SilverWolfExtension)
  .do((c) => {
    const silverWolf = c.player.characters.find(char =>
      [SilverWolf, SilverWolfCryo, SilverWolfAnemo, SilverWolfDendro, SilverWolfElectro, SilverWolfGeo, SilverWolfPyro, SilverWolfHydro].includes(char.definition.id as CharacterHandle));


    if (silverWolf) {
      // 移除所有逻辑覆写状态 - 使用更安全的方式
      const statuses = c.$$(`status at with id ${silverWolf.id}`).filter(status =>
        [CryoLogicOverwrite, PyroLogicOverwrite, ElectroLogicOverwrite,
         HydroLogicOverwrite, AnemoLogicOverwrite, GeoLogicOverwrite,
         DendroLogicOverwrite].some(def => def === status.definition.id)
      );

      // 直接处理查询得到的状态对象
      for (const status of statuses) {
        c.dispose(status.state);
      }

      // 转换形态 - 传递角色对象而不是字符串引用
      c.transformDefinition(silverWolf, SilverWolfElectro);

      // 添加新的逻辑覆写状态
      c.characterStatus(ElectroLogicOverwrite, silverWolf);

      // 以太编辑效果：每回合1次，元素转换后生成1个万能元素骰
      if (c.state.roundNumber !== c.getExtensionState().lastConvertRound[c.self.who]) {
        c.convertDice(DiceType.Omni, 1);

        // 记录本回合已使用
        c.setExtensionState((st) => {
          st.lastConvertRound[c.self.who] = c.state.roundNumber;
        });
      }
    }


  })
  .done();

/**
 * @id 297104
 * @name 水元素选择
 * @description
 * 选择水元素形态。
 */
export const HydroChoiceCard = card(297104)
  .unobtainable()
  .associateExtension(SilverWolfExtension)
  .do((c) => {
    const silverWolf = c.player.characters.find(char =>
      [SilverWolf, SilverWolfCryo, SilverWolfAnemo, SilverWolfDendro, SilverWolfElectro, SilverWolfGeo, SilverWolfPyro, SilverWolfHydro].includes(char.definition.id as CharacterHandle));


    if (silverWolf) {
      // 移除所有逻辑覆写状态 - 使用更安全的方式
      const statuses = c.$$(`status at with id ${silverWolf.id}`).filter(status =>
        [CryoLogicOverwrite, PyroLogicOverwrite, ElectroLogicOverwrite,
         HydroLogicOverwrite, AnemoLogicOverwrite, GeoLogicOverwrite,
         DendroLogicOverwrite].some(def => def === status.definition.id)
      );

      // 直接处理查询得到的状态对象
      for (const status of statuses) {
        c.dispose(status.state);
      }

      // 转换形态 - 传递角色对象而不是字符串引用
      c.transformDefinition(silverWolf, SilverWolfHydro);

      // 添加新的逻辑覆写状态
      c.characterStatus(HydroLogicOverwrite, silverWolf);

      // 以太编辑效果：每回合1次，元素转换后生成1个万能元素骰
      if (c.state.roundNumber !== c.getExtensionState().lastConvertRound[c.self.who]) {
        c.convertDice(DiceType.Omni, 1);

        // 记录本回合已使用
        c.setExtensionState((st) => {
          st.lastConvertRound[c.self.who] = c.state.roundNumber;
        });
      }
    }


  })
  .done();

/**
 * @id 297105
 * @name 风元素选择
 * @description
 * 选择风元素形态。
 */
export const AnemoChoiceCard = card(297105)
  .unobtainable()
  .associateExtension(SilverWolfExtension)
  .do((c) => {
    const silverWolf = c.player.characters.find(char =>
      [SilverWolf, SilverWolfCryo, SilverWolfAnemo, SilverWolfDendro, SilverWolfElectro, SilverWolfGeo, SilverWolfPyro, SilverWolfHydro].includes(char.definition.id as CharacterHandle));


    if (silverWolf) {
      // 移除所有逻辑覆写状态 - 使用更安全的方式
      const statuses = c.$$(`status at with id ${silverWolf.id}`).filter(status =>
        [CryoLogicOverwrite, PyroLogicOverwrite, ElectroLogicOverwrite,
         HydroLogicOverwrite, AnemoLogicOverwrite, GeoLogicOverwrite,
         DendroLogicOverwrite].some(def => def === status.definition.id)
      );

      // 直接处理查询得到的状态对象
      for (const status of statuses) {
        c.dispose(status.state);
      }

      // 转换形态 - 传递角色对象而不是字符串引用
      c.transformDefinition(silverWolf, SilverWolfAnemo);

      // 添加新的逻辑覆写状态
      c.characterStatus(AnemoLogicOverwrite, silverWolf);

      // 以太编辑效果：每回合1次，元素转换后生成1个万能元素骰
      if (c.state.roundNumber !== c.getExtensionState().lastConvertRound[c.self.who]) {
        c.convertDice(DiceType.Omni, 1);

        // 记录本回合已使用
        c.setExtensionState((st) => {
          st.lastConvertRound[c.self.who] = c.state.roundNumber;
        });
      }
    }


  })
  .done();

/**
 * @id 297106
 * @name 岩元素选择
 * @description
 * 选择岩元素形态。
 */
export const GeoChoiceCard = card(297106)
  .unobtainable()
  .associateExtension(SilverWolfExtension)
  .do((c) => {
    const silverWolf = c.player.characters.find(char =>
      [SilverWolf, SilverWolfCryo, SilverWolfAnemo, SilverWolfDendro, SilverWolfElectro, SilverWolfGeo, SilverWolfPyro, SilverWolfHydro].includes(char.definition.id as CharacterHandle));

    if (silverWolf) {
      // 移除所有逻辑覆写状态 - 使用更安全的方式
      const statuses = c.$$(`status at with id ${silverWolf.id}`).filter(status =>
        [CryoLogicOverwrite, PyroLogicOverwrite, ElectroLogicOverwrite,
         HydroLogicOverwrite, AnemoLogicOverwrite, GeoLogicOverwrite,
         DendroLogicOverwrite].some(def => def === status.definition.id)
      );

      // 直接处理查询得到的状态对象
      for (const status of statuses) {
        c.dispose(status.state);
      }
      // 转换形态 - 传递角色对象而不是字符串引用
      c.transformDefinition(silverWolf, SilverWolfGeo);

      // 添加新的逻辑覆写状态
      c.characterStatus(GeoLogicOverwrite, silverWolf);

      // 以太编辑效果：每回合1次，元素转换后生成1个万能元素骰
      if (c.state.roundNumber !== c.getExtensionState().lastConvertRound[c.self.who]) {
        c.convertDice(DiceType.Omni, 1);

        // 记录本回合已使用
        c.setExtensionState((st) => {
          st.lastConvertRound[c.self.who] = c.state.roundNumber;
        });
      }
    }


  })
  .done();

/**
 * @id 297107
 * @name 草元素选择
 * @description
 * 选择草元素形态。
 */
export const DendroChoiceCard = card(297107)
  .unobtainable()
  .associateExtension(SilverWolfExtension)
  .do((c) => {
    const silverWolf = c.player.characters.find(char =>
      [SilverWolf, SilverWolfCryo, SilverWolfAnemo, SilverWolfDendro, SilverWolfElectro, SilverWolfGeo, SilverWolfPyro, SilverWolfHydro].includes(char.definition.id as CharacterHandle));


    if (silverWolf) {
      // 移除所有逻辑覆写状态 - 使用更安全的方式
      const statuses = c.$$(`status at with id ${silverWolf.id}`).filter(status =>
        [CryoLogicOverwrite, PyroLogicOverwrite, ElectroLogicOverwrite,
         HydroLogicOverwrite, AnemoLogicOverwrite, GeoLogicOverwrite,
         DendroLogicOverwrite].some(def => def === status.definition.id)
      );

      // 直接处理查询得到的状态对象
      for (const status of statuses) {
        c.dispose(status.state);
      }

      // 转换形态 - 传递角色对象而不是字符串引用
      c.transformDefinition(silverWolf, SilverWolfDendro);

      // 添加新的逻辑覆写状态
      c.characterStatus(DendroLogicOverwrite, silverWolf);

      // 以太编辑效果：每回合1次，元素转换后生成1个万能元素骰
      if (c.state.roundNumber !== c.getExtensionState().lastConvertRound[c.self.who]) {
        c.convertDice(DiceType.Omni, 1);

        // 记录本回合已使用
        c.setExtensionState((st) => {
          st.lastConvertRound[c.self.who] = c.state.roundNumber;
        });
      }
    }


  })
  .done();

/**
 * @id 9700
 * @name 银狼
 * @description
 * 来自崩坏：星穹铁道的角色，黑客大师，能够操控各种元素。传闻猫尾酒馆某届挑战赛中一路连胜直抵冠军的神秘牌手，拒绝了所有奖金，只带走了一套纪念卡牌。

 */
export const SilverWolf = character(9700)
  .tags("cryo", "sword")
  .health(10)
  .energy(2)
  .skills(NormalAttack, ElementalSkill, ElementalBurst, EtherEditPassive)
  .done();

/**
 * @id 9701
 * @name 银狼·冰
 * @description
 * 黑客大师银狼，选择了冰元素形态。
 */
export const SilverWolfCryo = character(9701)
  .tags("cryo", "sword")
  .health(10)
  .energy(2)
  .skills(CryoNormalAttack, CryoElementalSkill, CryoElementalBurst, EtherEditPassive)
  .done();

/**
 * @id 9702
 * @name 银狼·火
 * @description
 * 黑客大师银狼，选择了火元素形态。
 */
export const SilverWolfPyro = character(9702)
  .tags("pyro", "sword")
  .health(10)
  .energy(2)
  .skills(PyroNormalAttack, PyroElementalSkill, PyroElementalBurst, EtherEditPassive)
  .done();

/**
 * @id 9703
 * @name 银狼·雷
 * @description
 * 黑客大师银狼，选择了雷元素形态。
 */
export const SilverWolfElectro = character(9703)
  .tags("electro", "sword")
  .health(10)
  .energy(2)
  .skills(ElectroNormalAttack, ElectroElementalSkill, ElectroElementalBurst, EtherEditPassive)
  .done();

/**
 * @id 9704
 * @name 银狼·水
 * @description
 * 黑客大师银狼，选择了水元素形态。
 */
export const SilverWolfHydro = character(9704)
  .tags("hydro", "sword")
  .health(10)
  .energy(2)
  .skills(HydroNormalAttack, HydroElementalSkill, HydroElementalBurst, EtherEditPassive)
  .done();

/**
 * @id 9705
 * @name 银狼·风
 * @description
 * 黑客大师银狼，选择了风元素形态。
 */
export const SilverWolfAnemo = character(9705)
  .tags("anemo", "sword")
  .health(10)
  .energy(2)
  .skills(AnemoNormalAttack, AnemoElementalSkill, AnemoElementalBurst, EtherEditPassive)
  .done();

/**
 * @id 9706
 * @name 银狼·岩
 * @description
 * 黑客大师银狼，选择了岩元素形态。
 */
export const SilverWolfGeo = character(9706)
  .tags("geo", "sword")
  .health(10)
  .energy(2)
  .skills(GeoNormalAttack, GeoElementalSkill, GeoElementalBurst, EtherEditPassive)
  .done();

/**
 * @id 9707
 * @name 银狼·草
 * @description
 * 黑客大师银狼，选择了草元素形态。
 */
export const SilverWolfDendro = character(9707)
  .tags("dendro", "sword")
  .health(10)
  .energy(2)
  .skills(DendroNormalAttack, DendroElementalSkill, DendroElementalBurst, EtherEditPassive)
  .done();

/**
 * @id 297020
 * @name 限制解除
 * @description
 * 战斗行动：我方出战角色为银狼时，装备此牌。
 * 装备有此牌的银狼使用普通攻击时，目标角色附属"侵入"，然后随机触发我方1个追影械兔0019的结束阶段效果。
 * （牌组中包含银狼，才能加入牌组）
 */
export const Unshackled = card(297020)
  .costSame(1)
  .talent([SilverWolf, SilverWolfCryo, SilverWolfAnemo, SilverWolfDendro, SilverWolfElectro, SilverWolfGeo, SilverWolfPyro, SilverWolfHydro],"none")
  .on("useSkill", (c, e) => {
    // 检查是否是银狼的普通攻击
    return [9700, 9701, 9702, 9703, 9704, 9705, 9706, 9707].includes(e.skill.caller.definition.id) &&
      e.isSkillType("normal");
  })
  .characterStatus(Intrusion, "opp active")
  .do((c) => {
    // 随机触发追影械兔的结束阶段效果
    const summons = c.$$("my summons").filter(s =>
      [197011, 197012, 197013, 197014,
       197015, 197016, 197017].includes(s.definition.id));

    if (summons.length > 0) {
      const targetSummon = c.random(summons);
      c.triggerEndPhaseSkill(targetSummon.state);
    }
  })
  .done();