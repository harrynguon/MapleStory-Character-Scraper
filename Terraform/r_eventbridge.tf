# CloudWatch Event Rule to schedule a trigger for the lambda 
resource "aws_cloudwatch_event_rule" "trigger_lambda_cloudwatch_event_rule" {
  name        = "scheduler_for_maplestory_scraper_lambda"
  description = "Schedule the MapleStory Scraper Lambda to automatically run once a day"

  // Every day at 6pm NZST
  schedule_expression = "cron(0 6 ? * * *)"
}

resource "aws_cloudwatch_event_target" "trigger_lambda_cloudwatch_event_target" {
  target_id = "target_maplestory_character_lambda"
  rule      = aws_cloudwatch_event_rule.trigger_lambda_cloudwatch_event_rule.name

  arn       = aws_lambda_function.character_scraper_lambda.arn
  input     = jsonencode( {"MapleStoryUsernames" = var.character_list} )

}

