export const environment = {
    production: true,
    hostname: 'localhost',
    port: 3000,
    context: 'api',
    get baseUrl(): string {
        return `${this.hostname}:${this.port}/${this.context}`;
    },
    accessControlUrl: 'http://localhost:3000/api/auth',
    appName: 'PDF Generator',
    cookieName: 'beyonda_session',
    webApiPath: '/api',
};
