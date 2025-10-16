// script.js - 最終優化邏輯版 (鎖定滾動，修復放大卡片跑版問題)

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
                <div class="close-overlay-hint">點擊任意處退出</div>
            </div>
        </div>
    `).join('');

    return `
        <h2>其他興趣</h2>
        <div class="edu-card-container" id="interest-container">
            ${cardsHtml}
        </div>
    `;
}

// 內容模組集中管理
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
const fragment = document.createDocumentFragment();
const homeButton = document.createElement('a');
homeButton.href = '#';
homeButton.textContent = 'Cheng-Hsuan, Hsieh 謝承軒';
homeButton.className = 'btn home-button';
fragment.appendChild(homeButton);

const title = document.createElement('h1');
title.innerHTML = '謝承軒 (Cheng-Hsuan, Hsieh)';
fragment.appendChild(title);

const profileContainer = document.createElement('div');
profileContainer.className = 'profile-container';
fragment.appendChild(profileContainer);

const profileCard = document.createElement('div');
profileCard.className = 'card profileCard';
profileContainer.appendChild(profileCard);

const photo = document.createElement('img');
photo.src = '106031240_謝承軒.jpg';
photo.alt = '我的個人照片';
photo.className = 'profile-photo';
profileCard.appendChild(photo);

const bioInfo = document.createElement('div');
bioInfo.className = 'bio-info';

const profession = document.createElement('p');
profession.innerHTML = '數位IC設計與系統整合';
bioInfo.appendChild(profession);

const emailContainer = document.createElement('p');
emailContainer.innerHTML = 'Email:   ';
const emailLink = document.createElement('a');
emailLink.href = 'mailto:frank8771919@gmail.com';
emailLink.textContent = 'frank8771919@gmail.com';
emailLink.className = 'email-link';
emailContainer.appendChild(emailLink);
bioInfo.appendChild(emailContainer);

profileCard.appendChild(bioInfo);

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

const infoCard = document.createElement('div');
infoCard.className = 'card infoCard';
profileContainer.appendChild(infoCard);

const menuTitlesArray = []; 

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

const navPhoto = document.createElement('img');
navPhoto.src = '106031240_謝承軒.jpg';
navPhoto.alt = '我的個人照片';
navPhoto.className = 'nav-photo';
navPhoto.title = '點擊回到主頁面';
navBar.appendChild(navPhoto);

const navMenuWrapper = document.createElement('div');
navMenuWrapper.className = 'nav-menu-wrapper';
navBar.appendChild(navMenuWrapper);

const navMenuTitles = [];
menuTitlesArray.forEach(originalTitle => {
    const clonedTitle = originalTitle.cloneNode(true);
    clonedTitle.classList.add('nav-menu-title');
    navMenuWrapper.appendChild(clonedTitle);
    navMenuTitles.push(clonedTitle);
});

const contentDisplay = document.createElement('div');
contentDisplay.id = 'content-display';
contentDisplay.className = 'content-display';
fragment.appendChild(contentDisplay);


// ********** 將 Fragment 一次性附加到真實 DOM **********
body.appendChild(fragment); 
title.insertAdjacentElement('afterend', navBar);


// ===================================
// 3. JavaScript 互動邏輯 (核心邏輯)
// ===================================

// 函數：統一的重置視圖函數 (恢復到雙卡模式)
function resetToDefaultView() {
    if (document.body.classList.contains('content-open')) {
        document.body.classList.remove('content-open');
        
        document.querySelectorAll('.menu-title').forEach(title => {
            title.classList.remove('active');
        });
    }
    // 確保退出興趣放大模式
    exitInterestZoomMode(); 
}

// 【放大邏輯】處理興趣卡片點擊的邏輯
function handleInterestCardClick(event) {
    const card = event.target.closest('.interest-card-item');
    if (!card) return;

    if (card.classList.contains('is-zoomed')) {
        exitInterestZoomMode();
        return;
    }

    exitInterestZoomMode();

    card.classList.add('is-zoomed');
    document.getElementById('interest-container').classList.add('cards-dimmed');

    // **【關鍵修復】鎖定 Body 滾動，防止背景滾動和跑版**
    document.body.style.overflow = 'hidden'; 

    event.stopPropagation();
}

// 【恢復邏輯】退出興趣放大模式
function exitInterestZoomMode() {
    document.querySelectorAll('.interest-card-item.is-zoomed').forEach(c => {
        c.classList.remove('is-zoomed');
    });
    document.getElementById('interest-container')?.classList.remove('cards-dimmed');

    // **【關鍵修復】恢復 Body 滾動**
    document.body.style.overflow = ''; 
}


// 函數：處理主選單點擊事件 (觸發頁面轉換)
function handleMenuClick(event) {
    const targetId = event.currentTarget.getAttribute('data-target');
    const targetContent = contentMap[targetId];
    
    document.body.classList.add('content-open'); 
    contentDisplay.innerHTML = targetContent;
    
    document.querySelectorAll('.menu-title').forEach(title => {
        title.classList.remove('active');
    });

    document.querySelectorAll(`.menu-title[data-target="${targetId}"]`).forEach(el => {
        el.classList.add('active');
    });

    // 4. 興趣內容的事件委派設定
    if (targetId === 'interest-content') {
        const interestContainer = document.getElementById('interest-container');
        if (interestContainer && !interestContainer.dataset.listenerAdded) {
            interestContainer.addEventListener('click', handleInterestCardClick);
            interestContainer.dataset.listenerAdded = 'true'; 
            
            // 監聽 contentDisplay 本身，點擊空白處恢復
            contentDisplay.addEventListener('click', exitInterestZoomMode);
        }
    } else {
        contentDisplay.removeEventListener('click', exitInterestZoomMode);
    }

    // 確保在切換內容時，如果 body 被鎖定，要解鎖
    document.body.style.overflow = '';

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
menuTitlesArray.forEach(titleElement => {
    titleElement.addEventListener('click', handleMenuClick);
    titleElement.addEventListener('mouseover', handleMouseOver);
    titleElement.addEventListener('mouseout', handleMouseOut);
});

navMenuTitles.forEach(navTitle => {
    navTitle.addEventListener('click', handleMenuClick);
});

profileCard.addEventListener('click', handleRestoreClick);

navPhoto.addEventListener('click', handleRestoreClick); 

homeButton.addEventListener('click', (e) => {
    e.preventDefault(); 
    resetToDefaultView();
});