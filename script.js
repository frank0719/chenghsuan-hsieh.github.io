// script.js - 最終優化邏輯整合版 (結構解耦 & 動態推送)

// ===================================
// 0. 數據與設定
// ===================================
const body = document.body;

const menuItems = [
    { text: '關於我', target: 'about-content' },
    { text: '學經歷', target: 'education-content' },
    { text: '核心技能', target: 'skills-content' },
    { text: '研究領域與成果', target: 'research-content' },
    { text: '其他興趣', target: 'interest-content' }
];

const interestsData = [
    { name: '潛水', iconClass: 'fa-water', description: '擁有自由潛水以及水肺潛水證照，潛過綠島、墾丁、東北角、宿霧、科摩多島。' }, 
    { name: '籃球', iconClass: 'fa-basketball-ball', description: '撕裂三次韌帶還在打，誰叫我是 Kobe 鐵粉。' },
    { name: '游泳', iconClass: 'fa-swimmer', description: '完成 2025 泳渡日月潭。' },
    { name: '單車', iconClass: 'fa-bicycle', description: '目標完成一日雙塔。' },
    { name: '登山', iconClass: 'fa-mountain', description: '完成玉山、嘉明湖等百岳挑戰。' },
    { name: '釣魚', iconClass: 'fa-fish', description: '新手船釣，多多指教。' },
    { name: '品酒', iconClass: 'fa-wine-glass-alt', description: '偏愛威士忌以及茶酒。' },
    { name: '旅遊', iconClass: 'fa-plane', description: '喜愛探索不同國家。' },
    { name: '美食', iconClass: 'fa-utensils', description: '嘗試在新竹尋找美食...。' }
];

const skillsData = [
    { name: '數位積體電路設計', iconClass: 'fa-microchip', description: '熟悉 Verilog / SystemVerilog，同步/非同步重置、時序/組合邏輯、FSM 與模組化設計。' },
    { name: 'EDA 工具', iconClass: 'fa-tools', description: 'Cadence / Synopsys 流程，含 RTL → 合成 → PnR → STA → DRC/LVS 觀念。' },
    { name: '軟體開發', iconClass: 'fa-code', description: 'Python、C++、JavaScript；自動化腳本、資料處理與前端互動頁面實作。' }
];

// ===================================
// 1. Helper Functions (輔助函式)
// ===================================

// 【修正與優化】生成興趣卡片 HTML
function generateInterestCards(data) {
    const cardsHtml = data.map((item, index) => {
        let extraDetail = `<p>${item.description}</p>`;
        
        // 【特別處理：旅遊】獨立內容
        // 在 generateInterestCards 函式中修改「旅遊」的判斷：
        if (item.name === '旅遊') {
    extraDetail = `
        <div class="travel-dashboard">
            <div class="map-wrapper" id="map-wrapper">
                <!-- 獨立圖層：用於承載 SVG 輪廓 -->
                <div id="svg-map-layer"></div>
                
                <!-- 足跡標記點：基於百分比定位 -->
                <div class="marker" style="top: 32.16%; left: 22.96%;" data-info="美國"></div>
                <div class="marker" style="top: 34.39%; left: 77.70%;;" data-info="中國"></div>
                <div class="marker" style="top: 34.01%; left: 85.87%;" data-info="日本"></div>
                <div class="marker" style="top: 34.39%; left: 85.97%;" data-info="南韓"></div>
                <div class="marker" style="top: 40.33%; left: 70.91%;" data-info="印度"></div>
                <div class="marker" style="top: 51.12%; left: 79%;" data-info="越南"></div>
                <div class="marker" style="top: 47.21%; left: 77.42%;" data-info="泰國"></div>
                <div class="marker" style="top: 54.09%; left: 78.07%;" data-info="馬來西亞"></div>
                <div class="marker" style="top: 56.13%; left: 78.72%;" data-info="新加坡"></div>
                <div class="marker" style="top: 62.83%; left: 82.81%;" data-info="印尼"></div>
                <div class="marker" style="top: 46.47%; left: 83.09%;" data-info="菲律賓"></div>







                <div id="map-tooltip" class="map-tooltip"></div>
            </div>
        </div>`;
}

        return `
            <div class="edu-card card-item interest-card-item" data-index="${index}">
                <i class="fas ${item.iconClass} fa-icon-placeholder" aria-hidden="true"></i> 
                <strong>${item.name}</strong>
                <!-- 隱藏詳細內容：點擊後會注入下方獨立容器 -->
                <div class="card-extra-detail hidden-content">${extraDetail}</div>
            </div>`;
    }).join('');

    // 返回九宮格容器 (Container 1)
    return `
        <div class="edu-card-container" id="interest-container" 
             data-zoom-class="is-zoomed" data-dim-class="cards-dimmed" data-card-selector=".interest-card-item">
            ${cardsHtml}
        </div>`;
}

