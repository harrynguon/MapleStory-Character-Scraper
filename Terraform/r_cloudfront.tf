locals {
  s3_origin_id = "${aws_s3_bucket.maplestory_frontend.id}-S3-Origin"
}

resource "aws_cloudfront_distribution" "maplestory_frontend_s3_distribution" {
  origin {
    domain_name = aws_s3_bucket.maplestory_frontend.bucket_regional_domain_name
    origin_id   = local.s3_origin_id
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CloudFront distribution to serve ${aws_s3_bucket.maplestory_frontend.id} s3 bucket"
  default_root_object = "index.html"

  # aliases = ["tester.fairfrozen.com"]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 43200 # Cache TTL 12 hours
  }

  price_class = "PriceClass_All"

  restrictions {
    geo_restriction {
      locations = []
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}