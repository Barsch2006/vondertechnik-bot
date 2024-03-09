export type ToDo = {
    id: number;
    message_id: string;
    todo: string;
    status: number;
    assigned_to: string;
};

export function statusToText(status: number): string {
    switch (status) {
        case 0:
            return 'open';
        case 1:
            return 'in progress';
        case 2:
            return 'done';
        default:
            return 'open';
    }
}
