
resource "aws_cloudwatch_event_rule" "schedule_rule" {
  name                = "communes-bot-chron"
  description         = "Fires once per hour"
  schedule_expression = "rate(1 hour)"
}

resource "aws_cloudwatch_event_target" "check_foo_every_one_minute" {
  rule      = aws_cloudwatch_event_rule.schedule_rule.name
  target_id = "communes-bot-chron-lambda"
  arn       = aws_lambda_function.tweeting_lambda.arn
}
