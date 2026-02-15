
let children = [];
let families = [];
let matches = [];


function initializeSampleData() {
    children = [
        {
            id: 1,
            name: "Mouna",
            age: 7,
            gender: "female",
            needs: ["education", "emotional"],
            bio: "Emma loves reading and drawing. She dreams of becoming an artist one day.",
            available: true
        },
        {
            id: 2,
            name: "Jasser",
            age: 12,
            gender: "male",
            needs: ["medical"],
            bio: "Liam is passionate about soccer and science. He needs regular medical checkups.",
            available: true
        },
        {
            id: 3,
            name: "Haifa",
            age: 4,
            gender: "female",
            needs: ["emotional"],
            bio: "Sophia is a cheerful little girl who loves music and dancing.",
            available: true
        },
        {
            id: 4,
            name: "Nidhal el saadi",
            age: 15,
            gender: "male",
            needs: ["education", "emotional"],
            bio: "Noah is a talented musician interested in computer programming.",
            available: true
        },
        {
            id: 5,
            name: "Safinez",
            age: 9,
            gender: "female",
            needs: ["medical", "education"],
            bio: "Mia enjoys nature and wants to be a veterinarian. She requires ongoing therapy.",
            available: true
        }
    ];

    updateStats();
    renderChildren();
    renderAdminChildren();
}


function navigateTo(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active-section');
    });
    document.getElementById(sectionId).classList.add('active-section');


    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    const activeLink = Array.from(document.querySelectorAll('.nav-link')).find(
        link => link.getAttribute('href') === `#${sectionId}`
    );
    if (activeLink) {
        activeLink.classList.add('active');
    }


    window.scrollTo(0, 0);
}


document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('href').substring(1);
        navigateTo(sectionId);
    });
});


function updateStats() {
    document.getElementById('children-count').textContent = children.filter(c => c.available).length;
    document.getElementById('families-count').textContent = families.filter(f => f.status === 'approved').length;
    document.getElementById('matches-count').textContent = matches.length;
}


