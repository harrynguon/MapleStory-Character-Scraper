data "aws_acm_certificate" "maplestory_domain_name_certificate" {
	provider = aws.us-east-1
	domain   = var.maplestory_character_scraper_domain_name
	statuses = ["ISSUED"]
}

locals {
  s3_origin_id = "${aws_s3_bucket.maplestory_frontend.id}-S3-Origin"
}

resource "aws_cloudfront_distribution" "maplestory_frontend_s3_distribution" {
  origin {
    domain_name              = aws_s3_bucket.maplestory_frontend.bucket_regional_domain_name
    origin_id                = local.s3_origin_id
    origin_access_control_id = aws_cloudfront_origin_access_control.maplestory_frontend_s3_distribution_OAC.id
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CloudFront distribution to serve ${aws_s3_bucket.maplestory_frontend.id} s3 bucket"
  default_root_object = "index.html"

  aliases = [var.maplestory_character_scraper_domain_name, "www.${var.maplestory_character_scraper_domain_name}"]

  default_cache_behavior {
    # Using the Caching Optimised managed policy ID
    cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = local.s3_origin_id
    viewer_protocol_policy = "redirect-to-https"
  }

  price_class = "PriceClass_All"

  restrictions {
    geo_restriction {
      locations = []
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = data.aws_acm_certificate.maplestory_domain_name_certificate.arn
    minimum_protocol_version = "TLSv1.2_2021"
    ssl_support_method       = "sni-only"
  }
}

# Origin Access Identities are now legacy as they don't work for all scenarios. Doesn't work for S3 buckets in all AWS regions, S3 server side encryption with AWS KMS, and dynamic requests (PUT, POST, DELETE) to S3.
# https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html

# Instead, create an Origin Access Control
resource "aws_cloudfront_origin_access_control" "maplestory_frontend_s3_distribution_OAC" {
  name                              = "maplestory_frontend_s3_distribution_OAC"
  description                       = "maplestory_frontend_s3_distribution_OAC to access the S3 bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}