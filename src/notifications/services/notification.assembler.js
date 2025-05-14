import { Notification } from "../model/notification.entity.js"

export class NotificationAssembler {
    static toEntityFromResource(resource) {
        return new Notification(resource.id, resource.date, resource.title, resource.content);
    }

    static toEntitiesFromResponse(response) {
        return response.data.map(this.toEntityFromResource);
    }

    static toResource(notification) {
        return {
            id: notification.id,
            date: notification.date,
            title: notification.title,
            content: notification.content
        };
    }
}
