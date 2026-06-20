import { connectToDatabase } from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";
import Video from "@/models/Video";

export interface DBTestimonial {
  _id: string;
  name: string;
  designation: string;
  company: string;
  review: string;
  image?: string | null;
  rating: number;
}

export interface DBVideo {
  _id: string;
  title: string;
  youtubeUrl: string;
  thumbnail?: string | null;
  featured: boolean;
  visible: boolean;
}

export async function getTestimonials(): Promise<DBTestimonial[]> {
  try {
    await connectToDatabase();
    const testimonialsRaw = await Testimonial.find({ visible: true })
      .sort({ featured: -1, createdAt: -1 })
      .limit(6)
      .lean();

    return testimonialsRaw.map((t) => ({
      _id: String(t._id),
      name: t.name,
      designation: t.designation,
      company: t.company,
      review: t.review,
      image: t.image ?? null,
      rating: t.rating ?? 5,
    }));
  } catch (error) {
    console.error("getTestimonials Server-Side Fetch Error:", error);
    return [];
  }
}

export async function getFeaturedVideos(): Promise<DBVideo[]> {
  try {
    await connectToDatabase();
    const videosRaw = await Video.find({ visible: true, featured: true })
      .sort({ featured: -1, createdAt: -1 })
      .limit(4)
      .lean();

    return videosRaw.map((v) => ({
      _id: String(v._id),
      title: v.title,
      youtubeUrl: v.youtubeUrl,
      thumbnail: v.thumbnail ?? null,
      featured: v.featured,
      visible: v.visible,
    }));
  } catch (error) {
    console.error("getFeaturedVideos Server-Side Fetch Error:", error);
    return [];
  }
}
