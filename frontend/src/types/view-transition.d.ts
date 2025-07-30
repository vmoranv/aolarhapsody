// View Transition API 类型声明
interface ViewTransition {
  finished: Promise<void>;
  ready: Promise<void>;
  updateCallbackDone: Promise<void>;
  skipTransition(): void;
}

interface Document {
  startViewTransition?(updateCallback?: () => void | Promise<void>): ViewTransition;
}

interface CSSStyleDeclaration {
  viewTransitionName?: string;
}