function renderChildren(filteredChildren = null) {
    const grid = document.getElementById('children-grid');
    const childrenToRender = filteredChildren || children.filter(c => c.available);

    if (childrenToRender.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-state-icon">👶</div>
                <p>No children match your filters</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = childrenToRender.map(child => `
        <div class="child-card" onclick="showChildDetails(${child.id})">
            <div class="child-avatar">${child.gender === 'male' ? '👦' : '👧'}</div>
            <h3>${child.name}</h3>
            <p class="child-info">${child.age} years old • ${child.gender}</p>
            <div class="child-needs">
                ${child.needs.map(need => `<span class="need-tag">${need}</span>`).join('')}
            </div>
            <p class="child-bio">${child.bio}</p>
        </div>
    `).join('');
}


function applyFilters() {
    const ageFilter = document.getElementById('age-filter').value;
    const needsFilter = document.getElementById('needs-filter').value;

    let filtered = children.filter(c => c.available);

    if (ageFilter) {
        const [min, max] = ageFilter.split('-').map(Number);
        filtered = filtered.filter(c => c.age >= min && c.age <= max);
    }

    if (needsFilter) {
        filtered = filtered.filter(c => c.needs.includes(needsFilter));
    }

    renderChildren(filtered);
}

document.getElementById('age-filter').addEventListener('change', applyFilters);
document.getElementById('needs-filter').addEventListener('change', applyFilters);


function showChildDetails(childId) {
    const child = children.find(c => c.id === childId);
    if (!child) return;

    const modal = document.getElementById('child-modal');
    const modalBody = document.getElementById('child-modal-body');

    modalBody.innerHTML = `
        <div style="text-align: center;">
            <div class="child-avatar" style="margin: 0 auto 1rem;">${child.gender === 'male' ? '👦' : '👧'}</div>
            <h2>${child.name}</h2>
            <p style="color: var(--gray-600); margin-bottom: 1.5rem;">${child.age} years old • ${child.gender}</p>
            <div class="child-needs" style="justify-content: center; margin-bottom: 1.5rem;">
                ${child.needs.map(need => `<span class="need-tag">${need}</span>`).join('')}
            </div>
            <p style="line-height: 1.8; color: var(--gray-700);">${child.bio}</p>
            <button class="result-button" onclick="navigateTo('apply')">Apply to Adopt</button>
        </div>
    `;

    modal.classList.add('active');
}

function closeChildModal() {
    document.getElementById('child-modal').classList.remove('active');
}


function verifyFamily(familyData) {
    let score = 100;
    let flags = [];
    let passes = [];


    if (familyData.criminalRecord === 'major') {
        score -= 100;
        flags.push('❌ Major criminal record - REJECTED');
    } else if (familyData.criminalRecord === 'minor') {
        score -= 10;
        flags.push('⚠️ Minor offenses on record');
    } else {
        passes.push('✓ Clean criminal record');
    }


    const incomeMap = {
        '20000-40000': 20,
        '40000-70000': 30,
        '70000-100000': 40,
        '100000+': 50
    };
    const incomeScore = incomeMap[familyData.income] || 0;
    if (incomeScore < 30) {
        score -= 15;
        flags.push('⚠️ Low income - may need financial support verification');
    } else {
        passes.push('✓ Adequate financial stability');
    }


    if (familyData.employment === 'unemployed') {
        score -= 25;
        flags.push('⚠️ Unemployment concern - needs review');
    } else {
        passes.push('✓ Stable employment status');
    }


    if (familyData.housing === 'owned') {
        passes.push('✓ Home ownership verified');
    } else if (familyData.housing === 'rented') {
        passes.push('✓ Stable housing arrangement');
    }


    const refs = familyData.references.split(',').map(r => r.trim()).filter(r => r);
    if (refs.length < 2) {
        score -= 15;
        flags.push('⚠️ Insufficient references provided');
    } else {
        passes.push('✓ Professional references verified');
    }


    const dangerousKeywords = [
        'alone', 'isolated', 'control', 'obey', 'discipline strictly',
        'punish', 'servant', 'work', 'money', 'profit'
    ];
    const motivationLower = familyData.motivation.toLowerCase();
    const foundDangerousKeywords = dangerousKeywords.filter(kw => motivationLower.includes(kw));

    if (foundDangerousKeywords.length > 0) {
        score -= 50;
        flags.push(`❌ Concerning language detected: "${foundDangerousKeywords.join(', ')}"`);
    } else {
        passes.push('✓ Motivation statement appears genuine');
    }


    const capabilities = familyData.capabilities || [];
    if (capabilities.length === 0) {
        score -= 10;
        flags.push('⚠️ No special care capabilities indicated');
    } else {
        passes.push(`✓ Can provide: ${capabilities.join(', ')}`);
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(familyData.email)) {
        score -= 5;
        flags.push('⚠️ Invalid email format');
    }


    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(familyData.phone) || familyData.phone.replace(/\D/g, '').length < 10) {
        score -= 5;
        flags.push('⚠️ Invalid phone number');
    }


    score = Math.max(0, Math.min(100, score));


    let status;
    if (score >= 70) {
        status = 'approved';
    } else if (score >= 50) {
        status = 'pending';
    } else {
        status = 'rejected';
    }

    return {
        score,
        status,
        flags,
        passes,
        timestamp: new Date().toISOString()
    };
}


document.getElementById('adoption-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const capabilities = Array.from(document.querySelectorAll('input[name="capabilities"]:checked'))
        .map(cb => cb.value);

    const familyData = {
        id: Date.now(),
        name: document.getElementById('family-name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        income: document.getElementById('income').value,
        housing: document.getElementById('housing').value,
        maritalStatus: document.getElementById('marital-status').value,
        childrenCount: document.getElementById('children-count').value,
        criminalRecord: document.getElementById('criminal-record').value,
        employment: document.getElementById('employment').value,
        references: document.getElementById('references').value,
        preferredAge: document.getElementById('preferred-age').value,
        capabilities: capabilities,
        motivation: document.getElementById('motivation').value
    };


    const verification = verifyFamily(familyData);


    families.push({
        ...familyData,
        verification,
        status: verification.status,
        appliedDate: new Date().toISOString()
    });


    showVerificationResult(verification);


    e.target.reset();


    updateStats();
    renderApplications();
});