function generateSkillCards(data) {
    const cardsHtml = data.map((item, index) => `
        <div class="edu-card card-item skill-card-item" data-index="${index}">
            <i class="fas ${item.iconClass} fa-icon-placeholder" aria-hidden="true"></i>
            <strong>${item.name}</strong>
            <div class="hidden-detail"><p>${item.description}</p></div>
        </div>`).join('');

    return `
        <div class="edu-card-container" id="skills-container"
             data-zoom-class="is-zoomed" data-dim-class="cards-dimmed" data-card-selector=".skill-card-item">
            ${cardsHtml}
        </div>`;
}

// 【優化核心邏輯】統一處理詳細內容區域的注入與顯示狀態 (為動畫支援做準備)
function updateDetailArea(containerId, content = '') {
    // 判斷要推送到哪個「獨立容器」
    const detailAreaId = (containerId === 'education-container') ? 'education-detail-area' : 'interest-detail-area';
    const detailArea = document.getElementById(detailAreaId);
    
    if (!detailArea) return;

    if (content) {
        // 注入內容並顯示容器 (為 CSS 動態呈現做準備)
        detailArea.innerHTML = content;
        detailArea.classList.remove('empty-detail');
        // 加入 class 以觸發 CSS 動畫 (例如：from下方出現)
        detailArea.classList.add('is-visible'); 
        
        // 針對工程師講究的精確：捲動到詳細內容區 (優化用戶體驗)
        detailArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        // 清空內容並隱藏容器
        detailArea.innerHTML = ''; // 清空內容
        detailArea.classList.add('empty-detail');
        // 移除 class 以觸發 CSS 隱藏動畫
        detailArea.classList.remove('is-visible');
    }
}

// ===================================
// 2. 互動核心邏輯
// ===================================

function exitZoomMode(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 移除選擇模式，恢復九宮格顯示
    container.classList.remove('selection-mode');
    container.querySelectorAll('.card-item').forEach(c => {
        c.classList.remove('is-zoomed');
    });
    container.classList.remove('cards-dimmed');
    
    // 清空下方的內容區
    updateDetailArea(containerId, ''); 
}

function handleCardClick(event) {
    const card = event.target.closest('.card-item');
    if (!card) return;

    const container = card.closest('.edu-card-container');
    const zoomClass = container.dataset.zoomClass || 'is-zoomed';
    
    if (card.classList.contains(zoomClass)) {
        exitZoomMode(container.id);
        return;
    }

    exitZoomMode(container.id);
    card.classList.add(zoomClass);
    container.classList.add('selection-mode');
    container.classList.add('cards-dimmed');

    const extraDetailDiv = card.querySelector('.card-extra-detail');
    const content = extraDetailDiv ? extraDetailDiv.innerHTML : '';
    
    updateDetailArea(container.id, content);

    // 【修正點】：傳入 container.id 讓地圖知道要去哪裡渲染
    if (card.innerText.includes('旅遊')) {
        setTimeout(() => loadAndInitMap(container.id), 50); 
    }
    
    event.stopPropagation();
}
// ===================================
// 3. 內容模組集中管理 (符合你所要求的結構解耦)
// ===================================
const contentMap = {
    'about-content': `
        <p>一位專注於<strong>數位積體電路設計</strong>的工程師，具備跨領域的生物系統晶片開發與系統整合經驗。</p>
        <p>主要專注於利用 CMOS 晶片開發適應性、可攜式快速生物檢測平台，實現裝置小型化與端到端檢測分析。</p>`,
    
    'education-content': `
        <div class="edu-card-container" id="education-container" data-zoom-class="is-zoomed" data-dim-class="cards-dimmed" data-card-selector=".edu-card">
            <div class="edu-card card-item" data-card-id="nycu">
                <img src="nycu_logo.png" alt="陽明交大校徽">
                <strong>國立陽明交通大學</strong>
                <p>電子工程研究所，碩士</p>
                <div class="card-extra-detail hidden-content">
                    <h3>國立陽明交通大學 - 電子工程研究所</h3>
                    <ul>
                        <li>一站式生醫檢測晶片設計與系統整合平台</li>
                    </ul>
                </div>
            </div>
            <!-- ... 其他學歷卡片 ... -->
        </div>
        <!-- 容器 2: 學經歷獨立詳細內容區域 -->
        <div id="education-detail-area" class="card edu-container empty-detail">
            點擊上方卡片以查看詳細經歷...
        </div>`,

    'skills-content': generateSkillCards(skillsData),
    'research-content': '<p>此處放置研究成果細節...</p>',

    // 【核心修正】這裡就是你要求的結構：九宮格與顯示區完全獨立，互為兄妹
    'interest-content': `
        <!-- 容器 1: 負責放九宮格卡片 -->
        ${generateInterestCards(interestsData)}

        
        
        <!-- 容器 2: 獨立的詳細內容區域 (現在它在 DOM 上是完全獨立的) -->
        <div id="interest-detail-area" class="card edu-container empty-detail">
            <!-- 預設可以留空，或放提示字眼，點擊卡片後內容會注入此處並出現 -->
        </div>`
};

