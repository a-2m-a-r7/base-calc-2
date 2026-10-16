/* ========================================
   BaseCalc2 — Innovation University
   Application Logic & Interactivity
   ======================================== */

// ── Utility: Sound Effects using Web Audio API ──
const AudioFX = (() => {
    let ctx = null;

    function getContext() {
        if (!ctx) {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        return ctx;
    }

    function play(freq, duration = 0.08, type = 'sine', volume = 0.15) {
        try {
            const c = getContext();
            const osc = c.createOscillator();
            const gain = c.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, c.currentTime);
            gain.gain.setValueAtTime(volume, c.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
            osc.connect(gain);
            gain.connect(c.destination);
            osc.start(c.currentTime);
            osc.stop(c.currentTime + duration);
        } catch (e) { /* silent fail */ }
    }

    return {
        click: () => play(800, 0.06, 'sine', 0.1),
        success: () => {
            play(523, 0.12, 'sine', 0.12);
            setTimeout(() => play(659, 0.12, 'sine', 0.12), 100);
            setTimeout(() => play(784, 0.18, 'sine', 0.12), 200);
        },
        error: () => play(200, 0.2, 'square', 0.1),
        swap: () => play(600, 0.1, 'triangle', 0.1),
        copy: () => play(1000, 0.08, 'sine', 0.08),
        remove: () => play(300, 0.1, 'sawtooth', 0.06)
    };
})();

// ── Utility: Confetti ──
const Confetti = (() => {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let running = false;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticle() {
        const colors = ['#B794F6', '#9B7DFF', '#FF6B9D', '#FFA94D', '#69DB7C', '#74C0FC', '#D4BBFF'];
        return {
            x: Math.random() * canvas.width,
            y: -10,
            w: Math.random() * 10 + 5,
            h: Math.random() * 6 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 4,
            vy: Math.random() * 3 + 2,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            opacity: 1
        };
    }

    function animate() {
        if (!running) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05;
            p.rotation += p.rotationSpeed;
            p.opacity -= 0.005;

            if (p.opacity <= 0 || p.y > canvas.height) {
                particles.splice(i, 1);
                return;
            }

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        });

        if (particles.length > 0) {
            requestAnimationFrame(animate);
        } else {
            running = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    return {
        fire() {
            resize();
            particles = [];
            for (let i = 0; i < 80; i++) {
                particles.push(createParticle());
            }
            running = true;
            animate();
        }
    };
})();

// ── Utility: Particles Background ──
const Particles = (() => {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let dots = [];
    let animId = null;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function init() {
        resize();
        dots = [];
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 18000), 60);
        for (let i = 0; i < count; i++) {
            dots.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 2 + 0.5,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.3 + 0.1
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        dots.forEach(d => {
            d.x += d.vx;
            d.y += d.vy;
            if (d.x < 0) d.x = canvas.width;
            if (d.x > canvas.width) d.x = 0;
            if (d.y < 0) d.y = canvas.height;
            if (d.y > canvas.height) d.y = 0;

            ctx.beginPath();
            ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(183, 148, 246, ${d.opacity})`;
            ctx.fill();
        });
        animId = requestAnimationFrame(draw);
    }

    return {
        start() { init(); draw(); },
        resize() {
            resize();
            const count = Math.min(Math.floor((canvas.width * canvas.height) / 18000), 60);
            while (dots.length > count) dots.pop();
            while (dots.length < count) {
                dots.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    r: Math.random() * 2 + 0.5,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    opacity: Math.random() * 0.3 + 0.1
                });
            }
        }
    };
})();

// ── Core: Base Conversion Engine ──
const BaseEngine = (() => {
    const HEX_CHARS = '0123456789ABCDEF';

    function validate(value, base) {
        if (!value || value.trim() === '') return { valid: false, error: 'Please enter a number.' };
        const v = value.trim().toUpperCase();
        const validChars = HEX_CHARS.slice(0, base);
        for (let i = 0; i < v.length; i++) {
            if (!validChars.includes(v[i])) {
                const baseNames = { 2: 'Binary', 8: 'Octal', 10: 'Decimal', 16: 'Hexadecimal' };
                return {
                    valid: false,
                    error: `Invalid digit "${v[i]}" for ${baseNames[base]} (Base ${base}). Valid digits: ${validChars.split('').join(', ')}`
                };
            }
        }
        return { valid: true };
    }

    function toDecimal(value, fromBase) {
        const v = value.trim().toUpperCase();
        let decimal = 0;
        const steps = [];

        if (fromBase === 10) {
            decimal = parseInt(v, 10);
            steps.push(`<strong>${v}</strong> is already in <span class="highlight">Decimal</span>.`);
            return { decimal, steps };
        }

        const baseNames = { 2: 'Binary', 8: 'Octal', 16: 'Hexadecimal' };
        const digits = v.split('');
        const len = digits.length;
        const terms = [];

        digits.forEach((d, i) => {
            const digitVal = HEX_CHARS.indexOf(d);
            const power = len - 1 - i;
            const contribution = digitVal * Math.pow(fromBase, power);
            decimal += contribution;
            terms.push(`${d}×${fromBase}<sup>${power}</sup>`);
        });

        steps.push(
            `Convert <span class="highlight">${v}</span> from <strong>${baseNames[fromBase]}</strong> to Decimal:`
        );
        steps.push(`${terms.join(' + ')} = <span class="highlight">${decimal}</span>`);

        return { decimal, steps };
    }

    function fromDecimal(decimal, toBase) {
        if (decimal === 0) return { result: '0', steps: [`<span class="highlight">0</span> in any base is <span class="highlight">0</span>.`] };

        const baseNames = { 2: 'Binary', 8: 'Octal', 10: 'Decimal', 16: 'Hexadecimal' };
        const steps = [];
        const isNegative = decimal < 0;
        let num = Math.abs(decimal);

        if (toBase === 10) {
            return { result: decimal.toString(), steps: [`Result in Decimal: <span class="highlight">${decimal}</span>`] };
        }

        steps.push(`Convert <span class="highlight">${decimal}</span> from Decimal to <strong>${baseNames[toBase]}</strong>:`);

        const remainders = [];
        const divSteps = [];
        let current = num;

        while (current > 0) {
            const rem = current % toBase;
            const quotient = Math.floor(current / toBase);
            divSteps.push(`${current} ÷ ${toBase} = ${quotient} remainder <span class="highlight">${HEX_CHARS[rem]}</span>`);
            remainders.unshift(HEX_CHARS[rem]);
            current = quotient;
        }

        divSteps.forEach(s => steps.push(s));

        let result = remainders.join('');
        if (isNegative) result = '-' + result;

        steps.push(`Read remainders bottom-to-top: <span class="highlight">${result}</span>`);

        return { result, steps };
    }

    function convertAll(decimal) {
        return {
            bin: fromDecimal(decimal, 2).result,
            oct: fromDecimal(decimal, 8).result,
            dec: decimal.toString(),
            hex: fromDecimal(decimal, 16).result
        };
    }

    return { validate, toDecimal, fromDecimal, convertAll };
})();

// ── App State ──
const State = {
    currentTab: 'converter',
    history: JSON.parse(localStorage.getItem('basecalc2_history') || '[]'),
    stepsOpen: false,
    theme: localStorage.getItem('basecalc2_theme') || 'dark',
    operandCount: 2
};

// ── DOM Elements ──
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const DOM = {
    app: $('#app'),
    loadingScreen: $('#loading-screen'),

    // Tabs
    tabs: $$('.tab'),
    panelConverter: $('#panel-converter'),
    panelCalculator: $('#panel-calculator'),

    // Converter
    convInput: $('#conv-input'),
    convFromBase: $('#conv-from-base'),
    convToBase: $('#conv-to-base'),
    convClear: $('#conv-clear'),
    swapBases: $('#swap-bases'),
    btnConvert: $('#btn-convert'),

    // Calculator
    operandsContainer: $('#operands-container'),
    btnAddOperand: $('#btn-add-operand'),
    btnCalculate: $('#btn-calculate'),

    // Results
    resultsSection: $('#results-section'),
    resultBin: $('#result-bin'),
    resultOct: $('#result-oct'),
    resultDec: $('#result-dec'),
    resultHex: $('#result-hex'),

    // Steps
    stepsSection: $('#steps-section'),
    stepsToggle: $('#steps-toggle'),
    stepsContent: $('#steps-content'),
    toggleArrow: $('#toggle-arrow'),

    // History
    historyList: $('#history-list'),
    historyEmpty: $('#history-empty'),
    btnClearHistory: $('#btn-clear-history'),

    // Error
    errorContainer: $('#error-container'),
    errorMessage: $('#error-message'),

    // Theme
    themeToggle: $('#theme-toggle'),

    // Toast
    toast: $('#toast'),
    toastIcon: $('#toast-icon'),
    toastMessage: $('#toast-message'),

    // Header
    header: $('#header'),
};

// ── Toast Notification ──
let toastTimeout = null;
function showToast(message) {
    clearTimeout(toastTimeout);
    DOM.toastMessage.textContent = message;
    DOM.toast.classList.remove('hidden');

    requestAnimationFrame(() => {
        DOM.toast.classList.add('visible');
    });

    toastTimeout = setTimeout(() => {
        DOM.toast.classList.remove('visible');
        setTimeout(() => DOM.toast.classList.add('hidden'), 400);
    }, 2500);
}

// ── Error Display ──
function showError(msg) {
    DOM.errorMessage.textContent = msg;
    DOM.errorContainer.classList.remove('hidden');
    DOM.errorContainer.style.animation = 'none';
    DOM.errorContainer.offsetHeight; // force reflow
    DOM.errorContainer.style.animation = '';
    AudioFX.error();
}

function hideError() {
    DOM.errorContainer.classList.add('hidden');
}

// ── Tab Switching ──
function switchTab(tab) {
    State.currentTab = tab;
    DOM.tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tab));

    if (tab === 'converter') {
        DOM.panelConverter.classList.add('active');
        DOM.panelCalculator.classList.remove('active');
    } else {
        DOM.panelConverter.classList.remove('active');
        DOM.panelCalculator.classList.add('active');
    }

    hideError();
    AudioFX.click();
}

// ── Theme Toggle ──
function toggleTheme() {
    const isLight = document.body.classList.toggle('light-theme');
    State.theme = isLight ? 'light' : 'dark';
    localStorage.setItem('basecalc2_theme', State.theme);
    AudioFX.click();
}

function applyTheme() {
    if (State.theme === 'light') {
        document.body.classList.add('light-theme');
    }
}

// ── Display Results ──
function displayResults(results) {
    DOM.resultBin.textContent = results.bin;
    DOM.resultOct.textContent = results.oct;
    DOM.resultDec.textContent = results.dec;
    DOM.resultHex.textContent = results.hex;
    DOM.resultsSection.classList.remove('hidden');

    // Re-trigger animation
    DOM.resultsSection.style.animation = 'none';
    DOM.resultsSection.offsetHeight;
    DOM.resultsSection.style.animation = '';
}

// ── Display Steps ──
function displaySteps(steps) {
    DOM.stepsContent.innerHTML = steps.map((step, i) =>
        `<div class="step-item" style="animation-delay: ${i * 0.05}s">
            <span class="step-number">${i + 1}</span>
            <span class="step-text">${step}</span>
        </div>`
    ).join('');
    DOM.stepsSection.classList.remove('hidden');

    // Auto-open steps
    if (!State.stepsOpen) {
        toggleSteps();
    }
}

// ── Toggle Steps ──
function toggleSteps() {
    State.stepsOpen = !State.stepsOpen;
    DOM.stepsContent.classList.toggle('open', State.stepsOpen);
    DOM.toggleArrow.classList.toggle('open', State.stepsOpen);
    AudioFX.click();
}

// ── Converter: Convert ──
function doConvert() {
    hideError();
    const value = DOM.convInput.value.trim();
    const fromBase = parseInt(DOM.convFromBase.value);
    const toBase = parseInt(DOM.convToBase.value);

    const validation = BaseEngine.validate(value, fromBase);
    if (!validation.valid) {
        showError(validation.error);
        DOM.convInput.classList.add('error');
        setTimeout(() => DOM.convInput.classList.remove('error'), 2000);
        return;
    }

    const allSteps = [];
    const { decimal, steps: toDecSteps } = BaseEngine.toDecimal(value, fromBase);
    allSteps.push(...toDecSteps);

    const results = BaseEngine.convertAll(decimal);
    const { steps: fromDecSteps } = BaseEngine.fromDecimal(decimal, toBase);

    if (fromBase !== toBase) {
        allSteps.push(...fromDecSteps);
    }

    displayResults(results);
    displaySteps(allSteps);

    const baseNames = { 2: 'BIN', 8: 'OCT', 10: 'DEC', 16: 'HEX' };
    addToHistory(
        `${value.toUpperCase()} (${baseNames[fromBase]})`,
        `= ${results[{ 2: 'bin', 8: 'oct', 10: 'dec', 16: 'hex' }[toBase]]} (${baseNames[toBase]})`,
        'converter'
    );

    AudioFX.success();
    Confetti.fire();
}

// ── Swap Bases ──
function swapBases() {
    const temp = DOM.convFromBase.value;
    DOM.convFromBase.value = DOM.convToBase.value;
    DOM.convToBase.value = temp;
    AudioFX.swap();
}

// ── Calculator: Add Operand ──
function addOperand() {
    State.operandCount++;
    const idx = State.operandCount - 1;
    const container = DOM.operandsContainer;

    // Add operator row
    const opRow = document.createElement('div');
    opRow.className = 'operator-row';
    opRow.innerHTML = `
        <select class="select-input operator-select">
            <option value="+">+ Add</option>
            <option value="-">− Subtract</option>
            <option value="*">× Multiply</option>
            <option value="/">÷ Divide</option>
        </select>
    `;

    // Add operand row
    const row = document.createElement('div');
    row.className = 'operand-row';
    row.dataset.index = idx;
    row.innerHTML = `
        <div class="input-group operand-input-group">
            <label class="input-label">Operand ${idx + 1}</label>
            <input type="text" class="text-input mono operand-value" placeholder="e.g. 1010" autocomplete="off" spellcheck="false">
        </div>
        <div class="input-group operand-base-group">
            <label class="input-label">Base</label>
            <select class="select-input operand-base">
                <option value="2">BIN</option>
                <option value="8">OCT</option>
                <option value="10" selected>DEC</option>
                <option value="16">HEX</option>
            </select>
        </div>
        <button class="remove-operand-btn" title="Remove operand">✕</button>
    `;

    container.appendChild(opRow);
    container.appendChild(row);

    // Bind remove button
    row.querySelector('.remove-operand-btn').addEventListener('click', () => {
        container.removeChild(opRow);
        container.removeChild(row);
        State.operandCount--;
        renumberOperands();
        AudioFX.remove();
    });

    AudioFX.click();
}

function renumberOperands() {
    const rows = DOM.operandsContainer.querySelectorAll('.operand-row');
    rows.forEach((row, i) => {
        row.dataset.index = i;
        const label = row.querySelector('.input-label');
        if (label) label.textContent = `Operand ${i + 1}`;
    });
}

// ── Calculator: Calculate ──
function doCalculate() {
    hideError();

    const operandRows = DOM.operandsContainer.querySelectorAll('.operand-row');
    const operatorSelects = DOM.operandsContainer.querySelectorAll('.operator-select');

    if (operandRows.length < 2) {
        showError('Need at least 2 operands to calculate.');
        return;
    }

    const operands = [];
    const operators = [];
    const allSteps = [];
    const baseNames = { 2: 'BIN', 8: 'OCT', 10: 'DEC', 16: 'HEX' };

    // Gather and validate operands
    for (let i = 0; i < operandRows.length; i++) {
        const row = operandRows[i];
        const value = row.querySelector('.operand-value').value.trim();
        const base = parseInt(row.querySelector('.operand-base').value);

        const validation = BaseEngine.validate(value, base);
        if (!validation.valid) {
            showError(`Operand ${i + 1}: ${validation.error}`);
            row.querySelector('.operand-value').classList.add('error');
            setTimeout(() => row.querySelector('.operand-value').classList.remove('error'), 2000);
            return;
        }

        const { decimal, steps } = BaseEngine.toDecimal(value, base);
        allSteps.push(...steps);
        operands.push({ value: value.toUpperCase(), base, decimal });
    }

    // Gather operators
    operatorSelects.forEach(sel => operators.push(sel.value));

    // Perform chained calculation
    let result = operands[0].decimal;
    const expressionParts = [`${operands[0].decimal}`];

    for (let i = 0; i < operators.length; i++) {
        const op = operators[i];
        const nextVal = operands[i + 1].decimal;
        const opSymbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };

        expressionParts.push(opSymbols[op]);
        expressionParts.push(`${nextVal}`);

        switch (op) {
            case '+': result = result + nextVal; break;
            case '-': result = result - nextVal; break;
            case '*': result = result * nextVal; break;
            case '/':
                if (nextVal === 0) {
                    showError('Cannot divide by zero!');
                    return;
                }
                result = Math.floor(result / nextVal);
                break;
        }
    }

    allSteps.push(`<strong>Calculation:</strong> ${expressionParts.join(' ')} = <span class="highlight">${result}</span>`);

    // Convert result to all bases
    const results = BaseEngine.convertAll(result);

    allSteps.push(`<strong>Final result in all bases:</strong>`);
    allSteps.push(`Binary: <span class="highlight">${results.bin}</span>`);
    allSteps.push(`Octal: <span class="highlight">${results.oct}</span>`);
    allSteps.push(`Decimal: <span class="highlight">${results.dec}</span>`);
    allSteps.push(`Hexadecimal: <span class="highlight">${results.hex}</span>`);

    displayResults(results);
    displaySteps(allSteps);

    // Build expression string for history
    const exprStr = operands.map((op, i) => {
        let s = `${op.value}(${baseNames[op.base]})`;
        if (i < operators.length) {
            const sym = { '+': '+', '-': '−', '*': '×', '/': '÷' };
            s += ` ${sym[operators[i]]} `;
        }
        return s;
    }).join('');

    addToHistory(exprStr, `= ${result} (DEC)`, 'calculator');

    AudioFX.success();
    Confetti.fire();
}

// ── History Management ──
function addToHistory(expression, result, type) {
    const entry = {
        id: Date.now(),
        expression,
        result,
        type,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    State.history.unshift(entry);
    if (State.history.length > 50) State.history.pop();
    saveHistory();
    renderHistory();
}

function saveHistory() {
    localStorage.setItem('basecalc2_history', JSON.stringify(State.history));
}

function renderHistory() {
    if (State.history.length === 0) {
        DOM.historyList.innerHTML = `
            <div class="history-empty" id="history-empty">
                <svg class="empty-svg-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.4"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>
                <p>No calculations yet. Start converting!</p>
            </div>
        `;
        return;
    }

    DOM.historyList.innerHTML = State.history.map(entry => `
        <div class="history-item" data-id="${entry.id}">
            <div class="history-item-content">
                <span class="history-expression">${escapeHtml(entry.expression)}</span>
                <span class="history-result">${escapeHtml(entry.result)}</span>
            </div>
            <span class="history-time">${entry.time}</span>
            <button class="history-delete" title="Delete" data-id="${entry.id}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
        </div>
    `).join('');

    // Bind delete buttons
    DOM.historyList.querySelectorAll('.history-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            State.history = State.history.filter(h => h.id !== id);
            saveHistory();
            renderHistory();
            AudioFX.remove();
        });
    });
}

function clearHistory() {
    if (State.history.length === 0) return;
    State.history = [];
    saveHistory();
    renderHistory();
    showToast('History cleared');
    AudioFX.remove();
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ── Copy to Clipboard ──
function copyResult(targetId) {
    const el = document.getElementById(targetId);
    if (!el || el.textContent === '—') return;

    navigator.clipboard.writeText(el.textContent).then(() => {
        const btn = document.querySelector(`[data-target="${targetId}"]`);
        if (btn) {
            btn.classList.add('copied');
            setTimeout(() => btn.classList.remove('copied'), 1000);
        }
        showToast('Copied to clipboard!');
        AudioFX.copy();
    }).catch(() => {
        // Fallback
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        document.execCommand('copy');
        sel.removeAllRanges();
        showToast('Copied!');
        AudioFX.copy();
    });
}

// ── Header Scroll Effect ──
function handleScroll() {
    DOM.header.classList.toggle('scrolled', window.scrollY > 10);
}

// ── Loading Screen ──
function hideLoadingScreen() {
    DOM.loadingScreen.classList.add('fade-out');
    DOM.app.classList.remove('hidden');
    requestAnimationFrame(() => {
        DOM.app.classList.add('visible');
    });
    setTimeout(() => {
        DOM.loadingScreen.style.display = 'none';
    }, 600);
}

// ── Event Bindings ──
function bindEvents() {
    // Tabs
    DOM.tabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // Converter
    DOM.btnConvert.addEventListener('click', doConvert);
    DOM.convClear.addEventListener('click', () => {
        DOM.convInput.value = '';
        DOM.convInput.focus();
        AudioFX.click();
    });
    DOM.swapBases.addEventListener('click', swapBases);

    // Calculator
    DOM.btnAddOperand.addEventListener('click', addOperand);
    DOM.btnCalculate.addEventListener('click', doCalculate);

    // Steps toggle
    DOM.stepsToggle.addEventListener('click', toggleSteps);

    // History
    DOM.btnClearHistory.addEventListener('click', clearHistory);

    // Theme
    DOM.themeToggle.addEventListener('click', toggleTheme);

    // Copy buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => copyResult(btn.dataset.target));
    });

    // Scroll
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Resize
    window.addEventListener('resize', () => {
        Particles.resize();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Enter to convert/calculate
        if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey) {
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT') {
                e.preventDefault();
                if (State.currentTab === 'converter') {
                    doConvert();
                } else {
                    doCalculate();
                }
            }
        }

        // Ctrl shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case '1':
                    e.preventDefault();
                    switchTab('converter');
                    break;
                case '2':
                    e.preventDefault();
                    switchTab('calculator');
                    break;
                case 'l':
                case 'L':
                    e.preventDefault();
                    if (State.currentTab === 'converter') {
                        DOM.convInput.value = '';
                        DOM.convInput.focus();
                    }
                    AudioFX.click();
                    break;
                case 'h':
                case 'H':
                    e.preventDefault();
                    clearHistory();
                    break;
                case 'd':
                case 'D':
                    e.preventDefault();
                    toggleTheme();
                    break;
            }
        }
    });

    // Auto-uppercase hex input
    DOM.convInput.addEventListener('input', () => {
        const pos = DOM.convInput.selectionStart;
        DOM.convInput.value = DOM.convInput.value.toUpperCase();
        DOM.convInput.selectionStart = pos;
        DOM.convInput.selectionEnd = pos;
    });

    // Remove operand buttons for initial rows (bind existing)
    DOM.operandsContainer.querySelectorAll('.remove-operand-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const row = this.closest('.operand-row');
            const prevOp = row.previousElementSibling;
            if (prevOp && prevOp.classList.contains('operator-row')) {
                prevOp.remove();
            }
            row.remove();
            State.operandCount--;
            renumberOperands();
            AudioFX.remove();
        });
    });
}

// ── Hide Loading Screen ──
function hideLoadingScreen() {
    if (DOM.loadingScreen) {
        DOM.loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            DOM.loadingScreen.style.display = 'none';
        }, 600);
    }
    if (DOM.app) {
        DOM.app.classList.remove('hidden');
    }
}

// ── Initialize ──
function init() {
    applyTheme();
    bindEvents();
    renderHistory();
    Particles.start();

    // Show app after loading animation
    setTimeout(hideLoadingScreen, 1800);
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