function showVerificationResult(verification) {
    const modal = document.getElementById('verification-modal');
    const modalBody = document.getElementById('modal-body');

    let statusColor, statusIcon, statusText;
    if (verification.status === 'approved') {
        statusColor = 'var(--success)';
        statusIcon = '✅';
        statusText = 'Application Approved!';
    } else if (verification.status === 'pending') {
        statusColor = 'var(--warning)';
        statusIcon = '⏳';
        statusText = 'Application Under Review';
    } else {
        statusColor = 'var(--danger)';
        statusIcon = '❌';
        statusText = 'Application Rejected';
    }

    modalBody.innerHTML = `
        <div class="verification-result">
            <div class="result-icon">${statusIcon}</div>
            <h2 style="color: ${statusColor};">${statusText}</h2>
            <p>${verification.status === 'approved'
                ? 'Congratulations! Your application has passed our automatic verification system.'
                : verification.status === 'pending'
                ? 'Your application requires additional manual review by our team.'
                : 'Unfortunately, your application did not meet our safety requirements.'}</p>

            <div class="verification-score">
                <h4>Safety Score</h4>
                <div class="score-bar">
                    <div class="score-fill ${verification.score >= 70 ? 'high' : verification.score >= 50 ? 'medium' : 'low'}"
                         style="width: ${verification.score}%;"></div>
                </div>
                <p style="margin-top: 0.5rem; font-size: 1.25rem; font-weight: bold;">${verification.score}/100</p>
            </div>

            ${verification.passes.length > 0 ? `
                <div style="text-align: left; margin: 1.5rem 0;">
                    <h4 style="color: var(--success); margin-bottom: 0.5rem;">Passed Checks:</h4>
                    ${verification.passes.map(pass => `<div class="verification-item pass">${pass}</div>`).join('')}
                </div>
            ` : ''}

            ${verification.flags.length > 0 ? `
                <div style="text-align: left; margin: 1.5rem 0;">
                    <h4 style="color: var(--danger); margin-bottom: 0.5rem;">Flags & Concerns:</h4>
                    ${verification.flags.map(flag => `<div class="verification-item fail">${flag}</div>`).join('')}
                </div>
            ` : ''}

            <button class="result-button" onclick="closeModal()">Close</button>
        </div>
    `;

    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('verification-modal').classList.remove('active');
}


function showAdminTab(tabName) {
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active-tab');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active-tab');

    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    if (tabName === 'applications') {
        renderApplications();
    } else if (tabName === 'matches') {
        renderMatches();
    }
}


