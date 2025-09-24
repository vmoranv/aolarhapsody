/**
 * @file 为实验性的 View Transitions API 提供 TypeScript 类型声明。
 * @description 这个文件通过模块扩展（augmentation）的方式，为全局的 `Document` 和 `CSSStyleDeclaration`
 * 接口添加了 View Transitions API 相关的属性和方法。这使得在 TypeScript 项目中
 * 可以安全地使用这个新的 Web API，并获得完整的类型检查和智能提示支持。
 * @see https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API
 */

/**
 * @interface ViewTransition
 * @description 表示一次视图过渡的对象。
 */
interface ViewTransition {
  /**
   * @property {Promise<void>} finished - 一个在过渡动画结束时兑现的 Promise。
   */
  finished: Promise<void>;

  /**
   * @property {Promise<void>} ready - 一个在伪元素创建完成且旧视图状态的截图就绪时兑现的 Promise。
   */
  ready: Promise<void>;

  /**
   * @property {Promise<void>} updateCallbackDone - 一个在 `startViewTransition` 的回调函数执行完毕后兑现的 Promise。
   */
  updateCallbackDone: Promise<void>;

  /**
   * @method skipTransition
   * @description 跳过过渡动画，直接跳转到最终状态。
   */
  skipTransition(): void;
}

/**
 * @interface Document
 * @description 扩展了全局的 `Document` 接口，以包含 `startViewTransition` 方法。
 */
interface Document {
  /**
   * @method startViewTransition
   * @description 启动一个新的视图过渡。
   * @param {() => void | Promise<void>} [updateCallback] - 一个回调函数，用于执行会引起 DOM 变化的操作。
   * @returns {ViewTransition} 返回一个 `ViewTransition` 对象，用于控制和监听过渡状态。
   */
  startViewTransition?(updateCallback?: () => void | Promise<void>): ViewTransition;
}

/**
 * @interface CSSStyleDeclaration
 * @description 扩展了全局的 `CSSStyleDeclaration` 接口，以包含 `viewTransitionName` CSS 属性。
 */
interface CSSStyleDeclaration {
  /**
   * @property {string} [viewTransitionName] - 用于给参与视图过渡的元素指定一个唯一的名称。
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/view-transition-name
   */
  viewTransitionName?: string;
}
