variable "environment" {
  description = "The environment/stage for resource naming (e.g., dev, prod)."
  type        = string
}

variable "account_id" {
  description = "The AWS Account ID allowed to use this provider."
  type        = string
}
