# Flask Quiz App

A simple quiz application built with Flask that allows users to create quizzes, attempt them, and view results. The application runs with HTTPS and supports real-time quiz submission.

## 🚀 Features

- ✅ Create quizzes dynamically
- ✅ Attempt quizzes and submit answers
- ✅ View quiz results instantly
- ✅ Error handling for 404 and 500 pages
- ✅ Secure HTTPS support
- ✅ Simple and responsive UI (extendable with CSS)

---

## 📌 Installation Guide

### **Step 1: Clone the Repository**
Open your terminal or command prompt and run:
```sh
git clone https://github.com/yourusername/flask_quiz_app.git
cd flask_quiz_app
```

### **Step 2: Create a Virtual Environment (Optional but Recommended)**
```sh
python -m venv venv
source venv/bin/activate  # On macOS/Linux
venv\Scripts\activate     # On Windows
```

### **Step 3: Install Dependencies**
```sh
pip install -r requirements.txt
```

### **Step 4: Run the Application**
```sh
python app.py
```

The Flask server will start, and you can access it in your browser at:
```
https://localhost:5000
```

---

## 📂 Project Structure
```
/flask_quiz_app
│── /templates        # HTML templates (index, quiz, create, results, etc.)
│── /static           # Static files (CSS, JavaScript, images)
│── app.py            # Main Flask application
│── requirements.txt  # Dependencies
│── cert.pem          # SSL Certificate (DO NOT COMMIT)
│── key.pem           # SSL Key (DO NOT COMMIT)
│── README.md         # Project documentation
│── .gitignore        # Git ignore file
```

---

## 🛠 Requirements
- Python 3.7+
- Flask
- Gunicorn (optional for deployment)

To install requirements manually:
```sh
pip install Flask gunicorn
```

---

## ⚠️ SSL Certificate Notice
This application runs with HTTPS using `cert.pem` and `key.pem`. If you do not have these files, generate them using:
```sh
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
```

For local testing without HTTPS, modify `app.py` to:
```python
app.run(host='0.0.0.0', port=5000, debug=True)
```

---

## 📜 License
This project is licensed under the **MIT License**.

---

## 🤝 Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m "Added a new feature"`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a **Pull Request**.

---

## 📞 Support
For issues, feel free to open an issue on GitHub or contact me.

Happy coding! 🚀
