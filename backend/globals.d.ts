declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SECRETE_TOKEN: string;
            PORT: string;
        }
    }
}
export { }