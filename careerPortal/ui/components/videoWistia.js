/**
 * Generic Wistia Video Component
 * Handles Wistia video embedding with dynamic loading
 */

window.VideoWistia = class VideoWistia {
    constructor(containerId, videoId, options = {}) {
        this.containerId = containerId;
        this.videoId = videoId;
        this.container = null;
        this.options = {
            autoplay: false,
            muted: false,
            responsive: true,
            borderRadius: '20px',
            ...options
        };
        
        this.init();
    }

    /**
     * Initialize the video component
     */
    async init() {
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            console.error(`Container with ID '${this.containerId}' not found`);
            return;
        }

        await this.createVideoStructure();
        await this.loadWistiaScripts();
    }

    /**
     * Create the HTML structure for Wistia video
     */
    createVideoStructure() {
        const videoWrapper = document.createElement('div');
        videoWrapper.className = 'wistia-video-wrapper';
        videoWrapper.style.cssText = `
            position: relative;
            width: 100%;
            border-radius: ${this.options.borderRadius};
            overflow: hidden;
        `;

        const responsivePadding = document.createElement('div');
        responsivePadding.className = 'wistia_responsive_padding';
        responsivePadding.style.cssText = `
            padding: 56.25% 0 0 0;
            position: relative;
            border-radius: ${this.options.borderRadius};
            overflow: hidden;
        `;

        const responsiveWrapper = document.createElement('div');
        responsiveWrapper.className = 'wistia_responsive_wrapper';
        responsiveWrapper.style.cssText = `
            height: 100%;
            left: 0;
            position: absolute;
            top: 0;
            width: 100%;
            border-radius: ${this.options.borderRadius};
            overflow: hidden;
        `;

        const embedDiv = document.createElement('div');
        embedDiv.className = `wistia_embed wistia_async_${this.videoId}`;
        if (this.options.autoplay) embedDiv.className += ' autoPlay=true';
        if (this.options.muted) embedDiv.className += ' muted=true';
        embedDiv.style.cssText = `
            height: 100%;
            position: relative;
            width: 100%;
            border-radius: ${this.options.borderRadius};
        `;

        // Create swatch (thumbnail)
        const swatch = document.createElement('div');
        swatch.className = 'wistia_swatch';
        swatch.style.cssText = `
            height: 100%;
            left: 0;
            opacity: 0;
            overflow: hidden;
            position: absolute;
            top: 0;
            transition: opacity 200ms;
            width: 100%;
        `;

        const thumbnail = document.createElement('img');
        thumbnail.src = `https://fast.wistia.com/embed/medias/${this.videoId}/swatch`;
        thumbnail.style.cssText = `
            filter: blur(5px);
            height: 100%;
            object-fit: contain;
            width: 100%;
        `;
        thumbnail.alt = '';
        thumbnail.setAttribute('aria-hidden', 'true');
        thumbnail.onload = () => {
            swatch.style.opacity = '1';
        };

        // Assemble the structure
        swatch.appendChild(thumbnail);
        embedDiv.appendChild(swatch);
        responsiveWrapper.appendChild(embedDiv);
        responsivePadding.appendChild(responsiveWrapper);
        videoWrapper.appendChild(responsivePadding);
        
        this.container.appendChild(videoWrapper);
    }

    /**
     * Load Wistia scripts dynamically
     */
    async loadWistiaScripts() {
        try {
            // Load the video-specific JSON script
            await this.loadScript(`https://fast.wistia.com/embed/medias/${this.videoId}.jsonp`);
            
            // Load the main Wistia script
            await this.loadScript('https://fast.wistia.com/assets/external/E-v1.js');
            
            console.log(`Wistia video ${this.videoId} loaded successfully`);
        } catch (error) {
            console.error('Failed to load Wistia scripts:', error);
        }
    }

    /**
     * Load external script with promise
     */
    loadScript(src) {
        return new Promise((resolve, reject) => {
            // Check if script already exists
            const existingScript = document.querySelector(`script[src="${src}"]`);
            if (existingScript) {
                resolve(existingScript);
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            
            script.onload = () => resolve(script);
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            
            document.head.appendChild(script);
        });
    }

    /**
     * Update video ID and reload
     */
    async updateVideo(newVideoId) {
        this.videoId = newVideoId;
        this.container.innerHTML = ''; // Clear existing content
        await this.init();
    }

    /**
     * Get Wistia API instance (if available)
     */
    getWistiaAPI() {
        if (window.Wistia && window.Wistia.api) {
            return window.Wistia.api(this.videoId);
        }
        return null;
    }

    /**
     * Play video programmatically
     */
    play() {
        const api = this.getWistiaAPI();
        if (api) {
            api.play();
        }
    }

    /**
     * Pause video programmatically
     */
    pause() {
        const api = this.getWistiaAPI();
        if (api) {
            api.pause();
        }
    }

    /**
     * Mute/unmute video
     */
    setVolume(level) {
        const api = this.getWistiaAPI();
        if (api) {
            api.volume(level);
        }
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
};