function renderApplications() {
    const list = document.getElementById('applications-list');

    if (families.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <p>No applications yet</p>
            </div>
        `;
        return;
    }

    list.innerHTML = families.map(family => `
        <div class="application-card">
            <div class="application-header">
                <div class="application-info">
                    <h4>${family.name}</h4>
                    <p>${family.email} • ${family.phone}</p>
                    <p>${family.address}</p>
                </div>
                <span class="status-badge status-${family.status}">${family.status.toUpperCase()}</span>
            </div>

            <div class="verification-details">
                <h5>Verification Score: ${family.verification.score}/100</h5>
                ${family.verification.passes.map(pass => `
                    <div class="verification-item pass">${pass}</div>
                `).join('')}
                ${family.verification.flags.map(flag => `
                    <div class="verification-item fail">${flag}</div>
                `).join('')}
            </div>

            <div style="margin-top: 1rem; padding: 1rem; background: var(--gray-50); border-radius: 8px;">
                <p><strong>Preferred Age:</strong> ${family.preferredAge}</p>
                <p><strong>Can Provide:</strong> ${family.capabilities.join(', ') || 'None specified'}</p>
                <p><strong>Motivation:</strong> ${family.motivation}</p>
            </div>

            ${family.status === 'approved' ? `
                <div class="application-actions">
                    <button class="match-button" onclick="findMatches(${family.id})">Find Matches</button>
                </div>
            ` : ''}
        </div>
    `).join('');
}


function calculateMatchScore(family, child) {
    let score = 0;


    const ageRanges = {
        '0-5': [0, 5],
        '6-12': [6, 12],
        '13-17': [13, 17],
        'any': [0, 17]
    };

    const [minAge, maxAge] = ageRanges[family.preferredAge] || [0, 17];
    if (child.age >= minAge && child.age <= maxAge) {
        score += 40;
    }


    const familyCapabilities = family.capabilities || [];
    const matchedNeeds = child.needs.filter(need => familyCapabilities.includes(need));
    score += matchedNeeds.length * 20;


    const hasSpecialNeeds = child.needs.includes('medical') || child.needs.includes('special');
    const highIncome = ['70000-100000', '100000+'].includes(family.income);
    if (hasSpecialNeeds && highIncome) {
        score += 15;
    }


    if (family.maritalStatus === 'married') {
        score += 10;
    }

    if (parseInt(family.childrenCount) > 0) {
        score += 10;
    }

    if (family.housing === 'owned') {
        score += 5;
    }

    return Math.min(100, score);
}

function findMatches(familyId) {
    const family = families.find(f => f.id === familyId);
    if (!family) return;

    const availableChildren = children.filter(c => c.available);
    const scored = availableChildren.map(child => ({
        child,
        score: calculateMatchScore(family, child)
    }));

    scored.sort((a, b) => b.score - a.score);

    const modal = document.getElementById('verification-modal');
    const modalBody = document.getElementById('modal-body');

    modalBody.innerHTML = `
        <h2>Matching Results for ${family.name}</h2>
        <p style="color: var(--gray-600); margin-bottom: 2rem;">Here are the best matches based on preferences and capabilities</p>

        ${scored.slice(0, 5).map(({ child, score }) => `
            <div style="padding: 1rem; margin-bottom: 1rem; background: var(--gray-50); border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4>${child.name}, ${child.age} years old</h4>
                        <p style="color: var(--gray-600);">Needs: ${child.needs.join(', ')}</p>
                        <p style="margin-top: 0.5rem;">${child.bio}</p>
                    </div>
                    <div style="text-align: center; min-width: 80px;">
                        <div style="font-size: 1.5rem; font-weight: bold; color: ${score >= 70 ? 'var(--success)' : score >= 50 ? 'var(--warning)' : 'var(--gray-600)'};">
                            ${score}%
                        </div>
                        <div style="font-size: 0.875rem; color: var(--gray-600);">Match</div>
                    </div>
                </div>
                <button class="match-button" onclick="createMatch(${familyId}, ${child.id}, ${score})" style="margin-top: 1rem; width: 100%;">
                    Create Match
                </button>
            </div>
        `).join('')}
    `;

    modal.classList.add('active');
}

function createMatch(familyId, childId, score) {
    const family = families.find(f => f.id === familyId);
    const child = children.find(c => c.id === childId);

    if (!family || !child) return;

    child.available = false;

    matches.push({
        id: Date.now(),
        family: family,
        child: child,
        score: score,
        date: new Date().toISOString()
    });

    updateStats();
    renderChildren();
    renderAdminChildren();
    closeModal();


    alert(`✅ Successfully matched ${child.name} with ${family.name}!`);
}


function renderMatches() {
    const list = document.getElementById('matches-list');

    if (matches.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">💚</div>
                <p>No successful matches yet</p>
            </div>
        `;
        return;
    }

    list.innerHTML = matches.map(match => `
        <div class="match-card">
            <div class="match-family">
                <h4>${match.family.name}</h4>
                <p>${match.family.email}</p>
                <p>${match.family.address}</p>
            </div>
            <div class="match-arrow">💚</div>
            <div class="match-child">
                <h4>${match.child.name}</h4>
                <p>${match.child.age} years old</p>
                <p>Needs: ${match.child.needs.join(', ')}</p>
            </div>
            <div class="match-score">
                <strong>Match Score: ${match.score}%</strong> •
                Matched on ${new Date(match.date).toLocaleDateString()}
            </div>
        </div>
    `).join('');
}


document.getElementById('child-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const needs = Array.from(document.querySelectorAll('input[name="child-needs"]:checked'))
        .map(cb => cb.value);

    const childData = {
        id: Date.now(),
        name: document.getElementById('child-name').value,
        age: parseInt(document.getElementById('child-age').value),
        gender: document.getElementById('child-gender').value,
        needs: needs,
        bio: document.getElementById('child-bio').value,
        available: true
    };

    children.push(childData);

    e.target.reset();
    updateStats();
    renderChildren();
    renderAdminChildren();

    alert('Child profile added successfully!');
});


function renderAdminChildren() {
    const list = document.getElementById('admin-children-list');

    list.innerHTML = children.map(child => `
        <div class="application-card">
            <div class="application-header">
                <div class="application-info">
                    <h4>${child.name}</h4>
                    <p>${child.age} years old • ${child.gender}</p>
                    <p>Needs: ${child.needs.join(', ') || 'None'}</p>
                </div>
                <span class="status-badge ${child.available ? 'status-pending' : 'status-approved'}">
                    ${child.available ? 'AVAILABLE' : 'MATCHED'}
                </span>
            </div>
            <p style="margin-top: 1rem; color: var(--gray-700);">${child.bio}</p>
        </div>
    `).join('');
}


document.addEventListener('DOMContentLoaded', () => {
    initializeSampleData();
    navigateTo('home');
});