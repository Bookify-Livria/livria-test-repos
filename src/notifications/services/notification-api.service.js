import axios from 'axios';
import { NotificationAssembler } from './notification.assembler.js';

export class NotificationApiService {
    getNotifications() {
        return axios.get('https://livria.onrender.com/notificaciones')
            .then(res => NotificationAssembler.toEntitiesFromResponse(res))
            .catch(err => { throw err });
    }

    addNotification(notification) {
        return axios.post('https://livria.onrender.com/notificaciones', NotificationAssembler.toResource(notification))
            .catch(err => { throw err });
    }

    removeFromList(Id) {
        return axios.delete(`https://livria.onrender.com/notificaciones/${Id}`)
            .then(response => {
                console.log('Notification deleted successfully:', response.data);
            })
            .catch(error => {
                console.error('Error deleting notification:', error);
                throw error;
            });
    }

    clearList() {
        return axios.get('https://livria.onrender.com/notificaciones')
            .then(response => {
                const items = response.data;
                return Promise.all(items.map(item =>
                    axios.delete(`https://livria.onrender.com/notificaciones/${item.id}`)
                ));
            })
            .catch(error => {
                console.error('Error clearing list:', error);
                throw error;
            });
    }

}
