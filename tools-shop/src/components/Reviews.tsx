'use client';

import { useState } from 'react';
import { Star, ThumbsUp, User } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  helpful: number;
  verified: boolean;
}

// Sample reviews - in production these would come from database
const sampleReviews: Review[] = [
  {
    id: '1',
    author: 'Георги П.',
    rating: 5,
    date: '15.01.2024',
    title: 'Отлично качество!',
    content: 'Много съм доволен от покупката. Инструментът работи перфектно и доставката беше бърза. Препоръчвам!',
    helpful: 12,
    verified: true,
  },
  {
    id: '2',
    author: 'Мария С.',
    rating: 4,
    date: '10.01.2024',
    title: 'Добро съотношение цена/качество',
    content: 'За тази цена е много добър продукт. Единственият минус е, че кутията беше леко смачкана при доставката.',
    helpful: 8,
    verified: true,
  },
  {
    id: '3',
    author: 'Иван Д.',
    rating: 5,
    date: '05.01.2024',
    title: 'Точно каквото търсех',
    content: 'Използвам го всеки ден в работата си. Издръжлив и надежден. Батерията държи дълго.',
    helpful: 15,
    verified: true,
  },
];

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= rating
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300'
          }
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  const [helpfulClicked, setHelpfulClicked] = useState<Set<string>>(new Set());

  const averageRating = sampleReviews.reduce((acc, r) => acc + r.rating, 0) / sampleReviews.length;
  const totalReviews = sampleReviews.length;

  // Calculate rating distribution
  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: sampleReviews.filter((r) => r.rating === rating).length,
    percentage: (sampleReviews.filter((r) => r.rating === rating).length / totalReviews) * 100,
  }));

  const handleHelpful = (reviewId: string) => {
    setHelpfulClicked((prev) => new Set(prev).add(reviewId));
  };

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">
        Отзиви от клиенти
      </h2>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Rating summary */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-[var(--foreground)]">
                {averageRating.toFixed(1)}
              </div>
              <StarRating rating={Math.round(averageRating)} size={20} />
              <p className="text-sm text-[var(--muted)] mt-1">
                Базирано на {totalReviews} отзива
              </p>
            </div>

            {/* Rating bars */}
            <div className="space-y-2">
              {ratingCounts.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm text-[var(--muted)] w-8">{rating}</span>
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-[var(--muted)] w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews list */}
        <div className="lg:col-span-2 space-y-4">
          {sampleReviews.map((review) => (
            <div
              key={review.id}
              className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)]"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--primary)]/10 rounded-full flex items-center justify-center">
                    <User size={20} className="text-[var(--primary)]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[var(--foreground)]">
                        {review.author}
                      </span>
                      {review.verified && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Верифицирана покупка
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StarRating rating={review.rating} size={14} />
                      <span className="text-xs text-[var(--muted)]">{review.date}</span>
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="font-medium text-[var(--foreground)] mb-1">
                {review.title}
              </h4>
              <p className="text-[var(--muted)] text-sm">
                {review.content}
              </p>

              <div className="mt-3 flex items-center gap-4">
                <button
                  onClick={() => handleHelpful(review.id)}
                  disabled={helpfulClicked.has(review.id)}
                  className={`flex items-center gap-1 text-sm transition-colors ${
                    helpfulClicked.has(review.id)
                      ? 'text-[var(--primary)]'
                      : 'text-[var(--muted)] hover:text-[var(--primary)]'
                  }`}
                >
                  <ThumbsUp size={14} />
                  <span>Полезно ({review.helpful + (helpfulClicked.has(review.id) ? 1 : 0)})</span>
                </button>
              </div>
            </div>
          ))}

          {/* Show more button */}
          <div className="text-center pt-4">
            <button className="btn btn-outline">
              Виж всички отзиви
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
