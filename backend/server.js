const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from frontend directory
app.use('/', express.static(path.join(__dirname, '../frontend')));

// Serve course files directly
app.use('/courses', express.static(path.join(__dirname, '../courses')));

// API endpoint to get course structure
app.get('/api/course-structure', async (req, res) => {
    try {
        const coursesDir = path.join(__dirname, '../courses');
        const structure = await buildCourseStructure(coursesDir);
        res.json(structure);
    } catch (error) {
        console.error('Error building course structure:', error);
        res.status(500).json({ error: 'Failed to load course structure' });
    }
});

// API endpoint to get file content
app.get('/api/content/*', async (req, res) => {
    try {
        const filePath = req.params[0];
        const fullPath = path.join(__dirname, '..', filePath);

        // Security check: ensure the path is within the project directory
        const projectRoot = path.resolve(__dirname, '..');
        const resolvedPath = path.resolve(fullPath);

        if (!resolvedPath.startsWith(projectRoot)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const content = await fs.readFile(resolvedPath, 'utf8');
        res.type('text/plain');
        res.send(content);
    } catch (error) {
        console.error('Error reading file:', error);
        if (error.code === 'ENOENT') {
            res.status(404).json({ error: 'File not found' });
        } else {
            res.status(500).json({ error: 'Failed to read file' });
        }
    }
});

async function buildCourseStructure(dirPath, relativePath = '') {
    const items = await fs.readdir(dirPath, { withFileTypes: true });

    // Build proper relative path including 'courses' prefix
    const baseName = path.basename(dirPath);
    const fullRelativePath = relativePath || 'courses';

    const structure = {
        name: baseName,
        type: 'folder',
        path: fullRelativePath,
        children: []
    };

    for (const item of items) {
        const itemPath = path.join(dirPath, item.name);
        const itemRelativePath = path.posix.join(fullRelativePath, item.name);

        if (item.isDirectory()) {
            // Skip hidden directories and common non-course directories
            if (item.name.startsWith('.') || item.name === 'node_modules') {
                continue;
            }

            const childStructure = await buildCourseStructure(itemPath, itemRelativePath);
            structure.children.push(childStructure);
        } else if (item.isFile()) {
            // Include common learning content file types
            const ext = path.extname(item.name).toLowerCase();
            const allowedExtensions = ['.md', '.txt', '.json', '.js', '.py', '.html', '.css', '.jpg', '.png', '.gif', '.pdf'];

            if (allowedExtensions.includes(ext) || item.name.toLowerCase() === 'readme') {
                structure.children.push({
                    name: item.name,
                    type: 'file',
                    path: itemRelativePath
                });
            }
        }
    }

    // Sort children: folders first, then files, both alphabetically
    structure.children.sort((a, b) => {
        if (a.type !== b.type) {
            return a.type === 'folder' ? -1 : 1;
        }
        return a.name.localeCompare(b.name, undefined, { numeric: true });
    });

    return structure;
}

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
    console.log(`E-Learning Backend running on http://localhost:${PORT}`);
    console.log(`Frontend available at: http://localhost:${PORT}`);
});

module.exports = app;