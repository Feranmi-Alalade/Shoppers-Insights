terraform {
  backend "s3" {
    bucket         = "blc-terraform-data-store"
    key            = "terraform/state/blc-infrastructure.tfstate"
    encrypt        = true
    dynamodb_table = "blc-terraform-state-lock"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  allowed_account_ids = [var.account_id]
}