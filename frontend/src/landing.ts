// 全局变量声明 - 声明将在后续代码中使用的第三方库
declare const gsap: any;
declare const ScrollTrigger: any;
declare const Swiper: any;

// DOM 元素引用 - 获取页面中的关键DOM元素
const themeToggleButton = document.getElementById('theme-toggle');
const { body } = document;
const navbar = document.querySelector('.navbar');
const cursorGlow = document.querySelector('.cursor-glow') as HTMLElement;

/**
 * 应用主题函数
 * 根据传入的主题参数切换页面的整体视觉主题
 * @param theme - 要应用的主题，'light-theme' 或 'dark-theme'
 */
const applyTheme = (theme: 'light-theme' | 'dark-theme') => {
  body.classList.remove('light-theme', 'dark-theme');
  body.classList.add(theme);
  localStorage.setItem('theme', theme);
};

/**
 * 主题切换事件处理函数
 * 处理用户点击主题切换按钮的事件，实现平滑的主题切换动画
 */
themeToggleButton?.addEventListener('click', (event: MouseEvent) => {
  const isDark = body.classList.contains('dark-theme');
  const newTheme = isDark ? 'light-theme' : 'dark-theme';

  // 如果浏览器不支持View Transition API，则直接切换主题
  if (!document.startViewTransition) {
    applyTheme(newTheme);
    return;
  }

  // 计算点击位置到视口边缘的最大距离，用于创建圆形展开动画
  const x = event.clientX;
  const y = event.clientY;
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  // 根据当前主题设置动画方向
  if (isDark) {
    document.documentElement.classList.add('reveal-old-view');
  }

  // 启动视图过渡动画
  const transition = document.startViewTransition(() => {
    applyTheme(newTheme);
  });

  // 配置动画参数
  transition.ready.then(() => {
    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];
    document.documentElement.animate(
      {
        clipPath: isDark ? [...clipPath].reverse() : clipPath,
      },
      {
        duration: 350,
        easing: 'ease-in-out',
        pseudoElement: isDark ? '::view-transition-old(root)' : '::view-transition-new(root)',
      }
    );
  });

  // 动画结束后的清理工作
  transition.finished.then(() => {
    document.documentElement.classList.remove('reveal-old-view');
  });
});

// 光标位置跟踪变量
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

/**
 * 鼠标移动事件监听器
 * 跟踪鼠标在页面中的实时位置
 */
document.addEventListener('mousemove', (e: MouseEvent) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

/**
 * 光标动画函数
 * 创建一个跟随鼠标移动的发光光晕效果
 */
function animateCursor() {
  // 计算光标当前位置与目标位置的差值
  const dx = mouseX - cursorX;
  const dy = mouseY - cursorY;

  // 使用缓动函数使光标移动更加平滑
  cursorX += dx * 0.1;
  cursorY += dy * 0.1;

  // 更新光标光晕的位置
  if (cursorGlow) {
    cursorGlow.style.left = cursorX + 'px';
    cursorGlow.style.top = cursorY + 'px';
  }

  // 持续执行动画循环
  requestAnimationFrame(animateCursor);
}

// 启动光标动画
animateCursor();

/**
 * 粒子动画系统类
 * 负责创建和管理页面中的动态粒子效果
 */
class ParticleSystem {
  // 粒子数组，存储所有粒子的状态信息
  private particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
  }> = [];

  /**
   * 构造函数
   * 初始化粒子系统并启动动画循环
   */
  constructor() {
    this.init();
    this.animate();
  }

  /**
   * 初始化粒子系统
   * 创建粒子元素并设置初始状态
   */
  private init() {
    const container = document.querySelector('.hero-particles') as HTMLElement;
    if (!container) {
      return;
    }

    // 创建指定数量的粒子
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      container.appendChild(particle);

      // 为每个粒子设置随机的初始状态
      this.particles.push({
        x: Math.random() * container.offsetWidth,
        y: Math.random() * container.offsetHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
  }

  /**
   * 粒子动画循环
   * 持续更新粒子位置并处理边界碰撞
   */
  private animate() {
    const container = document.querySelector('.hero-particles') as HTMLElement;
    if (!container) {
      return;
    }

    // 获取所有粒子DOM元素
    const particleElements = container.querySelectorAll('.particle');

    // 更新每个粒子的状态
    this.particles.forEach((particle, index) => {
      // 更新粒子位置
      particle.x += particle.vx;
      particle.y += particle.vy;

      // 处理边界碰撞，实现反弹效果
      if (particle.x < 0 || particle.x > container.offsetWidth) {
        particle.vx *= -1;
      }
      if (particle.y < 0 || particle.y > container.offsetHeight) {
        particle.vy *= -1;
      }

      // 更新粒子DOM元素的样式
      const element = particleElements[index] as HTMLElement;
      if (element) {
        element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
        element.style.width = `${particle.size}px`;
        element.style.height = `${particle.size}px`;
        element.style.opacity = `${particle.opacity}`;
      }
    });

    // 继续下一帧动画
    requestAnimationFrame(() => this.animate());
  }
}

/**
 * 数字滚动动画函数
 * 创建一个从0到目标值的数字滚动动画效果
 * @param element - 要显示数字的DOM元素
 * @param target - 目标数字值
 * @param duration - 动画持续时间（毫秒）
 */
const animateCounter = (element: HTMLElement, target: number, duration: number = 2000) => {
  let start = 0;
  const startTime = performance.now();

  /**
   * 更新计数器函数
   * 在动画帧中更新数字显示
   */
  const updateCounter = () => {
    const now = performance.now();
    const progress = (now - startTime) / duration;

    // 如果动画未完成，继续更新数字
    if (progress < 1) {
      start = Math.ceil(target * progress);
      element.textContent = `${start}%`;
      requestAnimationFrame(updateCounter);
    } else {
      // 动画完成，显示最终值
      element.textContent = `${target}%`;
    }
  };

  // 启动动画
  updateCounter();
};

/**
 * 滚动事件监听器
 * 监听页面滚动事件，触发动画效果
 */
window.addEventListener('scroll', () => {
  const counter = document.getElementById('stats-counter');
  if (counter && !counter.classList.contains('animated')) {
    const rect = counter.getBoundingClientRect();
    // 当元素进入视口时触发动画
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      animateCounter(counter, 98);
      counter.classList.add('animated');
    }
  }
});

/**
 * 初始化平滑滚动功能
 * 为页面中的锚点链接添加平滑滚动效果
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = (anchor as HTMLAnchorElement).getAttribute('href');
      const targetElement = document.querySelector(targetId!);
      if (targetElement) {
        // 使用浏览器原生的平滑滚动功能
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}

/**
 * 初始化Swiper滑动组件
 * 配置并启动Swiper实例
 */
function initSwiper() {
  new Swiper('.swiper-container', {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 30,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 40,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 50,
      },
    },
  });
}

