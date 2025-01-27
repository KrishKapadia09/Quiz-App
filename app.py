from flask import Flask, render_template, request, jsonify, url_for
import os
import socket

app = Flask(__name__)
app.secret_key = os.urandom(24)

# Context processor to add enumerate to Jinja environment
@app.context_processor
def utility_processor():
    return dict(enumerate=enumerate)

# Store quizzes in memory (replace with database in production)
quizzes = []

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/create_quiz', methods=['GET', 'POST'])
def create_quiz():
    if request.method == 'GET':
        return render_template('create.html')
    
    if request.method == 'POST':
        try:
            quiz_data = request.get_json()
            quizzes.append(quiz_data)
            return jsonify({
                'success': True,
                'message': 'Quiz created successfully',
                'quiz_id': len(quizzes) - 1
            })
        except Exception as e:
            return jsonify({
                'success': False,
                'message': str(e)
            }), 400

@app.route('/quiz')
def quiz():
    if not quizzes:
        return render_template('quiz.html', error="No quizzes available")
    return render_template('quiz.html', quiz=quizzes[-1])

@app.route('/submit_quiz', methods=['POST'])
def submit_quiz():
    try:
        data = request.get_json()
        answers = data.get('answers')
        quiz = quizzes[-1]
        questions = quiz['questions']
        score = sum(1 for i, question in enumerate(questions) if question['correctAnswer'] == answers[i])
        
        return jsonify({
            'success': True,
            'score': score,
            'totalQuestions': len(questions)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 400

@app.route('/result')
def result():
    return render_template('result.html')

# Add error handlers
@app.errorhandler(404)
def not_found_error(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('500.html'), 500

if __name__ == '__main__':
    hostname = socket.gethostname()
    ip_address = socket.gethostbyname(hostname)
    app.run(host=ip_address, port=5000, debug=True, ssl_context=('cert.pem', 'key.pem'))
