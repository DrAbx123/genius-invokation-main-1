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

import { blobToDataUrl } from "./data_url";

// 存储自定义卡牌图像映射
// 键: 卡牌ID(number)或cardFace字符串(string) 
// 值: URL字符串或Blob对象
const customImages = new Map<number | string, string | Blob>();

/**
 * 规范化URL路径
 * @param url 图片URL路径
 * @returns 规范化后的URL
 */
function normalizeUrl(url: string): string {
  // 如果已经是绝对URL或数据URL，直接返回
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  
  // 确保路径以斜杠开头
  if (!url.startsWith('/')) {
    url = '/' + url;
  }
  
  // 在浏览器环境中，添加origin
  try {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return baseUrl + url;
  } catch (e) {
    return url;
  }
}

/**
 * 根据ID注册自定义卡牌图像
 * @param id 卡牌ID
 * @param imageUrl 图片URL或Blob对象
 */
export function registerCustomImage(id: number, imageUrl: string | Blob): void {
  if (typeof imageUrl === 'string') {
    imageUrl = normalizeUrl(imageUrl);
  }
  customImages.set(id, imageUrl);
}

/**
 * 根据cardFace注册自定义卡牌图像
 * @param cardFace 卡牌face标识符
 * @param imageUrl 图片URL或Blob对象
 */
export function registerCustomImageByFace(cardFace: string, imageUrl: string | Blob): void {
  if (typeof imageUrl === 'string') {
    imageUrl = normalizeUrl(imageUrl);
  }
  customImages.set(cardFace, imageUrl);
}

/**
 * 批量注册自定义卡牌图像
 * @param images 卡牌ID/cardFace到图片URL的映射
 */
export function registerMultipleCustomImages(images: Record<string | number, string | Blob>): void {
  for (const [key, value] of Object.entries(images)) {
    const numKey = Number(key);
    if (!isNaN(numKey)) {
      registerCustomImage(numKey, value);
    } else {
      registerCustomImageByFace(key, value);
    }
  }
}

/**
 * 根据ID获取自定义卡牌图像URL
 * @param id 卡牌ID
 * @returns 图片URL字符串，如果没有找到返回null
 */
export async function getCustomImageUrl(id: number): Promise<string | null> {
  const image = customImages.get(id);
  if (!image) return null;
  
  if (typeof image === 'string') {
    return image;
  } else {
    return await blobToDataUrl(image);
  }
}

/**
 * 根据cardFace获取自定义卡牌图像URL
 * @param cardFace 卡牌face标识符
 * @returns 图片URL字符串，如果没有找到返回null
 */
export async function getCustomImageUrlByFace(cardFace: string): Promise<string | null> {
  const image = customImages.get(cardFace);
  if (!image) return null;
  
  if (typeof image === 'string') {
    return image;
  } else {
    return await blobToDataUrl(image);
  }
}

/**
 * 清除所有自定义卡牌图像
 */
export function clearCustomImages(): void {
  customImages.clear();
}

/**
 * 检查是否有指定ID的自定义卡牌图像
 * @param id 卡牌ID
 * @returns 是否存在对应的自定义图像
 */
export function hasCustomImage(id: number): boolean {
  return customImages.has(id);
}

/**
 * 检查是否有指定cardFace的自定义卡牌图像
 * @param cardFace 卡牌face标识符
 * @returns 是否存在对应的自定义图像
 */
export function hasCustomImageByFace(cardFace: string): boolean {
  return customImages.has(cardFace);
} 