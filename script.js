// script.js - 最終優化邏輯版 (統一置中放大/虛化功能 & 學經歷詳細內容顯示)

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
    // 移除 front/back face 結構，保持簡單
    const cardsHtml = data.map((item, index) => `
        <div class="edu-card card-item interest-card-item" data-index="${index}">
            <i class="fas ${item.iconClass} fa-icon-placeholder" aria-hidden="true"></i> 
            <strong>${item.name}</strong>
            <div class="hidden-detail">
                <p>${item.description}</p>
            </div>
        </div>
    `).join('');

    // 使用 data 屬性定義 Class，方便統一邏輯
    return `
        <div class="edu-card-container" id="interest-container" data-zoom-class="is-zoomed" data-dim-class="cards-dimmed" data-card-selector=".interest-card-item">
            ${cardsHtml}
        </div>
    `;
}

// 內容模組集中管理
const contentMap = {
    'about-content': `
        <p>一位專注於<strong>數位積體電路設計</strong>的工程師，具備跨領域的生物系統晶片開發與系統整合經驗。</p>
        <p>主要專注於利用 CMOS 晶片開發適應性、可攜式快速生物檢測平台，實現裝置小型化與端到端檢測分析。</p>`,
    
    // 【關鍵修改點】學經歷容器結構：包含卡片區和靜態詳細內容區
    'education-content': `
        <div class="edu-card-container" id="education-container" data-zoom-class="is-zoomed" data-dim-class="cards-dimmed" data-card-selector=".edu-card">
            <div class="edu-card card-item" data-card-id="nycu">
                <img src="nycu_logo.png" alt="陽明交大校徽">
                <strong>國立陽明交通大學</strong>
                <p>電子工程研究所，碩士</p>
                <div class="hidden-detail">
                    <p>2023 - 2025</p>
                </div>
                <div class="card-extra-detail hidden-content">
                    <h3>國立陽明交通大學 - 電子工程研究所</h3>
                    <ul>
                        <li>一站式生醫檢測晶片設計與系統整合平台</li>
                        
                    </ul>
                </div>
            </div>
            
            <div class="edu-card card-item" data-card-id="nthu">
                <img src="nthu.png" alt="清華大學校徽">
                <strong>國立清華大學</strong>
                <p>材料工程與科學學系，學士</p>
                <div class="hidden-detail">
                    <p>2019 - 2023</p>
                </div>
                <div class="card-extra-detail hidden-content">
                    <h3>國立清華大學 - 材料工程與科學學系</h3>
                    <ul>
                        <li>參與太陽能電池材料研究，發表一篇研討會論文。</li>
                        <li>選修多門電子工程與計算機科學課程，打下硬體基礎。</li>
                    </ul>
                </div>
            </div>

            <div class="edu-card card-item" data-card-id="tcfsh">
                <img src="tcfsh.png" alt="台中一中校徽">
                <strong>國立台中第一高級中學</strong>
                <p>自然組，高中</p>
                <div class="hidden-detail">
                    <p>2017 - 2019</p>
                </div>
                <div class="card-extra-detail hidden-content">
                    <h3>國立台中第一高級中學 - 自然組</h3>
                    <ul>
                        <li>參與科學實驗社團，培養對物理與化學的興趣。</li>
                        <li>獲得校內程式設計競賽佳作。</li>
                    </ul>
                </div>
            </div>
        </div>
        <div id="education-detail-area" class="card edu-container empty-detail">
            點擊上方卡片以查看詳細經歷...
        </div>`,

    'skills-content': `
        <ul>
            <li>數位積體電路設計 (Verilog, SystemVerilog)</li>
            <li>EDA 工具 (Cadence, Synopsys)</li>
            <li>軟體開發 (Python, C++, JavaScript)</li>
        </ul>
    `,
    'research-content': '<p>此處放置研究成果細節...</p>',
    'interest-content': generateInterestCards(interestsData)
};


// ===================================
// 1. DOM 結構建立 (保持不變)
// ===================================
// ... (此處是創建 DOM 元素並附加到 document.body 的代碼，與您提供的片段保持一致) ...
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

// 【新增】處理詳細內容區域的 Helper 函式，只負責內容的注入和清空
function updateEducationDetailArea(containerId, content = '') {
    // 使用 ID 確保精確度
    const detailArea = document.getElementById('education-detail-area');
    if (!detailArea || containerId !== 'education-container') return;

    if (content) {
        // 顯示內容
        detailArea.innerHTML = content;
        detailArea.classList.remove('empty-detail');
        // 捲動到詳細內容區 (優化用戶體驗)
        detailArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        // 清空內容
        detailArea.innerHTML = '點擊上方卡片以查看詳細經歷...';
        detailArea.classList.add('empty-detail');
    }
}


