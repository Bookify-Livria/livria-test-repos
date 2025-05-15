import { NotificationApiService } from "../../notifications/services/notification-api.service.js";
import { Notification } from "../../notifications/model/notification.entity.js";

let counter = 0;

export async function notifyEvent(type) {
    const service = new NotificationApiService();
    const now = new Date().toISOString();

    let title = "";
    let content = "";

    switch (type) {
        case "welcome":
            title = "Welcome to Livria!";
            content = "We're thrilled to have you here.";
            break;
        case "login":
            title = "Welcome back!";
            content = "Nice to see you again. Let’s continue exploring.";
            break;
        case "order":
            title = "Order Received";
            content = "Thanks for your order! It's being processed.";
            break;
        case "plan":
            title = "Plan Activated";
            content = "You just subscribed to a community plan. Enjoy the perks!";
            break;
        case "like":
            title = "Recent Likes";
            content = "Wow! Your recent post got a lot of likes! Wanna see?";
        default:
            title = "Notification";
            content = "An event just occurred.";
    }

    const newNotification = new Notification(
        String(1 + counter),
        now,
        title,
        content
    );

    await service.addNotification(newNotification);
    counter = counter + 1;
}
