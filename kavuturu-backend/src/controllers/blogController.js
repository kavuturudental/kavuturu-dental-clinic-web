// src/controllers/blogController.js

const Blog = require("../models/Blog");
const { processCloudinaryImage, deleteFromCloudinary } = require("../utils/handleCloudinaryHelper");

const DEFAULT_BLOGS = [
  {
    title: "Laser Root Canal Treatment: A Faster, Safer & More Comfortable Way to Save Your Tooth",
    slug: "laser-root-canal-treatment",
    category: "Root Canal Treatment",
    readTime: "5 min read",
    summary: "Discover how laser-assisted root canal treatment offers greater precision, minimal discomfort, faster healing, and improved long-term results.",
    content: "<h2>Laser Root Canal Treatment: A Faster, Safer & More Comfortable Way to Save Your Tooth</h2><p>Root canal treatments have historically carried a reputation for being uncomfortable and time-consuming. However, with modern technological advancements, root canal therapy has been revolutionized. Laser-assisted root canal treatment is at the forefront of this evolution, offering patients a faster, safer, and significantly more comfortable alternative to traditional methods.</p><h3>How Laser-Assisted Root Canal Treatment Works</h3><p>In traditional root canal therapy, a dentist uses manual files and chemical rinses to clean out infected pulp tissue from inside the tooth's canal. Laser-assisted root canals use a highly focused light beam (laser) along with specialized dental instruments. The laser energy enters the root canal space, producing shockwaves that thoroughly clean and sterilize the canals, reaching microscopic gaps that traditional files might miss.</p><h3>Key Benefits of Laser Root Canal Therapy</h3><ul><li>Microscopic Precision: Targets only infected tissue</li><li>Enhanced Sterilization: Destroys 99% of bacteria</li><li>Reduced Pain & Discomfort</li><li>Faster Recovery</li></ul>",
    image: "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAQAcJaQAA3AA/v7WAAA=",
    blogDate: new Date("2026-08-04"),
    faqs: [
      {
        question: "Is laser root canal treatment painful?",
        answer: "No, laser root canal treatment is generally much less painful than traditional root canals. The laser operates without direct friction or vibration, making it a very comfortable experience."
      },
      {
        question: "How long does the procedure take?",
        answer: "Thanks to the efficiency of the laser sterilization process, many treatments can be completed in a single visit, typically lasting between 45 to 60 minutes."
      }
    ],
    status: "Active",
  },
  {
    title: "Dental Implants: The Permanent Solution for Missing Teeth",
    slug: "dental-implants-guide",
    category: "Dental Implants",
    readTime: "6 min read",
    summary: "Replace missing teeth with advanced dental implants that look, feel, and function like natural teeth for years to come.",
    content: "<h2>Dental Implants: The Permanent Solution for Missing Teeth</h2><p>Missing teeth can impact more than just your self-esteem; they can also affect your speech, dietary options, and long-term oral health. Fortunately, dental implants provide a permanent, natural-looking solution that replicates both the root and crown of your missing tooth.</p><h3>What Exactly is a Dental Implant?</h3><p>A dental implant consists of three main components: a titanium post that is surgically placed into the jawbone (acting as a root), an abutment that fits over the post, and a custom-made crown that matches the color and shape of your surrounding teeth.</p><h3>Advantages of Choosing Dental Implants</h3><ul><li>Natural Look & Feel</li><li>Durability & Longevity</li><li>Preserves Jawbone Integrity</li><li>No Damage to Adjacent Teeth</li></ul>",
    image: "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAQAcJaQAA3AA/v7WAAA=",
    blogDate: new Date("2026-08-02"),
    faqs: [
      {
        question: "How long does a dental implant last?",
        answer: "With good oral hygiene, regular flossing, and dental checkups, the titanium implant post can last a lifetime."
      }
    ],
    status: "Active",
  },
  {
    title: "Laser Gum Treatment: The Advanced Solution for Gum Disease & Aesthetics",
    slug: "laser-gum-treatment",
    category: "Laser Dentistry",
    readTime: "4 min read",
    summary: "Learn how laser gum therapy offers a gentle, precise, and highly effective way to treat periodontal issues and contour your gums.",
    content: "<h2>Laser Gum Treatment: The Advanced Solution for Gum Disease & Aesthetics</h2><p>Healthy gums are the foundation of a healthy smile. Periodontal (gum) disease is one of the most common dental problems worldwide. Laser gum treatment provides a gentle, minimally invasive solution that heals tissues without blades or bleeding.</p><h3>Top Reasons to Opt for Laser Gum Treatment</h3><ul><li>No Scalpels or Sutures</li><li>Minimal Bleeding & Swelling</li><li>Gum Reshaping & Contouring</li><li>Faster Recovery Time</li></ul>",
    image: "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAQAcJaQAA3AA/v7WAAA=",
    blogDate: new Date("2026-07-28"),
    faqs: [
      {
        question: "Will my gums bleed after laser treatment?",
        answer: "Bleeding is extremely minimal compared to traditional surgery because the laser automatically cauterizes blood vessels during the cleaning process."
      }
    ],
    status: "Active",
  },
];

