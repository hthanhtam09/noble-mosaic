import { Product } from "@/models/Product";

export function getAmazonLinkFromAsin(asin: string) {
  return `https://www.amazon.com/dp/${asin}`;
}

export async function getNextReviewId() {
  const latest = await Product.findOne({ reviewId: { $exists: true, $ne: null } })
    .sort({ reviewId: -1 })
    .select("reviewId")
    .lean<{ reviewId?: number }>();

  return (latest?.reviewId || 0) + 1;
}

export async function normalizeProductLinks(body: any) {
  if (!body.amazonLink && body.asin) {
    body.amazonLink = getAmazonLinkFromAsin(body.asin);
  }

  if (body.reviewId === "" || body.reviewId === null) {
    delete body.reviewId;
  } else if (body.reviewId !== undefined) {
    body.reviewId = Number(body.reviewId);
  }

  if (!body.reviewId) {
    body.reviewId = await getNextReviewId();
  }

  if (body.editions && Array.isArray(body.editions)) {
    body.editions = body.editions.map((edition: any) => ({
      ...edition,
      link:
        !edition.link && edition.asin
          ? getAmazonLinkFromAsin(edition.asin)
          : edition.link,
    }));
  }
}
