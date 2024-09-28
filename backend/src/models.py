from django.db import models
import uuid

class Document(models.Model):
    doc_id = models.CharField(max_length=36, default=uuid.uuid4, editable=False, unique=True )
    user_id = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    description = models.CharField(max_length=10000, default=None)
    author = models.CharField(max_length=200)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    size = models.BigIntegerField(default=0)

class Downloads(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    user_id = models.CharField(max_length=100)
    downloaded_at = models.DateTimeField(auto_now_add=True)
