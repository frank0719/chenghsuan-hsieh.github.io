// script.js - 最終優化邏輯版 (興趣卡片翻轉/放大功能)

// ===================================
// 0. 數據與設定
// ===================================

const body = document.body;

// 選單標題與內容映射
const menuItems = [
    { text: '關於我', target: 'about-content' },
    { text: '學經歷', target: 'education-content' },
    { text: '核心技能', target: 'skills-content' },
    { text: '研究領域與成果', target: 'research-content' },
    { text: '其他興趣', target: 'interest-content' }
];

// 興趣資料陣列：使用 Font Awesome 圖標 Class
const interestsData = [
    { name: '潛水', iconClass: 'fa-water', description: '擁有自由潛水以及水肺潛水證照，潛過綠島、墾丁、東北角、宿霧、科摩多島。' }, 
    { name: '籃球', iconClass: 'fa-basketball-ball', description: '撕裂三次韌帶還在打，誰叫我是Kobe鐵粉。' },
    { name: '游泳', iconClass: 'fa-swimmer', description: '固定游泳訓練保養膝蓋，完成 2025 泳渡日月潭。' },
    { name: '登山', iconClass: 'fa-mountain', description: '完成玉山、嘉明湖等百岳挑戰。' },
    { name: '釣魚', iconClass: 'fa-fish', description: '新手船釣，多多指教。' },
    { name: '品酒', iconClass: 'fa-wine-glass-alt', description: '偏愛威士忌以及茶酒，學習品鑑風味與文化。' }
];

// 【Helper Function】生成興趣卡片 HTML
function generateInterestCards(data) {
    const cardsHtml = data.map((item, index) => `
        <div class="edu-card interest-card-item" data-index="${index}">
            <div class="interest-front-face">
                <i class="fas ${item.iconClass} fa-icon-placeholder" aria-hidden="true"></i> 
                <strong>${item.name}</strong>
            </div>
            
            <div class="interest-back-face hidden-detail">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="close-overlay-hint"></div>
            </div>
        </div>
    `).join('');

    // 使用與教育卡片相同的容器類名 (edu-card-container)
    return `
        <h2>其他興趣</h2>
        <div class="edu-card-container" id="interest-container">
            ${cardsHtml}
        </div>
    `;
}

// 內容模組集中管理 (注意：這裡的內容需要 H2，以便在內容頁面有標題)
const contentMap = {
    'about-content': `
        <h2>關於我</h2>
        <p>一位專注於<strong>數位積體電路設計</strong>的工程師，具備跨領域的生物系統晶片開發與系統整合經驗。</p>
        <p>主要專注於利用 CMOS 晶片開發適應性、可攜式快速生物檢測平台，實現裝置小型化與端到端檢測分析。</p>`,
    'education-content': `
        <h2>學經歷</h2>
        <div class="edu-card-container">
            <div class="edu-card">
                <img src="nycu_logo.png" alt="陽明交大校徽">
                <strong>國立陽明交通大學</strong>
                <p>電子工程研究所，碩士</p>
                <p>(2023 - 2025)</p>
            </div>
            
            <div class="edu-card">
                <img src="nthu.png" alt="清華大學校徽">
                <strong>國立清華大學</strong>
                <p>材料工程與科學學系，學士</p>
                <p>(2019 - 2023)</p>
            </div>

            <div class="edu-card">
                <img src="tcfsh.png" alt="台中一中校徽">
                <strong>國立台中第一高級中學</strong>
                <p>自然組，高中</p>
                <p>(2017 - 2019)</p>
            </div>
        </div>`,
    'skills-content': `
        <h2>核心技能</h2>
        <ul>
            <li>數位積體電路設計 (Verilog, SystemVerilog)</li>
            <li>EDA 工具 (Cadence, Synopsys)</li>
            <li>軟體開發 (Python, C++, JavaScript)</li>
        </ul>
    `,
    'research-content': '<h2>研究領域與成果</h2><p>此處放置研究成果細節...</p>',
    'interest-content': generateInterestCards(interestsData)
};


// ===================================
// 1. DOM 結構建立 (保持不變)
// ===================================
// ... (此處省略 DOM 結構建立代碼，與您提供的程式碼一致) ...

const fragment = document.createDocumentFragment();

// 創建回到首頁的按鈕
const homeButton = document.createElement('a');
homeButton.href = '#';
homeButton.textContent = 'Cheng-Hsuan, Hsieh 謝承軒';
homeButton.className = 'btn home-button';
fragment.appendChild(homeButton);

// 網站主標題
const title = document.createElement('h1');
title.innerHTML = '謝承軒 (Cheng-Hsuan, Hsieh)';
fragment.appendChild(title);

