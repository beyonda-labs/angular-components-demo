export const environment = {
    production: false,
    hostname: 'localhost',
    port: 8082,
    context: 'demo',
    get baseUrl(): string {
        return `${this.hostname}:${this.port}/${this.context}`;
    },
    accessControlUrl: 'http://localhost:8082/demo/auth',
    appName: 'Demo App',
    cookieName: 'beyonda_session',
    webApiPath: '/web-api'
};
