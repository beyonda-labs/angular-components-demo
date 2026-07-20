export const environment = {
    production: false,
    hostname: 'localhost',
    port: 3000,
    get baseUrl(): string {
        return `http://${this.hostname}:${this.port}`;
    },
    accessControlUrl: 'http://localhost:3000/auth',
    appName: 'Demo App',
    cookieName: 'beyonda_session',
    webApiPath: ''
};
