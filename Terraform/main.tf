terraform {
	backend "s3" {
		bucket = "terraform-states-hub"
		key    = "terraform-aws-infrastructure/projects/maplestory-character-scraper/terraform.tfstate"
		region = "ap-southeast-2"
	}

	required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
	region = "ap-southeast-2"

	assume_role {
		role_arn     = "arn:aws:iam::${var.account_id}:role/Terraform-Admin"
		session_name = "terraform-harry"
	}

	default_tags {
		tags = var.tags
	}
}