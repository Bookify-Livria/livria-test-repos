import axios from 'axios';
import { NotificationAssembler } from './notification.assembler.js';

export class NotificationApiService {
    getNotifications() {
        return axios.get('http://localhost:3000/notificaciones')
            .then(res => NotificationAssembler.toEntitiesFromResponse(res))
            .catch(err => { throw err });
    }

    addNotification(notification) {
        return axios.post('http://localhost:3000/notificaciones', NotificationAssembler.toResource(notification))
            .catch(err => { throw err });
    }

    removeFromList(Id) {
        return axios.delete(`http://localhost:3000/notificaciones/${Id}`)
            .then(response => {
                console.log('Notification deleted successfully:', response.data);
            })
            .catch(error => {
                console.error('Error deleting notification:', error);
                throw error;
            });
    }

    clearList() {
        return axios.get('http://localhost:3000/notificaciones')
            .then(response => {
                const items = response.data;
                return Promise.all(items.map(item =>
                    axios.delete(`http://localhost:3000/notificaciones/${item.id}`)
                ));
            })
            .catch(error => {
                console.error('Error clearing list:', error);
                throw error;
            });
    }

}
