// src/controllers/blogController.js

const Blog = require("../models/Blog");
const { processCloudinaryImage, deleteFromCloudinary } = require("../utils/handleCloudinaryHelper");

const DEFAULT_BLOGS = [
  {
    title: "Revolutionizing Dental Care with Advanced Laser Root Canal Treatment",
    slug: "laser-root-canal-treatment",
    category: "Root Canal",
    readTime: "5 min read",
    summary: "Discover how painless laser root canal technology eliminates bacteria rapidly while preserving your natural tooth structure with faster healing.",
    content: "<h2>Revolutionizing Dental Care with Advanced Laser Root Canal Treatment</h2><p>Root canal treatments have undergone a massive technological shift. With advanced dental lasers, root canals are now virtually painless, faster, and highly effective.</p><p>In traditional root canal procedures, mechanical instruments were used to clean infection from tiny root canals. Today, <strong>laser root canal therapy</strong> utilizes concentrated light energy to thoroughly sterilize root canals down to the microscopic level.</p><h3>Key Benefits of Laser Root Canal Therapy:</h3><ul><li>Minimally Invasive & Virtually Painless</li><li>High Sterilization Accuracy</li><li>Rapid Healing & Less Post-Treatment Discomfort</li></ul>",
    image: "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAQAcJaQAA3AA/v7WAAA=",
    blogDate: new Date("2026-08-04"),
    faqs: [
      {
        question: "Is a laser root canal treatment painful?",
        answer: "Modern laser root canal treatment is performed under local anesthesia, making the procedure highly comfortable and virtually painless."
      },
      {
        question: "How long does a laser root canal take?",
        answer: "Most laser root canal treatments can be completed in a single 45-to-60 minute session depending on the tooth."
      }
    ],
    status: "Active",
  },
  {
    title: "The Ultimate Guide to Modern Dental Implants & Permanent Smiles",
    slug: "dental-implants-guide",
    category: "Dental Implants",
    readTime: "6 min read",
    summary: "Everything you need to know about replacing missing teeth with durable, natural-looking titanium dental implants at Kavuturu Dental Clinic.",
    content: "<h2>The Ultimate Guide to Modern Dental Implants</h2><p>Missing teeth can impair eating, speaking, and self-confidence. Modern titanium dental implants offer the most durable, natural, and permanent solution available in dentistry today.</p><p>An implant acts as an artificial tooth root integrated directly into your jawbone, providing solid support for custom porcelain crowns.</p><h3>Advantages of Dental Implants:</h3><ul><li>Natural appearance & full chewing function</li><li>Prevents jawbone loss</li><li>Lifelong longevity with proper oral hygiene</li></ul>",
    image: "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAQAcJaQAA3AA/v7WAAA=",
    blogDate: new Date("2026-08-02"),
    faqs: [
      {
        question: "How long do dental implants last?",
        answer: "With proper oral hygiene and regular dental checkups, titanium dental implants can last a lifetime."
      }
    ],
    status: "Active",
  },
  {
    title: "Gentle Laser Therapy for Healthy Gums & Periodontal Wellness",
    slug: "laser-gum-treatment-wellness",
    category: "Gum Care",
    readTime: "4 min read",
    summary: "Learn how non-surgical laser gum therapy treats gum disease, stops bleeding, and reshapes your gum line for a symmetrical smile.",
    content: "<h2>Gentle Laser Therapy for Healthy Gums</h2><p>Gum health is the foundation of a healthy smile. Periodontal disease can lead to gum recession and tooth loss if left untreated.</p><p>Non-surgical laser gum treatment uses soft-tissue lasers to remove infected pocket tissue without scalpel cuts or sutures.</p><h3>Advantages of Laser Gum Therapy:</h3><ul><li>No scalpels or sutures</li><li>Immediate blood clotting and minimal swelling</li><li>Promotes natural tissue reattachment</li></ul>",
    image: "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAQAcJaQAA3AA/v7WAAA=",
    blogDate: new Date("2026-07-28"),
    faqs: [
      {
        question: "Does laser gum therapy require sutures?",
        answer: "No, laser gum therapy does not require scalpels or sutures, resulting in faster healing and minimal discomfort."
      }
    ],
    status: "Active",
  },
];

/**
 * Generate unique slug from title helper
 */
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

/**
 * Validate WEBP image format helper
 */
const isWebpImage = (str) => {
  if (!str || typeof str !== "string") return false;
  const lower = str.toLowerCase();
  if (lower.startsWith("data:image/webp")) return true;
  if (lower.includes(".webp")) return true;
  return false;
};

/**
 * @desc    Get Blogs (Homepage max 3, default max 15, sorted newest first by blogDate)
 * @route   GET /api/website/blogs
 * @access  Public
 */
