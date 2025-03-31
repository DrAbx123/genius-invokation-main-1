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

// 自定义卡牌模块
import {
  registerCustomImage,
  registerMultipleCustomImages,
  hasCustomImage,
  getCustomImageUrl
} from "@gi-tcg/assets-manager";

/**
 * 注册自定义卡牌图像
 * 这个函数将在应用启动时被调用，用于注册所有自定义卡牌图像
 */
export function registerCustomCardImages() {
  console.log("正在注册自定义卡牌图像...");

  // 批量注册自定义图像
  registerMultipleCustomImages({
    // 角色卡
    9700: "/custom-cards/UI_Gcg_CardFace_Char_Avatar_Silverwolf.png",
    9701: "/custom-cards/UI_Gcg_CardFace_Char_Avatar_Silverwolf.png",
    9702: "/custom-cards/UI_Gcg_CardFace_Char_Avatar_Silverwolf.png",
    9703: "/custom-cards/UI_Gcg_CardFace_Char_Avatar_Silverwolf.png",
    9704: "/custom-cards/UI_Gcg_CardFace_Char_Avatar_Silverwolf.png",
    9705: "/custom-cards/UI_Gcg_CardFace_Char_Avatar_Silverwolf.png",
    9706: "/custom-cards/UI_Gcg_CardFace_Char_Avatar_Silverwolf.png",
    9707: "/custom-cards/UI_Gcg_CardFace_Char_Avatar_Silverwolf.png",

    // 普攻
    97001: "/custom-cards/Skill_A_01.png",
    97101: "/custom-cards/Skill_A_01.png",
    97201: "/custom-cards/Skill_A_01.png",
    97301: "/custom-cards/Skill_A_01.png",
    97401: "/custom-cards/Skill_A_01.png",
    97501: "/custom-cards/Skill_A_01.png",
    97601: "/custom-cards/Skill_A_01.png",
    97701: "/custom-cards/Skill_A_01.png",

    // 战技
    97002: "/custom-cards/Skill_S_Silverwolf_01.png",
    97102: "/custom-cards/Skill_S_Silverwolf_01.png",
    97202: "/custom-cards/Skill_S_Silverwolf_01.png",
    97302: "/custom-cards/Skill_S_Silverwolf_01.png",
    97402: "/custom-cards/Skill_S_Silverwolf_01.png",
    97502: "/custom-cards/Skill_S_Silverwolf_01.png",
    97602: "/custom-cards/Skill_S_Silverwolf_01.png",
    97702: "/custom-cards/Skill_S_Silverwolf_01.png",

    // 爆发
    97003: "/custom-cards/Skill_E_Silverwolf_01.png",
    97103: "/custom-cards/Skill_E_Silverwolf_01.png",
    97203: "/custom-cards/Skill_E_Silverwolf_01.png",
    97303: "/custom-cards/Skill_E_Silverwolf_01.png",
    97403: "/custom-cards/Skill_E_Silverwolf_01.png",
    97503: "/custom-cards/Skill_E_Silverwolf_01.png",
    97603: "/custom-cards/Skill_E_Silverwolf_01.png",
    97703: "/custom-cards/Skill_E_Silverwolf_01.png",

    // 召唤物
    197011: "/custom-cards/UI_Gcg_History_Summon_Silverwolf_Ice_S.png",
    197012: "/custom-cards/UI_Gcg_History_Summon_Silverwolf_Fire_S.png",
    197013: "/custom-cards/UI_Gcg_History_Summon_Silverwolf_Electric_S.png",
    197014: "/custom-cards/UI_Gcg_History_Summon_Silverwolf_Water_S.png",
    197015: "/custom-cards/UI_Gcg_History_Summon_Silverwolf_Wind_S.png",
    197016: "/custom-cards/UI_Gcg_History_Summon_Silverwolf_Rock_S.png",
    197017: "/custom-cards/UI_Gcg_History_Summon_Silverwolf_Grass_S.png",

    97040: "/custom-cards/Skill_E_Silverwolf_03.png",
    97030: "/custom-cards/UI_Gcg_Buff_Silverwolf_P.png",

    // 特技
    297010: "/custom-cards/UI_Gcg_CardFace_Summon_Silverwolf_Vehicle.png",
    2970101: "/custom-cards/Skill_S_Silverwolf_02.png",

    // debuff
    97020: "/custom-cards/UI_Gcg_Buff_Silverwolf_E.png",

    // 天赋
    297020: "/custom-cards/UI_Gcg_CardFace_Modify_Talent_Silverwolf.png",

    // 附魔
    97104: "/custom-cards/UI_Gcg_Buff_Element_Enchant_Ice.png",
    97204: "/custom-cards/UI_Gcg_Buff_Element_Enchant_Fire.png",
    97304: "/custom-cards/UI_Gcg_Buff_Element_Enchant_Elec.png",
    97404: "/custom-cards/UI_Gcg_Buff_Element_Enchant_Water.png",
    97504: "/custom-cards/UI_Gcg_Buff_Element_Enchant_Wind.png",
    97604: "/custom-cards/UI_Gcg_Buff_Element_Enchant_Rock.png",
    97704: "/custom-cards/UI_Gcg_Buff_Element_Enchant_Grass.png",

    // 转换元素
    297101: "/custom-cards/UI_Gcg_CardFace_Summon_Silverwolf_Find_Ice.png",
    297102: "/custom-cards/UI_Gcg_CardFace_Summon_Silverwolf_Find_Fire.png",
    297103: "/custom-cards/UI_Gcg_CardFace_Summon_Silverwolf_Find_Electric.png",
    297104: "/custom-cards/UI_Gcg_CardFace_Summon_Silverwolf_Find_Water.png",
    297105: "/custom-cards/UI_Gcg_CardFace_Summon_Silverwolf_Find_Wind.png",
    297106: "/custom-cards/UI_Gcg_CardFace_Summon_Silverwolf_Find_Rock.png",
    297107: "/custom-cards/UI_Gcg_CardFace_Summon_Silverwolf_Find_Grass.png"
  });
}

/**
 * 用户可以在此自定义更多的注册逻辑
 * 例如：
 * - 动态加载自定义卡牌配置
 * - 添加UI界面以管理自定义卡牌
 * - 实现更复杂的卡牌替换逻辑
 */