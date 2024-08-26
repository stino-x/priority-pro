import { Client, Account } from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('66cc6dbd001f6d302e30');


    export const account = new Account(client);
    export { ID } from 'appwrite';