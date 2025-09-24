/**
 * @description 性格影响
 */
export const characterEffects: { [key: string]: { [key: string]: string } } = {
  attack: { defense: '孤僻', speed: '勇敢', special_attack: '固执', special_defense: '调皮' },
  defense: { attack: '大胆', speed: '悠闲', special_attack: '淘气', special_defense: '无虑' },
  special_attack: { attack: '保守', defense: '稳重', speed: '冷静', special_defense: '马虎' },
  special_defense: { attack: '沉着', defense: '温顺', speed: '狂妄', special_attack: '慎重' },
  speed: { attack: '胆小', defense: '急躁', special_attack: '开朗', special_defense: '天真' },
};

/**
 * @description 平衡性格
 */
export const balancedCharacters = ['浮躁', '认真', '害羞', '实干', '坦率'];