const getBlogs = async (req, res, next) => {
    try {
        const { homepage } = req.query;
        let query = { status: "Active" };
        let limit = homepage === "true" ? 3 : 15;

        let blogs = await Blog.find(query)
            .sort({ blogDate: -1, createdAt: -1 })
            .limit(limit);

        if (blogs.length === 0 && !homepage) {
            await Blog.insertMany(DEFAULT_BLOGS);
            blogs = await Blog.find(query)
                .sort({ blogDate: -1, createdAt: -1 })
                .limit(limit);
        }

        return res.status(200).json({
            success: true,
            count: blogs.length,
            data: blogs,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get Single Blog By Slug or ID
 * @route   GET /api/website/blogs/:slugOrId
 * @access  Public
 */
const getBlogBySlugOrId = async (req, res, next) => {
    try {
        const { slugOrId } = req.params;
        let blog = await Blog.findOne({ slug: slugOrId });

        if (!blog && slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
            blog = await Blog.findById(slugOrId);
        }

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog article not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: blog,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create New Blog Article (Max 15 limit check)
 * @route   POST /api/website/blogs
 * @access  Private (Doctor Only)
 */
const createBlog = async (req, res, next) => {
    try {
        // Enforce 15 blog maximum capacity limit
        const totalCount = await Blog.countDocuments();
        if (totalCount >= 15) {
            return res.status(400).json({
                success: false,
                code: "LIMIT_REACHED",
                message: "You have reached the maximum limit of 15 blogs. Please edit or delete an existing blog before adding a new one.",
            });
        }

        const {
            title,
            category,
            readTime,
            summary,
            content,
            image,
            blogDate,
            faqs,
            status,
        } = req.body;

        if (!title || !summary || !content || (!image && !req.file)) {
            return res.status(400).json({
                success: false,
                message: "Blog Title, Summary, Content, and Featured Image are required.",
            });
        }

        if (title.trim().length > 100) {
            return res.status(400).json({
                success: false,
                message: "Blog Title cannot exceed 100 characters.",
            });
        }

        let cloudImage = { secure_url: image || "", public_id: "" };
        if (image || req.file) {
            try {
                cloudImage = await processCloudinaryImage(image, req.file, "", "kavuturu-dental/blogs");
            } catch (err) {
                return res.status(500).json({
                    success: false,
                    message: `Blog featured image upload failed: ${err.message}`,
                });
            }
        }

        // Generate unique slug
        let baseSlug = slugify(title);
        let slug = baseSlug;
        let counter = 1;
        while (await Blog.findOne({ slug })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        const blog = await Blog.create({
            title: title.trim(),
            slug,
            category: category || "Dental Care",
            readTime: readTime || "5 min read",
            summary: summary.trim(),
            content: content.trim(),
            image: cloudImage.secure_url,
            public_id: cloudImage.public_id,
            blogDate: blogDate ? new Date(blogDate) : new Date(),
            faqs: Array.isArray(faqs) ? faqs : [],
            status: status || "Active",
        });

        return res.status(201).json({
            success: true,
            message: "Blog article created successfully.",
            data: blog,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update Blog Article
 * @route   PUT /api/website/blogs/:id
 * @access  Private (Doctor Only)
 */
const updateBlog = async (req, res, next) => {
    try {
        const {
            title,
            category,
            readTime,
            summary,
            content,
            image,
            blogDate,
            faqs,
            status,
        } = req.body;

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog article not found.",
            });
        }

        if (title && title.trim().length > 100) {
            return res.status(400).json({
                success: false,
                message: "Blog Title cannot exceed 100 characters.",
            });
        }

        if (image !== undefined || req.file) {
            try {
                const cloudImage = await processCloudinaryImage(image, req.file, blog.public_id, "kavuturu-dental/blogs");
                blog.image = cloudImage.secure_url;
                blog.public_id = cloudImage.public_id;
            } catch (err) {
                return res.status(500).json({
                    success: false,
                    message: `Blog featured image replacement failed: ${err.message}`,
                });
            }
        }

        if (title && title.trim() !== blog.title) {
            blog.title = title.trim();
            let baseSlug = slugify(title);
            let slug = baseSlug;
            let counter = 1;
            while (await Blog.findOne({ slug, _id: { $ne: blog._id } })) {
                slug = `${baseSlug}-${counter}`;
                counter++;
            }
            blog.slug = slug;
        }

        if (category) blog.category = category;
        if (readTime) blog.readTime = readTime;
        if (summary) blog.summary = summary.trim();
        if (content) blog.content = content.trim();
        if (blogDate) blog.blogDate = new Date(blogDate);
        if (Array.isArray(faqs)) blog.faqs = faqs;
        if (status) blog.status = status;

        await blog.save();

        return res.status(200).json({
            success: true,
            message: "Blog article updated successfully.",
            data: blog,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete Blog Article (Permanent deletion)
 * @route   DELETE /api/website/blogs/:id
 * @access  Private (Doctor Only)
 */
const deleteBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog article not found.",
            });
        }

        if (blog.public_id) {
            await deleteFromCloudinary(blog.public_id);
        }

        await blog.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Blog article deleted successfully.",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getBlogs,
    getBlogBySlugOrId,
    createBlog,
    updateBlog,
    deleteBlog,
};
