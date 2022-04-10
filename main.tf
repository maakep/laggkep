provider "google" {
  project = "laggkep"
  region = "europe-west1"
}

terraform {
  backend "gcs" {
    bucket = "terraform-state-bucket"
    prefix = "laggkep"
  }
}

resource "google_cloudbuild_trigger" "first" {

}