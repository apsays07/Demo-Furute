import mongoose from "mongoose";
import Video from "@/models/Video";

// Retrieve the MongoDB connection string from the environment variables.
// In Next.js, process.env holds variables defined in .env.local.
const MONGODB_URI = process.env.MONGODB_URI;

// Verify that the connection string is defined
if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 * Interface to define the cached connection structure in the global namespace.
 * Caching prevents multiple connection pools from being created on hot reloads
 * during development or individual serverless invocation runs.
 */
interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the global type definition in TypeScript so it does not flag mongooseCache
declare global {
  var mongooseCache: GlobalMongoose | undefined;
}

// Retrieve the cached connection from the Node.js global object if it exists.
// In Next.js dev server, global variables are preserved across hot reloads.
const cached: GlobalMongoose = globalThis.mongooseCache || { conn: null, promise: null };

if (!globalThis.mongooseCache) {
  globalThis.mongooseCache = cached;
}

/**
 * Connects to MongoDB Atlas using Mongoose and caches the connection instance.
 * Reuses the cached connection on subsequent calls for faster response times.
 */
export async function connectToDatabase() {
  // If a connection is already established, return it immediately
  if (cached.conn) {
    return cached.conn;
  }

  // If there is no active connection promise, create a new one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Turn off command buffering for predictable production behavior
    };

    // Initialize the mongoose connection promise
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then(async (mongooseInstance) => {
      console.log("Successfully connected to MongoDB via Mongoose.");
      
      // Auto-seed the 3 default homepage videos if collection is empty
      try {
        const count = await Video.countDocuments();
        if (count === 0) {
          console.log("Seeding default videos...");
          const defaultVideos = [
            {
              title: "Featured Talk",
              description: "Watch the featured talk and key highlights.",
              youtubeUrl: "https://www.youtube.com/watch?v=i-Qe4F17hKc",
              thumbnail: "https://img.youtube.com/vi/i-Qe4F17hKc/mqdefault.jpg",
              category: "General",
              featured: true,
              visible: true,
            },
            {
              title: "Business Learning Session",
              description: "Key business learning sessions and insights.",
              youtubeUrl: "https://www.youtube.com/watch?v=Dp65MGhze3I",
              thumbnail: "https://img.youtube.com/vi/Dp65MGhze3I/mqdefault.jpg",
              category: "General",
              featured: true,
              visible: true,
            },
            {
              title: "Growth Insight",
              description: "Growth insights and strategic directions.",
              youtubeUrl: "https://www.youtube.com/watch?v=2ofM34EwKJo",
              thumbnail: "https://img.youtube.com/vi/2ofM34EwKJo/mqdefault.jpg",
              category: "General",
              featured: true,
              visible: true,
            },
            {
              title: "Mentoring Moment",
              description: "Mentoring moments and valuable life lessons.",
              youtubeUrl: "https://www.youtube.com/watch?v=S9fjt9HVf6Q",
              thumbnail: "https://img.youtube.com/vi/S9fjt9HVf6Q/mqdefault.jpg",
              category: "Mentoring",
              featured: true,
              visible: true,
            },
          ];
          await Video.insertMany(defaultVideos);
          console.log("Successfully seeded 4 default videos.");
        }
      } catch (err) {
        console.error("Failed to seed default videos:", err);
      }

      return mongooseInstance;
    });
  }

  try {
    // Await the connection promise and save the resulting connection to the cache
    cached.conn = await cached.promise;
  } catch (e) {
    // If connection fails, clear the cached promise so we can attempt to reconnect on next call
    cached.promise = null;
    console.error("Failed to connect to MongoDB:", e);
    throw e;
  }

  return cached.conn;
}