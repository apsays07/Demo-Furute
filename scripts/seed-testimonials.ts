/**
 * Seed script: Inserts all static testimonials from lib/testimonials.ts into MongoDB.
 * Run with: npx ts-node --project tsconfig.json -e "require('./scripts/seed-testimonials.ts')"
 * Or run via: npx tsx scripts/seed-testimonials.ts
 */

import mongoose from "mongoose";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// Load .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌  MONGODB_URI not found in .env.local");
  process.exit(1);
}

// Static testimonials data
const staticTestimonials = [
  {
    name: "Lucky Surana",
    designation: "Industrialist & Educationist",
    company: "Insights Program",
    review:
      "After joining Insights I personally realize four things that really changed my life: emotional maturity, knowing every problem has a solution, consistency for set goals, and that failure is the key to success.",
    rating: 5,
    featured: true,
    visible: true,
  },
  {
    name: "Avant Parmar",
    designation: "Mobile Shop Owner",
    company: "Self Employed",
    review:
      "After doing Business Insights I started with a small mobile repairing shop. I implemented the formula by Ashay Sir and my turnover increased 25% within a year. My new 400 sq ft office is a reflection of my success.",
    rating: 5,
    featured: true,
    visible: true,
  },
  {
    name: "Manish Kalantri",
    designation: "Corporate Vendor & Supplier",
    company: "Self Employed",
    review:
      "Insights taught me how to handle adverse situations and turn them in my favour. Working on goal setting and Ashay Sir's time management theory made my personal life more balanced.",
    rating: 5,
    featured: false,
    visible: true,
  },
  {
    name: "Ankit Sakhariya",
    designation: "Owner",
    company: "Sakhariya Gold Jewelers",
    review:
      "I achieved success in my business by applying what I learned from Ashay Sir — how to relate with clients and workers to build communication. My business has developed more as a result.",
    rating: 5,
    featured: false,
    visible: true,
  },
  {
    name: "Viraj Parmar",
    designation: "Entrepreneur",
    company: "Construction Services & Software",
    review:
      "Before Insights I had only one business. Ashay Sir showed me the direction regarding my strengths. Using the lessons of 'caps' and 'circle of circumference' I was able to start three other businesses.",
    rating: 5,
    featured: true,
    visible: true,
  },
  {
    name: "Vikram Jain",
    designation: "Director",
    company: "Konifer",
    review:
      "Ashay Sir changed my perspective of life, both professional and personal. I have become more optimistic about the future and with self-confidence and a positive attitude, I keep boosting my business.",
    rating: 5,
    featured: false,
    visible: true,
  },
  {
    name: "Anand Buchade",
    designation: "Director",
    company: "AB Landmarks",
    review:
      "Ashay Sir is always inspiring and giving me confidence to do business in better ways. I have learned a lot about how to boost my business and I keep implementing it all.",
    rating: 5,
    featured: false,
    visible: true,
  },
  {
    name: "Khushboo Salunke",
    designation: "Director",
    company: "Unique Interior",
    review:
      "Coming in contact with Ashay Sir, my way of thinking changed completely. I have become more positive and peaceful. Most importantly, I started my own firm of Interior Designing — Unique Interiors.",
    rating: 5,
    featured: false,
    visible: true,
  },
  {
    name: "Akshat Oswal",
    designation: "Co-Founder",
    company: "Tech Innovance",
    review:
      "I gained knowledge of team building and right investment from Ashay Sir. I implemented it in my business and it has grown immensely, resulting in good profits and becoming a brand.",
    rating: 5,
    featured: false,
    visible: true,
  },
  {
    name: "Rahul Ramsina",
    designation: "Owner",
    company: "Rajsi Technologies",
    review:
      "After doing the Insights course I was able to start a new business successfully. Ashay Sir's lesson on Decision Making Strength helped me undoubtedly in managing difficult situations.",
    rating: 5,
    featured: false,
    visible: true,
  },
  {
    name: "Kirtikumar Shah",
    designation: "Founder",
    company: "Get Set Go Cab",
    review:
      "I see myself more confident after attending Insights sessions. As a proprietor I worked a lot on customer satisfaction. Now my clients are more satisfied and happy with my service.",
    rating: 5,
    featured: false,
    visible: true,
  },
  {
    name: "Anjali Parmar",
    designation: "German Professor",
    company: "Education",
    review:
      "After Insights, balance has come into my life. Earlier it was difficult to know what my priority is at what time, but now things have changed. 'I, Here, Right Now in Present Continuous' has helped a lot in both personal and professional life.",
    rating: 5,
    featured: false,
    visible: true,
  },
  {
    name: "Surabhi Mehta",
    designation: "Consultant",
    company: "Self Employed",
    review:
      "I understood 'Attachment and Detachment' very carefully and implemented it in my life. I completed my C.S. and LLB and started my own proprietorship as a consultant. Thanks to Ashay Sir and Insights.",
    rating: 5,
    featured: false,
    visible: true,
  },
  {
    name: "Rohit Pasalkar",
    designation: "Owner",
    company: "Shree Designs",
    review:
      "After doing the Insights batch I started understanding myself better and modified the way of doing business and living life. Now I always act with a ready plan and my business has grown to double turnover.",
    rating: 5,
    featured: false,
    visible: true,
  },
  {
    name: "Darpan Parmar",
    designation: "Business Owner",
    company: "Construction Business",
    review:
      "I achieved stability before the expected time in business through good communication and hard work. Insights and Ashay Sir helped me overcome all personal and professional obstacles on my path to success.",
    rating: 5,
    featured: false,
    visible: true,
  },
  {
    name: "Jeetendra Bamboli",
    designation: "Proprietor",
    company: "The Comfort Zone",
    review:
      "The idea of playing with my core strength — manufacturing high-quality furniture — clicked through the Insights Program. Now production and profit have increased 10 times compared to the last 3 years.",
    rating: 5,
    featured: false,
    visible: true,
  },
  {
    name: "Maithili Jadhav",
    designation: "Business Owner",
    company: "Self Employed",
    review:
      "To grow my business I needed to socialise with like-minded people to discuss business strategies — I learned that from Ashay Sir and Insights. I worked on it and achieved about 30% growth in one year.",
    rating: 5,
    featured: false,
    visible: true,
  },
  {
    name: "Mehul Ramsina",
    designation: "Interior Designer",
    company: "Self Employed",
    review:
      "Ashay Sir's teachings helped me adopt the 'Attach-Detach' process. Now I focus only on things relevant to my work. As a result, my business has uplifted compared to before.",
    rating: 5,
    featured: false,
    visible: true,
  },
  {
    name: "Mansukh Sonigara",
    designation: "Distributor",
    company: "Home & Kitchen Appliances",
    review:
      "After the Insights class I learned how to succeed through a proper plan. I improved my life alongside my business. The best part — I built my own house and grew my business more than ever before.",
    rating: 5,
    featured: false,
    visible: true,
  },
  {
    name: "Rakesh Jain",
    designation: "Structural Consultant",
    company: "Self Employed",
    review:
      "Following Ashay Sir's guidance I shifted my position in business and now work as a Structural Consultant. Through supervision, team building and management I have uplifted my business growth by almost 80% every year.",
    rating: 5,
    featured: false,
    visible: true,
  },
  {
    name: "Dilip Raka",
    designation: "Business Owner",
    company: "Industrial RO Components",
    review:
      "Before Insights I handled all business responsibilities alone. After learning work management I distributed tasks by appointing employees. Their teamwork increased my efficiency and business growth remarkably.",
    rating: 5,
    featured: false,
    visible: true,
  },
  {
    name: "Chirag Sheth",
    designation: "Entrepreneur",
    company: "Self Employed",
    review:
      "I was completely negative and had gone into depression. After attending Insights I bounced back from my negativity. Now I have started my business with a clear agenda of achieving my goals.",
    rating: 5,
    featured: false,
    visible: true,
  },
  {
    name: "Sumeet Desarda",
    designation: "Proprietor",
    company: "Aasra Enterprises",
    review:
      "After the Insights program my mindset totally changed. Emotional maturity improved greatly and had a good impact on my professional life. This course helped me bounce back to success from failure.",
    rating: 5,
    featured: false,
    visible: true,
  },
  {
    name: "Sujay Shah",
    designation: "Founder",
    company: "Jay Excavators Pvt Ltd",
    review:
      "Before joining Insights I was very inconsistent in nature. But now I have stability in performing my duties and have also become more social than before.",
    rating: 5,
    featured: false,
    visible: true,
  },
  {
    name: "Kamlesh Parmar",
    designation: "Business Owner",
    company: "Construction, Retail & Hotel Business",
    review:
      "Before Insights my life was disordered. After gaining knowledge of a peaceful, happy life I modified my lifestyle from top to bottom. Now I am very satisfied in all aspects of life, professionally and personally.",
    rating: 5,
    featured: false,
    visible: true,
  },
];

// Minimal Testimonial schema for seeding
const TestimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    review: { type: String, required: true, trim: true },
    image: { type: String, trim: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    featured: { type: Boolean, default: false },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

async function seed() {
  console.log("🌱  Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI!);
  console.log("✅  Connected.");

  const TestimonialModel =
    mongoose.models.Testimonial ||
    mongoose.model("Testimonial", TestimonialSchema);

  // Check existing count
  const existing = await TestimonialModel.countDocuments();
  if (existing > 0) {
    console.log(
      `ℹ️   Database already has ${existing} testimonials. Skipping seed to avoid duplicates.`
    );
    console.log(
      "    Delete all testimonials first if you want to re-seed."
    );
    await mongoose.disconnect();
    return;
  }

  console.log(`📝  Inserting ${staticTestimonials.length} testimonials...`);
  await TestimonialModel.insertMany(staticTestimonials);
  console.log(`✅  Successfully seeded ${staticTestimonials.length} testimonials!`);

  await mongoose.disconnect();
  console.log("🔌  Disconnected.");
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
