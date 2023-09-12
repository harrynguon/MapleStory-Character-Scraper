# Assume role policy. i.e. What entity in AWS is allowed to assume this role
data "aws_iam_policy_document" "character_scraper_lambda_assume_role_policy" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

# Create the IAM role
resource "aws_iam_role" "iam_for_character_scraper_lambda" {
  name               = "maplestory_character_scraper_lambda_iam_role"
  assume_role_policy = data.aws_iam_policy_document.character_scraper_lambda_assume_role_policy.json
}

# Identity based policy i.e. Permissions this role provides to the defined AWS resources
# Attach this policy to the IAM role
resource "aws_iam_role_policy" "character_scraper_lambda_iam_role_policy" {
  name = "maplestory_character_scraper_lambda_iam_role_policy"
  role = aws_iam_role.iam_for_character_scraper_lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
				Effect : "Allow",
				Action : [
					"lambda:InvokeFunction"
				],
				Resource : [
					aws_lambda_function.character_scraper_lambda.arn
				]
			},
      {
				Effect : "Allow",
				Action : [
					"logs:CreateLogGroup",
					"logs:CreateLogStream",
					"logs:PutLogEvents"
				],
				Resource : "arn:aws:logs:${var.region}:${var.account_id}:*"
			},
      {
				Effect : "Allow",
				Action : [
          "s3:ListBuckets",
				],
				Resource : aws_s3_bucket.maplestory_frontend.arn
			},
      {
				Effect : "Allow",
				Action : [
          "s3:GetObject",
          "s3:GetObjectAcl",
					"s3:PutObject",
          "s3:PutObjectAcl"
				],
				Resource : "${aws_s3_bucket.maplestory_frontend.arn}/*"
			}
    ]
  })
}


resource "aws_lambda_function" "character_scraper_lambda" {
  function_name = "maplestory_character_scraper"
  role          = aws_iam_role.iam_for_character_scraper_lambda.arn
  handler       = "Character.WebScraper::Character.WebScraper.Function::FunctionHandler"

  s3_bucket = "terraform-states-hub"
	s3_key    = "lambda_placeholder.zip"

  memory_size = 256

  runtime = "dotnet6"
  architectures = ["arm64"]

  timeout = 300

  environment {
    variables = {
      
      S3BucketName = aws_s3_bucket.maplestory_frontend.bucket
    }
  }
}
