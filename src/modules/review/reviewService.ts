import Review from '../../models/review';
import Request from '../../models/request';

const createReview = async (
  userId: string,
  payload: {
    requestId: string;
    rating: number;
    comment?: string;
  },
) => {
  const { requestId, rating, comment } = payload;

  const request = await Request.findById(requestId);

  if (!request) {
    throw new Error('Request not found');
  }

  // request owner check
  if (request.user.toString() !== userId) {
    throw new Error('Unauthorized');
  }

  // completed job check
  if (request.status !== 'completed') {
    throw new Error('You can only review completed jobs');
  }

  // duplicate review prevent
  const existingReview = await Review.findOne({
    request: requestId,
  });

  if (existingReview) {
    throw new Error('Review already submitted');
  }

  const review = await Review.create({
    user: userId,
    provider: request.provider,
    request: requestId,
    rating,
    comment,
  });

  return review;
};

const getMyReviews = async (userId: string) => {
  const reviews = await Review.find({
    user: userId,
  })
    .populate({
      path: 'request',
      populate: {
        path: 'category',
        select: 'label',
      },
      // select: 'title status budget',
    })
    .populate({
      path: 'provider',
      populate: {
        path: 'user',
        select: 'name image',
      },
    })
    .sort({ createdAt: -1 });

  return reviews;
};

const updateReview = async (
  userId: string,
  reviewId: string,
  payload: {
    rating?: number;
    comment?: string;
  },
) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new Error('Review not found');
  }

  // ownership check
  if (review.user.toString() !== userId) {
    throw new Error('Unauthorized');
  }

  // update allowed fields only
  if (payload.rating !== undefined) {
    review.rating = payload.rating;
  }

  if (payload.comment !== undefined) {
    review.comment = payload.comment;
  }

  await review.save();

  return review;
};

export { createReview, getMyReviews, updateReview };
