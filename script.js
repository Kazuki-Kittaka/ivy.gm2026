// ページ最上部へスムーズにスクロールする関数
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupSliderMotion() {
    const theater = document.querySelector('.thumbnail-theater');
    const track = document.querySelector('.slider-track');
    if (!theater || !track) return;

    let isDragging = false;
    let startX = 0;
    let startTranslate = 0;
    let currentTranslate = 0;
    let lastTime = null;
    const speed = 0.02; // px per millisecond

    const getLoopWidth = () => Math.max(track.scrollWidth / 2, 0);

    const normalizeTranslate = (value) => {
        const loopWidth = getLoopWidth();
        if (loopWidth === 0) return 0;
        let normalized = value % loopWidth;
        if (normalized < 0) normalized += loopWidth;
        return normalized;
    };

    const updateTransform = (translate) => {
        currentTranslate = normalizeTranslate(translate);
        track.style.transform = `translate3d(${-currentTranslate}px, 0, 0)`;
    };

    const animate = (timestamp) => {
        if (lastTime === null) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        if (!isDragging) {
            updateTransform(currentTranslate + speed * deltaTime);
        }

        requestAnimationFrame(animate);
    };

    theater.addEventListener('pointerdown', (event) => {
        isDragging = true;
        startX = event.clientX;
        startTranslate = currentTranslate;
        theater.classList.add('dragging');
        theater.setPointerCapture(event.pointerId);
        event.preventDefault();
    });

    theater.addEventListener('pointermove', (event) => {
        if (!isDragging) return;
        const deltaX = event.clientX - startX;
        updateTransform(startTranslate - deltaX);
    });

    const stopDrag = (event) => {
        if (!isDragging) return;
        isDragging = false;
        theater.classList.remove('dragging');
        if (event && event.pointerId) {
            theater.releasePointerCapture(event.pointerId);
        }
    };

    theater.addEventListener('pointerup', stopDrag);
    theater.addEventListener('pointercancel', stopDrag);
    theater.addEventListener('pointerleave', stopDrag);

    window.addEventListener('resize', () => {
        updateTransform(currentTranslate);
    });

    requestAnimationFrame(animate);
}


// ページ読み込み完了時に実行される処理
document.addEventListener("DOMContentLoaded", () => {
    const gridItems = document.querySelectorAll('.grid-item');
    
    // カードが下からフワッと順番に現れる動的エフェクト
    gridItems.forEach((item, index) => {
        // 初期状態を設定
        item.style.opacity = "0";
        item.style.transform = "translateY(20px)";
        item.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        
        // インデックスに応じて遅延（時間差）をつけて表示
        setTimeout(() => {
            item.style.opacity = "1";
            item.style.transform = "translateY(0)";
        }, index * 50); 
    });

    setupSliderMotion();
});