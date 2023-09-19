variable "account_id" {
  type = string
}

variable "region" {
  type    = string
  default = "ap-southeast-2"
}

variable "maplestory_lambda_scraper_function_name" {
  type    = string
  default = "maplestory_character_scraper"
}

variable "maplestory_lookup_url" {
  type = string
}

variable "character_list" {
  type = list(string)
}

variable "maplestory_character_scraper_domain_name" {
  type = string
}

variable "tags" {
	type    = map(string)
	default = {
		Owner             = "Harry"
		Description       = "Infrastructure for MapleStory Character Scraper"
		GitRepositoryName = "MapleStory Character Scraper"
		GitRepositoryLink = "https://github.com/harrynguon/MapleStory-Character-Scraper"
		ManagedBy         = "Terraform"
	}
}