PROJECT_ID="$1"
SERVICE_ACCOUNT_NAME="tf-ci-account"
SERVICE_ACCOUNT="$SERVICE_ACCOUNT_NAME@$PROJECT_ID.iam.gserviceaccount.com"
TF_STATE_BUCKET="$PROJECT_ID-terraform"

gcloud config set project $PROJECT_ID

gcloud iam service-accounts create $SERVICE_ACCOUNT --display-name "$SERVICE_ACCOUNT" --description "Terraform deployment account"

gsutil mb -c standard -l europe-west1 -p "$PROJECT_ID" --pap enforced "gs://$TF_STATE_BUCKET"


gcloud services enable \
    cloudbuild.googleapis.com \
    cloudfunctions.googleapis.com \
    iam.googleapis.com \
    cloudresourcemanager.googleapis.com \
    serviceusage.googleapis.com \
    iamcredentials.googleapis.com \
    storage-component.googleapis.com \
    storage-api.googleapis.com \
#     --project="$PROJECT_ID"