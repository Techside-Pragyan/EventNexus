const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('../models/Event');
const User = require('../models/User');

dotenv.config();

const events = [
    {
        title: "Global Tech Summit 2026",
        description: "Join the world's leading innovators and tech enthusiasts for a three-day summit covering AI, Blockchain, and the future of Computing. Network with industry leaders and discover the next big thing in technology.",
        date: "2026-06-15",
        time: "10:00 AM",
        location: "Convention Center, San Francisco",
        category: "Tech",
        ticketType: "Paid",
        price: 299,
        maxAttendees: 500,
        image: { secure_url: "https://images.unsplash.com/photo-1540575861501-7ad0582371f3?auto=format&fit=crop&w=800&q=80" }
    },
    {
        title: "Acoustic Night: Summer Vibes",
        description: "An intimate evening with local acoustic artists. Enjoy great music, food, and drinks in a cozy outdoor setting. Perfect for music lovers and those looking to relax.",
        date: "2026-07-20",
        time: "07:00 PM",
        location: "Greenwood Park, Austin",
        category: "Music",
        ticketType: "Free",
        price: 0,
        maxAttendees: 200,
        image: { secure_url: "https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=800&q=80" }
    },
    {
        title: "Marathon for Hope 2026",
        description: "Run for a cause! Participate in our annual marathon to raise funds for local charities. All fitness levels welcome. Registration includes a participant t-shirt and medal.",
        date: "2026-05-10",
        time: "06:00 AM",
        location: "Central Park, New York",
        category: "Sports",
        ticketType: "Paid",
        price: 45,
        maxAttendees: 1000,
        image: { secure_url: "https://images.unsplash.com/photo-1533359448864-219973fc7443?auto=format&fit=crop&w=800&q=80" }
    },
    {
        title: "The Royal Wedding: Sarah & James",
        description: "Witness the beautiful union of Sarah and James in a grand garden setting. A day of love, laughter, and high-end ceremony celebrating their journey together.",
        date: "2026-08-12",
        time: "04:30 PM",
        location: "Grand Heritage Palace, London",
        category: "Marriage",
        ticketType: "Free",
        price: 0,
        maxAttendees: 300,
        image: { secure_url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80" }
    },
    {
        title: "Leo's 1st Birthday Adventure",
        description: "Celebrate Leo's first big milestone with a jungle-themed birthday party! Games, cakes, and fun activities for kids and adults alike.",
        date: "2026-06-25",
        time: "11:00 AM",
        location: "SkyHigh Soft Play, Chicago",
        category: "Birthday",
        ticketType: "Free",
        price: 0,
        maxAttendees: 50,
        image: { secure_url: "https://images.unsplash.com/photo-1530103043960-ef38714abb15?auto=format&fit=crop&w=800&q=80" }
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB for seeding...");

        // Find an admin user to assign events to
        let admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.log("No admin found. Creating a default admin: admin@nexus.com / password123");
            admin = await User.create({
                name: "System Admin",
                email: "admin@nexus.com",
                password: "password123",
                role: "admin"
            });
        }

        await Event.deleteMany({});
        console.log("Deleted existing events.");

        const eventsWithAdmin = events.map(event => ({ ...event, createdBy: admin._id }));
        await Event.insertMany(eventsWithAdmin);
        console.log("Sample events seeded successfully!");

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

seedDB();
