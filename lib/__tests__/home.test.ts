import { getTestimonials, getFeaturedVideos } from "../home";
import Testimonial from "@/models/Testimonial";
import Video from "@/models/Video";

// Mock database connection
jest.mock("@/lib/mongodb", () => ({
  connectToDatabase: jest.fn().mockResolvedValue(true),
}));

// Mock Mongoose models
jest.mock("@/models/Testimonial", () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
  },
}));

jest.mock("@/models/Video", () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
  },
}));

describe("home lib", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getTestimonials", () => {
    it("returns testimonials correctly on success", async () => {
      const mockLean = jest.fn().mockResolvedValue([
        {
          _id: "test-id",
          name: "John Doe",
          designation: "Manager",
          company: "ABC Corp",
          review: "Great service",
          image: "john.jpg",
          rating: 5,
        },
      ]);
      const mockLimit = jest.fn().mockReturnValue({ lean: mockLean });
      const mockSort = jest.fn().mockReturnValue({ limit: mockLimit });
      (Testimonial.find as jest.Mock).mockReturnValue({ sort: mockSort });

      const result = await getTestimonials();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        _id: "test-id",
        name: "John Doe",
        designation: "Manager",
        company: "ABC Corp",
        review: "Great service",
        image: "john.jpg",
        rating: 5,
      });
    });

    it("handles testimonials with nullish/missing rating and image", async () => {
      const mockLean = jest.fn().mockResolvedValue([
        {
          _id: "test-id",
          name: "John Doe",
          designation: "Manager",
          company: "ABC Corp",
          review: "Great service",
          image: undefined,
          rating: undefined,
        },
      ]);
      const mockLimit = jest.fn().mockReturnValue({ lean: mockLean });
      const mockSort = jest.fn().mockReturnValue({ limit: mockLimit });
      (Testimonial.find as jest.Mock).mockReturnValue({ sort: mockSort });

      const result = await getTestimonials();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        _id: "test-id",
        name: "John Doe",
        designation: "Manager",
        company: "ABC Corp",
        review: "Great service",
        image: null,
        rating: 5,
      });
    });

    it("returns empty array and logs error on failure", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      (Testimonial.find as jest.Mock).mockImplementation(() => {
        throw new Error("DB Error");
      });

      const result = await getTestimonials();
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("getFeaturedVideos", () => {
    it("returns featured videos correctly on success", async () => {
      const mockLean = jest.fn().mockResolvedValue([
        {
          _id: "video-id",
          title: "Intro Video",
          youtubeUrl: "https://youtube.com/watch?v=123",
          thumbnail: "thumb.jpg",
          featured: true,
          visible: true,
        },
      ]);
      const mockLimit = jest.fn().mockReturnValue({ lean: mockLean });
      const mockSort = jest.fn().mockReturnValue({ limit: mockLimit });
      (Video.find as jest.Mock).mockReturnValue({ sort: mockSort });

      const result = await getFeaturedVideos();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        _id: "video-id",
        title: "Intro Video",
        youtubeUrl: "https://youtube.com/watch?v=123",
        thumbnail: "thumb.jpg",
        featured: true,
        visible: true,
      });
    });

    it("handles videos with nullish/missing thumbnail", async () => {
      const mockLean = jest.fn().mockResolvedValue([
        {
          _id: "video-id",
          title: "Intro Video",
          youtubeUrl: "https://youtube.com/watch?v=123",
          thumbnail: undefined,
          featured: true,
          visible: true,
        },
      ]);
      const mockLimit = jest.fn().mockReturnValue({ lean: mockLean });
      const mockSort = jest.fn().mockReturnValue({ limit: mockLimit });
      (Video.find as jest.Mock).mockReturnValue({ sort: mockSort });

      const result = await getFeaturedVideos();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        _id: "video-id",
        title: "Intro Video",
        youtubeUrl: "https://youtube.com/watch?v=123",
        thumbnail: null,
        featured: true,
        visible: true,
      });
    });

    it("returns empty array and logs error on failure", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      (Video.find as jest.Mock).mockImplementation(() => {
        throw new Error("DB Error");
      });

      const result = await getFeaturedVideos();
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
