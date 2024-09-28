from rest_framework import status
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializer import DataSerializer, DownloadSerializer
from .models import Document, Downloads
import boto3
import uuid
import os
from botocore.exceptions import ClientError
import logging
from pathlib import Path
from django.http import HttpResponse
import razorpay

logger = logging.getLogger(__name__)

s3_client = boto3.client(
    's3',
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    region_name=settings.AWS_S3_REGION_NAME
)

# Initialize Razorpay client
client = razorpay.Client(auth=("rzp_test_FQzlH7whPNyTpw", "f29JKfYy9ByV8IPB3RhdbnxN"))


@api_view(['GET'])
def get_docs(request):
    documents = Document.objects.all()
    serializer = DataSerializer(documents, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def get_docs_by_user(request):
    user_id = request.GET.get("user_id")
    if user_id is None:
        return Response({"error": "user_id parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
    documents = Document.objects.filter(user_id=user_id)
    if not documents.exists():
        return Response({"message": "No documents found for this user."}, status=status.HTTP_404_NOT_FOUND)
    serializer = DataSerializer(documents, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_docs_by_term(request):
    searchTerm = request.GET.get("searchTerm")
    if searchTerm is None:
        return Response({"error": "searchTerm parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
    documents = Document.objects.filter(title__icontains=searchTerm)
    if not documents.exists():
        return Response({"error": "No documents for this this search term"}, status=status.HTTP_404_NOT_FOUND)
    serializer = DataSerializer(documents, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def post_docs(request):
    serializer = DataSerializer(data=request.data)
    if serializer.is_valid():
        file = request.FILES.get('file')
        title = request.data.get('title')
        description = request.data.get('desc')
        author = request.data.get('author')
        user_id = request.data.get('user_id')
        size = request.data.get('size')
        
        unique_id = str(uuid.uuid4())
        
        # Get the original file extension
        file_extension = os.path.splitext(file.name)[1]  
        s3_key = f'{unique_id}{file_extension}'  # Create the S3 key
        
        # Upload to S3
        s3_client.upload_fileobj(file, settings.AWS_STORAGE_BUCKET_NAME, s3_key)
        
        # Create Document instance using the UUID
        document = Document.objects.create(
            doc_id=unique_id,  # Use the UUID object directly
            title=title,
            description=description,
            author=author,
            user_id=user_id,
            size= size
        )
        
        return Response(DataSerializer(document).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def download_file_from_s3(request, file_key, user_id):
    try:
        if not os.path.exists(settings.STORAGE_PATH):
            os.makedirs(settings.STORAGE_PATH)

        if not file_key:
            return Response({"mssg": "No file key provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Extract document ID if necessary
        doc_id = file_key.split(".")[0]

        # Retrieve the document
        document = Document.objects.get(doc_id=doc_id)

        # Log the download
        download = Downloads.objects.create(document=document, user_id=user_id)

        local_path = os.path.join(settings.STORAGE_PATH, os.path.basename(file_key))

        # Attempt to download the file
        s3_client.download_file(settings.AWS_STORAGE_BUCKET_NAME, file_key, local_path)

        # Send the file back as a response
        with open(local_path, 'rb') as f:
            response = HttpResponse(f.read(), content_type="application/octet-stream")
            response['Content-Disposition'] = f'attachment; filename="{os.path.basename(local_path)}"'
            return response

    except Document.DoesNotExist:
        return Response({"mssg": "Document not found"}, status=status.HTTP_404_NOT_FOUND)
    except ClientError as e:
        return Response({"mssg": "Error downloading file from S3", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        return Response({"mssg": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
@api_view(['DELETE'])
def delete_file(request, doc_id):
    try:
        document = Document.objects.get(doc_id=doc_id)
        file_key = document.doc_id  # Assuming your Document model has a field for the file key

        # Attempt to delete the file from S3
        s3_client.delete_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=file_key)
        
        # Delete the document record
        document.delete()
        logger.info(f"File deleted successfully: {file_key}")
        return Response({"mssg": "File deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        
    except Document.DoesNotExist:
        logger.warning(f"Document not found: {doc_id}")
        return Response({"mssg": "File not found"}, status=status.HTTP_404_NOT_FOUND)

    except ClientError as e:
        logger.error(f"Error deleting file: {e}")
        return Response({"mssg": "Error deleting file", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return Response({"mssg": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
def userDownloads(request, user_id):
    if not user_id:
        return Response({"mssg": "No user_id provided"}, status=status.HTTP_400_BAD_REQUEST)

    downloads = Downloads.objects.filter(user_id=user_id)
    
    if not downloads.exists():
        return Response({"mssg": "No downloads for this user"}, status=status.HTTP_404_NOT_FOUND)

    serializer = DownloadSerializer(downloads, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def presignedUrl(request, doc_id):
    if not doc_id:
        return Response({"mssg": "No doc_id provided"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        presigned_url = s3_client.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': settings.AWS_STORAGE_BUCKET_NAME,
                'Key': doc_id
            },
            ExpiresIn=3600  # URL valid for 1 hour
        )
        
        return Response({"url": presigned_url}, status=status.HTTP_200_OK)

    except Document.DoesNotExist:
        return Response({"mssg": "Document not found"}, status=status.HTTP_404_NOT_FOUND)
    except ClientError as e:
        return Response({"mssg": "Error generating pre-signed URL", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        return Response({"mssg": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def create_order(request):
    booking_id = request.data.get('bookingId')

    # Fetch the booking details (price, etc.) from the database based on booking_id
    price = 1  # Assuming Booking is your model name
    amount = int(price) * 100  # Amount in paise (for example: ₹500 is 50000 paise)
    currency = 'INR'

    try:
        # Create an order
        order = client.order.create({'amount': amount, 'currency': currency, 'receipt': str(booking_id)})
        return Response({'orderId': order['id'], 'amount': amount}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)