// ===================================
// 4. DOM 結構建立 (保持不變，略)
// ===================================
// ... 此處放置原始代碼中創建 DOM 元素並附加到 document.body 的部分 ...
const fragment = document.createDocumentFragment();

// (為了讓程式碼可執行，這裡需要補上 DOM 建立的關鍵部分，我將保留最核心的架構)

// 創建回到首頁的按鈕
const homeButton = document.createElement('a');
homeButton.href = '#';
homeButton.textContent = '#Cheng-Hsuan, Hsieh 謝承軒';
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

// 簡介與 Email
const bioInfo = document.createElement('div');
bioInfo.className = 'bio-info';
const profession = document.createElement('p');
profession.innerHTML = '數位IC設計與系統整合';
bioInfo.appendChild(profession);
const emailContainer = document.createElement('p');
emailContainer.innerHTML = 'Email:frank8771919@gmail.com'; // 修正 Email 連結
bioInfo.appendChild(emailContainer);
profileCard.appendChild(bioInfo);

// --- 1b. 區塊二: 整合資訊選單卡片 ---
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
// 5. 水平導覽列與內容展示區 (保持不變)
// ===================================
const navBar = document.createElement('div');
navBar.id = 'main-nav-bar';
navBar.className = 'nav-bar';
const navPhoto = document.createElement('img');
navPhoto.src = '106031240_謝承軒.jpg';
navPhoto.alt = '我的個人照片';
navPhoto.className = 'nav-photo';
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

// 將 Fragment 附加到真實 DOM
body.appendChild(fragment); 
title.insertAdjacentElement('afterend', navBar);

// ===================================
// 6. JavaScript 互動監聽事件綁定
// ===================================

// 全域重置視圖函數 (恢復到雙卡模式)
function resetToDefaultView() {
    if (document.body.classList.contains('content-open')) {
        document.body.classList.remove('content-open');
        document.querySelectorAll('.menu-title').forEach(title => {
            title.classList.remove('active');
        });
    }
    // 確保點擊首頁時，所有可能放大的容器都收回
    exitZoomMode('interest-container'); 
    exitZoomMode('education-container');
    exitZoomMode('skills-container');
}

// 處理主選單點擊事件 (觸發頁面轉換)
function handleMenuClick(event) {
    const targetId = event.currentTarget.getAttribute('data-target');
    const targetContent = contentMap[targetId];

    document.body.classList.add('content-open');
    const contentDisplay = document.getElementById('content-display');
    contentDisplay.innerHTML = targetContent;

    // 針對含有卡片的頁面進行事件委派綁定 (確保新內容也能點擊)
    const containerIds = ['interest-container', 'education-container', 'skills-container'];
    containerIds.forEach(id => {
        const cardContainer = document.getElementById(id);
        if (cardContainer) {
            cardContainer.addEventListener('click', handleCardClick);
        }
    });
}

