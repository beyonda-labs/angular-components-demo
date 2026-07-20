export const environment = {
    production: true,
    hostname: 'localhost',
    port: 3000,
    get baseUrl(): string {
        return `http://${this.hostname}:${this.port}`;
    },
    accessControlUrl: 'http://localhost:3000/api/auth',
    appName: 'PDF Generator',
    cookieName: 'beyonda_session',
    webApiPath: '/api',
};
