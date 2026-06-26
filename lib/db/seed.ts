import { connectDB } from "./connection.js";
import { User } from "./models/User.model.js";
import mongoose from "mongoose";

const name = "Nishan Gautam";
const email = "dev.nxhettry@gmail.com";
const password = "Admin@1234";
const role = "superadmin" as const;

const seedData = async () => {
  try {
    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      console.log("Superadmin already exists:", existing.email);
      return;
    }

    const superAdmin = await User.create({ name, email, password, role });
    console.log("Superadmin created:", superAdmin.email);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

seedData();
