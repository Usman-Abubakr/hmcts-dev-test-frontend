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

    app.post('/tasks', async (req, res) => {
        const { taskName, taskCaseNumber, taskDescription, taskStatus } = req.body;
      
        // Convert date input
        // const dueDate = `${taskDueDate.year}-${taskDueDate.month.padStart(2, '0')}-${taskDueDate.day.padStart(2, '0')}`;
      
        const dueDateDay = req.body['taskDueDate-day'];
        const dueDateMonth = req.body['taskDueDate-month'];
        const dueDateYear = req.body['taskDueDate-year'];

        let dueDate: string | undefined = undefined;
        if (dueDateYear && dueDateMonth && dueDateDay) {
            dueDate = `${dueDateYear}-${dueDateMonth.padStart(2, '0')}-${dueDateDay.padStart(2, '0')}`;
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

    // app.post('/tasks', async (req, res) => {
    //     const { taskName, taskCaseNumber, taskDescription, taskDueDate, taskStatus } = req.body;
      
    //     // Format the due date
    //     const dueDate = `${taskDueDate['year']}-${taskDueDate['month']}-${taskDueDate['day']}`;
      
    //     const newTask = {
    //       title: taskName,
    //       caseNumber: taskCaseNumber,
    //       description: taskDescription,
    //       status: taskStatus,
    //       dueDate: dueDate
    //     };
      
    //     // Now send this to your API
    //     try {
    //       await axios.post('http://localhost:3000/tasks', newTask); // Change URL if your API runs elsewhere
    //       res.redirect('/tasks'); // After saving, go back to task list
    //     } catch (error) {
    //       console.error('Error saving task:', error);
    //       res.status(500).send('Failed to save task');
    //     }
    //   });

    // app.get('/tasks/:id', async (req, res) => {
    //     const taskId = req.params.id;
    //     try {
    //         const response = await axios.get<Task>(`http://localhost:4000/tasks/${taskId}`);
    //         const task = response.data;

    //         if (!task) {
    //             return res.status(404).send('Task not found');
    //         }

    //         res.render('task-details', { task });
    //     } catch (error) {
    //         console.error('Error fetching task:', error);
    //         res.status(500).send('Internal Server Error');
    //     }
    // });
}