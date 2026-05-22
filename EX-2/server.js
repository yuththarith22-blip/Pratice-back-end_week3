// server.js
import express from 'express';
import courses from './course.js';

const app = express();
const PORT = 3000;

// Route: GET /departments/:dept/courses
app.get('/departments/:dept/courses', (req, res) => {
    const { dept } = req.params;
    let { level, minCredits, maxCredits, semester, instructor } = req.query;

    // Parse numeric query params; ignore invalid numbers silently
    if (minCredits !== undefined) {
        const parsed = parseInt(minCredits, 10);
        minCredits = Number.isNaN(parsed) ? undefined : parsed;
    }
    if (maxCredits !== undefined) {
        const parsed = parseInt(maxCredits, 10);
        maxCredits = Number.isNaN(parsed) ? undefined : parsed;
    }

    // Handle invalid credit range
    if (minCredits !== undefined && maxCredits !== undefined && minCredits > maxCredits) {
        return res.status(400).json({ error: 'Invalid credit range: minCredits cannot be greater than maxCredits' });
    }

    const matched = courses.filter(course => {
        // department must match route param (case-insensitive)
        if (course.department.toLowerCase() !== dept.toLowerCase()) return false;

        if (level && course.level.toLowerCase() !== level.toLowerCase()) return false;

        if (minCredits !== undefined && course.credits < minCredits) return false;
        if (maxCredits !== undefined && course.credits > maxCredits) return false;

        if (semester && course.semester.toLowerCase() !== semester.toLowerCase()) return false;

        if (instructor && !course.instructor.toLowerCase().includes(instructor.toLowerCase())) return false;

        return true;
    });

    return res.json({
        results: matched,
        meta: { total: matched.length }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