/**
 * 初始化GSAP动画
 * 配置并启动GSAP动画效果
 */
function initGSAPAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Navbar 动画
  gsap.from(navbar, {
    y: -100,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
  });

  // Hero 内容动画
  gsap.from('.hero-content > *', {
    y: 20,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: 'power3.out',
    delay: 0.5,
  });

  // 特性卡片动画
  gsap.utils.toArray('.feature-card').forEach((card: any) => {
    gsap.from(card, {
      y: 50,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    // 悬停效果
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        y: -10,
        scale: 1.03,
        duration: 0.1,
        ease: 'power2.out',
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.1,
        ease: 'power2.out',
      });
    });
  });

  // 关于我们部分动画
  gsap.utils.toArray('.about-item').forEach((item: any) => {
    gsap.from(item, {
      x: -50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
    });
  });

  // 展示区域动画
  gsap.utils.toArray('.showcase-item').forEach((item: any) => {
    gsap.fromTo(
      item,
      {
        x: -100,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // 页面加载动画
  gsap.fromTo(
    'body',
    {
      opacity: 0,
    },
    {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
    }
  );
}

/**
 * 初始化所有功能
 * 启动页面中的所有交互和动画效果
 */
function init() {
  // 应用保存的主题
  const savedTheme =
    (localStorage.getItem('theme') as 'light-theme' | 'dark-theme') || 'dark-theme';
  applyTheme(savedTheme);

  // 初始化各种功能
  initGSAPAnimations();
  initSmoothScroll();
  initSwiper();

  new ParticleSystem();

  // 添加交互效果
  document.querySelectorAll('.cta-button').forEach((button) => {
    button.addEventListener('mouseenter', () => {
      gsap.to(button, {
        scale: 1.05,
        duration: 0.1,
        ease: 'power2.out',
      });
    });

    button.addEventListener('mouseleave', () => {
      gsap.to(button, {
        scale: 1,
        duration: 0.1,
        ease: 'power2.out',
      });
    });
  });

  // 添加视差效果
  gsap.utils.toArray('.section-header').forEach((header: any) => {
    gsap.fromTo(
      header,
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // 确保按钮可见
  const heroButtons = document.querySelector('.hero-buttons') as HTMLElement;
  if (heroButtons) {
    heroButtons.style.display = 'flex';
    heroButtons.style.opacity = '1';
    heroButtons.style.visibility = 'visible';
  }

  const ctaButtons = document.querySelectorAll('.cta-button');
  ctaButtons.forEach((button) => {
    (button as HTMLElement).style.display = 'flex';
    (button as HTMLElement).style.opacity = '1';
    (button as HTMLElement).style.visibility = 'visible';
  });
}

// 响应式调整
window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
});

// 动态切换 Favicon
const updateFavicon = (isKimiMode: boolean) => {
  const appleTouchIcon = document.getElementById('apple-touch-icon') as HTMLLinkElement;
  const icon32x32 = document.getElementById('icon-32x32') as HTMLLinkElement;
  const icon16x16 = document.getElementById('icon-16x16') as HTMLLinkElement;
  const manifest = document.getElementById('manifest') as HTMLLinkElement;

  const basePath = isKimiMode ? '/favicon_maodie' : '/favicon_yinhe';

  if (appleTouchIcon) {
    appleTouchIcon.href = `${basePath}/apple-touch-icon.png`;
  }
  if (icon32x32) {
    icon32x32.href = `${basePath}/favicon-32x32.png`;
  }
  if (icon16x16) {
    icon16x16.href = `${basePath}/favicon-16x16.png`;
  }
  if (manifest) {
    manifest.href = `${basePath}/site.webmanifest`;
  }
};

// 监听 localStorage 中 kimiMode 的变化
window.addEventListener('storage', (event) => {
  if (event.key === 'kimiMode' && event.newValue) {
    updateFavicon(JSON.parse(event.newValue));
  }
});

import i18n from './i18n';

// 翻译函数
const t = (key: string) => i18n.t(key, { ns: 'landing' });

// 更新页面文本
const updateTexts = () => {
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.getAttribute('data-i18n');
    if (key) {
      element.innerHTML = t(key);
    }
  });
};

// DOM加载完成后执行初始化
document.addEventListener('DOMContentLoaded', () => {
  init();
  // 初始化时检查 kimiMode
  const kimiMode = localStorage.getItem('kimiMode');
  if (kimiMode) {
    updateFavicon(JSON.parse(kimiMode));
  }

  // 初始化语言
  i18n.on('languageChanged', () => {
    updateTexts();
  });
  updateTexts();
});
