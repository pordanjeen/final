// ฟังก์ชันสุ่มราคาหุ้นให้ดูเหมือนตลาดกำลังเปิดอยู่จริง
function updateStockPrices() {
    const prices = document.querySelectorAll('.stock-price');

    prices.forEach(priceEl => {
        // ดึงราคาปัจจุบันออกมา
        let currentPrice = parseFloat(priceEl.innerText.replace('$', '').replace(',', ''));

        // สุ่มการเปลี่ยนแปลง -0.5% ถึง +0.5%
        let changePercent = (Math.random() - 0.5) * 0.01;
        let newPrice = currentPrice + (currentPrice * changePercent);

        // แสดงผล
        priceEl.innerText = `$${newPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        // เปลี่ยนสีตามการขึ้นลง (เขียว/แดง)
        if (changePercent > 0) {
            priceEl.style.color = '#2da44e'; // เขียว
            flashElement(priceEl, 'flash-green');
        } else {
            priceEl.style.color = '#da3633'; // แดง
            flashElement(priceEl, 'flash-red');
        }
    });
}

// ช่วยเพิ่มคลาสชั่วคราวสำหรับเอฟเฟกต์กะพริบ
function flashElement(el, className) {
    el.classList.add(className);
    setTimeout(() => {
        el.classList.remove(className);
    }, 300);
}

// สั่งให้ทำงานทุกๆ 3 วินาที
setInterval(updateStockPrices, 3000);

// ฟังก์ชันทำให้ตัวเลขวิ่ง (เช่น ยอดเงิน)
function animateNumbers() {
    const counters = document.querySelectorAll('.animate-num');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target'); // ดึงค่าเป้าหมาย
        const speed = 200; // ความเร็ว

        const updateCount = () => {
            const count = +counter.innerText.replace('$', '').replace(',', '');
            const inc = target / speed;
            if (count < target) {
                counter.innerText = `$${Math.ceil(count + inc).toLocaleString()}`;
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = `$${target.toLocaleString()}`;
            }
        };
        updateCount();
    });
}

// เรียกใช้งานเมื่อโหลดหน้าเสร็จ
window.onload = () => {
    if (document.querySelector('.animate-num')) animateNumbers();
};

// ฟังก์ชันใหม่สำหรับแสดงรายละเอียดตลาดใน modal
function showMarketDetail() {
    // สร้างหน้าต่างจำลอง (Beautiful Modal with Glass Effect)
    const modalHtml = `
        <div id="customModal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); display:flex; justify-content:center; align-items:center; z-index:1000; backdrop-filter: blur(5px);">
            <div class="glass-panel" style="padding:40px; max-width:550px; text-align:center; color:white;">
                <h2>📊 Global Market Insights</h2>
                <p style="margin:20px 0; font-size:1rem; line-height:1.8;">
                    ตลาดขณะนี้มีความผันผวน <span style="color:#d4af37; font-weight:bold;">0.5%</span> 
                    <br><br>
                    แนะนำให้กระจายพอร์ตการลงทุนในกลุ่ม 
                    <span style="color:#2da44e; font-weight:bold;">Tech</span> และ 
                    <span style="color:#2da44e; font-weight:bold;">Energy</span> 
                    เพื่อลดความเสี่ยง
                </p>
                <button onclick="closeMarketModal()" class="btn-action" style="margin-top: 25px; padding: 12px 30px; font-size: 1rem;">
                    ✓ Close <i class="fas fa-times" style="margin-left:8px;"></i>
                </button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// ฟังก์ชันปิด modal อย่างราบรื่น
function closeMarketModal() {
    const modal = document.getElementById('customModal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease-in-out forwards';
        setTimeout(() => modal.remove(), 300);
    }
}

function updatePortfolioStatus() {
    if (!localStorage.getItem('my_stocks')) {
        const sampleHoldings = [
            { symbol: 'AAPL', quantity: 10, avgPrice: 150 },
            { symbol: 'MSFT', quantity: 5, avgPrice: 400 },
            { symbol: 'GOOGL', quantity: 3, avgPrice: 140 }
        ];
        localStorage.setItem('my_stocks', JSON.stringify(sampleHoldings));
    }
    const myStocks = JSON.parse(localStorage.getItem('my_stocks')) || [];
    let totalPL = 0, totalEquity = 25000, holdingsList = [];
    myStocks.forEach(stock => {
        const stockCard = document.querySelector(`[data-symbol="${stock.symbol}"]`);
        let currentPrice = stock.avgPrice;
        if (stockCard && stockCard.querySelector('.stock-price')) {
            const priceText = stockCard.querySelector('.stock-price').innerText.replace('$', '').replace(',', '');
            currentPrice = parseFloat(priceText) || stock.avgPrice;
        }
        const profit = (currentPrice - stock.avgPrice) * stock.quantity;
        const profitPercent = ((currentPrice - stock.avgPrice) / stock.avgPrice * 100).toFixed(2);
        totalPL += profit; totalEquity += currentPrice * stock.quantity;
        holdingsList.push({ symbol: stock.symbol, quantity: stock.quantity, avgPrice: stock.avgPrice.toFixed(2), currentPrice: currentPrice.toFixed(2), profit: profit.toFixed(2), profitPercent: profitPercent });
    });
    const plDisplay = document.getElementById('total-pl');
    if (plDisplay) { plDisplay.innerText = (totalPL >= 0 ? '+' : '') + totalPL.toFixed(2); plDisplay.style.color = totalPL >= 0 ? '#2da44e' : '#da3633'; }
    const equityDisplay = document.getElementById('total-equity');
    if (equityDisplay) { equityDisplay.innerText = '$' + totalEquity.toFixed(2); }
    const holdingListEl = document.getElementById('holding-list');
    if (holdingListEl) {
        holdingListEl.innerHTML = holdingsList.length === 0 ? '<div style="text-align:center; color:rgba(255,255,255,0.5);">No holdings</div>' : holdingsList.map(h => `<div class="holding-card ${h.profit >= 0 ? 'gain' : 'loss'}"><div class="holding-info"><div class="holding-symbol">${h.symbol}</div><div class="holding-qty">${h.quantity} Shares @ $${h.avgPrice}</div></div><div class="holding-pl"><div class="holding-pl-value ${h.profit >= 0 ? 'pl-positive' : 'pl-negative'}">${h.profit >= 0 ? '+' : ''}$${h.profit} (${h.profitPercent}%)</div><div style="font-size:0.85rem;color:rgba(255,255,255,0.6);">$${h.currentPrice}</div></div></div>`).join('');
    }
}
window.addEventListener('load', () => {
    updatePortfolioStatus();

    // จัดการ Navbar Active State
    const currentPage = window.location.pathname.split('/').pop() || 'home.html';
    document.querySelectorAll('.nav-item').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'home.html')) {
            link.classList.add('active');
        }
    });
});
setInterval(updatePortfolioStatus, 3000);

