// ページ最上部へスムーズにスクロールする関数
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// スライダーに表示する全15作品のサムネイル
const THUMBNAILS = [
    { src: 'img/Minecraftskin.png', alt: 'Minecraft スキン自作講座' },
    { src: 'img/oshi.png', alt: '推しキャラ布教見聞録' },
    { src: 'img/zelda.png', alt: 'ゼルダの伝説 時のオカリナ 特設ファンサイト' },
    { src: 'img/cat.png', alt: '猫図鑑' },
    { src: 'img/sadoba.png', alt: 'シャドバおすすめデッキ紹介' },
    { src: 'img/epe.jpg', alt: 'APEXファンサイト' },
    { src: 'img/lol.png', alt: 'サルでも分かる！League of Legends！！！' },
    { src: 'img/Create-mod.png', alt: 'Createの基礎知識 個人的まとめ' },
    { src: 'img/VRCAvaterkaguya.png', alt: '輝夜！' },
    { src: 'img/UNDERTALE.png', alt: 'UNDERTALE Unofficial Character introduction Fan-made Site' },
    { src: 'img/oshikyarasyoukaisaito.jpg', alt: '推しキャラ紹介' },
    { src: 'img/STORY1.png', alt: 'FBKINGDOM（フブキングダム）について' },
    { src: 'img/oshige.jpg', alt: 'オススメゲーム紹介' },
    { src: 'img/endfiled.png', alt: 'エンドフィールドファンサイト' },
    { src: 'img/daigojinkaku.png', alt: '第五人格入門' },
];

// Fisher-Yatesアルゴリズムで配列をシャッフル
function shuffleThumbnails(items) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function buildSliderGroup(items) {
    const group = document.createElement('div');
    group.className = 'slider-group';
    items.forEach(({ src, alt }) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        group.appendChild(img);
    });
    return group;
}

// ランダムな順番でサムネイルスライダーを描画する
// (シームレスループのため、同じ並び順のグループを2つ並べる)
function renderThumbnailSlider() {
    const track = document.getElementById('sliderTrack');
    if (!track) return;
    const order = shuffleThumbnails(THUMBNAILS);
    track.appendChild(buildSliderGroup(order));
    track.appendChild(buildSliderGroup(order));
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

    renderThumbnailSlider();
    setupSliderMotion();
});