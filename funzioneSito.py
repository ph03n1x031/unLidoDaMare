from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

def init_db():
    conn = sqlite3.connect('gestioneStabilimento.db')
    c = conn.cursor()

    c.execute('''CREATE TABLE IF NOT EXISTS utentiStabilimento (email TEXT PRIMARY KEY, password TEXT)''')

    c.execute('''CREATE TABLE IF NOT EXISTS prenotazioniSpiaggia (email TEXT, dataInizioPrenotazione TEXT, dataFinePrenotazione TEXT, spot TEXT)''')

    c.execute('''CREATE TABLE IF NOT EXISTS prenotazioniChiosco (email TEXT, dataPrenotazione TEXT, postoChiosco TEXT)''')

    conn.commit()
    conn.close()

@app.route('/')
def home():
    return render_template('unlidodamare.html')

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']
    
    conn = sqlite3.connect('gestioneStabilimento.db')
    c = conn.cursor()
    
    c.execute('SELECT * FROM utentiStabilimento WHERE email = ?', (email,))
    user = c.fetchone()
    
    if user:
        if user[1] == password:
            c.execute('SELECT * FROM prenotazioniSpiaggia WHERE email = ?', (email,))
            beach_booking = c.fetchone()

            c.execute('SELECT * FROM prenotazioniChiosco WHERE email = ?', (email,))
            kiosk_booking = c.fetchone()

            conn.close()
            
            response = {
                'success': True,
                'hasBeachBooking': bool(beach_booking),
                'hasKioskBooking': bool(kiosk_booking)
            }

            if beach_booking:
                response['beachStartDate'] = beach_booking[1]
                response['beachEndDate'] = beach_booking[2]
                response['beachSpot'] = beach_booking[3]

            if kiosk_booking:
                response['kioskDate'] = kiosk_booking[1]
                response['kioskSpot'] = kiosk_booking[2]

            return jsonify(response)
        else:
            conn.close()
            return jsonify(success=False, message='Password errata.')
    else:
        conn.close()
        return jsonify(success=False, message='Email non presente nel database.')

@app.route('/getSeatStatus', methods=['GET'])
def get_seat_status():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')

    conn = sqlite3.connect('gestioneStabilimento.db')
    c = conn.cursor()

    c.execute('''
        SELECT spot FROM prenotazioniSpiaggia 
        WHERE (dataInizioPrenotazione <= ? AND dataFinePrenotazione >= ?) 
        OR (dataInizioPrenotazione <= ? AND dataFinePrenotazione >= ?)
    ''', (end_date, start_date, start_date, end_date))
    
    occupied_spots = [row[0] for row in c.fetchall()]
    conn.close()

    return jsonify({'occupiedSeats': occupied_spots})

@app.route('/registration', methods=['POST'])
def registration():
    data = request.get_json()
    email = data['email']
    password = data['password']
    if len(password) < 3:
        return jsonify(success=False, message='Lunghezza password errata: almeno 3 caratteri')
    
    conn = sqlite3.connect('gestioneStabilimento.db')
    c = conn.cursor()
    c.execute('SELECT * FROM utentiStabilimento WHERE email = ?', (email,))
    user = c.fetchone()
    if user:
        conn.close()
        return jsonify(success=False, message='Email già presente nel database.')
    else:
        c.execute('INSERT INTO utentiStabilimento (email, password) VALUES (?, ?)', (email, password))
        conn.commit()
        conn.close()
        return jsonify(success=True)

@app.route('/prenotation', methods=['POST'])
def prenotation():
    data = request.get_json()
    email = data['email']
    start_date = data['startDate']
    end_date = data['endDate']
    spot = data['spot']
    
    conn = sqlite3.connect('gestioneStabilimento.db')
    c = conn.cursor()

    c.execute('SELECT * FROM prenotazioniSpiaggia WHERE spot = ? AND ((dataInizioPrenotazione <= ? AND dataFinePrenotazione >= ?) OR (dataInizioPrenotazione <= ? AND dataFinePrenotazione >= ?))', 
              (spot, start_date, start_date, end_date, end_date))
    booking = c.fetchone()

    if booking:
        conn.close()
        return jsonify(success=False, message='Il posto è già occupato per il periodo selezionato.')
    else:
        c.execute('INSERT INTO prenotazioniSpiaggia (email, dataInizioPrenotazione, dataFinePrenotazione, spot) VALUES (?, ?, ?, ?)', 
                  (email, start_date, end_date, spot))
        conn.commit()
        conn.close()
        return jsonify(success=True, message='Prenotazione effettuata con successo!')

@app.route('/updatePrenotation', methods=['POST'])
def update_prenotation():
    data = request.get_json()
    email = data['email']
    start_date = data['startDate']
    end_date = data['endDate']
    spot = data['spot']
    
    conn = sqlite3.connect('gestioneStabilimento.db')
    c = conn.cursor()
    c.execute('SELECT * FROM prenotazioniSpiaggia WHERE spot = ? AND ((dataInizioPrenotazione <= ? AND dataFinePrenotazione >= ?) OR (dataInizioPrenotazione <= ? AND dataFinePrenotazione >= ?))', 
              (spot, start_date, start_date, end_date, end_date))
    booking = c.fetchone()
    if booking:
        conn.close()
        return jsonify(success=False, message='Il posto è già occupato per il periodo selezionato.')
    else:
        c.execute('UPDATE prenotazioniSpiaggia SET dataInizioPrenotazione = ?, dataFinePrenotazione = ?, spot = ? WHERE email = ?', 
                  (start_date, end_date, spot, email))
        conn.commit()
        conn.close()
        return jsonify(success=True)

