variable "account_id" {
  type = string
}

variable "region" {
  type = string
  default = "ap-southeast-2"
}

variable "project_name" {
  type = string
  default = "value"
}

variable "maplestory_lookup_url" {
  type = string
}

variable "character_list" {
  type = list(string)
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