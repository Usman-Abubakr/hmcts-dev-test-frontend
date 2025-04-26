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
        case 'to do':
            return 'govuk-tag govuk-tag--grey';
        case 'in progress':
            return 'govuk-tag govuk-tag--blue';
        case 'complete':
            return 'govuk-tag govuk-tag--green';
        default:
            return 'govuk-tag';
    }
}

/**
 * Checks if the provided date is valid.
 * @param {number} year - The year of the date.
 * @param {number} month - The month of the date (1-12).
 * @param {number} day - The day of the date (1-31).
 * @returns {boolean} - True if the date is valid, false otherwise.
 */
function isValidDate(year: number, month: number, day: number): boolean {
    const date = new Date(year, month - 1, day); // month is 0-indexed in JS
    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
}

export default function (app: Application): void {
    
    app.get('/tasks/new', (req, res) => {
        res.render('new-task');
    });

    // Get all tasks
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

    // Create a new task
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
                status: taskStatus ?? 'to do', // Default to 'to do' if not provided
                dueDate: dueDate ?? null
            });
    
            // After successful creation, redirect back to tasks list
            res.redirect('/tasks');
        } catch (error) {
            console.error('Error creating task:', error);
            res.status(500).send('Something went wrong creating the task.');
        }
    });

    // Get a specific task
    app.get('/tasks/:id', async (req, res) => {
    const taskId = req.params.id;
    
    const response = await axios.get(`http://localhost:4000/tasks/${taskId}`);
    const task = response.data;
  
    // Format due date parts
    const [year, month, day] = (task.dueDate || '---').split('-');
  
    res.render('update-task', {
        task: {
            ...task,
            dueDateDay: day,
            dueDateMonth: month,
        dueDateYear: year,
        }
    });
    });

  // Update a specific task
  app.post('/tasks/:id', async (req, res) => {
    const id = req.params.id;
    const { taskTitle, taskCaseNumber, taskDescription, taskStatus } = req.body;

    const dueDateDay = req.body['taskDueDate-day'];
    const dueDateMonth = req.body['taskDueDate-month'];
    const dueDateYear = req.body['taskDueDate-year'];

    let dueDate = undefined;
    if (dueDateYear && dueDateMonth && dueDateDay) {
        const year = parseInt(dueDateYear, 10);
        const month = parseInt(dueDateMonth, 10);
        const day = parseInt(dueDateDay, 10);

        if (isValidDate(year, month, day)) {
            dueDate = `${year}-${dueDateMonth.padStart(2, '0')}-${dueDateDay.padStart(2, '0')}`;
        } else {
            console.error('Invalid date entered');
            dueDate = undefined;
        }
    }

    try {
        console.log('Sending updated task to API:', {
            id,
            caseNumber: taskCaseNumber,
            title: taskTitle,
            description: taskDescription,
            status: taskStatus ?? 'to do',
            dueDate: dueDate ?? null
        });

        await axios.put('http://localhost:4000/tasks', {
            id,
            caseNumber: taskCaseNumber,
            title: taskTitle,
            description: taskDescription,
            status: taskStatus ?? 'to do',
            dueDate: dueDate ?? null
        });

        res.redirect('/tasks');
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).send('Something went wrong updating the task.');
    }
});

    // Delete a specific task
    app.post('/tasks/:id/delete', async (req, res) => {
        const id = req.params.id;

        try {
            await axios.delete(`http://localhost:4000/tasks/${id}`);
            res.redirect('/tasks');
        } catch (error) {
            console.error('Error deleting task:', error);
            res.status(500).send('Something went wrong deleting the task.');
        }
    });

}