// script.js - 最終邏輯版 (修正水平模式標題凸顯)

// 獲取 body 元素
const body = document.body;

// 創建一個回到首頁的按鈕，並直接加到 body 裡
const homeButton = document.createElement('a');
homeButton.href = '#'; // 使用 # 避免頁面跳轉
homeButton.textContent = 'Cheng-Hsuan, Hsieh 謝承軒';
homeButton.className = 'btn home-button';
body.appendChild(homeButton);

// ---------------------------------
// 網站主標題與個人資訊
// ---------------------------------
const title = document.createElement('h1');
title.innerHTML = '謝承軒 (Cheng-Hsuan, Hsieh)';
body.appendChild(title);

const profileContainer = document.createElement('div');
profileContainer.className = 'profile-container'; 
body.appendChild(profileContainer);

// ===================================
// 1. 模式一 (預設): 雙卡並排容器
// ===================================

// 1a. 區塊一: 自拍照與聯絡資訊卡片
const profileCard = document.createElement('div');
profileCard.className = 'card profileCard'; 
profileContainer.appendChild(profileCard);

const photo = document.createElement('img');
photo.src = '106031240_謝承軒.jpg';
photo.alt = '我的個人照片';
photo.className = 'profile-photo';
profileCard.appendChild(photo);

const bio = document.createElement('p');

// 1. 設置「數位IC設計與系統整合」為 bio 內容的第一行
bio.innerHTML = '數位IC設計與系統整合<br>'; // <--- 修正：使用 innerHTML 設置第一行，並強制換行
bio.innerHTML += '<br>';

const emailLink = document.createElement('a');
emailLink.href = 'mailto:frank8771919@gmail.com';
emailLink.textContent = 'frank8771919@gmail.com';
emailLink.className = 'email-link';

// 2. 在 Email 文字之前，插入一個 Email 標籤和空格
const emailLabel = document.createTextNode('Email:   ');
bio.appendChild(emailLabel); // <--- 新增：插入 "Email:   " 文字標籤

bio.appendChild(emailLink); // 3. 附加 Email 連結
profileCard.appendChild(bio); // 4. 附加到卡片

// --- 社群連結 (Placeholder for Icons) ---
const socialLinksContainer = document.createElement('div');
socialLinksContainer.textContent = '社群連結: ';
socialLinksContainer.className = 'social-links'; // 父容器

// 創建 GitHub 連結
const githubLink = document.createElement('a');
githubLink.href = 'https://github.com/your-repo';
githubLink.textContent = 'GitHub';
githubLink.className = 'social-link-item'; // <-- 新增的 Class
socialLinksContainer.appendChild(githubLink);

// 添加分隔符
const separator = document.createTextNode(' | ');
socialLinksContainer.appendChild(separator);

// 創建 LinkedIn 連結
const linkedinLink = document.createElement('a');
linkedinLink.href = 'https://www.linkedin.com/in/chhsieh0719';
linkedinLink.textContent = 'LinkedIn';
linkedinLink.className = 'social-link-item'; // <-- 新增的 Class
socialLinksContainer.appendChild(linkedinLink);

profileCard.appendChild(socialLinksContainer); // 將整個容器加到卡片裡

// 1b. 區塊二: 整合資訊選單卡片
const infoCard = document.createElement('div');
infoCard.className = 'card infoCard'; 
profileContainer.appendChild(infoCard);

const menuTitlesArray = []; // 儲存所有標題元素，用於事件監聽

// 收集所有選單標題，並設置 class 和 data-target 屬性
const menuItems = [
    { text: '關於我', target: 'about-content' },
    { text: '學歷', target: 'education-content' },
    { text: '核心技能', target: 'skills-content' },
    { text: '研究領域與成果', target: 'research-content' },
    { text: '其他興趣', target: 'interest-content' }
];

menuItems.forEach(item => {
    const menuTitle = document.createElement('h2');
    menuTitle.textContent = item.text;
    menuTitle.classList.add('menu-title');
    menuTitle.setAttribute('data-target', item.target);
    infoCard.appendChild(menuTitle);
    menuTitlesArray.push(menuTitle); // 儲存到陣列中
});



// ===================================
// 2. 模式二 (隱藏): 水平導覽列 (用於內容展示時的固定選單)
// ===================================
const navBar = document.createElement('div');
navBar.id = 'main-nav-bar';
navBar.className = 'nav-bar';
title.insertAdjacentElement('afterend', navBar);

// 2a. 導覽列中的照片 (獨立複製，用於水平展示)
const navPhoto = document.createElement('img');
navPhoto.src = '106031240_謝承軒.jpg';
navPhoto.alt = '我的個人照片';
navPhoto.className = 'nav-photo';
navPhoto.title = '點擊回到主頁面';
navBar.appendChild(navPhoto);

