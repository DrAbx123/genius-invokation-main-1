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

// Store custom image mappings
// Key: Card ID (number) or CardFace string
// Value: URL or Blob of the custom image
const customImages = new Map<number | string, string | Blob>();

/**
 * 确保URL是有效的图片路径
 * @param url 图片URL字符串
 * @returns 格式化后的URL
 */
function normalizeImageUrl(url: string): string {
  // 如果已经是绝对URL，直接返回
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  
  // 如果是相对路径，添加baseUrl
  // 注意：在浏览器环境中，window.location可用
  try {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    // 确保路径格式正确（避免双斜杠等问题）
    if (url.startsWith('/')) {
      return `${baseUrl}${url}`;
    } else {
      return `${baseUrl}/${url}`;
    }
  } catch (e) {
    console.error('无法获取baseUrl，使用原始URL', e);
    return url;
  }
}

/**
 * Register a custom image for a card by ID
 * @param id The card ID
 * @param imageData URL string or Blob of the custom image
 */
export function registerCustomImageById(id: number, imageData: string | Blob): void {
  console.log(`[Custom Images] 注册ID: ${id}`);
  
  // 如果是URL，标准化处理
  if (typeof imageData === 'string') {
    imageData = normalizeImageUrl(imageData);
  }
  
  customImages.set(id, imageData);
}

/**
 * Register a custom image for a card by cardFace
 * @param cardFace The cardFace identifier (e.g., "UI_Gcg_CardFace_Character_SomeCustomCard")
 * @param imageData URL string or Blob of the custom image
 */
export function registerCustomImageByCardFace(cardFace: string, imageData: string | Blob): void {
  console.log(`[Custom Images] 注册CardFace: ${cardFace}`);
  
  // 如果是URL，标准化处理
  if (typeof imageData === 'string') {
    imageData = normalizeImageUrl(imageData);
  }
  
  customImages.set(cardFace, imageData);
}

/**
 * Get a custom image URL by card ID
 * @param id The card ID
 * @returns Data URL of the custom image, or null if no custom image is registered
 */
export async function getCustomImageUrlById(id: number): Promise<string | null> {
  const customImage = customImages.get(id);
  console.log(`[Custom Images] 查询ID: ${id}`, customImage ? "找到自定义图片" : "未找到自定义图片");
  
  if (!customImage) return null;

  if (typeof customImage === 'string') {
    // 确保URL是规范的
    return normalizeImageUrl(customImage);
  } else {
    return blobToDataUrl(customImage);
  }
}

/**
 * Get a custom image URL by cardFace
 * @param cardFace The cardFace identifier
 * @returns Data URL of the custom image, or null if no custom image is registered
 */
export async function getCustomImageUrlByCardFace(cardFace: string): Promise<string | null> {
  const customImage = customImages.get(cardFace);
  console.log(`[Custom Images] 查询CardFace: ${cardFace}`, customImage ? "找到自定义图片" : "未找到自定义图片");
  
  if (!customImage) return null;

  if (typeof customImage === 'string') {
    // 确保URL是规范的
    return normalizeImageUrl(customImage);
  } else {
    return blobToDataUrl(customImage);
  }
}

/**
 * Clear all registered custom images
 */
export function clearCustomImages(): void {
  console.log(`[Custom Images] 清空所有自定义图片`);
  customImages.clear();
}

/**
 * Batch register multiple custom images
 * @param images Object mapping card IDs or cardFaces to image data
 */
export function registerMultipleCustomImages(
  images: Record<string | number, string | Blob>
): void {
  console.log(`[Custom Images] 批量注册 ${Object.keys(images).length} 个自定义图片`);
  for (const [key, value] of Object.entries(images)) {
    const numKey = Number(key);
    if (!isNaN(numKey)) {
      registerCustomImageById(numKey, value);
    } else {
      registerCustomImageByCardFace(key, value);
    }
  }
}

// 导出当前映射以供调试
export function _getCustomImagesMap(): Map<number | string, string | Blob> {
  return customImages;
}