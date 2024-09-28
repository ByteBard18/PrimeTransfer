from rest_framework import serializers
from .models import Document, Downloads

class DataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ("doc_id", "user_id", "title", "author", "description", "uploaded_at", "size")
        read_only_fields = ("doc_id", "uploaded_at", "size")  # Make uploaded_at read-only

class DownloadSerializer(serializers.ModelSerializer):
    document = serializers.SerializerMethodField()

    class Meta:
        model = Downloads
        fields = ['user_id', 'downloaded_at', 'document']

    def get_document(self, obj):
        return {
            "doc_id": obj.document.doc_id,
            "title": obj.document.title,
            "description": obj.document.description,
            "author": obj.document.author,
            "uploaded_at": obj.document.uploaded_at
        }
