# Store character images here, and serve the frontend
resource "aws_s3_bucket" "maplestory_frontend" {
  bucket = "maplestory-frontend"
}

# Public access block
resource "aws_s3_bucket_public_access_block" "maplestory_frontend_s3_public_access_block" {
  bucket = aws_s3_bucket.maplestory_frontend.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Policy to allow access to the S3 bucket
# - CloudFront
# - Lambda
data "aws_iam_policy_document" "maplestory_frontend_allow_access_policy_document" {
  statement {
    principals {
      type        = "AWS"
      identifiers = [aws_iam_role.iam_for_character_scraper_lambda.arn]
    }

    actions = [
      "s3:GetObject",
      "s3:GetObjectAcl",
      "s3:PutObject",
      "s3:PutObjectAcl"
    ]

    resources = [ 
      "${aws_s3_bucket.maplestory_frontend.arn}/*"
      ]
  }
}

resource "aws_s3_bucket_policy" "maplestory_frontend_allow_access_bucket_policy" {
  bucket = aws_s3_bucket.maplestory_frontend.id
  policy = data.aws_iam_policy_document.maplestory_frontend_allow_access_policy_document.json
}