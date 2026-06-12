// Journey dataset sourced from: Atharva_Journey Data_Developer.xlsx
const journeyData = [
    { year: 2026, projects: [{ name: 'New Project', type: 'Residential Flats, Shops', location: 'Satara Highway, Off Ambegaon, Bk, Pune' }] },
    { year: 2022, projects: [{ name: 'Vistara', type: 'Residential Flats', location: 'Serene Meadows, Nashik' }] },
    {
        year: 2019,
        projects: [
            { name: 'Hotel Enrise by Sayaji', type: 'Hotel Building', location: 'Indira Nagar, Nashik' },
            { name: 'Meghmalhar', type: 'Residential Flats, Shops', location: 'Gangapur Road, Nashik' },
            { name: 'Ecstasy - Phase 2', type: 'Residential Flats', location: 'Off Sinhagad Road, Pune' }
        ]
    },
    { year: 2018, projects: [{ name: 'Millennium Heights', type: 'Residential Flats, Shops', location: 'Model Colony, Pune' }] },
    { year: 2017, projects: [{ name: 'Meghmalhar', type: 'Residential Flats, Shops', location: 'Gangapur Road, Nashik' }] },
    { year: 2016, projects: [{ name: 'Madhukosh', type: 'Residential Flats', location: 'Indira Nagar, Nashik' }] },
    { year: 2013, projects: [{ name: 'Ecstasy - Phase 1', type: 'Residential Flats', location: 'Vadgaon Bk, Pune' }] },
    { year: 2008, projects: [{ name: 'Shreyas', type: 'Residential Flats, Shops', location: 'Tidke Colony, Nashik' }] },
    { year: 2007, projects: [{ name: 'Venkateshpuram', type: 'Residential Flats', location: 'Off NIBM Road, Pune' }] },
    { year: 2005, projects: [{ name: 'Dattaprasad', type: 'Residential Flats, Shops', location: 'Ambad Link Road, Nashik' }] },
    {
        year: 2004,
        projects: [
            { name: 'Kamal Residency', type: 'Residential Flats', location: 'College Road, Nashik' },
            { name: 'Ashapuri', type: 'Residential Flats, Shops', location: 'Ambad Link Road, Nashik' }
        ]
    },
    {
        year: 2001,
        projects: [
            { name: 'Rohan Springs', type: 'Residential Flats', location: 'Savarkar Nagar, Nashik' },
            { name: 'Dattatreya Darshan', type: 'Offices, Shops', location: 'College Road, Nashik' },
            { name: 'Rohan Heights', type: 'Residential Flats, Shops', location: 'College Road, Nashik' }
        ]
    },
    { year: 1999, projects: [{ name: 'Shantikunj Apartments', type: 'Residential Flats', location: 'College Road, Nashik' }] },
    {
        year: 1998,
        projects: [
            { name: 'Suvidinath', type: 'Residential Flats', location: 'Pipeline Road, Nashik' },
            { name: 'Shripal', type: 'Residential Flats', location: 'Pipeline Road, Nashik' },
            { name: 'Shubh Plaza', type: 'Office, Shops', location: 'Mumbai-Agra Road, Nashik' }
        ]
    },
    {
        year: 1996,
        projects: [
            { name: 'Vishal Apartments', type: 'Residential Flats', location: 'Kamathvada, Nashik' },
            { name: 'Sanket Apartments', type: 'Residential Flats, Shops', location: 'Tidke Colony, Nashik' }
        ]
    },
    {
        year: 1995,
        projects: [
            { name: 'Pushpalata Apartments', type: 'Residential Flats', location: 'Gangapur Road, Nashik' },
            { name: 'Ruchik House', type: 'Residential Flats, Shops', location: 'College Road, Nashik' }
        ]
    },
    { year: 1993, projects: [{ name: 'Dashrath Apartments', type: 'Residential Flats', location: 'Gangapur Road, Nashik' }] },
    {
        year: 1991,
        projects: [
            { name: 'Saraswati Apartments', type: 'Residential Flats', location: 'Kulkarni Colony, Nashik' },
            { name: 'Swapna Vaibhav', type: 'Residential Flats, Shops', location: 'Canada Corner, Nashik' }
        ]
    }
];

