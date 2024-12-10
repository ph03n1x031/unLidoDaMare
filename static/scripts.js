function showAlert(message, buttonText) {
    const alertBox = document.getElementById('customAlert');
    const alertOverlay = document.querySelector('.alert-overlay');

    document.getElementById('alertMessage').innerText = message;
    document.getElementById('alertButton').innerText = buttonText;
    
    setTimeout(() => {
        alertBox.classList.add('show');
        alertBox.classList.remove('hide');
    }, 300);
    
    alertBox.style.display = 'block';
    alertOverlay.style.display = 'block';
}

function closeAlert() {
    const alertBox = document.getElementById('customAlert');
    const alertOverlay = document.querySelector('.alert-overlay');

    alertBox.classList.add('hide');
    alertBox.classList.remove('show');
    
    setTimeout(() => {
        alertBox.style.display = 'none';
        alertOverlay.style.display = 'none';
    }, 300);
}

document.addEventListener('DOMContentLoaded', function () {
    //sezione login
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const backBtnLogin = document.getElementById('backBtnLogin');
    const backBtnRegister = document.getElementById('backBtnRegister');

    //sezione prenotazione spiaggia e chiosco
    const bookingSection = document.getElementById('bookingSection');
    const bookingBeachInfo = document.getElementById('bookingBeachInfo');
    const bookingKioskInfo = document.getElementById('bookingKioskInfo');
    const backBookingBtnBeach = document.getElementById('backBookingBtnBeach');
    const seatMessage = document.getElementById('seatMessage');
    const selectedSeatInput = document.getElementById('selectedSeat');
    const seatSelection = document.getElementById('seatSelection');
    const kioskSeatMessage = document.getElementById('kioskSeatMessage')
    const kioskSeatSelection = document.getElementById('kioskSeatSelection')
    const kioskSelectedSeat = document.getElementById('kioskSelectedSeat')
    const backBookingBtnKiosk = document.getElementById('backBookingBtnKiosk');
    const bookBeachBtn = document.getElementById('bookBeachBtn');
    const beachBookingForm = document.getElementById('beachBookingForm');
    const prenotationButtons = document.getElementById('prenotationButtons')
    const buttons = document.getElementById('buttons');
    const seatButtons = document.querySelectorAll('.seat');
    const seatButtonsKiosk = document.querySelectorAll('.seatKiosk');
    const bookKioskBtn = document.getElementById('bookKioskBtn');
    const kioskBookingForm = document.getElementById('kioskBookingForm');
    document.getElementById('confirmKioskBookingBtn').addEventListener('click', confirmKioskBooking);

    //sezione modifica spiaggia e chiosco
    const backBtnBeachManage = document.getElementById('backBtnBeachManage');
    const manageBookingButtons = document.getElementById('manageBookingButtons');
    const manageBookingSection = document.getElementById('manageBookingSection');
    const manageSeatContainer = document.getElementById('manageSeatContainer');
    const seatMessageManage = document.getElementById('seatMessageManage');
    const manageSelectedSeatInput = document.getElementById('manageSelectedSeat');
    const manageStartDateInput = document.getElementById('manageStartDate');
    const manageEndDateInput = document.getElementById('manageEndDate');
    const manageKioskBtn = document.getElementById('manageKioskBtn');
    const manageKioskSeatSelection = document.getElementById('manageKioskSeatSelection');
    const manageKioskSeatMessage = document.getElementById('manageKioskSeatMessage');
    const manageKioskDatePrenotation = document.getElementById('manageKioskDatePrenotation');
    const manageKioskSelectedSeat = document.getElementById('manageKioskSelectedSeat');
    const backBtnKioskManage = document.getElementById('backBtnKioskManage');
    const manageKioskBookingForm = document.getElementById('manageKioskBookingForm');
    document.getElementById('confirmManageKioskBookingBtn').addEventListener('click', updateKioskBooking);
    
    const logoutBtn = document.getElementById('logoutBtn');
    
    //gestione date
    const today = new Date().toISOString().split('T')[0];
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const kioskDatePrenotation = document.getElementById('kioskDatePrenotation');
    document.getElementById('startDate').setAttribute('min', today);
    document.getElementById('endDate').setAttribute('min', today);
    document.getElementById('manageStartDate').setAttribute('min', today);
    document.getElementById('manageEndDate').setAttribute('min', today);
    document.getElementById('kioskDatePrenotation').setAttribute('min', today);

    let userEmail = ''; 

    // Login utente
    document.getElementById('loginSubmit').addEventListener('click', submitLogin);

    //funzione per il login dell'utente
    function submitLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
    
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                userEmail = email;
                loginForm.classList.add('hidden');
                bookingSection.classList.remove('hidden');
                logoutBtn.classList.remove('hidden');
                const loadingSpinner = document.getElementById('loadingSpinner');
                loadingSpinner.classList.remove('hidden');

                // Simula una richiesta di rete (2 secondi di attesa)
                setTimeout(() => {           
                    loadingSpinner.classList.add('hidden');     
                    checkBookings(email);
                }, 1500);
            } else {
                if (data.message === 'Email non presente nel database.') {
                    showAlert(data.message, 'Registrati');
                    loginForm.classList.add('hidden');
                    registerForm.classList.remove('hidden');
                    document.getElementById('emailUtente').value = email;
                } else if (data.message === 'Password errata.') {
                    showAlert(data.message, 'Ritenta.');
                }
            }
        });
    };

    // Pulsante login
    loginBtn.addEventListener('click', function () {
        buttons.classList.add('hidden');
        loginForm.classList.remove('hidden');
        prenotationButtons.classList.remove('hidden');
    });

    //pulsante indietro login
    backBtnLogin.addEventListener('click', function () {
        loginForm.classList.add('hidden');
        buttons.classList.remove('hidden');
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';

    });

    // Registrazione utente
    document.getElementById('registerSubmit').addEventListener('click', function () {
        const email = document.getElementById('emailUtente').value;
        const password = document.getElementById('pswUtente').value;
        fetch('/registration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showAlert('Registrazione effettuata con successo!', 'Login');
                    registerForm.classList.add('hidden');
                    loginForm.classList.remove('hidden');
                    document.getElementById('loginEmail').value = email;
                    document.getElementById('loginPassword').value = '';
                } else {
                    showAlert(data.message, 'Ritenta');
                }
            });
    });
    
    //pulsante registrazione
    registerBtn.addEventListener('click', function () {
        buttons.classList.add('hidden');
        registerForm.classList.remove('hidden');
    });

    //pulsante indietro registrazione
    backBtnRegister.addEventListener('click', function () {
        registerForm.classList.add('hidden');
        buttons.classList.remove('hidden');
        document.getElementById('emailUtente').value = '';
        document.getElementById('pswUtente').value = '';
    });
    
    //funzione che controlla se l'utente ha prenotazioni attive
    function checkBookings(email) {
        fetch(`/checkBookings?email=${email}`)
            .then(response => response.json())
            .then(data => {

                if (data.hasBeachBooking) {
                    bookingBeachInfo.innerHTML += `Prenotazione spiaggia dal ${data.beachStartDate} al ${data.beachEndDate} per il posto ${data.beachSpot}`;
                    manageBookingButtons.classList.remove('hidden'); 
                    bookBeachBtn.classList.add('hidden'); 
                } else {
                    prenotationButtons.classList.remove('hidden'); 
                    manageBookingButtons.classList.add('hidden'); 
                    bookBeachBtn.classList.remove('hidden');
                }

                // Gestisci la prenotazione per il chiosco
                if (data.hasKioskBooking) {
                    bookingKioskInfo.innerHTML += `<br>Prenotazione chiosco per il ${data.kioskDate} al posto ${data.kioskSpot}`;
                    manageKioskBtn.classList.remove('hidden'); 
                    bookKioskBtn.classList.add('hidden');
                } else {
                    prenotationButtons.classList.remove('hidden');
                    bookKioskBtn.classList.remove('hidden'); 
                    manageKioskBtn.classList.add('hidden'); 
                }
            })
            .catch(error => {
                console.error('Errore nel caricamento delle prenotazioni:', error);
            });
    }

    //funzione che controlla se l'utente ha prenotazioni per la spiaggia
    function checkBookingsBeach(email) {
        fetch(`/checkBookings?email=${email}`)
            .then(response => response.json())
            .then(data => {
                // Gestisci la prenotazione per la spiaggia
                if (data.hasBeachBooking) {
                    bookingBeachInfo.classList.remove('hidden');
                    manageBookingButtons.classList.remove('hidden'); 
                    bookBeachBtn.classList.add('hidden'); 
                } else {
                    prenotationButtons.classList.remove('hidden'); 
                    manageBookingButtons.classList.add('hidden'); 
                    bookBeachBtn.classList.remove('hidden');
                }

                if(data.hasKioskBooking) {
                    bookingKioskInfo.classList.remove('hidden');
                    manageKioskBtn.classList.remove('hidden');
                    bookKioskBtn.classList.add('hidden');
                } else {
                    bookKioskBtn.classList.remove('hidden');
                }
            })
            .catch(error => {
                console.error('Errore nel caricamento delle prenotazioni:', error);
            });
    }

    //funzione che controlla se l'utente ha prenotazioni per il chiosco
    function checkBookingsKiosk(email) {
        fetch(`/checkBookings?email=${email}`)
            .then(response => response.json())
            .then(data => {
                // Gestisci la prenotazione per il chiosco
                if (data.hasKioskBooking) {
                    bookingKioskInfo.classList.remove('hidden');
                    manageKioskBtn.classList.remove('hidden'); 
                    bookKioskBtn.classList.add('hidden');
                } else {
                    prenotationButtons.classList.remove('hidden'); 
                    bookKioskBtn.classList.remove('hidden'); 
                    manageKioskBtn.classList.add('hidden'); 
                }

                if(data.hasBeachBooking) {
                    bookingBeachInfo.classList.remove('hidden');
                    manageBookingButtons.classList.remove('hidden');
                    bookBeachBtn.classList.add('hidden');
                } else {
                    bookBeachBtn.classList.remove('hidden');
                }
            })
            .catch(error => {
                console.error('Errore nel caricamento delle prenotazioni:', error);
            });
    }

    //pulsante prenotazione spiaggia
    bookBeachBtn.addEventListener('click', function () {
        bookingKioskInfo.classList.add('hidden');
        manageKioskBtn.classList.add('hidden');
        bookKioskBtn.classList.add('hidden')
        seatSelection.classList.add('hidden');
        seatMessage.classList.remove('hidden');
        startDateInput.value = '';
        endDateInput.value = '';

        bookBeachBtn.classList.add('hidden');
        beachBookingForm.classList.remove('hidden');
        beachBookingForm.classList.add('show');
    });

    //funzione per visualizzare i bottoni dei posti disponibili alla spiaggia
    seatButtons.forEach(button => {
        button.addEventListener('click', function () {
            const isManageFormVisible = !manageBookingSection.classList.contains('hidden');
            const inputToUpdate = isManageFormVisible ? manageSelectedSeatInput : selectedSeatInput;
            const startDate = isManageFormVisible ? manageStartDateInput.value : startDateInput.value;
            const endDate = isManageFormVisible ? manageEndDateInput.value : endDateInput.value;

            if (!startDate || !endDate) {
                showAlert('Seleziona prima le date per scegliere un posto.', 'Ok');
                return;
            }

            seatButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            inputToUpdate.value = button.getAttribute('data-seat');
        });
    });

    //funzione per caricamento posti disponibili spiaggia
    function loadSeats(startDate, endDate) {
        fetch(`/getSeatStatus?start_date=${startDate}&end_date=${endDate}`)
            .then(response => response.json())
            .then(data => {
                const occupiedSeats = data.occupiedSeats;
                seatButtons.forEach(button => {
                    const seat = button.getAttribute('data-seat');
                    if (occupiedSeats.includes(seat)) {
                        button.classList.add('disabled');
                        button.disabled = true;
                    } else {
                        button.classList.remove('disabled');
                        button.disabled = false;
                    }
                });
            })
            .catch(error => {
                console.error('Errore nel caricamento dello stato dei posti:', error);
            });
    }

    //funzione che mostra i posti disponibili per la spiaggia
    function checkDatesAndShowSeats() {
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        if (startDate && endDate) {
            seatSelection.classList.remove('hidden');
            seatMessage.classList.add('hidden');
            loadSeats(startDate, endDate);
        } else {
            seatSelection.classList.add('hidden');
            seatMessage.classList.remove('hidden');
        }
    }

    //pulsante indietro prenotazione spiaggia
    backBookingBtnBeach.addEventListener('click', function () {
        startDateInput.value = '';
        endDateInput.value = '';
        seatButtons.forEach(btn => btn.classList.remove('selected'));

        checkBookingsBeach(userEmail);
        beachBookingForm.classList.add('hidden');
    });

    //prenotazione della spiaggia
        document.getElementById('confirmBookingBtn').addEventListener('click', function () {
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        const selectedSeat = selectedSeatInput.value;

        if (!selectedSeat) {
            showAlert('Seleziona un posto.', 'Ok');
            return;
        }

        fetch('/prenotation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: userEmail, startDate, endDate, spot: selectedSeat }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showAlert('Prenotazione effettuata con successo!', 'Continua');
                    beachBookingForm.classList.add('hidden');
                    bookingBeachInfo.innerHTML = `Prenotazione dal ${startDate} al ${endDate} per il posto ${selectedSeat}`;
                    bookingBeachInfo.classList.remove('hidden');
                    bookBeachBtn.classList.add('hidden');
                    manageBookingButtons.classList.remove('hidden');
                    bookKioskBtn.classList.remove('hidden');
                    seatSelection.classList.add('hidden');

                    checkBookingsKiosk(userEmail);
                } else {
                    showAlert(data.message, 'Ok');
                }
            });
        });

    //funzione per visualizzare i posti disponibili al chiosco
    seatButtonsKiosk.forEach(button => {
        button.addEventListener('click', function () {
            const isManageFormVisible = !manageKioskBookingForm.classList.contains('hidden');
            const inputToUpdate = isManageFormVisible ? manageKioskSelectedSeat : kioskSelectedSeat;
            const kioskDate = isManageFormVisible ? manageKioskDatePrenotation.value : kioskDatePrenotation.value;
    
            if (!kioskDate || kioskDate.trim() === '') {
                showAlert('Seleziona la data per scegliere un posto.', 'Ok');
                return;
            }
            seatButtonsKiosk.forEach(btn => btn.classList.remove('selected'));
    
            this.classList.add('selected');
    
            inputToUpdate.value = button.getAttribute('data-seat');
        });
    });

    //funzione per la prenotazione del chiosco
    function confirmKioskBooking() {
        const date = kioskDatePrenotation.value;
        const selectedSeat = document.getElementById('kioskSelectedSeat').value;  

        if (!date) {
            showAlert('Seleziona una data per visualizzare i posti disponibili.', 'Ok');
            return;
        } else if (!selectedSeat) {
            showAlert('Seleziona il posto per effettuare la prenotazione.', 'Ok');
            return;
        }
    
        fetch('/prenotationKiosk', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: userEmail, date: date, spot: selectedSeat }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showAlert('Prenotazione al chiosco effettuata con successo!', 'Continua');
                kioskBookingForm.classList.add('hidden');
                bookingKioskInfo.innerHTML = `Prenotazione per il chiosco il ${date} per il posto ${selectedSeat}`;
                bookingKioskInfo.classList.remove('hidden');
                bookKioskBtn.classList.remove('hidden');
                manageKioskBtn.classList.remove('hidden');
                bookBeachBtn.classList.remove('hidden');
                kioskDatePrenotation.value = '';
                checkBookingsBeach(userEmail);
            } else {
                showAlert(data.message, 'Ok');
            }
        })
        .catch(error => {
            showAlert('Errore nella prenotazione. Riprova.', 'Ok');
            console.error('Errore prenotazione chiosco:', error);
        });
    }
    
    //funzione per caricamento posti disponibili al chiosco
    function loadKioskSeats(date) {
        fetch(`/getKioskSeatStatus?date=${date}`)
            .then(response => response.json())
            .then(data => {
                const occupiedSeats = data.occupiedSeats;
                seatButtonsKiosk.forEach(button => {
                    const seat = button.getAttribute('data-seat');
                    if (occupiedSeats.includes(seat)) {
                        button.classList.add('disabled');
                        button.disabled = true;
                    } else {
                        button.classList.remove('disabled');
                        button.disabled = false;
                    }
                });
            })
            .catch(error => {
                console.error('Errore nel caricamento dello stato dei posti al chiosco:', error);
            });
    }

    //funzione per mostrare i posti disponibili al chiosco
    function checkDatesAndShowSeatsKiosk() {
        const date = kioskDatePrenotation.value;
        if (date) {
            kioskSeatSelection.classList.remove('hidden');
            kioskSeatMessage.classList.add('hidden');
            loadKioskSeats(date);
        } else {
            kioskSeatSelection.classList.add('hidden');
            kioskSeatMessage.classList.remove('hidden');
        }
    }

    //pulsante prenotazione chiosco
    bookKioskBtn.addEventListener('click', function () {
        bookingBeachInfo.classList.add('hidden');
        manageBookingButtons.classList.add('hidden');
        bookBeachBtn.classList.add('hidden');
        kioskSeatSelection.classList.add('hidden');
        kioskSeatMessage.classList.remove('hidden');
        kioskDatePrenotation.value = '';
        bookKioskBtn.classList.add('hidden');
        kioskBookingForm.classList.remove('hidden');
        kioskBookingForm.classList.add('show');
    });

    //pulsante indietro prenotazione chiosco
    backBookingBtnKiosk.addEventListener('click', function () {
        kioskDatePrenotation.value = '';
        seatButtonsKiosk.forEach(btn => btn.classList.remove('selected'));

        checkBookingsKiosk(userEmail);
        kioskBookingForm.classList.add('hidden');
    });

    //Modifica prenotazione spiaggia
    document.getElementById('manageBookingBtn').addEventListener('click', function () {
        bookingKioskInfo.classList.add('hidden');
        manageKioskBtn.classList.add('hidden');
        manageBookingButtons.classList.add('hidden');
        manageBookingSection.classList.remove('hidden');
        bookKioskBtn.classList.add('hidden');
    });

    //Aggiornamento prenotazione della spiaggia
    document.getElementById('updateBookingBtn').addEventListener('click', function () {
        const startDate = manageStartDateInput.value;
        const endDate = manageEndDateInput.value;
        const selectedSeat = manageSelectedSeatInput.value;
    
        if (!startDate || !endDate) {
            showAlert('Seleziona le date per visualizzare i posti disponibili.', 'Ok');
            return;
        } else if (!selectedSeat) {
            showAlert('Seleziona il posto per modificare la prenotazione.', 'Ok');
            return;
        }
    
        fetch('/updatePrenotation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: userEmail, startDate, endDate, spot: selectedSeat }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showAlert('Prenotazione aggiornata con successo!', 'Continua');
                bookingBeachInfo.innerHTML = `Prenotazione aggiornata dal ${startDate} al ${endDate} per il posto ${selectedSeat}`;
                manageBookingSection.classList.add('hidden');
                manageBookingButtons.classList.remove('hidden');
                manageSeatContainer.classList.add('hidden');
                manageStartDateInput.value = '';
                manageEndDateInput.value = '';
                checkBookingsKiosk(userEmail);
            } else {
                showAlert(data.message, 'Ok');
            }
        })
        .catch(error => {
            showAlert('Errore durante l\'aggiornamento. Riprova.', 'Ok');
            console.error('Errore aggiornamento prenotazione:', error);
        });
    });

    //funzione per mostrare i posti per modifica della spiaggia
    function checkDatesAndShowSeatsForManage() {
        const startDate = manageStartDateInput.value;
        const endDate = manageEndDateInput.value;
        if (startDate && endDate) {
            manageSeatContainer.classList.remove('hidden');
            seatMessageManage.classList.add('hidden');
            loadSeats(startDate, endDate);
        } else {
            manageSeatContainer.classList.add('hidden');
            seatMessageManage.classList.remove('hidden');
        }
    }

    //pulsante indietro modifica prenotazione spiaggia
    backBtnBeachManage.addEventListener('click', function () {
        manageStartDateInput.value = '';
        manageEndDateInput.value = '';
        seatButtons.forEach(btn => btn.classList.remove('selected'));
        checkBookingsBeach(userEmail);

        manageBookingSection.classList.add('hidden');
        manageSeatContainer.classList.add('hidden');
    });

    //funzione per l'aggiornamento del posto al chiosco
    function updateKioskBooking() {
        const date = manageKioskDatePrenotation.value;
        const selectedSeat = document.getElementById('manageKioskSelectedSeat').value;
    
        if (!date) {
            showAlert('Seleziona una data per modificare la prenotazione al chiosco.', 'Ok');
            return;
        } else if (!selectedSeat) {
            showAlert('Seleziona il posto per aggiornare la prenotazione.', 'Ok');
            return;
        }
    
        fetch('/updateKioskPrenotation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: userEmail, date: date, spot: selectedSeat }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showAlert('Prenotazione del chiosco aggiornata con successo!', 'Continua');
                bookingKioskInfo.innerHTML = `Prenotazione aggiornata per il chiosco il ${date} al posto ${selectedSeat}`;
                manageBookingButtons.classList.remove('hidden');
                kioskBookingForm.classList.add('hidden');
                manageKioskBookingForm.classList.add('hidden');
                manageKioskDatePrenotation.value = '';
                checkBookingsBeach(userEmail);
            } else {
                showAlert(data.message, 'Ok');
            }
        })
        .catch(error => {
            showAlert('Errore durante l\'aggiornamento della prenotazione. Riprova.', 'Ok');
            console.error('Errore aggiornamento prenotazione chiosco:', error);
        });
    }

    //funzione per la modifica del posto del chiosco
    function checkDatesAndShowSeatsForManageKiosk() {
        const date = manageKioskDatePrenotation.value;
        if (date) {
            console.log("data selezionata");
            manageKioskSeatSelection.classList.remove('hidden');
            manageKioskSeatMessage.classList.add('hidden');
            loadKioskSeats(date);
        } else {
            manageKioskSeatSelection.classList.add('hidden');
            manageKioskSeatMessage.classList.remove('hidden');
        }
    }
    
    //Modifica prenotazione chiosco
    document.getElementById('manageKioskBookingBtn').addEventListener('click', function () {
        bookingBeachInfo.classList.add('hidden');
        manageBookingButtons.classList.add('hidden');
        manageKioskBookingForm.classList.remove('hidden'); 
        manageKioskBtn.classList.add('hidden'); 
        bookBeachBtn.classList.add('hidden');
        manageKioskSeatSelection.classList.add('hidden');
        manageKioskSeatMessage.classList.remove('hidden');
    });

    //pulsante indietro modifica prenotazione chiosco
    backBtnKioskManage.addEventListener('click', function () {
        manageKioskDatePrenotation.value = '';
        seatButtonsKiosk.forEach(btn => btn.classList.remove('selected'));
        checkBookingsKiosk(userEmail);
        
        manageKioskBookingForm.classList.add('hidden');
    });

    //funzioni per la gestione delle date di prenotazione
    startDateInput.addEventListener('input', function () {
        const startDate = new Date(startDateInput.value);
        startDate.setDate(startDate.getDate() + 1);
        endDateInput.setAttribute('min', startDate.toISOString().split('T')[0]);
        checkDatesAndShowSeats();
    });
    
    endDateInput.addEventListener('input', function () {
        checkDatesAndShowSeats();
    });

    manageStartDateInput.addEventListener('input', function () {
        const startDate = new Date(manageStartDateInput.value);
        startDate.setDate(startDate.getDate() + 1);
        manageEndDateInput.setAttribute('min', startDate.toISOString().split('T')[0]);
        checkDatesAndShowSeatsForManage();
    });

    manageEndDateInput.addEventListener('input', checkDatesAndShowSeatsForManage);

    kioskDatePrenotation.addEventListener('input', function () {
        const startDate = new Date(kioskDatePrenotation.value);
        startDate.setDate(startDate.getDate() + 1);
        checkDatesAndShowSeatsKiosk();
    });

    manageKioskDatePrenotation.addEventListener('input', function () {
        const startDate = new Date(manageKioskDatePrenotation.value);
        startDate.setDate(startDate.getDate() + 1);
        checkDatesAndShowSeatsForManageKiosk();
    });

    //Cancella prenotazione spiaggia
    document.getElementById('cancelBookingBtn').addEventListener('click', function () {
        fetch('/cancelPrenotation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: userEmail }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showAlert('Prenotazione cancellata con successo!', 'Continua');
                    
                } else {
                    showAlert(data.message, 'Ok');
                }
                bookingBeachInfo.innerHTML = '';
                    manageBookingButtons.classList.add('hidden');
                    bookBeachBtn.classList.remove('hidden');
                    startDateInput.value = '';
                    endDateInput.value = '';
                    selectedSeatInput.value = '';
                    seatSelection.classList.add('hidden');
                    seatMessage.classList.remove('hidden');
                    bookKioskBtn.add('hidden');
            });
    });

    //Cancella prenotazione chiosco
    document.getElementById('cancelKioskBookingBtn').addEventListener('click', function () {
        fetch('/cancelKioskPrenotation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: userEmail }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showAlert('Prenotazione chiosco cancellata con successo!', 'Continua');
                bookingKioskInfo.innerHTML = ''; 
                manageKioskBtn.classList.add('hidden'); 
                bookKioskBtn.classList.remove('hidden');
            } else {
                showAlert(data.message, 'Ok');
            }
        });
    });    


    // Logout
    logoutBtn.addEventListener('click', function () {
        userEmail = '';
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        document.getElementById('emailUtente').value = '';
        document.getElementById('pswUtente').value = '';
        
        startDateInput.value = '';
        endDateInput.value = '';
        manageStartDateInput.value = '';
        manageEndDateInput.value = '';
        kioskDatePrenotation.value = '';
        
        document.getElementById('selectedSeat').value = '';
        document.getElementById('manageSelectedSeat').value = '';
        document.getElementById('kioskSelectedSeat').value = '';
    
        bookingBeachInfo.innerHTML = '';
        bookingKioskInfo.innerHTML = '';
        bookingSection.classList.add('hidden');
        logoutBtn.classList.add('hidden');
        buttons.classList.remove('hidden');
        bookBeachBtn.classList.add('hidden');
        beachBookingForm.classList.add('hidden');
        manageBookingButtons.classList.add('hidden');
        seatSelection.classList.add('hidden');
        seatSelection.classList.remove('show');
        seatMessage.classList.remove('hidden');
        manageSeatContainer.classList.add('hidden');
        manageBookingSection.classList.add('hidden');
        prenotationButtons.classList.add('hidden');
        kioskBookingForm.classList.add('hidden');
        kioskSeatMessage.classList.remove('hidden');
        kioskSeatSelection.classList.add('hidden');
        kioskSeatSelection.classList.remove('show');
        manageKioskBtn.classList.add('hidden');
        manageKioskBookingForm.classList.add('hidden');
        bookKioskBtn.classList.add('hidden');
    
        seatButtons.forEach(btn => {
            btn.classList.remove('selected', 'disabled');
            btn.disabled = false;
        });
        seatButtonsKiosk.forEach(btn => {
            btn.classList.remove('selected', 'disabled');
            btn.disabled = false;
        });
    });
});
