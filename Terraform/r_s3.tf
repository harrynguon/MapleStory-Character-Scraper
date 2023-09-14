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

# S3 Bucket Policy to allow access to the S3 bucket
# - CloudFront
# - Lambda
data "aws_iam_policy_document" "maplestory_frontend_allow_access_policy_document" {

  # Lambda access
  statement {
    principals {
      # Type 'AWS' = IAM principals
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

  # CloudFront OAC access
  statement {
    # Type 'Service' = AWS Service roles
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions = [
      "s3:GetObject"
    ]

    resources = [ 
      "${aws_s3_bucket.maplestory_frontend.arn}/*"
    ]

    condition {
      # IAM condition operator
      test = "StringEquals"
      # Name of the context variable to apply the condition (StringEquals) to
      variable = "Aws:SourceArn"
      # Values to evaluate the condition against
      values = [aws_cloudfront_distribution.maplestory_frontend_s3_distribution.arn] 
    }
  }
}

resource "aws_s3_bucket_policy" "maplestory_frontend_allow_access_bucket_policy" {
  bucket = aws_s3_bucket.maplestory_frontend.id
  policy = data.aws_iam_policy_document.maplestory_frontend_allow_access_policy_document.json
}