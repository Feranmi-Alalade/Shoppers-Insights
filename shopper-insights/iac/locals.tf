locals {

  shopper_insights_api_mock_options = {
    responses = {
      "200" = {
        description = "CORS support"
        headers = {
          "Access-Control-Allow-Origin"  = { schema = { type = "string" } }
          "Access-Control-Allow-Methods" = { schema = { type = "string" } }
          "Access-Control-Allow-Headers" = { schema = { type = "string" } }
        }
      }
    }
    x-amazon-apigateway-integration = {
      type = "mock"
      requestTemplates = {
        "application/json" = "{\"statusCode\": 200}"
      }
      responses = {
        default = {
          statusCode = "200"
          responseParameters = {
            "method.response.header.Access-Control-Allow-Origin"  = "'*'"
            "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS'"
            "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key'"
          }
          responseTemplates = {
            "application/json" = ""
          }
        }
      }
    }
  }

  shopper_insights_api_get_method = {
    security = [{ api_key = [] }]
    responses = {
      "200" = { description = "Successful response", content = { "application/json" = {} } }
      "400" = { description = "Bad request", content = { "application/json" = {} } }
      "404" = { description = "Not found", content = { "application/json" = {} } }
      "429" = { description = "Too many requests", content = { "application/json" = {} } }
      "500" = { description = "Internal server error", content = { "application/json" = {} } }
    }
    x-amazon-apigateway-integration = {
      uri                 = "arn:aws:apigateway:${data.aws_region.current.name}:lambda:path/2015-03-31/functions/${module.shopper_insights_api_lambda.lambda_function_arn}/invocations"
      passthroughBehavior = "when_no_match"
      httpMethod          = "POST"
      type                = "aws_proxy"
    }
  }

  shopper_insights_api_openapi_config = {
    openapi = "3.0.1"
    info = {
      title   = "BildCraft Image Translation API"
      version = "1.0"
    }

    x-amazon-apigateway-api-key-source = "HEADER"

    paths = {
      "/v1/presigned-url" = {
        get     = local.shopper_insights_api_get_method
        options = local.shopper_insights_api_mock_options
      }
      "/v1/result" = {
        get     = local.shopper_insights_api_get_method
        options = local.shopper_insights_api_mock_options
      }
      "/v1/status" = {
        get     = local.shopper_insights_api_get_method
        options = local.shopper_insights_api_mock_options
      }
    }

    components = {
      securitySchemes = {
        api_key = {
          type = "apiKey"
          name = "x-api-key"
          in   = "header"
        }
      }
    }

    security = [{ api_key = [] }]
  }

  put_rest_api_mode = "merge"
}