/**
 * Generate unique slug from title helper
 */
const slugify = (text) => {
  if (!text) return "";
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
    console.error("Error in getBlogs:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * @desc    Get Single Blog By Slug or ID
 * @route   GET /api/website/blogs/:slug
 * @access  Public
 */
const getBlogBySlugOrId = async (req, res, next) => {
  try {
    const rawSlug = req.params.slug || req.params.identifier || req.params.slugOrId;

    if (!rawSlug || typeof rawSlug !== "string" || !rawSlug.trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog slug",
      });
    }

    const slugParam = decodeURIComponent(rawSlug).trim();

    // 1. Direct MongoDB Query by exact slug
    let blog = await Blog.findOne({ slug: slugParam });

    // 2. Case-insensitive slug query
    if (!blog) {
      const safeRegex = slugParam.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      blog = await Blog.findOne({
        slug: { $regex: new RegExp(`^${safeRegex}$`, "i") },
      });
    }

    // 3. Match by slugified version of title or search by generated slug
    if (!blog) {
      const generatedSlug = slugify(slugParam);
      if (generatedSlug) {
        blog = await Blog.findOne({ slug: generatedSlug });
      }
    }

    // 4. Prefix/Substring match between full title slug and stored short slug
    if (!blog) {
      const allActiveBlogs = await Blog.find({ status: "Active" });
      blog = allActiveBlogs.find((b) => {
        const fullTitleSlug = slugify(b.title);
        return (
          b.slug === slugParam ||
          fullTitleSlug === slugParam ||
          slugParam.startsWith(b.slug) ||
          b.slug.startsWith(slugParam)
        );
      });
    }

    // 5. MongoDB ObjectId match
    if (!blog && slugParam.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(slugParam);
    }

    // 6. If database is empty, seed default blogs and query again
    if (!blog) {
      const count = await Blog.countDocuments();
      if (count === 0) {
        await Blog.insertMany(DEFAULT_BLOGS);
        blog = await Blog.findOne({ slug: slugParam }) ||
               await Blog.findOne({ slug: slugify(slugParam) });
      }
    }

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Internal server error in getBlogBySlugOrId:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * @desc    Create New Blog Article (Max 15 limit check)
 * @route   POST /api/website/blogs
 * @access  Private (Doctor Only)
 */
const createBlog = async (req, res, next) => {
  try {
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
    console.error("Error in createBlog:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
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
        message: "Blog not found",
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
    console.error("Error in updateBlog:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete Blog Article
 * @route   DELETE /api/website/blogs/:id
 * @access  Private (Doctor Only)
 */
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
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
    console.error("Error in deleteBlog:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getBlogs,
  getBlogBySlugOrId,
  createBlog,
  updateBlog,
  deleteBlog,
};
