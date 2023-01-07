export class Contact {
    Id: string;
    FirstName: string;
    LastName?: string;
    PhoneNumber: string;
    Address?: string;
    Email?: string;
    Note?: string;
    Company?: string;
    JobName: string;
    JobId: string;
}

export class Job {
    Id: string;
    JobName: string;
}

export class Guid {
    static newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}