// 【修改】統一退出放大模式的函數
function exitZoomMode(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 從容器的 data 屬性獲取 class 名稱
    const zoomClass = container.dataset.zoomClass || 'is-zoomed';
    const dimClass = container.dataset.dimClass || 'cards-dimmed';
    const cardSelector = container.dataset.cardSelector || '.card-item';

    // 移除所有卡片的放大狀態
    container.querySelectorAll(cardSelector).forEach(c => {
        c.classList.remove(zoomClass);
    });
    
    // 移除容器的虛化狀態
    container.classList.remove(dimClass);
    
    // 【新增】如果退出的是學經歷容器，清空詳細內容區域
    if (containerId === 'education-container') {
        updateEducationDetailArea(containerId, ''); 
    }
}

// 【新增】一個包裹函數，用於處理背景點擊恢復，並檢查所有可能的容器
function handleExitZoomModeWrapper() {
    // 點擊背景時，檢查並退出所有可能的放大模式
    exitZoomMode('interest-container'); 
    exitZoomMode('education-container');
}

// 函數：統一的重置視圖函數 (恢復到雙卡模式)
function resetToDefaultView() {
    if (document.body.classList.contains('content-open')) {
        document.body.classList.remove('content-open');
        
        // 清除所有標題的 active 狀態
        document.querySelectorAll('.menu-title').forEach(title => {
            title.classList.remove('active');
        });
    }
    // 確保退出放大模式
    handleExitZoomModeWrapper(); 

    // 移除 contentDisplay 上的恢復監聽器（防止主頁面點擊觸發）
    contentDisplay.removeEventListener('click', handleExitZoomModeWrapper);
}

// 【統一/修改】處理卡片點擊的邏輯 (置中放大)
function handleCardClick(event) {
    // 確保點擊的是卡片本身或其直接子元素，卡片必須有 'card-item' class
    const card = event.target.closest('.card-item');
    if (!card) return;

    // 取得當前卡片所在的容器
    const container = card.closest('.edu-card-container');
    if (!container) return;

    // 從容器的 data 屬性獲取對應的 Class 名稱
    const zoomClass = container.dataset.zoomClass || 'is-zoomed';
    const dimClass = container.dataset.dimClass || 'cards-dimmed';
    
    // 取得詳細內容 (從卡片內部的 .card-extra-detail 抓取 HTML)
    const extraDetailDiv = card.querySelector('.card-extra-detail');
    const content = extraDetailDiv ? extraDetailDiv.innerHTML : '';

    // 1. 判斷是否為「取消」點擊 (點擊已經放大的卡片)
    if (card.classList.contains(zoomClass)) {
        exitZoomMode(container.id);
        return;
    }

    // 2. 先清除所有同類卡片的放大狀態 (確保只有一個放大)
    // 此步驟會透過 exitZoomMode 清空 education-detail-area
    exitZoomMode(container.id);

    // 3. 應用放大和虛化效果
    card.classList.add(zoomClass);
    container.classList.add(dimClass);

    // 4. 【核心步驟】如果是學經歷容器，則顯示詳細內容
    if (container.id === 'education-container') {
        updateEducationDetailArea(container.id, content);
    }

    // 5. 阻止事件冒泡，避免觸發 contentDisplay 的恢復事件
    event.stopPropagation();
}


// 函數：處理主選單點擊事件 (觸發頁面轉換)
function handleMenuClick(event) {
    const targetId = event.currentTarget.getAttribute('data-target');
    const targetContent = contentMap[targetId];

    // --- 【優化點 1: 清理其他內容留下的監聽器】---
    contentDisplay.removeEventListener('click', handleExitZoomModeWrapper);
    
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

    // 4. 【統一邏輯】如果是點擊到 "其他興趣" 或 "學經歷"，則為卡片容器添加事件監聽器 (事件委派)
    if (targetId === 'interest-content' || targetId === 'education-content') {
        const containerId = (targetId === 'interest-content') ? 'interest-container' : 'education-container';
        const cardContainer = document.getElementById(containerId);
        
        if (cardContainer) {
            // 監聽所有卡片點擊，實現卡片放大 (事件委派)
            // 因為 contentDisplay 已經被清空並載入新內容，所以需要重新設定監聽器
            cardContainer.addEventListener('click', handleCardClick);
            
            // 監聽 contentDisplay 本身，實現點擊背景恢復
            contentDisplay.addEventListener('click', handleExitZoomModeWrapper);
        }
        
        // 【新增】如果是學經歷，確保詳細內容區被清空 (以防萬一)
        if (targetId === 'education-content') {
            updateEducationDetailArea('education-container', '');
        }
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