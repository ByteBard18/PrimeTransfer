from django.urls import path
from . import views
from django.conf import settings

urlpatterns = [
    path('getDocs/', views.get_docs), #working
    path('postDocs/', views.post_docs), #working
    path('getDocsByUser/', views.get_docs_by_user), #working
    path('getDocsByTerm/', views.get_docs_by_term), #working
    path('downloadDoc/<str:file_key>/<str:user_id>/', views.download_file_from_s3),
    path('deleteDoc/<str:doc_id>/', views.delete_file), #working
    path('getUserDownloads/<str:user_id>/', views.userDownloads),
    path('presignedUrl/<str:doc_id>/', views.presignedUrl),
    path('create-order/', views.create_order, name='create-order'),
]