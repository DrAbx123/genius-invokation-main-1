// Copyright (C) 2025 Guyutongxue
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

import { DEFAULT_ASSET_API_ENDPOINT } from "@gi-tcg/config";
import type {
  ActionCardRawData,
  CharacterRawData,
  EntityRawData,
  KeywordRawData,
  SkillRawData,
} from "@gi-tcg/static-data";
import { blobToDataUrl } from "./data_url";
import { KEYWORD_ID_OFFSET } from "./names";
import { getCustomImageUrlById, getCustomImageUrlByCardFace, _getCustomImagesMap } from "./custom_images";

export type AnyData =
  | ActionCardRawData
  | CharacterRawData
  | EntityRawData
  | KeywordRawData
  | SkillRawData;

export interface CommonOptions {
  assetsApiEndpoint?: string;
}

export interface GetDataOptions extends CommonOptions {}

const cache = new Map<string, Promise<any>>();

export async function getData(
  id: number,
  options: GetDataOptions = {},
): Promise<AnyData> {
  if (id >= KEYWORD_ID_OFFSET) {
    return getKeyword(id - KEYWORD_ID_OFFSET, options);
  }
  const url = `${
    options.assetsApiEndpoint ?? DEFAULT_ASSET_API_ENDPOINT
  }/data/${id}`;
  if (cache.has(url)) {
    return cache.get(url);
  }
  const promise = fetch(url).then((r) => r.json());
  cache.set(url, promise);
  return promise;
}

export async function getKeyword(
  id: number,
  options: GetDataOptions = {},
): Promise<AnyData> {
  const url = `${
    options.assetsApiEndpoint ?? DEFAULT_ASSET_API_ENDPOINT
  }/data/K${id}`;
  if (cache.has(url)) {
    return cache.get(url);
  }
  const promise = fetch(url).then((r) => r.json());
  cache.set(url, promise);
  return promise;
}

export interface GetImageOptions extends CommonOptions {
  thumbnail?: boolean;
}

export async function getImage(
  id: number,
  options: GetImageOptions = {},
): Promise<Blob> {
  console.log(`[getImage] 获取ID为 ${id} 的图片`);
  
  // 输出当前所有自定义图片的键
  const customImages = _getCustomImagesMap();
  const keys = Array.from(customImages.keys());
  console.log(`[getImage] 当前自定义图片键: ${keys.join(', ')}`);
  
  // Check for custom image first
  const customImageUrl = await getCustomImageUrlById(id);
  if (customImageUrl) {
    console.log(`[getImage] 找到自定义图片URL: ${customImageUrl.substring(0, 50)}...`);
    // Convert custom image URL back to blob if it's a data URL
    if (customImageUrl.startsWith('data:')) {
      const response = await fetch(customImageUrl);
      return await response.blob();
    } else {
      // Fetch from URL
      try {
        const response = await fetch(customImageUrl);
        if (!response.ok) {
          console.error(`[getImage] 获取自定义图片失败:`, response.status, response.statusText);
          throw new Error(`Failed to fetch custom image: ${response.status} ${response.statusText}`);
        }
        return await response.blob();
      } catch (error) {
        console.error(`[getImage] 获取自定义图片出错:`, error);
        throw error;
      }
    }
  }

  const url = `${
    options.assetsApiEndpoint ?? DEFAULT_ASSET_API_ENDPOINT
  }/images/${id}${options.thumbnail ? "?thumb=1" : ""}`;
  console.log(`[getImage] 使用默认图片URL: ${url}`);
  
  if (cache.has(url)) {
    console.log(`[getImage] 从缓存获取图片`);
    return cache.get(url);
  }
  
  console.log(`[getImage] 从网络获取图片`);
  const promise = fetch(url)
    .then((r) => {
      if (!r.ok) {
        console.error(`[getImage] 获取默认图片失败:`, r.status, r.statusText);
        throw new Error(`Failed to fetch image: ${r.status} ${r.statusText}`);
      }
      return r.blob();
    })
    .catch(error => {
      console.error(`[getImage] 获取默认图片出错:`, error);
      throw error;
    });
    
  cache.set(url, promise);
  return promise;
}

export async function getImageUrl(
  id: number,
  options: GetImageOptions = {},
): Promise<string> {
  console.log(`[getImageUrl] 获取ID为 ${id} 的图片URL`);
  
  // Check for custom image first
  const customImageUrl = await getCustomImageUrlById(id);
  if (customImageUrl) {
    console.log(`[getImageUrl] 返回自定义图片URL: ${customImageUrl.substring(0, 50)}...`);
    return customImageUrl;
  }

  console.log(`[getImageUrl] 无自定义图片，获取默认图片`);
  try {
    const blob = await getImage(id, options);
    const dataUrl = await blobToDataUrl(blob);
    console.log(`[getImageUrl] 返回默认图片的DataURL`);
    return dataUrl;
  } catch (error) {
    console.error(`[getImageUrl] 获取图片出错:`, error);
    // 返回一个空白或默认图片的data URL
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  }
}

// 新增函数: 从cardFace字符串获取图片URL
export async function getImageUrlFromCardFace(
  cardFace: string,
  options: GetImageOptions = {},
): Promise<string> {
  // Check for custom image first
  const customImageUrl = await getCustomImageUrlByCardFace(cardFace);
  if (customImageUrl) {
    return customImageUrl;
  }

  const assetsApiEndpoint = options.assetsApiEndpoint ?? DEFAULT_ASSET_API_ENDPOINT;

  // 构造相对路径，比如将 UI_Gcg_CardFace_Character_SilverWolf_Element 转换为 characters/SilverWolf_Element.png
  let imagePath = "";
  if (cardFace.includes("CardFace_Character")) {
    imagePath = `characters/${cardFace.replace("UI_Gcg_CardFace_Character_", "")}.png`;
  } else if (cardFace.includes("CardFace_Summon")) {
    imagePath = `summons/${cardFace.replace("UI_Gcg_CardFace_Summon_", "")}.png`;
  } else if (cardFace.includes("CardFace_Modify")) {
    imagePath = `equipment/${cardFace.replace("UI_Gcg_CardFace_Modify_", "")}.png`;
  } else if (cardFace.includes("CardFace_Assist")) {
    imagePath = `support/${cardFace.replace("UI_Gcg_CardFace_Assist_", "")}.png`;
  } else if (cardFace.includes("Buff_")) {
    imagePath = `states/${cardFace.replace("UI_Gcg_Buff_", "")}.png`;
  } else {
    imagePath = `other/${cardFace}.png`;
  }

  // 构造完整URL
  const url = `${assetsApiEndpoint}/${imagePath}`;

  if (cache.has(url)) {
    return cache.get(url);
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    const blob = await response.blob();
    const dataUrl = blobToDataUrl(blob);
    cache.set(url, Promise.resolve(dataUrl));
    return dataUrl;
  } catch (error) {
    console.error(`Error loading image from cardFace ${cardFace}:`, error);
    // 返回一个空白或默认图片的data URL
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  }
}
