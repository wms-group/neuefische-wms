import {OrderItem, OrderStatus} from "@/types";

export const orders: OrderItem[] = [
    {
        product: {
            id: "1",
            name: "Macbook pro 13”",
            category: "Laptop",
            imageUrl: "/images/macbook.png",
            variants: 2,
            price: 2399,
        },
        status: OrderStatus.DELIVERED,
        date: "2025-05-21T10:00:00Z",
    },
    {
        product: {
            id: "2",
            name: "Apple Watch Ultra",
            category: "Watch",
            imageUrl: "/images/watch.png",
            variants: 1,
            price: 879,
        },
        status: OrderStatus.PENDING,
        date: "2025-05-20T09:00:00Z",
    },
    {
        product: {
            id: "3",
            name: "iPhone 15 Pro Max",
            category: "Smartphone",
            imageUrl: "/images/iphone15pro.png",
            variants: 2,
            price: 1869,
        },
        status: OrderStatus.DELIVERED,
        date: "2025-05-19T14:30:00Z",
    },
    {
        product: {
            id: "4",
            name: "iPad Pro 3rd Gen",
            category: "Electronics",
            imageUrl: "/images/ipadpro.png",
            variants: 2,
            price: 1699,
        },
        status: OrderStatus.CANCELED,
        date: "2025-05-18T12:00:00Z",
    },
    {
        product: {
            id: "5",
            name: "AirPods Pro 2nd Gen",
            category: "Accessories",
            imageUrl: "/images/airpods.png",
            variants: 1,
            price: 240,
        },
        status: OrderStatus.DELIVERED,
        date: "2025-05-17T08:45:00Z",
    },
    {
        product: {
            id: "6",
            name: "Samsung Galaxy S24",
            category: "Smartphone",
            imageUrl: "/images/galaxy-s24.png",
            variants: 2,
            price: 1599,
        },
        status: OrderStatus.PENDING,
        date: "2025-05-16T17:20:00Z",
    },
    {
        product: {
            id: "7",
            name: "Sony WH-1000XM5",
            category: "Headphones",
            imageUrl: "/images/sony-headphones.png",
            variants: 1,
            price: 399,
        },
        status: OrderStatus.DELIVERED,
        date: "2025-05-15T11:10:00Z",
    },
    {
        product: {
            id: "8",
            name: "Google Pixel 8",
            category: "Smartphone",
            imageUrl: "/images/pixel8.png",
            variants: 1,
            price: 899,
        },
        status: OrderStatus.DELIVERED,
        date: "2025-05-14T10:00:00Z",
    },
    {
        product: {
            id: "9",
            name: "Dell XPS 15",
            category: "Laptop",
            imageUrl: "/images/dell-xps.png",
            variants: 2,
            price: 2199,
        },
        status: OrderStatus.PENDING,
        date: "2025-05-13T13:30:00Z",
    },
    {
        product: {
            id: "10",
            name: "Logitech MX Master 3",
            category: "Accessories",
            imageUrl: "/images/logitech-mx3.png",
            variants: 1,
            price: 99,
        },
        status: OrderStatus.CANCELED,
        date: "2025-05-12T09:00:00Z",
    },
];
