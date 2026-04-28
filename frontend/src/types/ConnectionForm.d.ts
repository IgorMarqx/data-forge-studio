import { Driver } from "./Driver";

export type ConnectionForm = {
    name: string;
    driver: Driver;
    host: string;
    port: string;
    database: string;
    username: string;
    password: string;
    ssl: boolean;
};