// 綁定選單與導覽列事件
menuTitlesArray.forEach(titleElement => {
    titleElement.addEventListener('click', handleMenuClick);
});
navMenuTitles.forEach(navTitle => {
    navTitle.addEventListener('click', handleMenuClick);
});

// 恢復點擊事件
profileCard.addEventListener('click', resetToDefaultView);
navPhoto.addEventListener('click', resetToDefaultView); 
homeButton.addEventListener('click', (e) => {
    e.preventDefault(); 
    resetToDefaultView();
});

// 在 contentDisplay 渲染後執行
function initMapInteractions() {
    const wrapper = document.getElementById('map-wrapper');
    const tooltip = document.getElementById('map-tooltip');
    if (!wrapper || !tooltip) return;

    // --- 1. 保留原本的標記點 Hover 邏輯 ---
    const markers = wrapper.querySelectorAll('.marker');
    markers.forEach(marker => {
        marker.addEventListener('mouseenter', () => {
            tooltip.innerHTML = marker.getAttribute('data-info');
            tooltip.style.opacity = '1';
        });

        marker.addEventListener('mousemove', (e) => {
            const rect = wrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            tooltip.style.left = (x + 15) + 'px';
            tooltip.style.top = (y + 15) + 'px';
        });

        marker.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    });

    // --- 2. 方案一：開發者專用精準定位小工具 ---
    wrapper.addEventListener('click', (e) => {
        const rect = wrapper.getBoundingClientRect();
        
        // 計算點擊位置相對容器的百分比
        const leftPercent = ((e.clientX - rect.left) / rect.width) * 100;
        const topPercent = ((e.clientY - rect.top) / rect.height) * 100;
        
        // 格式化為 HTML style 字串
        const styleString = `top: ${topPercent.toFixed(2)}%; left: ${leftPercent.toFixed(2)}%;`;
        
        // 印在 Console 讓你看見
        console.log(`📍 取得新座標 -> style="${styleString}"`);
        
        // 自動複製到剪貼簿 (需在 HTTPS 或 Localhost 環境下生效)
        navigator.clipboard.writeText(styleString).then(() => {
            alert(`✅ 座標已複製！\n直接貼上你的 HTML 即可：\nstyle="${styleString}"`);
        }).catch(err => {
            console.error('複製到剪貼簿失敗，請從 Console 複製', err);
        });
    });
}