// 2b. 導覽列中的選單容器
const navMenuWrapper = document.createElement('div');
navMenuWrapper.className = 'nav-menu-wrapper';
navBar.appendChild(navMenuWrapper);

// 2c. 複製所有選單標題到導覽列中
menuTitlesArray.forEach(originalTitle => {
    const clonedTitle = originalTitle.cloneNode(true);
    clonedTitle.classList.add('nav-menu-title'); // 新增 class
    navMenuWrapper.appendChild(clonedTitle);
});

//內容展示區域
const contentDisplay = document.createElement('div');
contentDisplay.id = 'content-display';
contentDisplay.className = 'content-display';
body.appendChild(contentDisplay);

// 內容模組 A: 關於我
const aboutContent = `
    <p>一位專注於<strong>數位積體電路設計</strong>的工程師，具備跨領域的生物系統晶片開發與系統整合經驗。</p>
    <p>主要專注於利用 CMOS 晶片開發適應性、可攜式快速生物檢測平台，實現裝置小型化與端到端檢測分析。</p>`;

const educationContent = `
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

    </div>
`;

const skillsContent = `
    <ul>
        <li>數位積體電路設計 (Verilog, SystemVerilog)</li>
        <li>EDA 工具 (Cadence, Synopsys)</li>
        <li>軟體開發 (Python, C++, JavaScript)</li>
    </ul>
`;

// 內容映射 (用於點擊事件)
const contentMap = {
    'about-content': aboutContent,
    'education-content': educationContent,
    'skills-content': skillsContent
};



// ===================================
// 3. JavaScript 互動邏輯 (核心)
// ===================================

const menuTitles = infoCard.querySelectorAll('.menu-title');
const navMenuTitles = navMenuWrapper.querySelectorAll('.menu-title');

// 函數：處理點擊事件 (觸發頁面轉換)
function handleMenuClick(event) {
    const targetId = event.currentTarget.getAttribute('data-target');
    const targetContent = contentMap[targetId];
    
    // 1. 進入內容展示模式
    document.body.classList.add('content-open'); 
    
    // 2. 【核心】切換內容
    contentDisplay.innerHTML = targetContent;
    
    // 3. 【新增邏輯】處理水平導覽列中的標題高亮 (不變)
    navMenuTitles.forEach(navTitle => {
        navTitle.classList.remove('active');
    });
    
    // 為被點擊的標題加上 active 狀態
    event.currentTarget.classList.add('active');
    
    // 由於 navMenuTitles 是由原始 menuTitles clone 過來的，
    // 點擊 nav-bar 內的標題時，也要找到並設定對應的 active 狀態。
    // 使用 targetId 來同步狀態
    const clickedTargetId = event.currentTarget.getAttribute('data-target');
    document.querySelectorAll(`.nav-menu-wrapper .menu-title[data-target="${clickedTargetId}"]`).forEach(el => {
        el.classList.add('active');
    });

    console.log(`Content section activated for: ${targetId}`);
}

// 函數：滑鼠懸停 (凸顯) - 適用於模式一的標題
function handleMouseOver(event) {
    if (document.body.classList.contains('content-open')) return;

    menuTitles.forEach(el => {
        el.classList.add('dimmed');
    });

    event.currentTarget.classList.remove('dimmed');
    event.currentTarget.classList.add('highlight');
}

// 函數：滑鼠移開 (恢復) - 適用於模式一的標題
function handleMouseOut() {
    if (document.body.classList.contains('content-open')) return;
    
    menuTitles.forEach(el => {
        el.classList.remove('dimmed');
        el.classList.remove('highlight');
    });
}


// 函數：點擊照片/卡片恢復原狀的邏輯
function handleRestoreClick(event) {
    event.stopPropagation(); 
    
    if (document.body.classList.contains('content-open')) {
        document.body.classList.remove('content-open');
        
        // 【新增邏輯】恢復原狀時，清除所有標題的 active 狀態
        navMenuTitles.forEach(navTitle => {
            navTitle.classList.remove('active');
        });
    }
}


// ---------------------------------
// 事件監聽器設定
// ---------------------------------

// 1. 為所有模式一標題添加 點擊/懸停 事件
menuTitles.forEach(titleElement => {
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


// 5. homeButton 點擊事件 (恢復原狀)
homeButton.addEventListener('click', (e) => {
    e.preventDefault(); 
    document.body.classList.remove('content-open');
    navMenuTitles.forEach(navTitle => { // 確保清除 active 狀態
        navTitle.classList.remove('active');
    });
});