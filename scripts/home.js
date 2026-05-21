document.addEventListener("DOMContentLoaded", () => {
    const headerEl = document.querySelector('header');
    const storyTrigger = document.getElementById('story-trigger');
    const realEstateTrigger = document.getElementById('real-estate-trigger');
    const hospitalityTrigger = document.getElementById('hospitality-trigger');

    const syncHeaderOverlayTop = () => {
        if (!headerEl) return;
        document.documentElement.style.setProperty('--header-overlay-top', `${Math.round(headerEl.offsetHeight)}px`);
    };

    const syncStoryListLeft = () => {
        if (!storyTrigger) return;
        const triggerRect = storyTrigger.getBoundingClientRect();
        document.documentElement.style.setProperty('--story-list-left', `${Math.round(triggerRect.left)}px`);
    };

    const syncRealEstatePanelLeft = () => {
        if (!realEstateTrigger) return;
        const triggerRect = realEstateTrigger.getBoundingClientRect();
        document.documentElement.style.setProperty('--real-estate-panel-left', `${Math.round(triggerRect.left)}px`);
    };

    const syncHospitalityItemLeft = () => {
        if (!hospitalityTrigger) return;
        const triggerRect = hospitalityTrigger.getBoundingClientRect();
        document.documentElement.style.setProperty('--hospitality-item-left', `${Math.round(triggerRect.left)}px`);
    };

    const syncLayoutOffsets = () => {
        syncHeaderOverlayTop();
        syncStoryListLeft();
        syncRealEstatePanelLeft();
        syncHospitalityItemLeft();
    };

    syncLayoutOffsets();

    let resizeRafId = null;
    window.addEventListener('resize', () => {
        if (resizeRafId !== null) {
            cancelAnimationFrame(resizeRafId);
        }
        resizeRafId = requestAnimationFrame(() => {
            resizeRafId = null;
            syncLayoutOffsets();
        });
    }, { passive: true });

    const storyMenu = document.getElementById('story-menu');
    const realEstateMenu = document.getElementById('real-estate-menu');
    const hospitalityMenu = document.getElementById('hospitality-menu');
    const lazyBgCards = Array.from(document.querySelectorAll('[data-bg]'));
    const loadedBgPaths = new Set();
    const rootEl = document.documentElement;
    const closeDelayMs = 220;
    const closeTimers = {
        story: null,
        realEstate: null,
        hospitality: null
    };

    const clearCloseTimer = (menuKey) => {
        const timerId = closeTimers[menuKey];
        if (timerId !== null) {
            clearTimeout(timerId);
            closeTimers[menuKey] = null;
        }
    };

    const scheduleClose = (menuKey, closeFn) => {
        clearCloseTimer(menuKey);
        closeTimers[menuKey] = window.setTimeout(() => {
            closeTimers[menuKey] = null;
            closeFn();
        }, closeDelayMs);
    };

    const closeStoryMenu = () => {
        if (!storyMenu || !storyTrigger) return;
        clearCloseTimer('story');
        storyMenu.classList.remove('is-open');
        storyTrigger.setAttribute('aria-expanded', 'false');
    };

    const closeRealEstateMenu = () => {
        if (!realEstateMenu || !realEstateTrigger) return;
        clearCloseTimer('realEstate');
        realEstateMenu.classList.remove('is-open');
        realEstateTrigger.setAttribute('aria-expanded', 'false');
    };

    const closeHospitalityMenu = () => {
        if (!hospitalityMenu || !hospitalityTrigger) return;
        clearCloseTimer('hospitality');
        hospitalityMenu.classList.remove('is-open');
        hospitalityTrigger.setAttribute('aria-expanded', 'false');
    };

    if (storyMenu && storyTrigger) {
        const storyLinks = Array.from(storyMenu.querySelectorAll('.story-dropdown a'));

        const openStoryMenu = () => {
            clearCloseTimer('story');
            syncStoryListLeft();
            closeRealEstateMenu();
            closeHospitalityMenu();
            storyMenu.classList.add('is-open');
            storyTrigger.setAttribute('aria-expanded', 'true');
        };

        storyTrigger.addEventListener('click', (event) => {
            event.preventDefault();
            if (storyMenu.classList.contains('is-open')) {
                closeStoryMenu();
            } else {
                openStoryMenu();
            }
        });

        storyMenu.addEventListener('mouseenter', openStoryMenu);
        storyMenu.addEventListener('mouseleave', () => scheduleClose('story', closeStoryMenu));

        storyLinks.forEach((link) => {
            link.addEventListener('click', () => {
                storyLinks.forEach((item) => item.classList.remove('is-selected'));
                link.classList.add('is-selected');
            });
        });
    }

    if (realEstateMenu && realEstateTrigger) {
        const stateButtons = Array.from(realEstateMenu.querySelectorAll('.real-estate-status-btn'));
        const statePanels = Array.from(realEstateMenu.querySelectorAll('.real-estate-groups'));
        const statusCol = realEstateMenu.querySelector('.real-estate-status-col');

        const setRealEstateState = (state) => {
            stateButtons.forEach((btn) => {
                btn.classList.toggle('is-active', btn.dataset.reState === state);
            });
            statePanels.forEach((panel) => {
                panel.classList.toggle('is-active', panel.dataset.rePanel === state);
            });
        };

        const setHoveredRealEstateState = (hoveredButton) => {
            if (!statusCol) return;
            statusCol.classList.toggle('is-hovering', Boolean(hoveredButton));
            stateButtons.forEach((btn) => {
                btn.classList.toggle('is-hovered', btn === hoveredButton);
            });
        };

        const openRealEstateMenu = () => {
            clearCloseTimer('realEstate');
            syncRealEstatePanelLeft();
            closeStoryMenu();
            closeHospitalityMenu();
            realEstateMenu.classList.add('is-open');
            realEstateTrigger.setAttribute('aria-expanded', 'true');
        };

        realEstateTrigger.addEventListener('click', (event) => {
            event.preventDefault();
            if (realEstateMenu.classList.contains('is-open')) {
                closeRealEstateMenu();
            } else {
                openRealEstateMenu();
            }
        });

        realEstateMenu.addEventListener('mouseenter', openRealEstateMenu);
        realEstateMenu.addEventListener('mouseleave', () => scheduleClose('realEstate', closeRealEstateMenu));

        const statePageMap = {
            completed: 'real-estate-completed.html',
            upcoming: 'real-estate-upcoming.html'
        };

        stateButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                const selectedState = btn.dataset.reState;
                const isAlreadyActive = btn.classList.contains('is-active');

                if (isAlreadyActive) {
                    const targetPage = statePageMap[selectedState];
                    if (targetPage) {
                        window.location.href = targetPage;
                    }
                    return;
                }

                setRealEstateState(selectedState);
            });

            btn.addEventListener('mouseenter', () => {
                setHoveredRealEstateState(btn);
            });

            btn.addEventListener('focus', () => {
                setHoveredRealEstateState(btn);
            });
        });

        if (statusCol) {
            statusCol.addEventListener('mouseleave', () => {
                setHoveredRealEstateState(null);
            });

            statusCol.addEventListener('focusout', () => {
                window.requestAnimationFrame(() => {
                    if (!statusCol.contains(document.activeElement) && !statusCol.matches(':hover')) {
                        setHoveredRealEstateState(null);
                    }
                });
            });
        }
    }

    if (hospitalityMenu && hospitalityTrigger) {
        const openHospitalityMenu = () => {
            clearCloseTimer('hospitality');
            syncHospitalityItemLeft();
            closeStoryMenu();
            closeRealEstateMenu();
            hospitalityMenu.classList.add('is-open');
            hospitalityTrigger.setAttribute('aria-expanded', 'true');
        };

        hospitalityTrigger.addEventListener('click', (event) => {
            event.preventDefault();
            if (hospitalityMenu.classList.contains('is-open')) {
                closeHospitalityMenu();
            } else {
                openHospitalityMenu();
            }
        });

        hospitalityMenu.addEventListener('mouseenter', openHospitalityMenu);
        hospitalityMenu.addEventListener('mouseleave', () => scheduleClose('hospitality', closeHospitalityMenu));
    }

    document.addEventListener('click', (event) => {
        if (storyMenu && !storyMenu.contains(event.target)) {
            closeStoryMenu();
        }
        if (realEstateMenu && !realEstateMenu.contains(event.target)) {
            closeRealEstateMenu();
        }
        if (hospitalityMenu && !hospitalityMenu.contains(event.target)) {
            closeHospitalityMenu();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeStoryMenu();
            closeRealEstateMenu();
            closeHospitalityMenu();
        }
    });

    const suppressNavHover = () => {
        rootEl.classList.add('nav-hover-suppressed');
    };

    const releaseNavHoverSuppression = () => {
        rootEl.classList.remove('nav-hover-suppressed');
    };

    // Prevent detached dropdown overlays when the page scrolls.
    window.addEventListener('scroll', () => {
        closeStoryMenu();
        closeRealEstateMenu();
        closeHospitalityMenu();
        suppressNavHover();
    }, { passive: true });

    document.addEventListener('mousemove', releaseNavHoverSuppression, { passive: true });
    document.addEventListener('pointermove', releaseNavHoverSuppression, { passive: true });
    document.addEventListener('touchstart', releaseNavHoverSuppression, { passive: true });

    const enquiryTypeGroups = Array.from(document.querySelectorAll('.contact-enquiry-type'));
    enquiryTypeGroups.forEach((group) => {
        const chips = Array.from(group.querySelectorAll('.enquiry-chip'));
        const hiddenInput = document.getElementById('contact-enquiry-type');

        const setActiveChip = (selectedChip) => {
            chips.forEach((chip) => {
                const isActive = chip === selectedChip;
                chip.classList.toggle('is-active', isActive);
                chip.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            });

            if (hiddenInput) {
                hiddenInput.value = selectedChip.dataset.enquiryValue || selectedChip.textContent.trim();
            }
        };

        chips.forEach((chip) => {
            chip.addEventListener('click', () => setActiveChip(chip));
        });

        const initiallyActiveChip = chips.find((chip) => chip.classList.contains('is-active')) || chips[0];
        if (initiallyActiveChip) {
            setActiveChip(initiallyActiveChip);
        }
    });

    const citySwitchButtons = Array.from(document.querySelectorAll('.re-city-btn[data-city-switch]'));
    const cityPanels = Array.from(document.querySelectorAll('.re-city-panel[data-city-panel]'));
    const featuredGrid = document.querySelector('.re-featured-grid');
    const featuredCards = Array.from(document.querySelectorAll('.re-featured-card[data-featured-city]'));
    if (citySwitchButtons.length > 0 && cityPanels.length > 0) {
        const setActiveCity = (city) => {
            citySwitchButtons.forEach((button) => {
                const isActive = button.dataset.citySwitch === city;
                button.classList.toggle('is-active', isActive);
                button.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });

            cityPanels.forEach((panel) => {
                panel.classList.toggle('is-active', panel.dataset.cityPanel === city);
            });

            if (featuredCards.length > 0) {
                featuredCards.forEach((card) => {
                    card.classList.toggle('is-hidden-by-city', card.dataset.featuredCity !== city);
                });
            }

            if (featuredGrid) {
                featuredGrid.classList.toggle('is-pune-view', city === 'pune');
            }
        };

        citySwitchButtons.forEach((button) => {
            button.addEventListener('click', () => {
                setActiveCity(button.dataset.citySwitch);
            });
        });

        const defaultButton = citySwitchButtons.find((button) => button.classList.contains('is-active')) || citySwitchButtons[0];
        if (defaultButton) {
            setActiveCity(defaultButton.dataset.citySwitch);
        }
    }

    if (lazyBgCards.length > 0) {
        const applyBackgroundAsset = (card) => {
            const bgPath = card.dataset.bg;
            if (!bgPath || card.dataset.bgLoaded === 'true' || card.dataset.bgLoading === 'true') return;

            const commitLoaded = () => {
                card.style.backgroundImage = `url("${bgPath}")`;
                card.dataset.bgLoaded = 'true';
                card.dataset.bgLoading = 'false';
                loadedBgPaths.add(bgPath);
            };

            if (loadedBgPaths.has(bgPath)) {
                commitLoaded();
                return;
            }

            card.dataset.bgLoading = 'true';
            const preloader = new Image();
            preloader.decoding = 'async';
            preloader.fetchPriority = card.dataset.bgPriority === 'high' ? 'high' : 'low';
            preloader.src = bgPath;

            const applyNow = () => {
                if (card.dataset.bgLoaded === 'true') return;
                commitLoaded();
            };

            if (typeof preloader.decode === 'function') {
                preloader.decode().then(applyNow).catch(applyNow);
            } else {
                preloader.onload = applyNow;
                preloader.onerror = applyNow;
            }
        };

        const eagerCards = lazyBgCards.filter((card) => {
            if (card.dataset.bgPriority === 'high') return true;
            const rect = card.getBoundingClientRect();
            return rect.top < window.innerHeight * 1.8;
        });

        eagerCards.forEach(applyBackgroundAsset);

        if ('IntersectionObserver' in window) {
            const bgObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    applyBackgroundAsset(entry.target);
                    observer.unobserve(entry.target);
                });
            }, {
                root: null,
                rootMargin: '1200px 0px',
                threshold: 0.01
            });

            lazyBgCards.forEach((card) => {
                if (card.dataset.bgLoaded === 'true') return;
                bgObserver.observe(card);
            });
        } else {
            lazyBgCards.forEach(applyBackgroundAsset);
        }
    }

    const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));
    const heroEnquireBtns = Array.from(document.querySelectorAll('.hero-enquire-btn[data-slide-index]'));
    if (heroSlides.length > 1) {
        let activeHeroIndex = 0;
        const heroIntervalMs = 5000;
        let heroTimerId = null;

        const updateEnquireButtons = () => {
            heroEnquireBtns.forEach((btn) => {
                const btnIndex = Number(btn.dataset.slideIndex);
                btn.classList.toggle('is-active', btnIndex === activeHeroIndex);
            });
        };

        const advanceHero = () => {
            heroSlides[activeHeroIndex].classList.remove('is-active');
            activeHeroIndex = (activeHeroIndex + 1) % heroSlides.length;
            heroSlides[activeHeroIndex].classList.add('is-active');
            updateEnquireButtons();
        };

        const startHeroTimer = () => {
            if (heroTimerId !== null) return;
            heroTimerId = window.setInterval(advanceHero, heroIntervalMs);
        };

        const stopHeroTimer = () => {
            if (heroTimerId === null) return;
            clearInterval(heroTimerId);
            heroTimerId = null;
        };

        updateEnquireButtons();
        startHeroTimer();

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopHeroTimer();
            } else {
                startHeroTimer();
            }
        });

        window.addEventListener('pagehide', stopHeroTimer);
    }

    const track = document.getElementById('testimonial-track');
    if (track) {
        const cards = track.querySelectorAll('.testi-card');
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let animationFrameId = null;
        let shouldAnimate = true;
        let lastUpdateTs = 0;
        const frameIntervalMs = 80;

        function renderCardScale(ts = 0) {
            if (!shouldAnimate) {
                animationFrameId = null;
                return;
            }

            if (ts - lastUpdateTs < frameIntervalMs) {
                animationFrameId = requestAnimationFrame(renderCardScale);
                return;
            }
            lastUpdateTs = ts;

            const screenCenter = window.innerWidth / 2;

            cards.forEach((card) => {
                const rect = card.getBoundingClientRect();
                const cardCenter = rect.left + (rect.width / 2);
                const distanceFromCenter = Math.abs(screenCenter - cardCenter);

                const maxScale = 1.25;
                const effectRange = window.innerWidth * 0.35;

                let scale = 1;
                if (distanceFromCenter < effectRange) {
                    scale = 1 + (maxScale - 1) * Math.pow(1 - (distanceFromCenter / effectRange), 1.5);
                }

                const opacityShadow = Math.max(0, (scale - 1) * 3);

                card.style.transform = `scale(${scale})`;
                card.style.boxShadow = `0 ${8 * opacityShadow}px ${25 * opacityShadow}px rgba(0, 0, 0, ${0.1 * opacityShadow})`;
            });

            animationFrameId = requestAnimationFrame(renderCardScale);
        }

        const startCardScale = () => {
            shouldAnimate = true;
            if (animationFrameId === null) {
                animationFrameId = requestAnimationFrame(renderCardScale);
            }
        };

        const stopCardScale = () => {
            shouldAnimate = false;
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        };

        if (prefersReducedMotion) {
            cards.forEach((card) => {
                card.style.transform = 'scale(1)';
                card.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
            });
            return;
        }

        if ('IntersectionObserver' in window) {
            const trackObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        startCardScale();
                    } else {
                        stopCardScale();
                    }
                });
            }, {
                root: null,
                threshold: 0.1
            });

            trackObserver.observe(track);
        } else {
            startCardScale();
        }

        window.addEventListener('pagehide', stopCardScale);
    }

    const promoteCriticalHeaderAssets = () => {
        const headerLogos = Array.from(document.querySelectorAll('header .logo-img'));
        headerLogos.forEach((logo) => {
            logo.loading = 'eager';
            logo.decoding = 'async';
            logo.fetchPriority = 'high';
        });
    };

    const warmImageCache = () => {
        const navConnection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (navConnection && navConnection.saveData) return;
        if (navConnection && typeof navConnection.effectiveType === 'string' && /(^|-)2g$/.test(navConnection.effectiveType)) return;

        const seen = new Set();
        const queue = [];

        const pushCandidate = (rawSrc) => {
            if (!rawSrc) return;
            const trimmed = rawSrc.trim();
            if (!trimmed || trimmed.startsWith('data:')) return;
            try {
                const resolved = new URL(trimmed, window.location.href).href;
                if (seen.has(resolved)) return;
                seen.add(resolved);
                queue.push(resolved);
            } catch (_) {
                // Ignore malformed URLs.
            }
        };

        document.querySelectorAll('img[src]').forEach((img) => {
            pushCandidate(img.currentSrc || img.src);
        });

        if (queue.length === 0) return;

        const maxParallel = 3;
        let activeLoads = 0;
        let nextIndex = 0;

        const pump = () => {
            while (activeLoads < maxParallel && nextIndex < queue.length) {
                const src = queue[nextIndex++];
                const preloadImage = new Image();
                activeLoads += 1;

                const finalize = () => {
                    activeLoads -= 1;
                    pump();
                };

                preloadImage.decoding = 'async';
                preloadImage.onload = finalize;
                preloadImage.onerror = finalize;
                preloadImage.src = src;
            }
        };

        pump();
    };

    promoteCriticalHeaderAssets();
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => warmImageCache(), { timeout: 2500 });
    } else {
        window.setTimeout(warmImageCache, 1200);
    }
});