@app.route('/prenotationKiosk', methods=['POST'])
def prenotation_kiosk():
    data = request.get_json()
    email = data['email']
    date = data['date']
    posto_chiosco = data['spot']
    
    conn = sqlite3.connect('gestioneStabilimento.db')
    c = conn.cursor()

    c.execute('SELECT * FROM prenotazioniChiosco WHERE postoChiosco = ? AND dataPrenotazione = ?', 
              (posto_chiosco, date))
    booking = c.fetchone()

    if booking:
        conn.close()
        return jsonify(success=False, message='Il posto al chiosco è già occupato per il giorno selezionato.')
    else:
        c.execute('INSERT INTO prenotazioniChiosco (email, dataPrenotazione, postoChiosco) VALUES (?, ?, ?)', 
                  (email, date, posto_chiosco))
        conn.commit()
        conn.close()
        return jsonify(success=True, message='Prenotazione al chiosco effettuata con successo!')

@app.route('/updateKioskPrenotation', methods=['POST'])
def update_kiosk_prenotation():
    data = request.get_json()
    email = data['email']
    date = data['date']
    posto_chiosco = data['spot']
    
    conn = sqlite3.connect('gestioneStabilimento.db')
    c = conn.cursor()

    c.execute('SELECT * FROM prenotazioniChiosco WHERE postoChiosco = ? AND dataPrenotazione = ? AND email != ?', 
              (posto_chiosco, date, email))
    booking = c.fetchone()

    if booking:
        conn.close()
        return jsonify(success=False, message='Il posto al chiosco è già occupato per la data selezionata.')
    else:
        c.execute('UPDATE prenotazioniChiosco SET dataPrenotazione = ?, postoChiosco = ? WHERE email = ?', 
                  (date, posto_chiosco, email))
        conn.commit()
        conn.close()
        return jsonify(success=True, message='Prenotazione del chiosco aggiornata con successo!')

@app.route('/getKioskSeatStatus', methods=['GET'])
def get_kiosk_seat_status():
    date = request.args.get('date')

    conn = sqlite3.connect('gestioneStabilimento.db')
    c = conn.cursor()
    c.execute('SELECT postoChiosco FROM prenotazioniChiosco WHERE dataPrenotazione = ?', (date,))
    
    occupied_spots = [row[0] for row in c.fetchall()]
    conn.close()

    return jsonify({'occupiedSeats': occupied_spots})

@app.route('/cancelPrenotation', methods=['POST'])
def cancel_prenotation():
    email = request.get_json()['email']
    conn = sqlite3.connect('gestioneStabilimento.db')
    c = conn.cursor()
    c.execute('DELETE FROM prenotazioniSpiaggia WHERE email = ?', (email,))
    conn.commit()
    conn.close()
    return jsonify(success=True)

@app.route('/cancelKioskPrenotation', methods=['POST'])
def cancel_kiosk_prenotation():
    email = request.get_json()['email']
    conn = sqlite3.connect('gestioneStabilimento.db')
    c = conn.cursor()
    c.execute('DELETE FROM prenotazioniChiosco WHERE email = ?', (email,))
    conn.commit()
    conn.close()
    return jsonify(success=True)

@app.route('/checkBookings', methods=['GET'])
def check_bookings():
    email = request.args.get('email')
    conn = sqlite3.connect('gestioneStabilimento.db')
    c = conn.cursor()

    c.execute('SELECT * FROM prenotazioniSpiaggia WHERE email = ?', (email,))
    beach_booking = c.fetchone()

    c.execute('SELECT * FROM prenotazioniChiosco WHERE email = ?', (email,))
    kiosk_booking = c.fetchone()

    conn.close()

    return jsonify({
        'hasBeachBooking': bool(beach_booking),
        'beachStartDate': beach_booking[1] if beach_booking else None,
        'beachEndDate': beach_booking[2] if beach_booking else None,
        'beachSpot': beach_booking[3] if beach_booking else None,
        'hasKioskBooking': bool(kiosk_booking),
        'kioskDate': kiosk_booking[1] if kiosk_booking else None,
        'kioskSpot': kiosk_booking[2] if kiosk_booking else None,
    })

@app.route('/checkBookingsBeach', methods=['GET'])
def check_bookings_beach():
    email = request.args.get('email')
    conn = sqlite3.connect('gestioneStabilimento.db')
    c = conn.cursor()

    c.execute('SELECT * FROM prenotazioniSpiaggia WHERE email = ?', (email,))
    beach_booking = c.fetchone()

    conn.close()

    return jsonify({
        'hasBeachBooking': bool(beach_booking),
        'beachStartDate': beach_booking[1] if beach_booking else None,
        'beachEndDate': beach_booking[2] if beach_booking else None,
        'beachSpot': beach_booking[3] if beach_booking else None,
    })

@app.route('/checkBookingsKiosk', methods=['GET'])
def check_bookings_kiosk():
    email = request.args.get('email')
    conn = sqlite3.connect('gestioneStabilimento.db')
    c = conn.cursor()

    c.execute('SELECT * FROM prenotazioniChiosco WHERE email = ?', (email,))
    kiosk_booking = c.fetchone()

    conn.close()

    return jsonify({
        'hasKioskBooking': bool(kiosk_booking),
        'kioskDate': kiosk_booking[1] if kiosk_booking else None,
        'kioskSpot': kiosk_booking[2] if kiosk_booking else None,
    })

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