// ===================================================
// ฟังก์ชันร่วมสำหรับทุกหน้า (Shared Utilities)
// ===================================================

/**
 * ออกจากระบบ: ล้าง session แล้ว redirect ไปหน้า signin
 */
function handleLogout() {
    localStorage.removeItem('stonkstock_loggedIn');
    localStorage.removeItem('stonkstock_user');
    window.location.href = 'signin.html';
}

/**
 * แสดงชื่อผู้ใช้ใน navbar (#display-username)
 * และตั้ง active class ให้ link ที่ตรงกับหน้าปัจจุบัน
 */
function initNavbar() {
    // แสดง username
    const user = localStorage.getItem('stonkstock_user') || '';
    const el = document.getElementById('display-username');
    if (el && user) {
        el.textContent = '👤 ' + user;
    }

    // Redirect ถ้ายังไม่ได้ login (ให้ข้ามสำหรับหน้า signin/signup)
    const publicPages = ['signin.html', 'signup.html', 'inup.html'];
    const currentPage = window.location.pathname.split('/').pop() || 'home.html';
    const isPublic = publicPages.some(p => currentPage.includes(p));
    if (!isPublic && !localStorage.getItem('stonkstock_loggedIn')) {
        window.location.href = 'signin.html';
        return;
    }

    // Active nav link
    document.querySelectorAll('.main-nav .nav-item').forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href && currentPage.includes(href.split('?')[0])) {
            link.classList.add('active');
        }
    });
}

// เรียก initNavbar เมื่อ DOM พร้อม
document.addEventListener('DOMContentLoaded', initNavbar);
