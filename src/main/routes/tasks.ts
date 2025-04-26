import { Application } from 'express';
import axios from 'axios';

interface Task {
    id: number;
    caseNumber: string;
    title: string;
    description: string;
    status: string;
    dueDate: string;
}

/**
 * Returns the appropriate CSS class for the status tag based on the status value.
 * @param {string} status - The status of the task.
 * @returns {string} - The CSS class for the status tag.
 */
function getStatusTagClass(status: string): string {
    switch (status.toLowerCase()) {
        case 'todo':
            return 'govuk-tag govuk-tag--grey';
        case 'in progress':
            return 'govuk-tag govuk-tag--blue';
        case 'complete':
            return 'govuk-tag govuk-tag--green';
        default:
            return 'govuk-tag';
    }
}


export default function (app: Application): void {
    // GET /tasks/new
    app.get('/tasks/new', (req, res) => {
        res.render('new-task');
    });

    // Get /tasks
    app.get('/tasks', async (req, res) => {
        try {
            const response = await axios.get<Task[]>('http://localhost:4000/tasks');
            const tasks = response.data;

            const taskRows = tasks.map(task => ([
                { html: `<a class="govuk-link" href="/tasks/${task.id}">${task.title}</a>` },
                { text: task.dueDate },
                { html: `<strong class="${getStatusTagClass(task.status)}">${task.status}</strong>` }
            ]));

            res.render('tasks', { taskRows });
        } catch (error) {
            console.error('Error fetching tasks:', error);
            res.render('tasks', { taskRows: [] });
        }
    });

    function isValidDate(year: number, month: number, day: number): boolean {
        const date = new Date(year, month - 1, day); // month is 0-indexed in JS
        return (
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day
        );
    }

    app.post('/tasks', async (req, res) => {
        const { taskName, taskCaseNumber, taskDescription, taskStatus } = req.body;

        const dueDateDay = req.body['taskDueDate-day'];
        const dueDateMonth = req.body['taskDueDate-month'];
        const dueDateYear = req.body['taskDueDate-year'];

        let dueDate: string | undefined = undefined;
        if (dueDateYear && dueDateMonth && dueDateDay) {
            const year = parseInt(dueDateYear, 10);
            const month = parseInt(dueDateMonth, 10);
            const day = parseInt(dueDateDay, 10);

            if (isValidDate(year, month, day)) {
                dueDate = `${year}-${dueDateMonth.padStart(2, '0')}-${dueDateDay.padStart(2, '0')}`;
            } else {
                console.error('Invalid date entered');
                // Optional: handle this gracefully (redirect back with error, etc.)
                    dueDate = undefined; // or throw an error
                }
            }
    
            try {
                await axios.post('http://localhost:4000/tasks', {
                    caseNumber: taskCaseNumber,
                    title: taskName,
                    description: taskDescription,
                    status: taskStatus ?? 'todo', // Default to 'todo' if not provided
                    dueDate: dueDate ?? null
                });
    
                // After successful creation, redirect back to tasks list
                res.redirect('/tasks');
            } catch (error) {
                console.error('Error creating task:', error);
                res.status(500).send('Something went wrong creating the task.');
            }
        });
}