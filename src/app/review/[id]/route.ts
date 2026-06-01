import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { getAmazonLinkFromAsin } from "@/lib/review-links";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const reviewId = Number(id);

  if (!Number.isInteger(reviewId) || reviewId <= 0) {
    return NextResponse.json({ error: "Review link not found" }, { status: 404 });
  }

  await connectDB();

  const product = await Product.findOne({ reviewId })
    .select("amazonLink asin")
    .lean<{ amazonLink?: string; asin?: string }>();

  const destination =
    product?.amazonLink || (product?.asin ? getAmazonLinkFromAsin(product.asin) : null);

  if (!destination) {
    return NextResponse.json({ error: "Review link not found" }, { status: 404 });
  }

  return NextResponse.redirect(destination, 302);
}
