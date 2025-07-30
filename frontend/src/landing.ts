const themeToggleButton = document.getElementById('theme-toggle');
const body = document.body;

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

    // 如果是从深色切换到浅色，我们需要让旧的（深色）视图显示在最上面
    // 以便它的收缩动画可以被看到。
    if (isDark) {
        document.documentElement.classList.add('reveal-old-view');
    }

    const transition = document.startViewTransition(() => {
        applyTheme(newTheme);
    });

    transition.ready.then(() => {
        const clipPath = [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`
        ];
        document.documentElement.animate(
            {
                clipPath: isDark ? [...clipPath].reverse() : clipPath,
            },
            {
                duration: 350,
                easing: 'ease-in-out',
                pseudoElement: isDark
                    ? '::view-transition-old(root)' // 深 -> 浅，作用于旧视图
                    : '::view-transition-new(root)', // 浅 -> 深，作用于新视图
            }
        );
    });

    transition.finished.then(() => {
        // 动画结束后，清理类名
        document.documentElement.classList.remove('reveal-old-view');
    });
});

const savedTheme = (localStorage.getItem('theme') as 'light-theme' | 'dark-theme') || 'light-theme';
applyTheme(savedTheme);