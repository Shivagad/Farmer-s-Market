import dealerProduct from '../Models/dealerProducts.js';
import { User } from '../Models/User.js';
import Seller from '../Models/Seller.js';
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';
import { upload, uploadToCloudinary } from '../Database/Cloudinary.js';
import multer from 'multer';
dotenv.config();

export const validateProduct = (req, res, next) => {
  // // console.log(req.body);
  const {
    dealerid,
    title,
    price,
    category,
    serviceType,
    desc,
    images,
    quantity,
    size,
    largerSizeAvailable,
    smallerSizeAvailable,
    largerSizes,
    smallerSizes,
  } = req.body;

  const errors = [];

  if (errors.length > 0)
    return res.status(400).json({ success: false, errors });

  next();
};

export const createProduct = async (req, res) => {
  try {
    const {
      dealerid,
      title,
      name,
      price,
      category,
      serviceType,
      desc,
      quantity,
      size,
      sizeUnit,
      largerSizeAvailable,
      smallerSizeAvailable,
      largerSizes,
      smallerSizes,
      images,
    } = req.body;

    const imageUrls = [];

    for (let image of images) {
      const base64Image = image.split(";base64,").pop(); // Extract base64 string

      // Upload the image to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(
        `data:image/png;base64,${base64Image}`,
        {
          folder: "DealerProduct_images",
          use_filename: true,
          unique_filename: true,
          quality: "auto:best", // Dynamically adjust quality for best result
          format: "auto", // Automatically select the best image format
          width: 374,
          height: 305,
          crop: "fit", // Maintain original aspect ratio without cropping
        }
      );
      

      // Save the image URL for reference
      imageUrls.push(uploadResponse.secure_url);
    }
    const newProduct = new dealerProduct({
      dealerid,
      title,
      name,
      price,
      category,
      serviceType,
      desc,
      sizeUnit,
      images: imageUrls, // Store Cloudinary URLs
      quantity,
      size,
      largerSizeAvailable,
      smallerSizeAvailable,
      largerSizes,
      smallerSizes,
    });

    const savedProduct = await newProduct.save();

    // Update dealer's product list
    const dealer = await User.findById(dealerid);
    if (!dealer) {
      return res
        .status(404)
        .json({ success: false, message: "Dealer not found" });
    }

    dealer.dealerProducts.push(savedProduct._id);
    await dealer.save();

    res.status(201).json({
      success: true,
      message: "Product saved successfully",
      data: savedProduct,
    });
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while saving the product",
      error: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const filters = req.query;
    const products = await dealerProduct
      .find(filters)
      .populate("dealerid", "name email"); // Populate dealer details (name, email)
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch products. Please try again." });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await dealerProduct.findById(id).populate("dealerid");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch product. Please try again." });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await dealerProduct.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res
      .status(200)
      .json({ message: "Product deleted successfully", success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id; // Get product ID from request params
    const {
      title,
      name,
      price,
      size,
      sizeUnit,
      quantity,
      category,
      serviceType,
      images,
      desc,
      largerSizeAvailable,
      smallerSizeAvailable,
      largerSizes,
      smallerSizes,
    } = req.body;
    // // console.log(req.body);
    const imageUrls = [];

    for (let image of images) {
      let base64Image; // Change `const` to `let` to allow reassignment

      if (image.startsWith("data:image")) {
        const base64Image = image.split(";base64,").pop();
        try {
          // Upload the image to Cloudinary
          const uploadResponse = await cloudinary.uploader.upload(
            `data:image/png;base64,${base64Image}`,
            {
              folder: "DealerProduct_images", // Optional: Cloudinary folder name
              use_filename: true, // Optional: Use original file name
              unique_filename: true, // Optional: Ensure a unique file name
              quality:100,
              format:"webp",
            }
          );

          imageUrls.push(uploadResponse.secure_url);
        } catch (error) {
          console.error("Error uploading image to Cloudinary:", error);
          // Handle any errors you encounter during the upload
        }
      } else {
        imageUrls.push(image);
      }
    }

    // Find the product by ID and update it with new values
    const updatedProduct = await dealerProduct.findByIdAndUpdate(
      productId,
      {
        title,
        name,
        price,
        size,
        sizeUnit,
        quantity,
        category,
        serviceType,
        images: imageUrls,
        desc,
        largerSizeAvailable,
        smallerSizeAvailable,
        largerSizes,
        smallerSizes,
        dealerid: productId,
      },
      { new: true, runValidators: true } // Return the updated document and validate data
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    // // console.log(updatedProduct);
    res
      .status(200)
      .json({ message: "Product updated successfully", updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getSimilarProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 1000;
    // // console.log(limit)

    const products = await dealerProduct.find().limit(limit);

    return res.status(201).json({
      success: true,
      message: 'Product fetched successfully',
      data: products,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    // Aggregation pipeline
    const products = await Seller.aggregate([
      // Unwind the productsSold array to process each product
      { $unwind: "$productsSold" },

      // Group by productId and calculate the total quantity sold
      {
        $group: {
          _id: "$productsSold.productId", // Group by productId
          totalQuantitySold: { $sum: "$productsSold.quantity" }, // Sum the quantity sold
        },
      },

      // Perform a lookup to join with the dealerProduct collection to get product details
      {
        $lookup: {
          from: "dealerproducts", // The name of the products collection
          localField: "_id", // Match the productId in Seller to _id in dealerProduct
          foreignField: "_id", // The field in the dealerProduct collection
          as: "productDetails", // Alias for the joined data
        },
      },

      // Unwind the productDetails array to flatten the data
      { $unwind: "$productDetails" },

      // Project the necessary fields to include in the final result
      {
        $project: {
          _id: "$productDetails._id",
          title: "$productDetails.title", // Product title
          price: "$productDetails.price", // Product price
          totalQuantitySold: 1, // Total quantity sold
          category: "$productDetails.category", // Product category
          serviceType: "$productDetails.serviceType", // Service type
          images: "$productDetails.images", // Product images
          largerSizes: "$productDetails.largerSizes", // Larger sizes
          smallerSizes: "$productDetails.smallerSizes", // Smaller sizes
          size: "$productDetails.size", // Size
          sizeUnit: "$productDetails.sizeUnit", // Size unit
        },
      },

      // Sort by totalQuantitySold in descending order (highest sales first)
      { $sort: { totalQuantitySold: -1 } },

      // Limit to the top 5 products
      { $limit: 5 },
    ]);

    // // console.log(products);

    return res.status(200).json({
      success: true,
      message: "Top popular products fetched successfully",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching popular products",
      error: error.message,
    });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const category = req.query.category;
    // // console.log(category);
    const products = await dealerProduct.find({ category });
    // // console.log(products);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch products by category",
      });
  }
};
export const postComment = async (req, res) => {
  try {
    const productId = req.params.id;
    const { comment, userId, rating,date } = req.body;

    // Validate input
    if (!comment || !userId || !rating) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Validate rating range
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be a number between 1 and 5." });
    }

    const product = await dealerProduct.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Add the comment
    const newComment = { rating, userId, comment,date };
    product.comments.push(newComment);

    // Save the updated product
    await product.save();

    res.status(201).json({ message: "Comment added successfully.", comment: newComment });
  } catch (error) {
    console.error("Error posting comment:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


export const getComments = async (req, res) => {
  try {
    const productId = req.params.id; // Get the product ID from params

    // Step 1: Fetch the product with comments
    const product = await dealerProduct.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found or no comments available." });
    }

    // Step 2: Fetch the user details for each comment
    const commentsWithUserDetails = await Promise.all(
      product.comments.map(async (comment) => {
        // Fetch the user details based on userId in each comment
        const user = await User.findById(comment.userId);
        return {
          rating: comment.rating,
          comment: comment.comment,
          date: comment.date,
          name: user ? user.name : "Anonymous", // Fallback if no user found
        };
      })
    );

   // // console.log("/////////////////",commentsWithUserDetails)
    res.status(200).json({ comments: commentsWithUserDetails });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