// 雙卡並排容器 (模式一)
const profileContainer = document.createElement('div');
profileContainer.className = 'profile-container';
fragment.appendChild(profileContainer);

// --- 1a. 區塊一: 自拍照與聯絡資訊卡片 ---
const profileCard = document.createElement('div');
profileCard.className = 'card profileCard';
profileContainer.appendChild(profileCard);

// 照片
const photo = document.createElement('img');
photo.src = '106031240_謝承軒.jpg';
photo.alt = '我的個人照片';
photo.className = 'profile-photo';
profileCard.appendChild(photo);

// 簡介與 Email (結構化優化)
const bioInfo = document.createElement('div');
bioInfo.className = 'bio-info';

// 專業領域
const profession = document.createElement('p');
profession.innerHTML = '數位IC設計與系統整合'; // 專業描述
bioInfo.appendChild(profession);

// Email 連結
const emailContainer = document.createElement('p');
emailContainer.innerHTML = 'Email:   ';
const emailLink = document.createElement('a');
emailLink.href = 'mailto:frank8771919@gmail.com';
emailLink.textContent = 'frank8771919@gmail.com';
emailLink.className = 'email-link';
emailContainer.appendChild(emailLink);
bioInfo.appendChild(emailContainer); // Email 段落

profileCard.appendChild(bioInfo);

// 社群連結
const socialLinksContainer = document.createElement('div');
socialLinksContainer.textContent = '社群連結: ';
socialLinksContainer.className = 'social-links';

const githubLink = document.createElement('a');
githubLink.href = 'https://github.com/frank0719';
githubLink.textContent = 'GitHub';
githubLink.className = 'social-link-item';
socialLinksContainer.appendChild(githubLink);

const separator = document.createTextNode(' | ');
socialLinksContainer.appendChild(separator);

const linkedinLink = document.createElement('a');
linkedinLink.href = 'https://www.linkedin.com/in/chhsieh0719';
linkedinLink.textContent = 'LinkedIn';
linkedinLink.className = 'social-link-item';
socialLinksContainer.appendChild(linkedinLink);

profileCard.appendChild(socialLinksContainer);

// --- 1b. 區塊二: 整合資訊選單卡片 ---
const infoCard = document.createElement('div');
infoCard.className = 'card infoCard';
profileContainer.appendChild(infoCard);

// 儲存所有標題元素，用於後續複製和事件監聽
const menuTitlesArray = []; 

// 收集所有選單標題，並設置 class 和 data-target 屬性
menuItems.forEach(item => {
    const menuTitle = document.createElement('h2');
    menuTitle.textContent = item.text;
    menuTitle.classList.add('menu-title');
    menuTitle.setAttribute('data-target', item.target);
    infoCard.appendChild(menuTitle);
    menuTitlesArray.push(menuTitle);
});

// ===================================
// 2. 水平導覽列 (保持不變)
// ===================================
const navBar = document.createElement('div');
navBar.id = 'main-nav-bar';
navBar.className = 'nav-bar';

// 導覽列中的照片
const navPhoto = document.createElement('img');
navPhoto.src = '106031240_謝承軒.jpg';
navPhoto.alt = '我的個人照片';
navPhoto.className = 'nav-photo';
navPhoto.title = '點擊回到主頁面';
navBar.appendChild(navPhoto);

// 導覽列中的選單容器
const navMenuWrapper = document.createElement('div');
navMenuWrapper.className = 'nav-menu-wrapper';
navBar.appendChild(navMenuWrapper);

// 複製所有選單標題到導覽列中 (與 menuTitlesArray 結構同步)
const navMenuTitles = []; // 專門儲存 nav bar 裡的標題
menuTitlesArray.forEach(originalTitle => {
    const clonedTitle = originalTitle.cloneNode(true);
    clonedTitle.classList.add('nav-menu-title');
    navMenuWrapper.appendChild(clonedTitle);
    navMenuTitles.push(clonedTitle);
});

// 內容展示區域
const contentDisplay = document.createElement('div');
contentDisplay.id = 'content-display';
contentDisplay.className = 'content-display';
fragment.appendChild(contentDisplay);


// ********** 將 Fragment 一次性附加到真實 DOM **********
body.appendChild(fragment); 
title.insertAdjacentElement('afterend', navBar);


// ===================================
// 3. JavaScript 互動邏輯 (核心邏輯調整)
// ===================================

// 函數：統一的重置視圖函數 (恢復到雙卡模式)
function resetToDefaultView() {
    if (document.body.classList.contains('content-open')) {
        document.body.classList.remove('content-open');
        
        // 清除所有標題的 active 狀態 (模式一與模式二)
        document.querySelectorAll('.menu-title').forEach(title => {
            title.classList.remove('active');
        });
    }
    // 確保退出興趣放大模式
    exitInterestZoomMode(); 
}

