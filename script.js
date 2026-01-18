// ==========================================
// Service Worker Registration (PWA Support)
// ==========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js')
            .then(function(registration) {
                console.log('Service Worker registered successfully:', registration);
            })
            .catch(function(error) {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// ==========================================
// Smooth scrolling for navigation links
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add animation to cards on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideIn 0.6s ease-out';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.resource-card, .emergency-card, .feature').forEach(card => {
    observer.observe(card);
});

// Add click feedback for emergency buttons
document.querySelectorAll('.emergency-btn, .card-link, .cta-button').forEach(button => {
    button.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 100);
    });
});

// Keyboard accessibility - allow Enter key on any clickable element
document.querySelectorAll('[role="button"], a').forEach(element => {
    element.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.click();
        }
    });
});

// Add visual feedback for links
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('mouseenter', function() {
        if (!this.classList.contains('emergency-btn') && 
            !this.classList.contains('card-link') && 
            !this.classList.contains('cta-button')) {
            this.style.textDecoration = 'underline';
        }
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.textDecoration = '';
    });
});

// Log to console on page load for debugging
console.log('Mental Health Resources landing page loaded successfully');
console.log('Emergency hotlines are accessible via the red banner at the top');

// ===== ChatGPT Codex Assistant, Search, Assessments, and PWA =====
(function() {
    const crisisKeywords = ['suicide', 'self-harm', 'kill myself', 'ending my life', 'hurt others', 'overdose', '911', 'emergency'];
    const crisisResponse = {
        en: 'I detect possible crisis language. Please use these options now: Call 9-8-8 or 911, Text 9-8-8, Kids Help Phone 1-800-668-6868 (text 686868), Hope for Wellness 1-855-242-3310. I will not provide other advice until you connect with a crisis responder.',
        fr: "Je détecte un langage de crise. Options immédiates : Appeler 9-8-8 ou le 911, Texto 9-8-8, Jeunesse, J'écoute 1-800-668-6868 (texto 686868), Espoir pour le mieux-être 1-855-242-3310. Je ne fournirai pas d'autres conseils tant que vous n'avez pas contacté un intervenant."
    };

    const resourceCatalog = [
        { title: '9-8-8 Suicide Crisis Helpline', topic: ['crisis'], province: ['ALL'], language: ['en','fr'], cost: 'free', type: 'hotline', url: 'tel:988', note: 'Call/Text 24/7' },
        { title: 'Talk Suicide Canada (1-833-456-4566)', topic: ['crisis'], province: ['ALL'], language: ['en','fr'], cost: 'free', type: 'hotline', url: 'tel:18334564566', note: '24/7 phone; text 45645 (4pm–midnight ET)' },
        { title: 'Kids Help Phone (youth)', topic: ['youth','crisis'], province: ['ALL'], language: ['en','fr'], cost: 'free', type: 'hotline', url: 'tel:18006686868', note: 'Text CONNECT to 686868' },
        { title: 'Hope for Wellness (Indigenous)', topic: ['indigenous','crisis'], province: ['ALL'], language: ['en','fr'], cost: 'free', type: 'hotline', url: 'tel:18552423310', note: '24/7 phone + chat' },
        { title: 'Panic Attack Self-Help Guide', topic: ['panic','anxiety'], province: ['ALL'], language: ['en'], cost: 'free', type: 'guide', url: 'Panic_Attack_Self_Help_Guide.md' },
        { title: 'Healthy Habits & Depression Recovery', topic: ['depression'], province: ['ALL'], language: ['en'], cost: 'free', type: 'guide', url: 'Healthy_Habits_Depression_Recovery.md' },
        { title: 'Canada Mental Health Directory', topic: ['guides','depression','panic'], province: ['ALL'], language: ['en'], cost: 'free', type: 'guide', url: 'Canada_Mental_Health_Resources.md' },
        { title: 'Free Multimedia Library', topic: ['guides','apps','depression','panic'], province: ['ALL'], language: ['en'], cost: 'free', type: 'guide', url: 'Free_Multimedia_Resources.md' },
        { title: 'Bibliotherapy & Books', topic: ['guides','depression'], province: ['ALL'], language: ['en'], cost: 'free', type: 'guide', url: 'Bibliotherapy.html' },
        { title: 'Anxiety Canada MindShift CBT', topic: ['apps','panic','anxiety'], province: ['ALL'], language: ['en'], cost: 'free', type: 'app', url: 'https://www.mindshift.app/' },
        { title: 'Insight Timer', topic: ['apps','meditation'], province: ['ALL'], language: ['en'], cost: 'free', type: 'app', url: 'https://insighttimer.com/' },
        { title: 'BC Crisis Centre', topic: ['crisis'], province: ['BC'], language: ['en'], cost: 'free', type: 'hotline', url: 'https://crisiscentre.bc.ca/', note: 'Call 1-800-784-2433' },
        { title: 'Centre de prévention du suicide (Québec)', topic: ['crisis'], province: ['QC'], language: ['fr'], cost: 'free', type: 'hotline', url: 'https://suicide.ca', note: '1-866-277-3553' }
    ];

    const assessments = {
        phq9: [
            'Little interest or pleasure in doing things',
            'Feeling down, depressed, or hopeless',
            'Trouble falling or staying asleep, or sleeping too much',
            'Feeling tired or having little energy',
            'Poor appetite or overeating',
            'Feeling bad about yourself or that you are a failure',
            'Trouble concentrating on things',
            'Moving or speaking slowly or being fidgety/restless',
            'Thoughts that you would be better off dead or of hurting yourself'
        ],
        gad7: [
            'Feeling nervous, anxious, or on edge',
            'Not being able to stop or control worrying',
            'Worrying too much about different things',
            'Trouble relaxing',
            'Being so restless that it is hard to sit still',
            'Becoming easily annoyed or irritable',
            'Feeling afraid as if something awful might happen'
        ]
    };

    const scoreBands = {
        phq9: [
            { max: 4, level: 'Minimal', action: 'Keep healthy habits; monitor changes.' },
            { max: 9, level: 'Mild', action: 'Self-help tools; consider talking to a clinician if it persists.' },
            { max: 14, level: 'Moderate', action: 'Reach out to primary care or mental health professional.' },
            { max: 19, level: 'Moderately severe', action: 'Talk to a clinician soon; consider counseling.' },
            { max: 27, level: 'Severe', action: 'Contact a clinician promptly; use crisis lines if you feel unsafe.' }
        ],
        gad7: [
            { max: 4, level: 'Minimal', action: 'Maintain coping practices.' },
            { max: 9, level: 'Mild', action: 'Self-help and monitoring.' },
            { max: 14, level: 'Moderate', action: 'Talk with a clinician; consider therapy.' },
            { max: 21, level: 'Severe', action: 'Seek professional support soon; use crisis help if risk is present.' }
        ]
    };

    const langSelect = document.getElementById('lang-select');
    let currentLang = 'en';

    function translate(key) {
        const dict = {
            crisisFootnote: {
                en: 'Safety first: mentions of self-harm or harm to others trigger immediate crisis guidance.',
                fr: 'Sécurité d’abord : tout signe de risque déclenche des conseils de crise immédiats.'
            },
            example: {
                en: 'having panic at night in BC, need text support',
                fr: 'crise de panique la nuit en C.-B., besoin de clavardage'
            },
            assistantHint: {
                en: 'Keep it short; mention symptoms, location (province), and urgency.',
                fr: 'Soyez bref; mentionnez symptômes, province et urgence.'
            }
        };
        return dict[key]?.[currentLang] || dict[key]?.en || '';
    }

    function addMessage(role, text) {
        const chat = document.getElementById('assistant-chat');
        if (!chat) return;
        const div = document.createElement('div');
        div.className = `chat-bubble ${role === 'user' ? 'chat-user' : 'chat-assistant'}`;
        div.textContent = text;
        chat.appendChild(div);
        chat.scrollTop = chat.scrollHeight;
    }

    function detectProvince(message) {
        const provinces = ['BC','AB','SK','MB','ON','QC','NB','NS','PEI','NL','YT','NT','NU'];
        const found = provinces.find(p => message.toUpperCase().includes(p));
        return found || '';
    }

    function searchResources(filters) {
        return resourceCatalog.filter(r => {
            const topicOk = !filters.topic || r.topic.includes(filters.topic);
            const provOk = !filters.province || r.province.includes('ALL') || r.province.includes(filters.province);
            const langOk = !filters.language || r.language.includes(filters.language);
            const costOk = !filters.cost || r.cost === filters.cost;
            return topicOk && provOk && langOk && costOk;
        });
    }

    function renderSearch(filters) {
        const container = document.getElementById('search-results');
        if (!container) return;
        container.innerHTML = '';
        const results = searchResources(filters);
        if (results.length === 0) {
            container.innerHTML = '<p style=\"color:#6b7280\">No matches yet. Try fewer filters.</p>';
            return;
        }
        const sorted = results.sort((a,b) => (a.topic.includes('crisis') ? -1 : 0));
        sorted.forEach(r => {
            const card = document.createElement('div');
            card.className = 'search-card';
            card.innerHTML = `
                <h4>${r.title}</h4>
                <div class=\"meta\">
                    <span class=\"meta-badge\">${r.type}</span>
                    <span class=\"meta-badge\">${r.cost}</span>
                    <span class=\"meta-badge\">${r.language.join(', ')}</span>
                    <span class=\"meta-badge\">${r.province.join(', ')}</span>
                </div>
                ${r.note ? `<p class=\"assistant-tip\">${r.note}</p>` : ''}
                <a href=\"${r.url}\" class=\"card-link\" target=\"_blank\" rel=\"noopener\">Open</a>
                <button class=\"pill-button\" data-save=\"${encodeURIComponent(r.title)}\" data-url=\"${encodeURIComponent(r.url)}\">Save</button>
            `;
            container.appendChild(card);
        });
        container.querySelectorAll('[data-save]').forEach(btn => {
            btn.addEventListener('click', () => {
                const title = decodeURIComponent(btn.getAttribute('data-save'));
                const url = decodeURIComponent(btn.getAttribute('data-url'));
                saveResource(title, url);
            });
        });
    }

    function assistantReply(message) {
        const lower = message.toLowerCase();
        if (crisisKeywords.some(k => lower.includes(k))) {
            return crisisResponse[currentLang];
        }
        const province = detectProvince(message);
        let topic = '';
        if (lower.includes('panic') || lower.includes('anxiety')) topic = 'panic';
        if (lower.includes('depress')) topic = 'depression';
        if (lower.includes('youth') || lower.includes('teen')) topic = 'youth';
        if (lower.includes('indigenous') || lower.includes('first nation') || lower.includes('inuit') || lower.includes('metis')) topic = 'indigenous';

        const results = searchResources({ topic, province, language: currentLang === 'fr' ? 'fr' : '', cost: 'free' });
        const top = results.slice(0, 3);
        if (top.length === 0) {
            return currentLang === 'fr'
                ? 'Je ne trouve pas encore de ressource adaptée. Essayez un autre mot-clé ou contactez 9-8-8.'
                : 'I did not find a matching resource. Try another keyword or contact 9-8-8.';
        }
        const links = top.map(r => `${r.title} (${r.note || r.type}): ${r.url}`).join(' | ');
        return `${currentLang === 'fr' ? 'Voici ce que je recommande' : 'Here is what I recommend'}${province ? ` (${province})` : ''}: ${links}`;
    }

    function handleAssistantSend() {
        const input = document.getElementById('assistant-input');
        if (!input || !input.value.trim()) return;
        const message = input.value.trim();
        addMessage('user', message);
        const reply = assistantReply(message);
        addMessage('assistant', reply);
        input.value = '';
    }

    function renderAssessments() {
        const phqForm = document.getElementById('phq9-form');
        const gadForm = document.getElementById('gad7-form');
        const opts = [
            { value: 0, label: 'Not at all / 0' },
            { value: 1, label: 'Several days / 1' },
            { value: 2, label: 'More than half the days / 2' },
            { value: 3, label: 'Nearly every day / 3' }
        ];
        const render = (container, questions, prefix) => {
            if (!container) return;
            container.innerHTML = '';
            questions.forEach((q, idx) => {
                const div = document.createElement('div');
                div.className = 'question';
                const select = document.createElement('select');
                select.name = `${prefix}-${idx}`;
                opts.forEach(o => {
                    const opt = document.createElement('option');
                    opt.value = o.value;
                    opt.textContent = o.label;
                    select.appendChild(opt);
                });
                const label = document.createElement('label');
                label.textContent = `${idx + 1}. ${q}`;
                div.appendChild(label);
                div.appendChild(select);
                container.appendChild(div);
            });
        };
        render(phqForm, assessments.phq9, 'phq9');
        render(gadForm, assessments.gad7, 'gad7');
    }

    function scoreAssessment(formId, questions, bandKey, resultId) {
        const form = document.getElementById(formId);
        const result = document.getElementById(resultId);
        if (!form || !result) return;
        const selects = form.querySelectorAll('select');
        let score = 0;
        selects.forEach(s => score += Number(s.value || 0));
        const band = scoreBands[bandKey].find(b => score <= b.max);
        const highRisk = formId === 'phq9-form' && Number(selects[8]?.value || 0) > 0;
        let message = `${band?.level || 'Score'}: ${score}. ${band?.action || ''}`;
        if (highRisk) {
            message += ' If you have thoughts of self-harm, contact 9-8-8 or 911 now.';
        }
        result.textContent = message;
    }

    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').catch(err => console.warn('SW registration failed', err));
        }
    }

    // Plan builder, saved resources, mood, CBT, accessibility
    function savePlan() {
        const data = {
            crisis: document.getElementById('plan-crisis').value,
            grounding: document.getElementById('plan-grounding').value,
            habits: document.getElementById('plan-habits').value,
            notes: document.getElementById('plan-notes').value
        };
        localStorage.setItem('planData', JSON.stringify(data));
    }

    function loadPlan() {
        try {
            const data = JSON.parse(localStorage.getItem('planData') || '{}');
            if (data.crisis) document.getElementById('plan-crisis').value = data.crisis;
            if (data.grounding) document.getElementById('plan-grounding').value = data.grounding;
            if (data.habits) document.getElementById('plan-habits').value = data.habits;
            if (data.notes) document.getElementById('plan-notes').value = data.notes;
        } catch(e) {}
    }

    function renderSaved() {
        const container = document.getElementById('saved-resources');
        if (!container) return;
        const saved = JSON.parse(localStorage.getItem('savedResources') || '[]');
        container.innerHTML = '';
        if (saved.length === 0) {
            container.innerHTML = '<p class=\"assistant-tip\">Nothing saved yet.</p>';
            return;
        }
        saved.forEach(item => {
            const div = document.createElement('div');
            div.className = 'saved-item';
            div.innerHTML = `<strong>${item.title}</strong><br><a class=\"card-link\" href=\"${item.url}\" target=\"_blank\">Open</a>`;
            container.appendChild(div);
        });
    }

    function saveResource(title, url) {
        const saved = JSON.parse(localStorage.getItem('savedResources') || '[]');
        if (!saved.find(s => s.title === title)) {
            saved.push({ title, url });
            localStorage.setItem('savedResources', JSON.stringify(saved));
            renderSaved();
        }
    }

    function saveMood() {
        const mood = Number(document.getElementById('mood-score').value || 0);
        const notes = document.getElementById('mood-notes').value || '';
        const entry = { mood, notes, at: new Date().toISOString() };
        const log = JSON.parse(localStorage.getItem('moodLog') || '[]');
        log.unshift(entry);
        localStorage.setItem('moodLog', JSON.stringify(log.slice(0, 20)));
        renderMood();
    }

    function renderMood() {
        const log = JSON.parse(localStorage.getItem('moodLog') || '[]');
        const container = document.getElementById('mood-log');
        if (!container) return;
        container.innerHTML = '';
        log.forEach(entry => {
            const div = document.createElement('div');
            div.className = 'mood-item';
            const date = new Date(entry.at).toLocaleString();
            div.innerHTML = `<strong>${date}</strong> — Mood ${entry.mood}/5<br>${entry.notes || ''}`;
            container.appendChild(div);
        });
    }

    function saveCBT() {
        const entry = {
            situation: document.getElementById('cbt-situation').value,
            thought: document.getElementById('cbt-thought').value,
            evidence: document.getElementById('cbt-evidence').value,
            reframe: document.getElementById('cbt-reframe').value,
            at: new Date().toISOString()
        };
        const log = JSON.parse(localStorage.getItem('cbtLog') || '[]');
        log.unshift(entry);
        localStorage.setItem('cbtLog', JSON.stringify(log.slice(0, 20)));
        renderCBT();
    }

    function renderCBT() {
        const log = JSON.parse(localStorage.getItem('cbtLog') || '[]');
        const container = document.getElementById('cbt-log');
        if (!container) return;
        container.innerHTML = '';
        log.forEach(entry => {
            const div = document.createElement('div');
            div.className = 'cbt-item';
            const date = new Date(entry.at).toLocaleString();
            div.innerHTML = `<strong>${date}</strong><br><em>Situation:</em> ${entry.situation}<br><em>Thought:</em> ${entry.thought}<br><em>Evidence:</em> ${entry.evidence}<br><em>Reframe:</em> ${entry.reframe}`;
            container.appendChild(div);
        });
    }

    function applyPrefs() {
        const contrast = localStorage.getItem('pref-contrast') === '1';
        const motion = localStorage.getItem('pref-motion') === '1';
        const font = localStorage.getItem('pref-font') === '1';
        document.body.classList.toggle('pref-contrast', contrast);
        document.body.classList.toggle('pref-motion', motion);
        document.body.classList.toggle('pref-font', font);
        const map = {
            'pref-contrast': contrast,
            'pref-motion': motion,
            'pref-font': font
        };
        Object.keys(map).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.checked = map[id];
        });
    }

    function attachEvents() {
        const send = document.getElementById('assistant-send');
        if (send) send.addEventListener('click', handleAssistantSend);
        const input = document.getElementById('assistant-input');
        if (input) input.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleAssistantSend();
            }
        });
        const reset = document.getElementById('assistant-reset');
        if (reset) reset.addEventListener('click', () => {
            const chat = document.getElementById('assistant-chat');
            if (chat) chat.innerHTML = '';
            addMessage('assistant', currentLang === 'fr' ? 'Bonjour, comment puis-je vous aider ?' : 'Hi, how can I help?');
        });
        const sample = document.getElementById('assistant-sample');
        if (sample) sample.addEventListener('click', () => {
            const input = document.getElementById('assistant-input');
            if (input) input.value = translate('example');
        });
        ['filter-topic','filter-province','filter-language','filter-cost'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('change', () => {
                renderSearch({
                    topic: document.getElementById('filter-topic').value,
                    province: document.getElementById('filter-province').value,
                    language: document.getElementById('filter-language').value,
                    cost: document.getElementById('filter-cost').value
                });
            });
        });
        const filterReset = document.getElementById('filter-reset');
        if (filterReset) filterReset.addEventListener('click', () => {
            ['filter-topic','filter-province','filter-language','filter-cost'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });
            renderSearch({ topic: '', province: '', language: '', cost: '' });
        });
        const phqBtn = document.getElementById('phq9-submit');
        if (phqBtn) phqBtn.addEventListener('click', () => scoreAssessment('phq9-form', assessments.phq9, 'phq9', 'phq9-result'));
        const gadBtn = document.getElementById('gad7-submit');
        if (gadBtn) gadBtn.addEventListener('click', () => scoreAssessment('gad7-form', assessments.gad7, 'gad7', 'gad7-result'));
        const resetAssess = document.getElementById('reset-assessments');
        if (resetAssess) resetAssess.addEventListener('click', () => {
            renderAssessments();
            document.getElementById('phq9-result').textContent = '';
            document.getElementById('gad7-result').textContent = '';
        });
        const pwaRefresh = document.getElementById('pwa-refresh');
        if (pwaRefresh) pwaRefresh.addEventListener('click', () => {
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({ type: 'refreshCache' });
            }
        });
        const pwaInstall = document.getElementById('pwa-install');
        if (pwaInstall) {
            let deferredPrompt;
            window.addEventListener('beforeinstallprompt', e => {
                e.preventDefault();
                deferredPrompt = e;
            });
            pwaInstall.addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    await deferredPrompt.userChoice;
                    deferredPrompt = null;
                } else {
                    alert('Use your browser menu to add to home screen.');
                }
            });
        }
        if (langSelect) {
            langSelect.addEventListener('change', e => {
                currentLang = e.target.value;
                document.getElementById('assistant-footnote').textContent = translate('crisisFootnote');
                document.getElementById('assistant-input').placeholder = translate('example');
                const tip = document.querySelector('.assistant-tip');
                if (tip) tip.textContent = translate('assistantHint');
            });
        }
        const planSave = document.getElementById('plan-save');
        if (planSave) planSave.addEventListener('click', savePlan);
        const planClear = document.getElementById('plan-clear');
        if (planClear) planClear.addEventListener('click', () => {
            ['plan-crisis','plan-grounding','plan-habits','plan-notes'].forEach(id => {
                const el = document.getElementById(id); if (el) el.value = '';
            });
            savePlan();
        });
        const planPrint = document.getElementById('plan-print');
        if (planPrint) planPrint.addEventListener('click', () => window.print());
        const moodSave = document.getElementById('mood-save');
        if (moodSave) moodSave.addEventListener('click', saveMood);
        const moodClear = document.getElementById('mood-clear');
        if (moodClear) moodClear.addEventListener('click', () => {
            localStorage.removeItem('moodLog');
            renderMood();
        });
        const cbtSave = document.getElementById('cbt-save');
        if (cbtSave) cbtSave.addEventListener('click', saveCBT);
        const accessPrefs = ['pref-contrast','pref-motion','pref-font'];
        accessPrefs.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('change', () => {
                localStorage.setItem(id, el.checked ? '1' : '0');
                applyPrefs();
            });
        });
    }

    function init() {
        renderAssessments();
        renderSearch({ topic: '', province: '', language: '', cost: '' });
        addMessage('assistant', 'Hi, how can I help? Crisis support is always available: 9-8-8.');
        registerServiceWorker();
        loadPlan();
        renderSaved();
        renderMood();
        renderCBT();
        applyPrefs();
    }

    document.addEventListener('DOMContentLoaded', () => {
        init();
        attachEvents();
    });
})();