// 接收 containerId，確保我們只在「顯示區」尋找地圖，避開隱藏的重複 ID
async function loadAndInitMap(containerId) {
    const detailAreaId = (containerId === 'education-container') ? 'education-detail-area' : 'interest-detail-area';
    const detailArea = document.getElementById(detailAreaId);
    
    if (!detailArea) return;

    // 【修正點 1】：改用 querySelector 從 detailArea 內部尋找，無視 ID 重複問題
    const mapLayer = detailArea.querySelector('#svg-map-layer');
    const wrapper = detailArea.querySelector('#map-wrapper');
    const tooltip = detailArea.querySelector('#map-tooltip');

    if (!mapLayer || !wrapper || !tooltip) return;

    try {
        const response = await fetch('world.svg');
        const svgText = await response.text();
        mapLayer.innerHTML = svgText;

        // 清除 inline style 讓 CSS 能夠接管
        const allPaths = mapLayer.querySelectorAll('path, polygon, polyline');
        allPaths.forEach(path => {
            path.style.stroke = '';
            path.style.fill = '';
        });

        // 綁定 Hover 互動邏輯
        const markers = wrapper.querySelectorAll('.marker');
        markers.forEach(marker => {
            marker.addEventListener('mouseenter', () => {
                tooltip.innerHTML = marker.getAttribute('data-info');
                tooltip.style.opacity = '1';
            });

            marker.addEventListener('mousemove', (e) => {
                const rect = wrapper.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                tooltip.style.left = (x + 15) + 'px';
                tooltip.style.top = (y + 15) + 'px';
            });

            marker.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
            });
        });

        // 【修正點 2】：防呆版開發者定位工具
        wrapper.addEventListener('click', (e) => {
            const rect = wrapper.getBoundingClientRect();
            const leftPercent = ((e.clientX - rect.left) / rect.width) * 100;
            const topPercent = ((e.clientY - rect.top) / rect.height) * 100;
            
            const styleString = `top: ${topPercent.toFixed(2)}%; left: ${leftPercent.toFixed(2)}%;`;
            
            // 改用 prompt 跳出對話框，這招在 file:/// 也能 100% 成功複製
            prompt('📍 座標抓取成功！請直接按下 Ctrl+C / Cmd+C 複製：', styleString);
        });

    } catch (err) {
        console.error('地圖檔案載入失敗，請確認 world.svg 與 index.html 在同一資料夾', err);
    }
}

                // <div class="marker" style="top: 39.03%; left: 26.58%;" data-info="<h3>西雅圖</h3><p>美國</p>"></div>
                // <div class="marker" style="top: 43.68%; left: 27.42%;" data-info="<h3>拉斯維加斯</h3><p>美國</p>"></div>
                // <div class="marker" style="top: 45.54%; left: 27.97%;" data-info="<h3>亞歷桑那</h3><p>美國</p>"></div>
                // <div class="marker" style="top: 43.87%; left: 71.28%;" data-info="<h3>北京</h3><p>中國</p>"></div>
                // <div class="marker" style="top: 48.14%; left: 73.23%;" data-info="<h3>上海</h3><p>中國</p>"></div>
                // <div class="marker" style="top: 48.33%; left: 72.49%;" data-info="<h3>蘇杭</h3><p>中國</p>"></div>
                // <div class="marker" style="top: 53.16%; left: 71.75%;" data-info="<h3>港澳</h3><p>中國</p>"></div>
                // <div class="marker" style="top: 55.02%; left: 71.47%;" data-info="<h3>海南</h3><p>中國</p>"></div>
                // <div class="marker" style="top: 52.60%; left: 64.50%;" data-info="<h3>新德里</h3><p>印度</p>"></div>
                // <div class="marker" style="top: 53.53%; left: 65.43%;" data-info="<h3>瓦拉納西</h3><p>印度</p>"></div>
                // <div class="marker" style="top: 35.68%; left: 139.69%;" data-info="<h3>海得拉巴</h3><p>印度</p>"></div>
                // <div class="marker" style="top: 31.23%; left: 121.47%;" data-info="<h3>胡志明</h3><p>越南</p>"></div>
                // <div class="marker" style="top: 28.61%; left: 77.20%;" data-info="<h3>曼谷</h3><p>泰國</p>"></div>
                // <div class="marker" style="top: 35.68%; left: 139.69%;" data-info="<h3>吉隆坡</h3><p>馬來西亞</p>"></div>
                // <div class="marker" style="top: 1.29%; left: 103.85%;" data-info="<h3>馬六甲</h3><p>馬來西亞</p>"></div>
                // <div class="marker" style="top: 1.35%; left: 103.82%;" data-info="<h3>新加坡</h3><p>新加坡</p>"></div>
                // <div class="marker" style="top: 13.41%; left: 122.56%;" data-info="<h3>宿霧</h3><p>菲律賓</p>"></div>
                // <div class="marker" style="top: 8.34%; left: 115.17%;" data-info="<h3>科摩多島</h3><p>印尼</p>"></div>
                // <div class="marker" style="top: 20.59%; left: 106.85%;" data-info="<h3>峇厘島</h3><p>印尼</p>"></div>
                // <div class="marker" style="top: 35.68%; left: 139.69%;" data-info="<h3>東京</h3><p>日本</p>"></div>
                // <div class="marker" style="top: 34.69%; left: 135.50%;" data-info="<h3>大阪</h3><p>日本</p>"></div>
                // <div class="marker" style="top: 35.68%; left: 139.69%;" data-info="<h3>京都</h3><p>日本</p>"></div>
                // <div class="marker" style="top: 35.68%; left: 139.69%;" data-info="<h3>沖繩</h3><p>日本</p>"></div>
                // <div class="marker" style="top: 37.77%; left: 122.42%;" data-info="<h3>北海道</h3><p>日本</p>"></div>
                // <div class="marker" style="top: 35.68%; left: 139.69%;" data-info="<h3>名古屋</h3><p>日本</p>"></div>
                // <div class="marker" style="top: 35.68%; left: 139.69%;" data-info="<h3>高山</h3><p>日本</p>"></div>
                // <div class="marker" style="top: 35.68%; left: 139.69%;" data-info="<h3>釜山</h3><p>韓國</p>"></div>
