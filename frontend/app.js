class ELearningApp {
    constructor() {
        this.currentPath = '';
        this.courseStructure = null;
        this.courseTree = document.getElementById('courseTree');
        this.contentCanvas = document.getElementById('contentCanvas');
        this.breadcrumb = document.getElementById('breadcrumb');
        this.sidebar = document.getElementById('sidebar');
        this.sidebarToggle = document.getElementById('sidebarToggle');

        // Icon mappings for different file types
        this.fileIcons = {
            // Document types
            'md': '📖',
            'markdown': '📖',
            'txt': '📝',
            'pdf': '📑',
            'doc': '📄',
            'docx': '📄',

            // Code files
            'py': '🐍',
            'js': '📜',
            'ts': '💙',
            'jsx': '⚛️',
            'tsx': '⚛️',
            'html': '🌐',
            'css': '🎨',
            'scss': '🎨',
            'sass': '🎨',
            'java': '☕',
            'cpp': '⚙️',
            'c': '⚙️',
            'cs': '🔷',
            'php': '🐘',
            'rb': '💎',
            'go': '🐹',
            'rs': '🦀',
            'swift': '🦉',
            'kt': '🟣',

            // Data files
            'json': '📊',
            'xml': '📋',
            'yaml': '📋',
            'yml': '📋',
            'csv': '📊',
            'sql': '🗃️',

            // Image files
            'jpg': '🖼️',
            'jpeg': '🖼️',
            'png': '🖼️',
            'gif': '🖼️',
            'svg': '🖼️',
            'webp': '🖼️',
            'bmp': '🖼️',
            'ico': '🖼️',

            // Video/Audio files
            'mp4': '🎥',
            'avi': '🎥',
            'mov': '🎥',
            'webm': '🎥',
            'mp3': '🎵',
            'wav': '🎵',
            'ogg': '🎵',

            // Archive files
            'zip': '📦',
            'tar': '📦',
            'gz': '📦',
            'rar': '📦',
            '7z': '📦',

            // Config files
            'env': '⚙️',
            'config': '⚙️',
            'ini': '⚙️',
            'toml': '⚙️',

            // Default
            'default': '📄'
        };

        this.init();
    }

    async init() {
        try {
            await this.loadCourseStructure();
            this.renderCourseTree();
            // Load syllabus on initial load
            await this.loadSyllabus();
        } catch (error) {
            this.showError('Failed to load course structure: ' + error.message);
        }
    }

    async loadSyllabus() {
        try {
            const syllabusPath = 'courses/genaiboot/syllabus.md';
            const content = await this.loadFileContent(syllabusPath);
            if (content) {
                const html = marked.parse(content);
                this.contentCanvas.innerHTML = `
                    <div class="syllabus-content">
                        ${html}
                    </div>
                `;
                // Update breadcrumb to show we're on home/syllabus
                this.breadcrumb.innerHTML = '<span class="breadcrumb-home" title="Home">🏠</span> › Syllabus';
                // Process links in the content
                this.processLinks();
            }
        } catch (error) {
            // If syllabus not found, show regular welcome message
            this.contentCanvas.innerHTML = `
                <div class="welcome-content">
                    <h1>📚 Welcome to E-Learning Platform</h1>
                    <p>Select a file from the navigation tree to begin learning.</p>
                </div>
            `;
        }
    }

    async loadCourseStructure() {
        try {
            const response = await fetch('/api/course-structure');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            this.courseStructure = await response.json();
        } catch (error) {
            // Fallback: try to load from local structure
            console.warn('API not available, using mock data');
            this.courseStructure = await this.createMockStructure();
        }
    }

    async createMockStructure() {
        // This creates a mock structure based on the courses directory
        return {
            name: "Sample Course",
            type: "folder",
            path: "courses/sample-course",
            children: [
                {
                    name: "README.md",
                    type: "file",
                    path: "courses/sample-course/README.md"
                },
                {
                    name: "0-introduction",
                    type: "folder",
                    path: "courses/sample-course/0-introduction",
                    children: [
                        {
                            name: "welcome.md",
                            type: "file",
                            path: "courses/sample-course/0-introduction/welcome.md"
                        }
                    ]
                },
                {
                    name: "1-fundamentals",
                    type: "folder",
                    path: "courses/sample-course/1-fundamentals",
                    children: [
                        {
                            name: "lessons",
                            type: "folder",
                            path: "courses/sample-course/1-fundamentals/lessons",
                            children: [
                                {
                                    name: "lesson-01.md",
                                    type: "file",
                                    path: "courses/sample-course/1-fundamentals/lessons/lesson-01.md"
                                }
                            ]
                        },
                        {
                            name: "exercises",
                            type: "folder",
                            path: "courses/sample-course/1-fundamentals/exercises",
                            children: [
                                {
                                    name: "exercise-01.md",
                                    type: "file",
                                    path: "courses/sample-course/1-fundamentals/exercises/exercise-01.md"
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    }

    renderCourseTree() {
        this.courseTree.innerHTML = '';
        if (this.courseStructure) {
            const treeElement = this.createTreeElement(this.courseStructure);
            this.courseTree.appendChild(treeElement);
        }
    }

    // Format file/folder names for display
    formatDisplayName(name, isFile = false) {
        let displayName = name;

        // Remove file extension for files
        if (isFile) {
            const lastDotIndex = name.lastIndexOf('.');
            if (lastDotIndex > 0) {
                displayName = name.substring(0, lastDotIndex);
            }
        }

        // Replace hyphens and underscores with spaces
        displayName = displayName.replace(/[-_]/g, ' ');

        // Capitalize each word (title case)
        displayName = displayName.replace(/\b\w/g, char => char.toUpperCase());

        // Handle special cases like 'Readme' -> 'README'
        if (displayName.toLowerCase() === 'readme') {
            displayName = 'README';
        }

        return displayName;
    }

    // Get appropriate icon for file
    getFileIcon(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        return this.fileIcons[extension] || this.fileIcons.default;
    }

    createTreeElement(item, level = 0) {
        const element = document.createElement('div');
        element.className = 'tree-item';

        if (item.type === 'folder') {
            const displayName = this.formatDisplayName(item.name, false);
            element.innerHTML = `
                <div class="tree-folder" data-path="${item.path}" title="${item.name}">
                    <span class="tree-icon">📁</span>
                    <span class="tree-name">${displayName}</span>
                </div>
            `;

            const folderDiv = element.querySelector('.tree-folder');
            folderDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleFolder(element, item);
            });

            if (item.children && item.children.length > 0) {
                const childrenContainer = document.createElement('div');
                childrenContainer.className = 'tree-children collapsed';

                item.children.forEach(child => {
                    const childElement = this.createTreeElement(child, level + 1);
                    childrenContainer.appendChild(childElement);
                });

                element.appendChild(childrenContainer);
            }
        } else {
            const displayName = this.formatDisplayName(item.name, true);
            const icon = this.getFileIcon(item.name);
            element.innerHTML = `
                <div class="tree-file" data-path="${item.path}" title="${item.name}">
                    <span class="tree-icon">${icon}</span>
                    <span class="tree-name">${displayName}</span>
                </div>
            `;

            const fileDiv = element.querySelector('.tree-file');
            fileDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectFile(item.path, fileDiv);
            });
        }

        return element;
    }

    toggleFolder(element, item) {
        const childrenContainer = element.querySelector('.tree-children');
        const folderDiv = element.querySelector('.tree-folder');
        const icon = folderDiv.querySelector('.tree-icon');

        if (childrenContainer) {
            const isCollapsed = childrenContainer.classList.contains('collapsed');

            if (isCollapsed) {
                childrenContainer.classList.remove('collapsed');
                icon.textContent = '📂';
            } else {
                childrenContainer.classList.add('collapsed');
                icon.textContent = '📁';
            }
        }

        // If folder has README.md, load it when expanded
        if (item.children) {
            const readme = item.children.find(child =>
                child.name.toLowerCase() === 'readme.md' && child.type === 'file'
            );
            if (readme && !childrenContainer.classList.contains('collapsed')) {
                this.selectFile(readme.path);
            }
        }
    }

    async selectFile(filePath, fileElement = null) {
        // Update active state
        document.querySelectorAll('.tree-file.active').forEach(el => {
            el.classList.remove('active');
        });

        if (fileElement) {
            fileElement.classList.add('active');
        }

        // Update breadcrumb
        this.updateBreadcrumb(filePath);

        // Load and display content
        try {
            this.showLoading();
            const content = await this.loadFileContent(filePath);
            this.renderContent(content, filePath);
        } catch (error) {
            this.showError(`Failed to load file: ${error.message}`);
        }
    }

    async loadFileContent(filePath) {
        try {
            const response = await fetch(`/api/content/${encodeURIComponent(filePath)}`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return await response.text();
        } catch (error) {
            // Fallback: try to load from relative path
            console.warn('API not available, trying direct file access');
            const response = await fetch(`../${filePath}`);
            if (!response.ok) {
                throw new Error(`Could not load file: ${filePath}`);
            }
            return await response.text();
        }
    }

    renderContent(content, filePath) {
        const fileExtension = filePath.split('.').pop().toLowerCase();

        let html = '';

        switch (fileExtension) {
            case 'md':
            case 'markdown':
                html = marked.parse(content);
                break;
            case 'txt':
                html = `<pre>${this.escapeHtml(content)}</pre>`;
                break;
            case 'json':
                try {
                    const jsonObj = JSON.parse(content);
                    html = `<pre><code class="language-json">${JSON.stringify(jsonObj, null, 2)}</code></pre>`;
                } catch (e) {
                    html = `<pre>${this.escapeHtml(content)}</pre>`;
                }
                break;
            default:
                if (this.isImageFile(filePath)) {
                    html = `<div class="image-container">
                        <img src="../${filePath}" alt="${filePath}" />
                        <p class="image-caption">Image: ${filePath}</p>
                    </div>`;
                } else {
                    html = `<pre>${this.escapeHtml(content)}</pre>`;
                }
        }

        this.contentCanvas.innerHTML = html;

        // Handle links to make them open in new tab if external
        this.processLinks();

        // Scroll to top
        this.contentCanvas.scrollTop = 0;
    }

    processLinks() {
        const links = this.contentCanvas.querySelectorAll('a');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && (href.startsWith('http') || href.startsWith('https'))) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });
    }

    isImageFile(filePath) {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
        const extension = filePath.split('.').pop().toLowerCase();
        return imageExtensions.includes(extension);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    updateBreadcrumb(filePath) {
        const pathParts = filePath.split('/');

        // Build breadcrumb HTML with clickable segments
        let breadcrumbHTML = '<span class="breadcrumb-home" title="Home">🏠</span>';

        pathParts.forEach((part, index) => {
            // Check if this is the last part (filename)
            const isFile = index === pathParts.length - 1 && part.includes('.');
            const displayName = this.formatDisplayName(part, isFile);

            // Build the path up to this segment
            const segmentPath = pathParts.slice(0, index + 1).join('/');

            breadcrumbHTML += ' › ';

            // Make non-file segments clickable
            if (!isFile && index < pathParts.length - 1) {
                breadcrumbHTML += `<span class="breadcrumb-segment" data-path="${segmentPath}" title="Navigate to ${displayName}">${displayName}</span>`;
            } else {
                // Last segment (current file/folder) is not clickable
                breadcrumbHTML += `<span class="breadcrumb-current">${displayName}</span>`;
            }
        });

        this.breadcrumb.innerHTML = breadcrumbHTML;

        // Add click handler for home icon
        const homeIcon = this.breadcrumb.querySelector('.breadcrumb-home');
        if (homeIcon) {
            homeIcon.addEventListener('click', async () => {
                // Load syllabus when home is clicked
                await this.loadSyllabus();
                // Remove active state from all files
                document.querySelectorAll('.tree-file.active').forEach(el => {
                    el.classList.remove('active');
                });
            });
        }

        // Add click handlers for breadcrumb segments
        const segments = this.breadcrumb.querySelectorAll('.breadcrumb-segment');
        segments.forEach(segment => {
            segment.addEventListener('click', () => {
                const segmentPath = segment.getAttribute('data-path');
                this.navigateToPath(segmentPath);
            });
        });
    }

    navigateToPath(path) {
        // Find and expand the folder in the tree
        const folderElements = document.querySelectorAll('.tree-folder');

        folderElements.forEach(folderEl => {
            const folderPath = folderEl.getAttribute('data-path');

            // Check if this folder is in the path or is the target
            if (path.startsWith(folderPath) || folderPath === path) {
                const treeItem = folderEl.closest('.tree-item');
                const childrenContainer = treeItem.querySelector('.tree-children');

                if (childrenContainer && childrenContainer.classList.contains('collapsed')) {
                    // Expand this folder
                    childrenContainer.classList.remove('collapsed');
                    const icon = folderEl.querySelector('.tree-icon');
                    if (icon) icon.textContent = '📂';
                }

                // If this is the exact path, look for README
                if (folderPath === path && childrenContainer) {
                    const readmeFile = Array.from(childrenContainer.querySelectorAll('.tree-file')).find(
                        el => el.querySelector('.tree-name').textContent.toLowerCase() === 'readme'
                    );

                    if (readmeFile) {
                        const readmePath = readmeFile.getAttribute('data-path');
                        this.selectFile(readmePath, readmeFile);
                    } else {
                        // Just show folder selected message
                        this.contentCanvas.innerHTML = `
                            <div class="folder-content">
                                <h2>📁 ${this.formatDisplayName(path.split('/').pop())}</h2>
                                <p>Select a file from this folder to view its content.</p>
                            </div>
                        `;
                    }
                }
            }
        });
    }

    showLoading() {
        this.contentCanvas.innerHTML = '<div class="loading-content">Loading content...</div>';
    }

    showError(message) {
        this.contentCanvas.innerHTML = `
            <div class="error-message">
                <h3>Error</h3>
                <p>${message}</p>
            </div>
        `;
    }

    initializeSidebarToggle() {
        // Restore saved state from localStorage
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState === 'true') {
            this.sidebar.classList.add('collapsed');
            this.sidebarToggle.querySelector('.toggle-icon').textContent = '☰';
            this.sidebarToggle.setAttribute('title', 'Expand Sidebar');
        }

        // Add click event listener to the toggle button
        this.sidebarToggle.addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Add keyboard shortcut (Ctrl/Cmd + B)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                this.toggleSidebar();
            }
        });
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('collapsed');

        // Update toggle icon
        const toggleIcon = this.sidebarToggle.querySelector('.toggle-icon');
        if (this.sidebar.classList.contains('collapsed')) {
            toggleIcon.textContent = '☰';
            this.sidebarToggle.setAttribute('title', 'Expand Sidebar');
        } else {
            toggleIcon.textContent = '☰';
            this.sidebarToggle.setAttribute('title', 'Collapse Sidebar');
        }

        // Save state to localStorage
        localStorage.setItem('sidebarCollapsed', this.sidebar.classList.contains('collapsed'));
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new ELearningApp();

    // Initialize sidebar toggle functionality
    app.initializeSidebarToggle();
});