const wheelSlots = [
    { className: 'y-1', offset: -3 },
    { className: 'y-2', offset: -2 },
    { className: 'y-3', offset: -1 },
    { className: 'y-4', offset: 0 },
    { className: 'y-5', offset: 1 },
    { className: 'y-6', offset: 2 },
    { className: 'y-7', offset: 3 }
];

const availableYears = [...new Set(journeyData.map((entry) => entry.year))].sort((a, b) => b - a);
let activeYearIndex = 0;
let lastRotateAt = 0;
const MIN_ROTATE_INTERVAL_MS = 220;

const toSafeDisplayName = (name) => name
    .normalize('NFKD')
    .replace(/[^\x20-\x7E]/g, '')
    .replace(/[^A-Za-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

function formatYearWithSafeFour(year) {
    return String(year).replace(/4/g, '<span class="year-digit-fix">4</span>');
}

function yearAt(index) {
    if (index < 0 || index >= availableYears.length) return null;
    return availableYears[index];
}

function projectsForYear(year) {
    const record = journeyData.find((entry) => entry.year === year);
    return record ? record.projects : [];
}

function renderJourneyCardsForYear(year) {
    const container = document.getElementById('journey-projects');
    const yearEl = document.getElementById('journey-year');
    if (!container || !yearEl) return;

    yearEl.classList.add('is-updating');
    yearEl.innerHTML = formatYearWithSafeFour(year);

    const yearProjects = projectsForYear(year);
    const cards = yearProjects.map((project) => `
        <article class="journey-project">
            <h3>${toSafeDisplayName(project.name)}</h3>
            <p class="type">${project.type.trim()}</p>
            <p class="location">${project.location.trim()}</p>
        </article>
    `).join('');

    container.classList.add('is-updating');
    requestAnimationFrame(() => {
        container.innerHTML = cards;
        requestAnimationFrame(() => {
            container.classList.remove('is-updating');
            yearEl.classList.remove('is-updating');
            syncJourneyCopyPosition();
        });
    });
}

function syncJourneyCopyPosition() {
    const heroContent = document.querySelector('.journey-hero-content');
    const projects = document.getElementById('journey-projects');
    const copy = document.querySelector('.journey-copy');
    if (!heroContent || !projects || !copy) return;

    const isStandardDesktop = window.matchMedia('(min-width: 941px) and (max-width: 2199px)').matches;

    if (isStandardDesktop) {
        // Keep copy anchored to CSS position on desktop.
        copy.style.top = '';

        // Reset any previous lift before measuring.
        projects.style.marginTop = '0px';

        const heroRect = heroContent.getBoundingClientRect();
        const projectsRect = projects.getBoundingClientRect();
        const copyRect = copy.getBoundingClientRect();
        const minGap = 22;

        const projectsBottom = projectsRect.bottom - heroRect.top;
        const copyTop = copyRect.top - heroRect.top;
        const overlap = projectsBottom - (copyTop - minGap);

        // If projects would push into copy space, lift projects upward just enough.
        if (overlap > 0) {
            projects.style.marginTop = `${-Math.ceil(overlap)}px`;
        }
        return;
    }

    // Preserve existing behavior for non-desktop breakpoints.
    projects.style.marginTop = '0px';
    const heroRect = heroContent.getBoundingClientRect();
    const projectsRect = projects.getBoundingClientRect();
    const oneLineGap = 22;
    const top = (projectsRect.bottom - heroRect.top) + oneLineGap;
    copy.style.top = `${Math.round(top)}px`;
}

let syncRafId = null;
function scheduleJourneyCopySync() {
    if (syncRafId !== null) return;
    syncRafId = requestAnimationFrame(() => {
        syncRafId = null;
        syncJourneyCopyPosition();
    });
}

function renderYearWheel() {
    const arc = document.querySelector('.journey-arc');
    if (!arc || availableYears.length === 0) return;

    wheelSlots.forEach((slot) => {
        const node = arc.querySelector(`.${slot.className}`);
        if (!node) return;

        const year = yearAt(activeYearIndex + slot.offset);
        const hasYear = year !== null;
        const isActive = slot.offset === 0 && hasYear;
        const distance = Math.abs(slot.offset);
        node.innerHTML = hasYear ? formatYearWithSafeFour(year) : '';
        node.dataset.year = hasYear ? String(year) : '';
        node.classList.toggle('is-active', isActive);
        node.classList.toggle('is-near', distance === 1);
        node.classList.toggle('is-far', distance >= 2);
        node.classList.toggle('is-empty', !hasYear);

        if (hasYear) {
            node.setAttribute('role', 'button');
            node.setAttribute('tabindex', '0');
            node.setAttribute('aria-label', `View projects from ${year}`);
            node.setAttribute('aria-current', isActive ? 'true' : 'false');
        } else {
            node.removeAttribute('role');
            node.setAttribute('tabindex', '-1');
            node.removeAttribute('aria-label');
            node.removeAttribute('aria-current');
        }
    });

    renderJourneyCardsForYear(availableYears[activeYearIndex]);
}

function rotateWheel(step) {
    if (!availableYears.length) return;

    const now = performance.now();
    if (now - lastRotateAt < MIN_ROTATE_INTERVAL_MS) return;
    lastRotateAt = now;

    const nextIndex = Math.min(
        availableYears.length - 1,
        Math.max(0, activeYearIndex + step)
    );
    if (nextIndex === activeYearIndex) return;
    activeYearIndex = nextIndex;
    renderYearWheel();
}

function goToYear(year) {
    const nextIndex = availableYears.indexOf(Number(year));
    if (nextIndex === -1) return;

    activeYearIndex = nextIndex;
    renderYearWheel();
}

function bindYearWheelInteractions() {
    const arc = document.querySelector('.journey-arc');
    if (!arc) return;

    arc.addEventListener('click', (event) => {
        const target = event.target.closest('.y');
        if (!target) return;
        goToYear(target.dataset.year);
    });

    arc.addEventListener('keydown', (event) => {
        const target = event.target.closest('.y');
        if (!target) return;

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            goToYear(target.dataset.year);
        }

        if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
            event.preventDefault();
            rotateWheel(-1);
        }

        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
            event.preventDefault();
            rotateWheel(1);
        }
    });

    arc.addEventListener('wheel', (event) => {
        event.preventDefault();
        rotateWheel(event.deltaY > 0 ? 1 : -1);
    }, { passive: false });

    let dragStartY = null;
    let lastPointerY = null;
    let dragAccumulator = 0;

    arc.addEventListener('pointerdown', (event) => {
        dragStartY = event.clientY;
        lastPointerY = event.clientY;
        dragAccumulator = 0;
        arc.classList.add('is-dragging');
        arc.setPointerCapture(event.pointerId);
    });

    arc.addEventListener('pointermove', (event) => {
        if (dragStartY === null) return;

        const dy = event.clientY - lastPointerY;
        lastPointerY = event.clientY;
        dragAccumulator += dy;

        const stepThreshold = 34;
        const stepCount = Math.trunc(dragAccumulator / stepThreshold);
        if (stepCount !== 0) {
            rotateWheel(stepCount);
            dragAccumulator -= stepCount * stepThreshold;
        }
    });

    arc.addEventListener('pointerup', () => {
        dragStartY = null;
        lastPointerY = null;
        dragAccumulator = 0;
        arc.classList.remove('is-dragging');
    });

    arc.addEventListener('pointercancel', () => {
        dragStartY = null;
        lastPointerY = null;
        dragAccumulator = 0;
        arc.classList.remove('is-dragging');
    });
}

bindYearWheelInteractions();
renderYearWheel();
window.addEventListener('resize', scheduleJourneyCopySync);
window.addEventListener('orientationchange', scheduleJourneyCopySync);
window.addEventListener('load', scheduleJourneyCopySync);