// 【新增/修改】處理興趣卡片點擊的邏輯 (翻牌/放大)
function handleInterestCardClick(event) {
    // 確保點擊的是卡片本身或其直接子元素
    const card = event.target.closest('.interest-card-item');
    if (!card) return;

    // 如果點擊的是已經放大的卡片，則恢復原狀
    if (card.classList.contains('is-zoomed')) {
        exitInterestZoomMode();
        return;
    }

    // 1. 先清除所有放大的狀態 (保險機制)
    exitInterestZoomMode();

    // 2. 應用放大和虛化效果
    card.classList.add('is-zoomed');
    document.getElementById('interest-container').classList.add('cards-dimmed');

    // 3. 阻止事件冒泡，避免觸發 body/contentDisplay 的恢復事件
    event.stopPropagation();
}

// 【新增】退出興趣放大模式
function exitInterestZoomMode() {
    document.querySelectorAll('.interest-card-item.is-zoomed').forEach(c => {
        c.classList.remove('is-zoomed');
    });
    document.getElementById('interest-container')?.classList.remove('cards-dimmed');
}


// 函數：處理主選單點擊事件 (觸發頁面轉換)
function handleMenuClick(event) {
    const targetId = event.currentTarget.getAttribute('data-target');
    const targetContent = contentMap[targetId];
    
    // 1. 進入內容展示模式
    document.body.classList.add('content-open'); 
    
    // 2. 核心：切換內容
    contentDisplay.innerHTML = targetContent;
    
    // 3. 統一處理標題高亮
    document.querySelectorAll('.menu-title').forEach(title => {
        title.classList.remove('active');
    });

    document.querySelectorAll(`.menu-title[data-target="${targetId}"]`).forEach(el => {
        el.classList.add('active');
    });

    // 4. 【新增邏輯】如果是點擊到 "其他興趣"，則為卡片容器添加事件監聽器 (事件委派)
    if (targetId === 'interest-content') {
        const interestContainer = document.getElementById('interest-container');
        // 確保只添加一次監聽器
        if (interestContainer && !interestContainer.dataset.listenerAdded) {
            // 監聽所有點擊，實現卡片放大
            interestContainer.addEventListener('click', handleInterestCardClick);
            interestContainer.dataset.listenerAdded = 'true'; 
            
            // 監聽 contentDisplay 本身，實現點擊背景恢復
            contentDisplay.addEventListener('click', exitInterestZoomMode);
        }
    } else {
        // 如果切換到其他內容，確保移除 contentDisplay 上的恢復監聽器（雖然 resetToDefaultView 會處理）
        contentDisplay.removeEventListener('click', exitInterestZoomMode);
    }

    console.log(`Content section activated for: ${targetId}`);
}

// 函數：滑鼠懸停 (凸顯) - 適用於模式一的標題 (不變)
function handleMouseOver() {
    if (document.body.classList.contains('content-open')) return;
    menuTitlesArray.forEach(el => {
        el.classList.add('dimmed');
    });
    event.currentTarget.classList.remove('dimmed');
    event.currentTarget.classList.add('highlight');
}

// 函數：滑鼠移開 (恢復) - 適用於模式一的標題 (不變)
function handleMouseOut() {
    if (document.body.classList.contains('content-open')) return;
    menuTitlesArray.forEach(el => {
        el.classList.remove('dimmed');
        el.classList.remove('highlight');
    });
}

// 函數：點擊照片/卡片恢復原狀的邏輯 (阻止事件冒泡並調用重置函數) (不變)
function handleRestoreClick(event) {
    event.stopPropagation();
    resetToDefaultView();
}


// ---------------------------------
// 事件監聽器設定 (保持不變)
// ---------------------------------

// 1. 為所有模式一標題添加 點擊/懸停 事件
menuTitlesArray.forEach(titleElement => {
    titleElement.addEventListener('click', handleMenuClick);
    titleElement.addEventListener('mouseover', handleMouseOver);
    titleElement.addEventListener('mouseout', handleMouseOut);
});

// 2. 為模式二 (導覽列) 中的標題添加點擊事件
navMenuTitles.forEach(navTitle => {
    navTitle.addEventListener('click', handleMenuClick);
});

// 3. 點擊模式一的照片卡片 (profileCard) 恢復原狀
profileCard.addEventListener('click', handleRestoreClick);

// 4. 點擊模式二的導覽列照片 (navPhoto) 恢復原狀
navPhoto.addEventListener('click', handleRestoreClick); 

// 5. homeButton 點擊事件 (恢復原狀並阻止預設行為)
homeButton.addEventListener('click', (e) => {
    e.preventDefault(); 
    resetToDefaultView();
});