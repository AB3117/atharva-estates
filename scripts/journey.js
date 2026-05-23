// Journey dataset sourced from: Atharva_Journey Data_Developer.xlsx
const journeyData = [
    { year: 2026, projects: [{ name: 'New Project', type: 'Residential Flats, Shops', location: 'Satara Highway, Off Ambegaon, Bk, Pune' }] },
    { year: 2007, projects: [{ name: 'Venkateshpuram', type: 'Residential Flats', location: 'Off NIBM Road, Pune' }] },
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

function pickFeaturedProjects() {
    // Match the reference visual while sourcing values from the workbook dataset.
    const allProjects = journeyData.flatMap((entry) => entry.projects);
    const names = ['Meghmalhar', 'Ecstasy - Phase 2'];
    const featured = names
        .map((target) => allProjects.find((p) => p.name === target))
        .filter(Boolean);

    return featured;
}

function renderJourneyCards() {
    const container = document.getElementById('journey-projects');
    const yearEl = document.getElementById('journey-year');
    if (!container || !yearEl) return;

    const displayYear = '2022';
    yearEl.textContent = displayYear;

    const featured = pickFeaturedProjects();
    const toSafeDisplayName = (name) => name
        .normalize('NFKD')
        .replace(/[^\x20-\x7E]/g, '')
        .replace(/[^A-Za-z0-9 ]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    const cards = featured.map((project) => `
        <article class="journey-project">
            <h3>${toSafeDisplayName(project.name)}</h3>
            <p class="type">${project.type}</p>
            <p class="location">${project.location}</p>
        </article>
    `).join('');

    container.innerHTML = cards;
}

renderJourneyCards();

