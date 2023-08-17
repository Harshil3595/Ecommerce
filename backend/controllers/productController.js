const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apifeatures");

const multer = require('multer');

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the destination folder where the uploaded images will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Set the filename for the uploaded image
  },
});

// Set up multer upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB file size limit
  },
}).array('avatar', 5); // Assuming the field name is 'avatar' and you allow up to 5 images

exports.createProduct = catchAsyncErrors(async (req, res) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);

  // Upload the images using the upload middleware
  upload(req, res, async (err) => {
    if (err) {
      // Handle upload errors
      console.error(err);
      return res.status(400).json({ success: false, error: 'Image upload failed' });
    }

    console.log(req); // Log the req object to check its structure

    // Images uploaded successfully
    const urls = req.files.map((file) => file.path); // Retrieve the file paths of the uploaded images

    // Save the image URLs to the product object
    product.images = urls;
    await product.save();

    res.status(201).json({ success: true, product });
  });
});

//get all product
exports.getAllProducts = catchAsyncErrors(async (req, res,next) => {

  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();
  const apifeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  const products = await apifeature.query;
  res.status(201).json({ success: true, products,productsCount,resultPerPage });
});

//get all product(ADMIN)
exports.getAdminProducts = catchAsyncErrors(async (req, res,next) => {

  const products=await Product.find();
  res.status(201).json({ success: true, products});
});


exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});
//delete product -- Admin
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findOneAndDelete({ _id: req.params.id });

  if (!product) {
    return res
      .status(500)
      .json({ success: false, message: "Product not found" });
  }
  return res.status(200).json({ success: true, message: "Product Deleted!!!" });
});

//Get product details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found...", 404));
  }

  res.status(200).json({ success: true, product });
});

//create new review and update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);
  const existingReviewIndex = product.reviews.findIndex(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (existingReviewIndex !== -1) {
    // Update existing review
    product.reviews[existingReviewIndex].rating = rating;
    product.reviews[existingReviewIndex].comment = comment;
  } else {
    // Add new review
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({ success: true });
});

//get all reviews
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found...", 404));
  }

  res.status(200).json({ success: true, reviews: product.reviews });
});

//delete review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const { productId } = req.query;
  
    const product = await Product.findById(productId);
  
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
  
    const existingReview = product.reviews.find((rev) => rev._id.toString() === req.query.id);
  
    if (!existingReview) {
      return next(new ErrorHandler("Review not found", 404));
    }
  
    // Filter out the review to be deleted
    const updatedReviews = product.reviews.filter((rev) => rev._id.toString() !== req.query.id);
  
    let totalRatings = 0;
  
    if (updatedReviews.length > 0) {
      updatedReviews.forEach((rev) => {
        totalRatings += rev.rating;
      });
    }
  
    const ratings = updatedReviews.length > 0 ? totalRatings / updatedReviews.length : 0;
    const numOfReviews = updatedReviews.length;
  
    await Product.findByIdAndUpdate(
      productId,
      { reviews: updatedReviews, ratings, numOfReviews },
      { new: true, runValidators: true, useFindAndModify: false }
    );
  
    res.status(200).json({ success: true });
  });
  