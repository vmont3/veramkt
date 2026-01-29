/**
 * VERA Tracking Script - Client-Side Buyer Signal Collector
 *
 * Installation:
 * Add this script to your website's <head>:
 * <script src="https://vera.ai/track.js" data-vera-key="YOUR_API_KEY"></script>
 *
 * Or use npm package:
 * npm install @vera/track
 */

(function() {
    'use strict';

    // Configuration
    const API_ENDPOINT = 'https://api.vera.ai/v1/signals';
    const BATCH_INTERVAL = 5000; // Send batch every 5 seconds
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

    // Get API key from script tag
    const scriptTag = document.currentScript || document.querySelector('script[data-vera-key]');
    const API_KEY = scriptTag ? scriptTag.getAttribute('data-vera-key') : null;

    if (!API_KEY) {
        console.warn('[VERA] API key not found. Add data-vera-key to script tag.');
        return;
    }

    // Generate or retrieve visitor ID (persistent)
    function getVisitorId() {
        let visitorId = localStorage.getItem('vera_visitor_id');

        if (!visitorId) {
            visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('vera_visitor_id', visitorId);
        }

        return visitorId;
    }

    // Generate or retrieve session ID (expires after timeout)
    function getSessionId() {
        const now = Date.now();
        let sessionData = JSON.parse(sessionStorage.getItem('vera_session') || '{}');

        if (!sessionData.id || (now - sessionData.lastActivity) > SESSION_TIMEOUT) {
            sessionData = {
                id: 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                lastActivity: now
            };
        } else {
            sessionData.lastActivity = now;
        }

        sessionStorage.setItem('vera_session', JSON.stringify(sessionData));
        return sessionData.id;
    }

    // Signal queue for batching
    let signalQueue = [];

    // Track a signal
    function trackSignal(type, data = {}) {
        const signal = {
            visitorId: getVisitorId(),
            sessionId: getSessionId(),
            type,
            source: 'website',
            data,
            metadata: {
                page: window.location.href,
                referrer: document.referrer,
                device: getDeviceType(),
                timestamp: new Date().toISOString()
            }
        };

        signalQueue.push(signal);

        // Send immediately for high-priority signals
        if (type === 'form_interaction' || type === 'button_click') {
            sendBatch();
        }
    }

    // Get device type
    function getDeviceType() {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return 'tablet';
        }
        if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            return 'mobile';
        }
        return 'desktop';
    }

    // Send batch of signals to API
    async function sendBatch() {
        if (signalQueue.length === 0) return;

        const batch = [...signalQueue];
        signalQueue = [];

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-VERA-API-Key': API_KEY
                },
                body: JSON.stringify({ signals: batch }),
                keepalive: true // Important for page unload
            });

            if (!response.ok) {
                console.error('[VERA] Failed to send signals:', response.status);
            }

        } catch (error) {
            console.error('[VERA] Error sending signals:', error);
        }
    }

    // Track page view
    trackSignal('page_view', {
        title: document.title,
        path: window.location.pathname
    });

    // Track time on page
    let pageStartTime = Date.now();

    function trackTimeOnPage() {
        const timeSpent = Math.floor((Date.now() - pageStartTime) / 1000);

        if (timeSpent > 10) { // Only track if spent more than 10 seconds
            trackSignal('time_on_page', {
                seconds: timeSpent,
                path: window.location.pathname
            });
        }
    }

    // Track before page unload
    window.addEventListener('beforeunload', () => {
        trackTimeOnPage();
        sendBatch();
    });

    // Track visibility changes (tab switching)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            trackTimeOnPage();
            sendBatch();
        } else {
            pageStartTime = Date.now();
        }
    });

    // Track form interactions
    document.addEventListener('focusin', (e) => {
        const element = e.target;

        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
            const form = element.closest('form');

            trackSignal('form_interaction', {
                fieldName: element.name || element.id,
                fieldType: element.type,
                formId: form ? (form.id || form.action) : null
            });
        }
    });

    // Track form submissions
    document.addEventListener('submit', (e) => {
        const form = e.target;

        trackSignal('form_interaction', {
            event: 'submit',
            formId: form.id || form.action
        });

        sendBatch(); // Send immediately
    }, true);

    // Track button clicks (CTA)
    document.addEventListener('click', (e) => {
        const element = e.target.closest('button, a[href], [role="button"]');

        if (element) {
            const text = element.textContent.trim().substring(0, 50);
            const isCTA = /buy|purchase|trial|demo|contact|signup|subscribe|download/i.test(text);

            if (isCTA) {
                trackSignal('button_click', {
                    text,
                    href: element.href,
                    isCTA: true
                });
            }
        }
    }, true);

    // Track video watch
    document.addEventListener('play', (e) => {
        if (e.target.tagName === 'VIDEO') {
            trackSignal('video_watch', {
                src: e.target.currentSrc,
                duration: e.target.duration
            });
        }
    }, true);

    // Track downloads
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[download], a[href$=".pdf"], a[href$=".zip"], a[href$=".doc"]');

        if (link) {
            trackSignal('download', {
                file: link.href,
                filename: link.download || link.href.split('/').pop()
            });
        }
    }, true);

    // Track search (if search input detected)
    const searchInputs = document.querySelectorAll('input[type="search"], input[name*="search"], input[name*="query"]');

    searchInputs.forEach(input => {
        let searchTimeout;

        input.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);

            searchTimeout = setTimeout(() => {
                const query = e.target.value.trim();

                if (query.length >= 3) {
                    trackSignal('search_query', {
                        query: query
                    });
                }
            }, 1000);
        });
    });

    // Send batch periodically
    setInterval(sendBatch, BATCH_INTERVAL);

    // Track repeat visits
    const visitCount = parseInt(localStorage.getItem('vera_visit_count') || '0') + 1;
    localStorage.setItem('vera_visit_count', visitCount.toString());

    if (visitCount >= 2) {
        trackSignal('repeat_visit', {
            count: visitCount
        });
    }

    // Public API for custom tracking
    window.VERA = {
        track: trackSignal,
        identify: function(userId, traits = {}) {
            trackSignal('identify', {
                userId,
                traits
            });
        },
        flush: sendBatch
    };

    console.log('[VERA] Tracking initialized. Visitor:', getVisitorId());

})();
