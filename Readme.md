
# 📁 File Sharing App

## 📖 Overview

The File Sharing App allows users to seamlessly upload, share, and download PDF files. The app provides user-friendly features for managing files, user authentication, and smooth interaction with the cloud using AWS S3 for file storage. It also integrates WhatsApp for sharing PDF links and offers efficient search mechanisms to locate documents easily.

## ✨ Features

-   **🔒 User Authentication & Authorization**:  
    Firebase Authentication is used to sign up, log in, and manage user access securely.
    
-   **⬆️ Upload & Download PDFs**:  
    Users can upload PDF files to an AWS S3 bucket via a seamless upload page. They can also view and download their previously uploaded PDFs.
    
-   **🏠 Homepage**:  
    A central hub that displays all uploaded PDF files across users.
    
-   **👤 Profile Page**:  
    Users can view and update their profile, change their password, and delete their account.
    
-   **📲 WhatsApp Integration**:  
    Users can share PDF file links directly via WhatsApp, enhancing the sharing experience.
    
-   **🔍 Efficient Search**:  
    The app includes a search feature allowing users to search through uploaded files.
    
-   **⚛️ Recoil State Management**:  
    Extensively used for managing the state of the application, including the current signed-in user's details.
    
-   **🗄️ SQLITE Database**:  
    For metadata management on the backend (default database with Django).
    

## 🚀 Future Scope

1.  **🔍 Elasticsearch Integration**:  
    Enhance search capabilities by implementing Elasticsearch for faster and more efficient document retrieval.
    
2.  **🤖 WhatsApp Bot Integration**:  
    Automate file uploads and downloads via WhatsApp using bot functionality.
    
3.  **💳 Payment Gateway Integration**:  
    To restrict uncontrolled server usage and abusive traffic, we plan to implement a payment gateway, ensuring quality service for users.
    

## 🛠️ Technologies Used

-   **Frontend**:  
    React.js, Recoil for state management, WhatsApp API for link sharing.
    
-   **Backend**:  
    Django with Django REST Framework for API communication, Firebase for authentication and authorization.
    
-   **Storage**:  
    AWS S3 for file storage, SQLITE for metadata storage.
    
-   **Deployment**:  
    AWS for hosting the Django server and file storage.
    

## 📥 Installation and Setup

1.  **Clone the Repository**:
    
    ```bash
    `git clone https://github.com/your-repo-url.git`
    ``` 
    
2.  **Frontend Setup**:
    
    -   Navigate to the frontend directory:
        
		```bash     
	        `cd frontend`
	    ``` 
        
    -   Install dependencies:
        
        ```bash
	      `npm install` 
	    ```
    
   -   Start the development server:
        
		 ```bash
        npm start 
	    ```
        
3.  **Backend Setup**:
    
    -   Navigate to the backend directory:
        
        ```bash
        cd backend 
	     ```
    -   Install dependencies:
        
        ```bash
        pip install -r requirements.txt 
	     ```
        
    -   Run database migrations:
        
        ```bash 
        python manage.py migrate 
        ```
        
    -   Start the Django server:
        
	       ```bash  
        python manage.py runserver
	    ``` 
        
4.  **AWS S3 Setup**:
    
    -   Ensure your AWS credentials are correctly set up in the environment for file uploads and downloads.

5.  **Firebase Setup**:
    
    -   Add your Firebase project credentials to the frontend and backend for user authentication.

## 🌟 Usage

-   Visit the homepage to view all uploaded PDFs.
-   Navigate to the Uploads page to upload new PDF files.
-   Go to the Downloads page to view and download your uploaded PDFs.
-   Share file links through WhatsApp by clicking the share button.
-   Manage your account via the Profile page.

## 🤝 Contribution

Feel free to fork this project and submit pull requests for any feature enhancements or bug fixes.