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
}