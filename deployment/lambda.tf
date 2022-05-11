data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = "${path.root}/../src"
  output_path = "./.terraform/lambda.zip"
}

resource "aws_lambda_function" "tweeting_lambda" {
  filename      = data.archive_file.lambda.output_path
  function_name = "communes-bot-lambda"
  role          = aws_iam_role.lambda.arn
  handler       = "index.handler"

  source_code_hash = data.archive_file.lambda.output_base64sha256

  runtime = "nodejs14.x"

  environment {
    variables = {
      TWITTER_API_KEY             = var.twitter_api_key
      TWITTER_API_SECRET          = var.twitter_api_secret
      TWITTER_ACCESS_TOKEN        = var.twitter_access_token
      TWITTER_ACCESS_TOKEN_SECRET = var.twitter_access_token_secret
      BING_API_KEY                = var.bing_api_key
    }
  }
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_lambda" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.tweeting_lambda.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.schedule_rule.arn
}
