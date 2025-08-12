// 全局变量声明
declare const gsap: any;
declare const ScrollTrigger: any;
declare const Swiper: any;

// DOM 元素
const themeToggleButton = document.getElementById('theme-toggle');
const { body } = document;
const navbar = document.querySelector('.navbar');
const cursorGlow = document.querySelector('.cursor-glow') as HTMLElement;

// 主题切换功能（保持原有逻辑）
const applyTheme = (theme: 'light-theme' | 'dark-theme') => {
  body.classList.remove('light-theme', 'dark-theme');
  body.classList.add(theme);
  localStorage.setItem('theme', theme);
};

themeToggleButton?.addEventListener('click', (event: MouseEvent) => {
  const isDark = body.classList.contains('dark-theme');
  const newTheme = isDark ? 'light-theme' : 'dark-theme';

  if (!document.startViewTransition) {
    applyTheme(newTheme);
    return;
  }

  const x = event.clientX;
  const y = event.clientY;
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  if (isDark) {
    document.documentElement.classList.add('reveal-old-view');
  }

  const transition = document.startViewTransition(() => {
    applyTheme(newTheme);
  });

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

  transition.finished.then(() => {
    document.documentElement.classList.remove('reveal-old-view');
  });
});

// 光标跟随效果
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e: MouseEvent) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  const dx = mouseX - cursorX;
  const dy = mouseY - cursorY;

  cursorX += dx * 0.1;
  cursorY += dy * 0.1;

  if (cursorGlow) {
    cursorGlow.style.left = cursorX + 'px';
    cursorGlow.style.top = cursorY + 'px';
  }

  requestAnimationFrame(animateCursor);
}

animateCursor();

// 粒子动画系统
class ParticleSystem {
  private particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
  }> = [];

  constructor() {
    this.init();
    this.animate();
  }

  private init() {
    const container = document.querySelector('.hero-particles') as HTMLElement;
    if (!container) {
      return;
    }

    // 创建粒子
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      container.appendChild(particle);

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

  private animate() {
    const container = document.querySelector('.hero-particles') as HTMLElement;
    if (!container) {
      return;
    }

    const particleElements = container.querySelectorAll('.particle');

    this.particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > container.offsetWidth) {
        particle.vx *= -1;
      }
      if (particle.y < 0 || particle.y > container.offsetHeight) {
        particle.vy *= -1;
      }

      const element = particleElements[index] as HTMLElement;
      if (element) {
        element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
        element.style.width = `${particle.size}px`;
        element.style.height = `${particle.size}px`;
        element.style.opacity = `${particle.opacity}`;
      }
    });

    requestAnimationFrame(() => this.animate());
  }
}

// 数字滚动动画
const animateCounter = (element: HTMLElement, target: number, duration: number = 2000) => {
  let start = 0;
  const startTime = performance.now();

  const updateCounter = () => {
    const now = performance.now();
    const progress = (now - startTime) / duration;

    if (progress < 1) {
      start = Math.ceil(target * progress);
      element.textContent = `${start}%`;
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = `${target}%`;
    }
  };

  updateCounter();
};

// 滚动监听，触发动画
window.addEventListener('scroll', () => {
  const counter = document.getElementById('stats-counter');
  if (counter && !counter.classList.contains('animated')) {
    const rect = counter.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      animateCounter(counter, 98);
      counter.classList.add('animated');
    }
  }
});

// 平滑滚动
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = (anchor as HTMLAnchorElement).getAttribute('href');
      const targetElement = document.querySelector(targetId!);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}

// Swiper 初始化
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

// GSAP 动画
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
    y: 50,
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

// 初始化所有功能
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

  // 预加载关键资源
  preloadResources();
}

// 响应式调整
window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
});

// 预加载图片等资源
function preloadResources() {
  const criticalImages: string[] = [
    // 添加需要预加载的图片URL
  ];
  criticalImages.forEach((src: string) => {
    const img = new Image();
    img.src = src;
  });
}

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
