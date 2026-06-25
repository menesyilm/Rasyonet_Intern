import * as signalR from '@microsoft/signalr'

export const createDashboardConnection = () => {
    return new signalR.HubConnectionBuilder()
        .withUrl('http://localhost:5010/hubs/dashboard')
        .withAutomaticReconnect()
        .build()
}